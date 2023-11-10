import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { BorderBox, CustomSelect, FormItem, ImageUpload, LanguageToggle, StyledText } from 'components'
import { useCreateCollectionMutation, useFetchCategoriesQuery } from 'services'
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
    const { data: categories, isLoading: loadingCategory } = useFetchCategoriesQuery({})
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
            image: collection.image[0]?.response?.id as ID,
            categories: collection.categories.map(el => ({ category: el }))
        }

        createCollection(data)
            .unwrap()
            .then(() => {
                toast.success("Коллекция успешно добавлена")
                navigate("/collection/list")
            })
            .catch(() => toast.error("Не удалось добавить коллекцию"))
    }, [collection, createCollection, navigate])

    return (
        <Fragment>
            <Title level={3}>Добавить новую коллекцию</Title>
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
                            label="Категория"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <CustomSelect
                                mode='multiple'
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={loadingCategory}
                                options={categories?.map(category => ({
                                    label: category.languages[1]?.title ?? '',
                                    value: category.id
                                }))}
                                value={collection.categories || undefined}
                                onChange={(value) => changeCollection('categories', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={collection.image} 
                            onChange={(info) => changeCollection('image', info.fileList)}
                        />
                        <StyledText>Загрузить изображение</StyledText>
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
