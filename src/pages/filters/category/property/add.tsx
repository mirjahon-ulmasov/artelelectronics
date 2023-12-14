import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import { BorderBox, FormItem, LanguageToggle, StyledTextL2 } from 'components'
import { useCreateCategoryPropertyMutation } from 'services'
import { Category, CategoryProperty } from 'types/filters/category'
import { ID, LANGUAGE, Language } from 'types/others/api'
import { languages } from 'utils/index'

const { Title } = Typography

interface PropertyProps {
    category?: Category.DTO
}

export default function AddProperty({ category }: PropertyProps) {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [property, setProperty] = useState<CategoryProperty.DTO>({
        category: category?.id as ID,
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ],
        items: [
            {
                languages: [
                    { title: '', language: LANGUAGE.UZ },
                    { title: '', language: LANGUAGE.RU },
                    { title: '', language: LANGUAGE.EN },
                ]
            }
        ]
    })
    const [createProperty, { isLoading: createLoading }] = useCreateCategoryPropertyMutation()

    const changePropertyTitle = useCallback((key: keyof Language, value: string) => {
        setProperty(prev => ({
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

    const getValue = useCallback((key: keyof Language) => {
        const foundIdx = property.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return property.languages[foundIdx][key] as string
        }
        return ''
    }, [language, property.languages])

    // ---------------- Property Items ----------------

    const changePropertyItemTitle = useCallback((idx: number, value: string) => {
        setProperty(prev => ({
            ...prev,
            items: prev.items.map((item, index) => {
                if(index === idx) {
                    return {
                        ...item,
                        languages: item.languages.map(el => {
                            if(el.language === language) {
                                return {
                                    ...el,
                                    title: value
                                }
                            }
                            return el
                        })
                    }
                }
                return item
            })
        }))
    }, [language])

    const getItemValue = useCallback((index: number) => {
        const foundIdx = property.items[index].languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return property.items[index].languages[foundIdx].title
        }
        return ''
    }, [language, property.items])

    const addNewItem = useCallback(() => {
        setProperty(prev => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    languages: [
                        { title: '', language: LANGUAGE.UZ },
                        { title: '', language: LANGUAGE.RU },
                        { title: '', language: LANGUAGE.EN },
                    ]
                }
            ]
        }))
    }, [])

    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {

        createProperty(property)
            .unwrap()
            .then(() => {
                toast.success("Свойство категории успешно добавлено")
                navigate(`/category/${category?.id}/property/list`)
            })
            .catch(() => toast.error("Что-то пошло не так"))
    }, [createProperty, property, navigate, category?.id])    

    return (
        <Fragment>
            <Title level={3}>
                Добавить свойство - {category?.languages?.[1]?.title}
            </Title>
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
                                    onChange={e => changePropertyTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24}>
                        <BorderBox gap='0px'>
                            <StyledTextL2>Элементы</StyledTextL2>
                            <Row gutter={[16, 16]}>
                                {property.items.map((_, index) => (
                                    <Col span={24} key={index}>
                                        <FormItem
                                            label={`${index + 1}-название`}
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Input 
                                                size="large" 
                                                placeholder="Название"
                                                value={getItemValue(index)}
                                                onChange={e => changePropertyItemTitle(index, e.target.value)} 
                                            />
                                        </FormItem>
                                    </Col>
                                ))}
                            </Row>
                        </BorderBox>
                        <div className='d-flex mt-1'>
                            <Button 
                                type='text' 
                                size='large'
                                shape='round'
                                onClick={addNewItem}
                                icon={<PlusOutlined />} 
                                style={{ fontWeight: 400 }} 
                            >
                                Добавить еще
                            </Button>
                        </div>
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
                                onClick={() => navigate(`/category/${category?.id}/property/list`)}
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
