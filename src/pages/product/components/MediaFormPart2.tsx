/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Divider, Form, 
    Input, Row, Space, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { useCreateProductVariantImagesMutation, useFetchProductVariantsQuery } from 'services'
import { CustomSelect, BorderBox, FormItem, StyledTextL2, CustomUpload } from 'components'
import { Product, VariantImage } from 'types/product';
import { PlusOutlined } from '@ant-design/icons';
import { ID } from 'types/api'

interface MedieFormProps {
    onClick: () => void
    product: Product.DTO
}

export function MediaFormPart2({ onClick, product }: MedieFormProps) {
    const navigate = useNavigate();

    const [variantImages, setVariantImages] = useState<VariantImage.DTOLocal[]>([
        { variant: '', images: [], uuid: uuid() }
    ])

    const [createProductVariantImages, { isLoading: createLoading }] = useCreateProductVariantImagesMutation()
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
    const onFinish = () => {
        
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
                onClick();
            })
            .catch(() => {
                toast.error("Что-то пошло не так");
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <Form
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Изображения продукта</StyledTextL2>
                        {variantImages.map((variantImage) => (
                            <Fragment key={variantImage.uuid}>
                                <FormItem
                                    label="Выбрать цвет продукта"
                                    style={{ maxWidth: 300 }}
                                    wrapperCol={{ span: 24 }}
                                    labelCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        value={variantImage.variant}
                                        placeholder="Выберите"
                                        onChange={(value: ID) => changeVariantImage(
                                            'variant', value, variantImage.uuid
                                        )}
                                        loading={variantsLoading}
                                        options={variants?.map(variant => ({
                                            value: variant.id,
                                            label: variant.color.code,
                                        }))}
                                    ></CustomSelect>
                                </FormItem>
                                <CustomUpload
                                    maxCount={8}
                                    fileList={variantImage.images as UploadFile[]} 
                                    onChange={(info) => changeVariantImage(
                                        'images', info.fileList, variantImage.uuid
                                    )}
                                />
                                <Divider style={{ margin: '5px 0'}} />
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
                                name="category"
                                label="Объем/Размер"
                                style={{ maxWidth: 300 }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Iltimos mijozning ismini kiriting',
                                    },
                                ]}
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
                                ></CustomSelect>
                            </FormItem>
                            <FormItem
                                name="category"
                                label="Цвет продукта"
                                style={{ maxWidth: 300 }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Iltimos mijozning ismini kiriting',
                                    },
                                ]}
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
                                ></CustomSelect>
                            </FormItem>
                            <FormItem
                                name="category"
                                label="Серийный номер"
                                style={{ maxWidth: 300 }}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'Iltimos mijozning ismini kiriting',
                                    },
                                ]}
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
                            loading={createLoading}
                            style={{ background: '#25A55A' }}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            onClick={() => navigate('/client/list')}
                        >
                            Сохранить и продолжить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
