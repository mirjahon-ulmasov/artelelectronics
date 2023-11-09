import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { BorderBox, FormItem, ImageUpload, LanguageToggle, StyledText } from 'components'
import { useCreateCollectionMutation } from 'services'
import { ID, LANGUAGE } from 'types/others/api'
import { Collection } from 'types/filters/collection'
import { languages } from 'utils/index'

const { Title } = Typography

export default function AddCollection() {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [collection, setCollection] = useState<Collection.DTOCreation>({
        image: [],
        categories: [],
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })
    const [createCollection, { isLoading: createLoading }] = useCreateCollectionMutation()

    const changeCollection = useCallback((key: keyof Collection.DTOCreation, value: unknown) => {
        setCollection(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeCollectionTitle = useCallback((key: keyof Collection.Language, value: string) => {
        setCollection(prev => ({
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

    const getValue = useCallback((key: keyof Collection.Language) => {
        const foundIdx = collection.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return collection.languages[foundIdx][key] as string
        }
        return ''
    }, [language, collection.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        const data: Collection.DTOUpload = {
            ...collection,
            flag: collection.flag[0]?.response?.id as ID
        }

        createCollection(data)
            .unwrap()
            .then(() => {
                toast.success("Страна успешно добавлена")
                navigate("/collection/list")
            })
            .catch(() => toast.error("Не удалось добавить страну"))
    }, [collection, createCollection, navigate])

    return (
        <Fragment>
            <Title level={3}>Добавить новую страну</Title>
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
                                    onChange={e => changeCollectionTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            name="collection_code"
                            label="Код страны"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="uz"
                                value={collection.collection_code}
                                onChange={e => changeCollection('collection_code', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            name="IP"
                            label="IP-адрес"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="127.0.0.1"
                                value={collection.IP}
                                onChange={e => changeCollection('IP', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={collection.flag} 
                            onChange={(info) => changeCollection('flag', info.fileList)}
                        />
                        <StyledText>Загрузить флаг страны</StyledText>
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
                                onClick={() => navigate(`/collection/list`)}
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
