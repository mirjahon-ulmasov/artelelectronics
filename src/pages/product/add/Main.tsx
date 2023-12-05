import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space } from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { useCreateProductMutation, useFetchBrandsQuery, useFetchCategoryTypesQuery } from 'services';
import { CustomSelect, BorderBox, LanguageToggle, FormItem } from 'components'
import { Product } from 'types/product/product';
import { ID, LANGUAGE } from 'types/others/api'
import { languages } from 'utils/index'

interface MainProps {
    onClick: () => void
    onSetID: (id: string) => void
    category: ID
}

export function Main({ onClick, onSetID, category }: MainProps) {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [product, setProduct] = useState<Product.DTOUpload>({
        brand: '',
        category,
        category_type: '',
        external_url: '',
        languages: [
            { title: '', secondary_title: "", language: LANGUAGE.EN },
            { title: '', secondary_title: "", language: LANGUAGE.RU },
            { title: '', secondary_title: "", language: LANGUAGE.UZ },
        ]
    })

    const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()
    const { data: brands, isLoading: brandsLoading } = useFetchBrandsQuery({})
    const { data: category_types, isLoading: categoryTypesLoading } = useFetchCategoryTypesQuery({
        category: category
    })

    // ---------------- Product ----------------

    const changeProduct = useCallback((key: keyof Product.DTOUpload, value: unknown) => {
        setProduct(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])


    const changeTitle = useCallback((key: keyof Product.ExLanguage, value: string) => {
        setProduct(prev => ({
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


    const getValue = useCallback((key: keyof Product.ExLanguage) => {
        const foundIdx = product.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return product.languages[foundIdx][key]
        }
        return ''
    }, [language, product.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback((next: boolean) => {

        if(!category) {
            toast.error("Категория не выбрана")
            return;
        } 
        
        createProduct(product)
            .unwrap()
            .then((response) => {
                toast.success("Продукт успешно создан")
                if(next) {
                    onClick()
                    onSetID(response.slug)
                    return;
                }
                navigate({
                    pathname: '/product/list',
                    search: `?category=${category}`
                })
            })
            .catch(() => toast.error("Не удалось создать продукт"))
    }, [category, createProduct, navigate, onClick, onSetID, product]);

    return (
        <Form autoComplete="off" style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
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
                            label="Название продукта"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="Название продукта"
                                value={getValue('title')}
                                onChange={e => changeTitle('title', e.target.value)}
                            />
                        </FormItem>
                        <FormItem
                            label="Вторичное название продукта"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="Вторичное название продукта"
                                value={getValue('secondary_title')}
                                onChange={e => changeTitle('secondary_title', e.target.value)}
                            />
                        </FormItem>
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <FormItem
                            label="Выбрать бренд"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={brandsLoading}
                                options={brands?.map(brand => ({
                                    value: brand.id,
                                    label: brand.title,
                                }))}
                                value={product.brand || undefined}
                                onChange={(value: ID) => changeProduct('brand', value)}
                            />
                        </FormItem>
                        <FormItem label="Тип названия категории" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={categoryTypesLoading}
                                options={category_types?.map(type => ({
                                    value: type.id,
                                    label: type.languages[1]?.title,
                                }))}
                                value={product.category_type || undefined}
                                onChange={(value: ID) => changeProduct('category_type', value)}
                            />
                        </FormItem>
                        <FormItem label="Внешний URL-адрес" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                            <Input.TextArea
                                rows={5}
                                size="large"
                                placeholder="Внешний URL-адрес"
                                value={product.external_url}
                                onChange={e => changeProduct('external_url', e.target.value)}
                            />
                        </FormItem>
                    </BorderBox>
                </Col>
                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            type="default"
                            htmlType="submit"
                            shape="round"
                            loading={createLoading}
                            onClick={() => onFinish(false)}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={createLoading}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить и продолжить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
