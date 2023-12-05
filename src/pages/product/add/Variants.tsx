import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Checkbox, Col, Divider, Form, 
    Input, Row, Space 
} from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { v4 as uuid } from 'uuid'
import { PlusOutlined } from '@ant-design/icons';
import { 
    useCreateProductVariantsMutation,
    useFetchProductColorsQuery,
    useFetchProductPropertiesQuery, 
} from 'services'
import { 
    CustomSelect, BorderBox, FormItem, 
    StyledTextL2, Color, TrashIcon, StyledText, FileUpload 
} from 'components'
import { ProductVariant } from 'types/product/variant'
import { Product } from 'types/product/product';
import { ID } from 'types/others/api'

interface VariantsProps {
    category: string
    onClick: () => void
    product: Product.DTO
}

export function Variants({ onClick, product, category }: VariantsProps) {
    const navigate = useNavigate();

    const [productVariant, setProductVariant] = useState<ProductVariant.DTOLocal>({ 
        product: product.id,
        file: [],
        items: [{
            uuid: uuid(),
            product: product.id,
            brand: product.brand.id,
            category: product.category.id,
            color: '',
            properties: [],
            sap_code: '',
            is_recommended: false,
            is_new: false,
            is_hot: false,
            
        }],
    })

    const { data: colors, isLoading: colorsLoading } = useFetchProductColorsQuery({
        product: product.id
    })
    const { data: properties, isLoading: propertiesLoading } = useFetchProductPropertiesQuery({
        product: product.id    
    })
    const [createVariant, { isLoading: loading }] = useCreateProductVariantsMutation()

    // ---------------- Product Variant Item ----------------
    
    const addNewVariantItem = useCallback(() => {
        setProductVariant(prev => ({
            ...prev,
            items: [
                ...prev.items, 
                {
                    uuid: uuid(),
                    product: product.id,
                    brand: product.brand.id,
                    category: product.category.id,
                    color: '',
                    properties: [],
                    sap_code: '',
                    is_recommended: false,
                    is_new: false,
                    is_hot: false,
                }
            ]
        }))
    }, [product.brand.id, product.category.id, product.id])

    const changeProductVariantItem = useCallback(
        (id: ID, key: keyof ProductVariant.VariantItem, value: unknown) => {
        setProductVariant(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if(item.uuid === id) {
                    return {
                        ...item,
                        [key]: value
                    }
                }
                return item
            })
        }))
    }, [])

    const changeProductVariantProperties = useCallback((id: ID, value: ID, idx: number)=> {
        setProductVariant(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if(item.uuid === id) {
                    const properties = item.properties
                    properties[idx] = value

                    return {
                        ...item,
                        properties
                    }
                }
                return item
            })
        }))
    }, [])

    const deleteItem = useCallback((id: string) => {
        setProductVariant(prev => ({
            ...prev,
            items: prev.items.filter(item => item.uuid !== id)
        }))
    }, [])

    const reset = useCallback(() => {
        setProductVariant({ 
            product: product.id,
            file: [],
            items: [{
                uuid: uuid(),
                product: product.id,
                brand: product.brand.id,
                category: product.category.id,
                color: '',
                properties: [],
                sap_code: '',
                is_recommended: false,
                is_new: false,
                is_hot: false,
                
            }],
        })
    }, [product.brand.id, product.category.id, product.id])

    // ---------------- Submit ----------------
    const onFinish = useCallback((again?: boolean, next?: boolean) => {    

        const variant: ProductVariant.DTOUpload = {
            ...productVariant,
            file: productVariant.file[0]?.response?.id as ID,
            items: productVariant.items.map(el => ({
                ...el,
                properties: el.properties.filter(property => property)
            }))
        }

        const promises = [
            createVariant(variant).unwrap(),
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Варианты продукта успешно добавлены.");
                if(again) {
                    reset()
                    return;
                }
                if(next) {
                    onClick()
                    return;
                }
                navigate({
                    pathname: '/product/list',
                    search: `?category=${category}`
                })
            })
            .catch(() => toast.error("Что-то пошло не так"));
    }, [category, createVariant, navigate, onClick, productVariant, reset]);


    return (
        <Form autoComplete="off">
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Характеристики</StyledTextL2>
                        <FileUpload
                            label='Загрузить Excel'
                            fileList={productVariant.file} 
                            onChange={(info) => setProductVariant(prev => ({ ...prev, file: info.fileList }))}
                        />
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>SAP Code</StyledTextL2>
                        {productVariant.items.map((prodVariant, index) => (
                            <div key={prodVariant.uuid} className='d-flex gap-16 jc-start fw-wrap'>
                                {!!index && (
                                    <Divider style={{ margin: '15px 0'}}>
                                        <Space size='middle'>
                                            <StyledText>{index + 1}</StyledText>
                                            <Button
                                                size='middle'
                                                shape='circle'
                                                className='d-flex'
                                                icon={<TrashIcon />}
                                                style={{ scale: '1.2' }}
                                                onClick={() => deleteItem(prodVariant.uuid)}
                                            />
                                        </Space>
                                    </Divider>
                                )}
                                <FormItem
                                    label="Цвет продукта"
                                    style={{ width: 250 }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder="Выберите"
                                        loading={colorsLoading}
                                        options={colors?.map(prodColor => ({
                                            value: prodColor.color.id,
                                            label: (
                                                <div className='d-flex gap-12 jc-start'>
                                                    <Color link={prodColor.color.image.file} />
                                                    {prodColor.color.title}
                                                </div>
                                            ),
                                        }))}
                                        value={prodVariant.color || undefined}
                                        onChange={(value: ID) => changeProductVariantItem(
                                            prodVariant.uuid, 'color', value, 
                                        )}
                                    />
                                </FormItem>
                                {properties?.map((property, idx) => (
                                    <FormItem
                                        key={property.id}
                                        label={property.languages[1]?.title}
                                        style={{ width: 250 }}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <CustomSelect
                                            allowClear
                                            size="large"
                                            placeholder="Выберите"
                                            loading={propertiesLoading}
                                            options={property.items?.map(item => ({
                                                value: item.id,
                                                label: item.languages[1]?.title,
                                            }))}
                                            value={prodVariant.properties[idx]}
                                            onChange={(value: ID) => changeProductVariantProperties(
                                                prodVariant.uuid, value, idx
                                            )}
                                        />
                                    </FormItem>
                                ))}
                                <FormItem
                                    label="Серийный номер"
                                    style={{ width: 250 }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input 
                                        size="large" 
                                        placeholder="Серийный номер"
                                        value={prodVariant.sap_code}
                                        onChange={e => changeProductVariantItem(
                                            prodVariant.uuid, 'sap_code', e.target.value, 
                                        )}
                                    />
                                </FormItem>
                                <div className='w-100 d-flex gap-16 jc-start fw-wrap'>
                                    <Form.Item valuePropName="checked" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Checkbox
                                            checked={prodVariant.is_hot}
                                            onChange={e => changeProductVariantItem(
                                                prodVariant.uuid, 'is_hot', e.target.checked
                                            )}
                                        >
                                            <StyledText>Хитовый товар</StyledText>
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Checkbox
                                            checked={prodVariant.is_new}
                                            onChange={e => changeProductVariantItem(
                                                prodVariant.uuid, 'is_new', e.target.checked
                                            )}
                                        >
                                            <StyledText>Новый товар</StyledText>
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item valuePropName="checked" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Checkbox
                                            checked={prodVariant.is_recommended}
                                            onChange={e => changeProductVariantItem(
                                                prodVariant.uuid, 'is_recommended', e.target.checked
                                            )}                                        
                                        >
                                            <StyledText>
                                                Рекомендованный товар
                                            </StyledText>
                                        </Checkbox>
                                    </Form.Item>
                                </div>
                            </div>
                        ))}
                    </BorderBox>
                    <div className='d-flex mt-1'>
                        <Button 
                            type='text' 
                            size='large'
                            shape='round'
                            onClick={addNewVariantItem}
                            icon={<PlusOutlined />} 
                        >
                            Добавить еще
                        </Button>
                    </div>
                </Col>

                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            shape="round"
                            type="default"
                            loading={loading}
                            onClick={() => onFinish()}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={loading}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить и добавить еще
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={loading}
                            onClick={() => onFinish(false, true)}
                        >
                            Сохранить и продолжить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
