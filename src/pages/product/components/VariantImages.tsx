import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Divider, Form, Row, Space } from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { useCreateProductVariantImagesMutation, useFetchProductVariantsQuery } from 'services'
import { 
    CustomSelect, BorderBox, FormItem, 
    StyledTextL2, ImageUpload, StyledText, Color, TrashIcon 
} from 'components'
import { Product, VariantImage } from 'types/product/product';
import { PlusOutlined } from '@ant-design/icons';
import { ID } from 'types/others/api'

interface VariantImageProps {
    category: string
    onClick: () => void
    product: Product.DTO
}

export function VariantImages({ onClick, product, category }: VariantImageProps) {
    const navigate = useNavigate();

    const [variantImages, setVariantImages] = useState<VariantImage.DTOLocal[]>([
        { variant: '', images: [], uuid: uuid() }
    ])

    const [createProductVariantImages, { isLoading: loading }] = useCreateProductVariantImagesMutation()
    const { data: variants, isLoading: variantsLoading } = useFetchProductVariantsQuery({
        product: product.id
    })

    // ---------------- Product Variant Images ----------------
    function addNewVariantImage() {
        setVariantImages(prev => [
            ...prev, 
            { variant: '', images: [], uuid: uuid() }
        ])
    }

    function changeVariantImage(key: keyof VariantImage.DTOLocal, value: unknown, uuid: string) {
        setVariantImages(prev => prev.map(variantImage => {
            if(variantImage.uuid === uuid) {
                return {
                    ...variantImage,
                    [key]: value
                }
            }
            return variantImage
        }))
    }

    const deleteItem = useCallback((id: ID) => {
        setVariantImages(prev => prev.filter(variantImage => variantImage.uuid !== id))
    }, [])

    // ---------------- Submit ----------------
    const onFinish = useCallback((next: boolean) => {
        
        const dataVariantImages: VariantImage.DTOUpload[] = variantImages
            .flatMap(el => el.images.map(image => ({
                variant: el.variant,
                image: image.response?.id as ID
        })))

        const promises = [
            createProductVariantImages(dataVariantImages).unwrap(),
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Варианты изображения успешно добавлены");
                if(next) {
                    onClick()
                    return;
                }
                navigate({
                    pathname: '/product/list',
                    search: `?category=${category}`
                })
            })
            .catch(() => toast.error("Что-то пошло не так"));
    }, [category, createProductVariantImages, navigate, onClick, variantImages]);


    return (
        <Form autoComplete="off">
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Изображения продукта</StyledTextL2>
                        {variantImages.map((variantImage, index) => (
                            <Fragment key={variantImage.uuid}>
                                {!!index && (
                                    <Divider style={{ margin: '15px 0'}}>
                                        <Space size='middle'>
                                            <StyledText>{index + 1}</StyledText>
                                            <Button
                                                size='middle'
                                                shape='circle'
                                                className='d-flex'
                                                icon={<TrashIcon />}
                                                style={{ scale: '1.2' }}
                                                onClick={() => deleteItem(variantImage.uuid)}
                                            />
                                        </Space>
                                    </Divider>
                                )}
                                <FormItem
                                    label="Выбрать цвет продукта"
                                    style={{ width: 300 }}
                                    wrapperCol={{ span: 24 }}
                                    labelCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder="Выберите"
                                        value={variantImage.variant || undefined}
                                        onChange={(value: ID) => changeVariantImage(
                                            'variant', value, variantImage.uuid
                                        )}
                                        loading={variantsLoading}
                                        options={variants?.map(variant => ({
                                            value: variant.id,
                                            label: (
                                                <div className='d-flex gap-12 jc-start'>
                                                    <Color link={variant.color.image.file} />
                                                    {variant.color.title}
                                                </div>
                                            ),
                                        }))}

                                    />
                                </FormItem>
                                <ImageUpload
                                    maxCount={8}
                                    fileList={variantImage.images} 
                                    onChange={(info) => changeVariantImage(
                                        'images', info.fileList, variantImage.uuid
                                    )}
                                />
                            </Fragment>
                        ))}
                    </BorderBox>
                    <div className='d-flex mt-1'>
                        <Button 
                            type='text' 
                            size='large'
                            shape='round'
                            onClick={addNewVariantImage}
                            icon={<PlusOutlined />} 
                            style={{ fontWeight: 400 }} 
                        >
                            Добавить еще
                        </Button>
                    </div>
                </Col>
                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            type="default"
                            htmlType="submit"
                            shape="round"
                            loading={loading}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={loading}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить и продолжить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
