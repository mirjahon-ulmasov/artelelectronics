import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { BorderBox, FormItem, ImageUpload, LanguageToggle, StyledText } from 'components'
import { useCreateColorMutation } from 'services/filters/color'
import { ID, LANGUAGE } from 'types/others/api'
import { Color } from 'types/filters/color'
import { languages } from 'utils/index'

const { Title } = Typography

export default function AddColor() {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [color, setColor] = useState<Color.DTOCreation>({
        code: '',
        image: [],
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })
    const [createColor, { isLoading: createLoading }] = useCreateColorMutation()

    const changeColor = useCallback((key: keyof Color.DTOCreation, value: unknown) => {
        setColor(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeColorTitle = useCallback((key: keyof Color.Language, value: string) => {
        setColor(prev => ({
            ...prev,
            languages: prev.languages.map(el => {
                if(el.language === language) {
                    return {
                        ...el,
                        [key]: value
                    }
                }
                return el
            })
        }))
    }, [language])

    const getValue = useCallback((key: keyof Color.Language) => {
        const foundIdx = color.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return color.languages[foundIdx][key] as string
        }
        return ''
    }, [language, color.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        const data: Color.DTOUpload = {
            ...color,
            image: color.image[0]?.response?.id as ID
        }

        createColor(data)
            .unwrap()
            .then(() => {
                toast.success("Цвет успешно добавлен")
                navigate("/color/list")
            })
            .catch(() => toast.error("Не удалось добавить цвет"))
    }, [color, createColor, navigate])

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
                        <BorderBox>
                            <LanguageToggle
                                languages={languages}
                                currentLanguage={language}
                                onChange={lang => {
                                    setLanguage(lang)
                                }}
                            />
                            <FormItem
                                label="Название"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Input 
                                    size="large" 
                                    placeholder="Название"
                                    value={getValue('title')}
                                    onChange={e => changeColorTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            name="code"
                            label="Цветовой код"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="Цветовой код"
                                value={color.code}
                                onChange={e => changeColor('code', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={color.image} 
                            onChange={(info) => changeColor('image', info.fileList)}
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
