/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Checkbox, Col, Form, Input, 
    Row, Space 
} from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { useCreateProductMutation, useFetchBrandsQuery, useFetchCategoriesQuery } from 'services';
import { CustomSelect, BorderBox, LanguageToggle, Language, StyledText, FormItem } from 'components'
import { LANGUAGE } from 'types/index';
import { Product } from 'types/product';
import { useQuery } from 'hooks/useQuery'
import { ID } from 'types/api'

const languages: Language[] = [
    { label: 'Ru', value: LANGUAGE.RU },
    { label: 'Uz', value: LANGUAGE.UZ },
    { label: 'En', value: LANGUAGE.EN }
]

interface MainFormProps {
    onClick: () => void
    onSetID: (id: ID) => void
}

export function MainForm({ onClick, onSetID }: MainFormProps) {
    const navigate = useNavigate();
    const query = useQuery();
    const category = query.get("category") ?? undefined

    const [form] = Form.useForm()
    const [titleLanguage, setTitleLanguage] = useState<LANGUAGE>(LANGUAGE.RU)

    const [createProduct, { isLoading: createLoading }] = useCreateProductMutation()
    const { data: brands, isLoading: brandsLoading } = useFetchBrandsQuery({})
    const { data: subcategories, isLoading: subcategoriesLoading } = useFetchCategoriesQuery({
        parent: category
    })


    // ---------------- Submit ----------------
    const onFinish = (values: Product.DTOCreation) => {

        if(!category) {
            toast.error("Категория не выбрана")
            return;
        } 

        const data = {
            ...values,
            category,
            title_uz: form.getFieldValue('title_uz'),
            title_ru: form.getFieldValue('title_ru'),
            title: form.getFieldValue('title_en')
        }
        
        createProduct(data)
            .unwrap()
            .then((response) => {
                toast.success("Продукт успешно создан")
                onClick()
                onSetID(response.id)
                // navigate({
                //     pathname: '/product/list',
                //     search: `?category=${category}`
                // })
            })
            .catch(() => toast.error("Не удалось создать продукт"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <Form
            form={form}
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <LanguageToggle
                            languages={languages}
                            currentLanguage={titleLanguage}
                            onChange={lang => {
                                setTitleLanguage(lang)
                            }}
                        />
                        <FormItem
                            key={`title_${titleLanguage}`}
                            name={`title_${titleLanguage}`}
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
                            <Input size="large" placeholder="Название продукта" />
                        </FormItem>
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <FormItem
                            name="brand"
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
                            ></CustomSelect>
                        </FormItem>
                        <FormItem
                            name="subcategory"
                            label="Субкатегория"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            // rules={[
                            //     {
                            //         required: true,
                            //         message: 'Пожалуйста выберите подкатегорию',
                            //     },
                            // ]}
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
                            ></CustomSelect>
                        </FormItem>
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <StyledText>Выбрать товар</StyledText>
                        <Space size="large">
                            <Form.Item
                                name="is_hot"
                                valuePropName="checked"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Checkbox>
                                    <StyledText>Хитовый товар</StyledText>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="is_new"
                                valuePropName="checked"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Checkbox>
                                    <StyledText>Новый товар</StyledText>
                                </Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="is_recommended"
                                valuePropName="checked"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Checkbox>
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
                            type="primary"
                            htmlType="submit"
                            shape="round"
                            loading={createLoading}
                            style={{ background: '#25A55A' }}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            onClick={() => navigate('/client/list')}
                        >
                            Сохранить и продолжить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
