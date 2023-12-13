import { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import { BorderBox, FileUpload, FormItem, ImageUpload, LanguageToggle, StyledText } from 'components'
import { useFetchCategoryQuery, useUpdateCategoryMutation } from 'services'
import { ID, LANGUAGE, Language } from 'types/others/api'
import { Category } from 'types/filters/category'
import { languages } from 'utils/index'

const { Title } = Typography

export default function EditCategory() {
    const navigate = useNavigate()
    const { categoryID } = useParams()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [category, setCategory] = useState<Category.DTOLocal>({
        parent: null,
        image: [],
        secondary_file: [],
        custom_order: 0,
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })
    const { data: categoryData } = useFetchCategoryQuery(categoryID as ID)
    const [updateCategory, { isLoading: updateLoading }] = useUpdateCategoryMutation()

    useEffect(() => {
        if(!categoryData) return;
        setCategory({
            ...categoryData,
            image: categoryData.image ? [{
                uid: uuid(),
                response: categoryData.image,
                status: 'done',
                name: 'category.png',
                url: categoryData.image?.file
            }] : [],
            secondary_file: categoryData.secondary_file ? [{
                uid: uuid(),
                response: categoryData.secondary_file,
                status: 'done',
                name: 'video.mp4',
                url: categoryData.secondary_file?.file
            }] : [],
        })
    }, [categoryData])

    const changeCategory = useCallback((key: keyof Category.DTOLocal, value: unknown) => {
        setCategory(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeCategoryTitle = useCallback((key: keyof Language, value: string) => {
        setCategory(prev => ({
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
        const foundIdx = category.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return category.languages[foundIdx][key] as string
        }
        return ''
    }, [language, category.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        const data: Category.DTOUpload = {
            ...category,
            image: category.image[0]?.response?.id as ID,
            secondary_file: category.secondary_file[0]?.response?.id as ID,
        }

        updateCategory(data)
            .unwrap()
            .then(() => {
                toast.success("Категория успешно добавлена")
                navigate("/category/list")
            })
            .catch(() => toast.error("Не удалось добавить категорию"))
    }, [category, updateCategory, navigate])

    return (
        <Fragment>
            <Title level={3}>Изменить категорию - {categoryData?.languages?.[1]?.title}</Title>
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
                                    onChange={e => changeCategoryTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={category.image} 
                            onChange={(info) => changeCategory('image', info.fileList)}
                        />
                        <StyledText>Загрузить изображение</StyledText>
                    </Col>
                    <Col span={24} className="mt-1">
                        <FileUpload
                            label='Загрузить анимацию'
                            fileList={category.secondary_file} 
                            onChange={(info) => changeCategory('secondary_file', info.fileList)}
                        />
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
                                onClick={() => navigate(`/category/list`)}
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
