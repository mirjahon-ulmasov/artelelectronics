import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, InputNumber, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { FormItem, ImageUpload, StyledText } from 'components'
import { useCreateBrandMutation } from 'services'
import { Brand } from 'types/filters/brand'
import { ID, } from 'types/others/api'

const { Title } = Typography

export default function AddBrand() {
    const navigate = useNavigate()
    const [brand, setBrand] = useState<Brand.DTOLocal>({
        title: '',
        image: [],
        secondary_image: [],
        custom_order: 0,
    })
    const [createBrand, { isLoading: createLoading }] = useCreateBrandMutation()

    const changeBrand = useCallback((key: keyof Brand.DTOLocal, value: unknown) => {
        setBrand(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        const data: Brand.DTOUpload = {
            ...brand,
            image: brand.image[0]?.response?.id as ID,
            secondary_image: brand.secondary_image[0]?.response?.id as ID,
        }

        createBrand(data)
            .unwrap()
            .then(() => {
                toast.success("Бренд успешно добавлен")
                navigate("/brand/list")
            })
            .catch(() => toast.error("Не удалось добавить бренд"))
    }, [brand, createBrand, navigate])

    return (
        <Fragment>
            <Title level={3}>Добавить новый бренд</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 550 }}
            >
                <Row gutter={[0, 8]} className='mt-1'>
                    <Col span={24}>
                        <FormItem
                            label="Название"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input 
                                size="large" 
                                placeholder="Название"
                                value={brand.title}
                                onChange={e => changeBrand('title', e.target.value)} 
                            />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            label="Порядок"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <InputNumber
                                size="large"
                                placeholder="4"
                                style={{ width: 200 }}
                                value={brand?.custom_order}
                                onChange={num => changeBrand('custom_order', num)} 
                            />
                        </FormItem>
                    </Col>
                    <Col span={12} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={brand.image} 
                            onChange={(info) => changeBrand('image', info.fileList)}
                        />
                        <StyledText>Загрузить главный логотип</StyledText>
                    </Col>
                    <Col span={12} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={brand.secondary_image} 
                            onChange={(info) => changeBrand('secondary_image', info.fileList)}
                        />
                        <StyledText>Загрузить второй логотип</StyledText>
                    </Col>
                    <Col span={24} className="mt-2">
                        <Space size="large">
                            <Button
                                size="large"
                                shape="round"
                                type="primary"
                                htmlType="submit"
                                loading={createLoading}
                            >
                                Сохранить
                            </Button>
                            <Button
                                size="large"
                                shape="round"
                                type="default"
                                onClick={() => navigate(`/brand/list`)}
                            >
                                Отменить
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
