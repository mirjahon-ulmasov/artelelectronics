import { Button, Col, Form, Input, Row, Space, Typography, UploadFile } from 'antd'
import { FormItem, ImageUpload, StyledText } from 'components'
import { Fragment, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useCreateColorMutation } from 'services/color'
import { ID } from 'types/api'
import { Color } from 'types/color'

const { Title } = Typography

export default function AddColor() {
    const navigate = useNavigate()
    const [imageFile, setImageFile] = useState<UploadFile[]>([])
    const [createColor, { isLoading: createLoading }] = useCreateColorMutation()

    // ---------------- Submit ----------------
    const onFinish = (values: any) => {
        const data: Color.DTOCreation = {
            ...values,
            image: imageFile[0]?.response?.id as ID
        }

        createColor(data)
            .unwrap()
            .then(() => {
                toast.success("Цвет успешно добавлен")
                navigate("/color/list")
            })
            .catch(() => toast.error("Не удалось добавить цвет"))
    }

    return (
        <Fragment>
            <Title level={3}>Добавить новый цвет</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
            >
                <Row gutter={[0, 8]} className='mt-1'>
                    <Col span={24}>
                        <FormItem
                            name="title"
                            label="Название"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста заполните это поле',
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Название" />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            name="code"
                            label="Цветовой код"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста заполните это поле',
                                },
                            ]}
                        >
                            <Input size="large" placeholder="Цветовой код" />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={imageFile} 
                            onChange={(info) => setImageFile(info.fileList)}
                        />
                        <StyledText>Загрузить изображение цвета</StyledText>
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
                                onClick={() => navigate(`/color/list`)}
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
