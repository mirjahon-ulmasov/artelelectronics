/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Divider, Form, 
    Input, Row, Space 
} from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { 
    useCreateProductVariantImagesMutation, useFetchCategoryUtilityQuery, 
    useFetchProductVariantsQuery 
} from 'services'
import { CustomSelect, BorderBox, FormItem, StyledTextL2, ImageUpload, StyledText } from 'components'
import { Product, VariantImage } from 'types/product';
import { PlusOutlined } from '@ant-design/icons';
import { ID } from 'types/api'

interface SAPCodeProps {
    category: string
    onClick: () => void
    product: Product.DTO
}

export function SAPCode({ onClick, product, category }: SAPCodeProps) {
    const navigate = useNavigate();
    const [variantImages, setVariantImages] = useState<VariantImage.DTOLocal[]>([
        { variant: '', images: [], uuid: uuid() }
    ])

    const [createProductVariantImages, { isLoading: createLoading }] = useCreateProductVariantImagesMutation()
    const { data: variants, isLoading: variantsLoading } = useFetchProductVariantsQuery({
        product: product.id
    })
    const { data: utilities } = useFetchCategoryUtilityQuery({
        category
    })

    // ---------------- Product Variant Images ----------------

    function addNewVariantImage() {
        setVariantImages(prev => [
            ...prev, 
            { variant: '', images: [], uuid: uuid() }
        ])
    }

    function changeVariantImage(key: string, value: unknown, uuid: string) {
        setVariantImages(prev => prev.map(variant => {
            if(variant.uuid === uuid) {
                return {
                    ...variant,
                    [key]: value
                }
            }
            return variant
        }))
    }

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
                toast.success("Варианты продукта и видео успешно добавлены.");
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
                                        <StyledText>{index + 1}</StyledText>
                                    </Divider>
                                )}
                                <FormItem
                                    label="Выбрать цвет продукта"
                                    style={{ maxWidth: 300 }}
                                    wrapperCol={{ span: 24 }}
                                    labelCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder="Выберите"
                                        value={variantImage.variant}
                                        onChange={(value: ID) => changeVariantImage(
                                            'variant', value, variantImage.uuid
                                        )}
                                        loading={variantsLoading}
                                        options={variants?.map(variant => ({
                                            value: variant.id,
                                            label: variant.color.code,
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

                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>SUP code</StyledTextL2>
                        <Space size='large'>
                            <FormItem
                                label="Цвет продукта"
                                style={{ maxWidth: 300 }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <CustomSelect
                                    allowClear
                                    size="large"
                                    placeholder="Выберите"
                                    loading={variantsLoading}
                                    options={variants?.map(variant => ({
                                        value: variant.id,
                                        label: variant.color.code,
                                    }))}
                                />
                            </FormItem>
                            {utilities?.map(utility => (
                                <FormItem
                                    key={utility.id}
                                    label={utility.title}
                                    style={{ maxWidth: 300 }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder="Выберите"
                                        loading={variantsLoading}
                                        options={utility.items.map(item => ({
                                            value: item.id,
                                            label: item.title,
                                        }))}
                                    />
                                </FormItem>
                            ))}
                            <FormItem
                                label="Серийный номер"
                                style={{ maxWidth: 300 }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Input size="large" placeholder="Серийный номер" />
                            </FormItem>
                        </Space>
                        
                    </BorderBox>
                </Col>

                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            shape="round"
                            style={{ background: '#25A55A' }}
                            loading={createLoading}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={createLoading}
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
