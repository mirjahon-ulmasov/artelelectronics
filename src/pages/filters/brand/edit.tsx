import { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, InputNumber, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import { FormItem, ImageUpload, StyledText } from 'components'
import { useFetchBrandQuery, useUpdateBrandMutation } from 'services'
import { Brand } from 'types/filters/brand'
import { ID, } from 'types/others/api'

const { Title } = Typography

export default function EditBrand() {
    const navigate = useNavigate()
    const { brandID } = useParams()
    const [brand, setBrand] = useState<Brand.DTOLocal>()

    const { data: brandData } = useFetchBrandQuery(brandID as ID)
    const [updateBrand, { isLoading: updateLoading }] = useUpdateBrandMutation()

    useEffect(() => {
        if(!brandData) return;
        setBrand({
            ...brandData,
            image: brandData.image ? [{
                uid: uuid(),
                response: brandData.image,
                status: 'done',
                name: `${brandData.title}.png`,
                url: brandData.image.file
            }] : [],
            secondary_image: brandData.secondary_image ? [{
                uid: uuid(),
                response: brandData.secondary_image,
                status: 'done',
                name: `${brandData.title}.png`,
                url: brandData.secondary_image?.file
            }] : [],
            third_image: brandData.third_image ? [{
                uid: uuid(),
                response: brandData.third_image,
                status: 'done',
                name: `${brandData.title}.png`,
                url: brandData.third_image?.file
            }] : []
        })
    }, [brandData])

    const changeBrand = useCallback((key: keyof Brand.DTOLocal, value: unknown) => {
        setBrand(prev => {
            if(!prev) return prev
            return {
                ...prev,
                [key]: value
            }
        })
    }, [])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        if(!brand) return;

        const data: Brand.DTOUpload = {
            ...brand,
            image: brand.image[0]?.response?.id as ID,
            secondary_image: brand.secondary_image[0]?.response?.id as ID,
            third_image: brand.third_image[0]?.response?.id as ID,
        }

        updateBrand(data)
            .unwrap()
            .then(() => {
                toast.success("Бренд успешно изменен")
                navigate("/brand/list")
            })
            .catch(() => toast.error("Не удалось изменить бренд"))
    }, [brand, updateBrand, navigate])

    return (
        <Fragment>
            <Title level={3}>Изменить бренд</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 800 }}
            >
                <Row gutter={[16, 8]} className='mt-1'>
                    <Col span={12}>
                        <FormItem
                            label="Название"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input 
                                size="large" 
                                placeholder="Название"
                                value={brand?.title}
                                onChange={e => changeBrand('title', e.target.value)} 
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
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
                    <Col span={8} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={brand?.image} 
                            onChange={(info) => changeBrand('image', info.fileList)}
                        />
                        <StyledText>Загрузить главный логотип</StyledText>
                    </Col>
                    <Col span={8} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={brand?.secondary_image} 
                            onChange={(info) => changeBrand('secondary_image', info.fileList)}
                        />
                        <StyledText>Загрузить второй логотип</StyledText>
                    </Col>
                    <Col span={8} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={brand?.third_image} 
                            onChange={(info) => changeBrand('third_image', info.fileList)}
                        />
                        <StyledText>Загрузить третий логотип</StyledText>
                    </Col>
                    <Col span={24} className="mt-2">
                        <Space size="large">
                            <Button
                                size="large"
                                shape="round"
                                type="primary"
                                htmlType="submit"
                                loading={updateLoading}
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
