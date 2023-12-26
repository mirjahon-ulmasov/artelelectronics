import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Row, Space, UploadFile } from 'antd'
import toast from 'react-hot-toast'
import {
    CustomSelect,
    BorderBox,
    FormItem,
    StyledTextL2,
    Color,
    FileUpload,
} from 'components'
import {
    useCreate360VideoMutation,
    useFetchProductColorsQuery,
    useCreateFeaturedVideoMutation
} from 'services'
import { ID } from 'types/others/api'
import { Product } from 'types/product/product'
import { ProductVideo } from 'types/product/video'

interface VideoProps {
    onClick: () => void
    product: Product.DTO
    category: string
}

export function Videos({ onClick, product, category }: VideoProps) {
    const navigate = useNavigate()
    const [_360Video, set360Video] = useState<ProductVideo.DTOLocal>({
        product: product.id,
        color: '',
        video: []
    })

    const [featuredVideo, setFeaturedVideo] = useState<ProductVideo.DTOLocal>({
        product: product.id,
        color: '',
        video: []
    })

    const { data: colors, isLoading: colorsLoading } =
        useFetchProductColorsQuery({
            product: product.id,
        })

    const [create360Video, { isLoading: createLoading1 }] =
        useCreate360VideoMutation()

    const [createFeaturedVideo, { isLoading: createLoading2 }] =
        useCreateFeaturedVideoMutation()

    // ---------------- Product Variants ----------------

    const changeProdColor = useCallback((color: ID) => {
        set360Video(prev => ({ ...prev, color }))
    }, [])

    const change_360Video = useCallback((video: UploadFile[]) => {
        set360Video(prev => ({
            ...prev,
            video
        }))
    }, [])

    const changeFeaturedVideo = useCallback((video: UploadFile[]) => {
        setFeaturedVideo(prev => ({
            ...prev,
            video
        }))
    }, [])

    const reset = useCallback(() => {
        set360Video({
            product: product.id,
            color: '',
            video: []
        })

        setFeaturedVideo({
            product: product.id,
            color: '',
            video: []
        })
    }, [product.id])

    // ---------------- Submit ----------------
    const onFinish = useCallback(
        (again?: boolean, next?: boolean) => {
            const _360_video: ProductVideo.DTOUpload = {
                ..._360Video,
                video: _360Video.video[0]?.response?.id as ID,
            }

            const featured_video: ProductVideo.DTOUpload = {
                ...featuredVideo,
                video: featuredVideo.video[0]?.response?.id as ID,
            }

            const promises = [
                create360Video(_360_video).unwrap(),
                createFeaturedVideo(featured_video).unwrap()
            ]

            Promise.all(promises)
                .then(() => {
                    toast.success('Видео успешно добавлены в продукт')
                    if (again) {
                        reset()
                        return
                    }
                    if (next) {
                        onClick()
                        return
                    }
                    navigate({
                        pathname: '/product/list',
                        search: `?category=${category}`,
                    })
                })
                .catch(() => toast.error('Что-то пошло не так'))
        },
        [
            category,
            create360Video,
            navigate,
            onClick,
            _360Video,
            createFeaturedVideo,
            featuredVideo,
            reset,
        ]
    )

    return (
        <Form autoComplete="off" style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox gap="24px">
                        <StyledTextL2>Видео каталога</StyledTextL2>
                        <FormItem
                            label="Выбрать цвет продукта"
                            style={{ maxWidth: 300 }}
                            wrapperCol={{ span: 24 }}
                            labelCol={{ span: 24 }}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                value={_360Video.color || undefined}
                                placeholder="Выберите"
                                loading={colorsLoading}
                                onChange={(value: ID) => changeProdColor(value)}
                                options={colors?.map(prodColor => ({
                                    value: prodColor.color.id,
                                    label: (
                                        <div className="d-flex gap-12 jc-start">
                                            <Color
                                                link={
                                                    prodColor.color.image.file
                                                }
                                            />
                                            {prodColor.color.title}
                                        </div>
                                    ),
                                }))}
                            ></CustomSelect>
                        </FormItem>
                        <BorderBox>
                            <StyledTextL2>360 видео продукта</StyledTextL2>
                            <FileUpload
                                label='Загрузить видео'
                                fileList={_360Video.video} 
                                onChange={(info) => change_360Video(info.fileList)}
                            />
                        </BorderBox>

                        <BorderBox>
                            <StyledTextL2>Магазин видео продукта</StyledTextL2>
                            <FileUpload
                                label='Загрузить видео'
                                fileList={featuredVideo.video} 
                                onChange={(info) => changeFeaturedVideo(info.fileList)}
                            />
                        </BorderBox>
                    </BorderBox>
                </Col>
                <Col span={24} className="mt-2">
                    <Space size="large">
                        <Button
                            size="large"
                            type="default"
                            htmlType="submit"
                            shape="round"
                            loading={createLoading1}
                            onClick={() => onFinish()}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={createLoading1}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить и добавить еще
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={createLoading1}
                            onClick={() => onFinish(false, true)}
                        >
                            Сохранить и продолжить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
