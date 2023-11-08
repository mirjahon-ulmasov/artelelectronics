import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Checkbox, Col, Form, Input, 
    Row, Space 
} from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { useCreateProductMutation, useFetchBrandsQuery, useFetchCategoriesQuery } from 'services';
import { CustomSelect, BorderBox, LanguageToggle, StyledText, FormItem } from 'components'
import { languages } from 'utils/index'
import { Product } from 'types/product/product';
import { ID, LANGUAGE } from 'types/others/api'

interface MainProps {
    onClick: () => void
    onSetID: (id: ID) => void
    category: string
}

export function Main({ onClick, onSetID, category }: MainProps) {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [product, setProduct] = useState<Product.DTOUpload>({
        brand: '',
        category,
        subcategory: '',
        is_hot: false,
        is_new: false,
        is_recommended: false,
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })

    const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()
    const { data: brands, isLoading: brandsLoading } = useFetchBrandsQuery({})
    const { data: subcategories, isLoading: subcategoriesLoading } = useFetchCategoriesQuery({
        parent: category
    })

    // ---------------- Product ----------------

    const changeProduct = useCallback((key: keyof Product.DTOUpload, value: unknown) => {
        setProduct(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])


    const changeTitle = useCallback((key: keyof Product.LanguageUpload, value: string) => {
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


    const getValue = useCallback((key: keyof Product.LanguageUpload) => {
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
                    onSetID(response.id)
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста заполните поле',
                                },
                            ]}
                        >
                            <Input 
                                size="large" 
                                placeholder="Название продукта"
                                value={getValue('title')}
                                onChange={e => changeTitle('title', e.target.value)}
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Пожалуйста выберите бренд',
                                },
                            ]}
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
                                value={product.brand}
                                onChange={(value: ID) => changeProduct('brand', value)}
                            />
                        </FormItem>
                        <FormItem
                            label="Субкатегория"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={subcategoriesLoading}
                                options={subcategories?.map(subcategory => ({
                                    value: subcategory.id,
                                    label: subcategory.title,
                                }))}
                                value={product.subcategory}
                                onChange={(value: ID) => changeProduct('subcategory', value)}
                            />
                        </FormItem>
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <StyledText>Выбрать товар</StyledText>
                        <Space size="large">
                            <Form.Item
                                valuePropName="checked"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Checkbox
                                    checked={product.is_hot}
                                    onChange={e => changeProduct('is_hot', e.target.checked)}
                                >
                                    <StyledText>Хитовый товар</StyledText>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                valuePropName="checked"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                 <Checkbox
                                    checked={product.is_new}
                                    onChange={e => changeProduct('is_new', e.target.checked)}
                                >
                                    <StyledText>Новый товар</StyledText>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                valuePropName="checked"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                 <Checkbox
                                    checked={product.is_recommended}
                                    onChange={e => changeProduct('is_recommended', e.target.checked)}
                                >
                                    <StyledText>
                                        Рекомендованный товар
                                    </StyledText>
                                </Checkbox>
                            </Form.Item>
                        </Space>
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
