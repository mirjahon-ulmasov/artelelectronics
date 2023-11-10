import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { BorderBox, FileUpload, FormItem, ImageUpload, LanguageToggle, StyledText } from 'components'
import { useCreateCategoryMutation } from 'services'
import { ID, LANGUAGE } from 'types/others/api'
import { Category } from 'types/filters/category'
import { languages } from 'utils/index'

const { Title } = Typography

export default function AddCategory() {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [category, setCategory] = useState<Category.DTOCreation>({
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
    const [createCategory, { isLoading: createLoading }] = useCreateCategoryMutation()

    const changeCategory = useCallback((key: keyof Category.DTOCreation, value: unknown) => {
        setCategory(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeCategoryTitle = useCallback((key: keyof Category.Language, value: string) => {
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

    const getValue = useCallback((key: keyof Category.Language) => {
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

        createCategory(data)
            .unwrap()
            .then(() => {
                toast.success("Категория успешно добавлена")
                navigate("/category/list")
            })
            .catch(() => toast.error("Не удалось добавить категорию"))
    }, [category, createCategory, navigate])

    return (
        <Fragment>
            <Title level={3}>Добавить новую категорию</Title>
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
                                loading={createLoading}
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
