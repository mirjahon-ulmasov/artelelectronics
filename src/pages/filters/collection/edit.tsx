import { Fragment, useCallback, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import { 
    BorderBox, CustomSelect, FormItem, 
    ImageUpload, LanguageToggle, StyledText 
} from 'components'
import { 
    useFetchCategoriesQuery, useFetchCollectionQuery, 
    useUpdateCollectionMutation, useAddCategoryToCollectionMutation 
} from 'services'
import { ID, LANGUAGE, Language } from 'types/others/api'
import { Collection } from 'types/filters/collection'
import { languages } from 'utils/index'

const { Title } = Typography

export default function EditCollection() {
    const navigate = useNavigate()
    const { collectionID } = useParams()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [collection, setCollection] = useState<Collection.DTOLocal>()

    const { data: collectionData } = useFetchCollectionQuery(collectionID as ID)
    const { data: categories, isLoading: loadingCategory } = useFetchCategoriesQuery({})

    const [addCategory,  { isLoading: loading1 }] = useAddCategoryToCollectionMutation()
    const [updateCollection, { isLoading: loading2 }] = useUpdateCollectionMutation()

    useEffect(() => {
        if(!collectionData) return;
        setCollection({
            ...collectionData,
            image: collectionData.image ? [{
                uid: uuid(),
                response: collectionData.image,
                status: 'done',
                name: 'collection.png',
                url: collectionData.image?.file
            }] : [],
            categories: collectionData.categories.map(category => category.id)
        })
    }, [collectionData])


    const changeCollection = useCallback((key: keyof Collection.DTOLocal, value: unknown) => {
        setCollection(prev => {
            if(!prev) return prev
            return {
                ...prev,
                [key]: value
            }
        })
    }, [])

    const changeCollectionTitle = useCallback((key: keyof Language, value: string) => {
        setCollection(prev => {
            if(!prev) return prev
            return {
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
            }
        })
    }, [language])

    const getValue = useCallback((key: keyof Language) => {
        const foundIdx = collection?.languages.findIndex(el => el.language === language)
        if(typeof foundIdx === 'number' && foundIdx !== -1) {
            return collection?.languages[foundIdx][key] as string
        }
        return ''
    }, [language, collection?.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        if(!collectionData || !collection) return;

        const data: Collection.DTOUpload = {
            ...collection,
            image: collection.image[0]?.response?.id as ID,
            categories: collection.categories.map(el => ({ category: el }))
        }

        const promises = [
            addCategory({ body: data.categories, id: collectionData.id }).unwrap(),
            updateCollection(data).unwrap()
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Коллекция успешно изменена")
                navigate("/collection/list")
            })
            .catch(() => toast.error("Не удалось изменить коллекцию"))
    }, [collectionData, collection, addCategory, updateCollection, navigate])

    return (
        <Fragment>
            <Title level={3}>Изменить коллекцию</Title>
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
                                value={collection?.categories || undefined}
                                onChange={(value) => changeCollection('categories', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={collection?.image} 
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
                                loading={loading1 || loading2}
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
