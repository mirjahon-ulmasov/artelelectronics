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
    useCreateProductUtilityMutation, useFetchCategoryUtilitiesQuery, 
    useFetchProductVariantsQuery 
} from 'services'
import { 
    CustomSelect, BorderBox, FormItem, 
    StyledTextL2, Color, TrashIcon, StyledText, FileUpload 
} from 'components'
import { ProductUtility } from 'types/product/utility'
import { Product } from 'types/product/product';
import { ID } from 'types/others/api'

interface SAPCodeProps {
    category: string
    onClick: () => void
    product: Product.DTO
}

export function SAPCode({ onClick, product, category }: SAPCodeProps) {
    const navigate = useNavigate();

    const [productUtility, setProductUtility] = useState<ProductUtility.DTOLocal>({ 
        product: product.id,
        brand: product.brand.id,
        is_default: false,
        file: [],
        items: [{
            uuid: uuid(),
            product: product.id,
            brand: product.brand.id,
            category: product.category.id,
            variant: '',
            primary_utility: '',
            secondary_utilities: [],
            code: '',
            is_recommended: false,
            is_new: false,
            is_hot: false,
        }],
    })

    const { data: variants, isLoading: variantsLoading } = useFetchProductVariantsQuery({
        product: product.id
    })
    const { data: primaryUtility } = useFetchCategoryUtilitiesQuery({
        category,
        is_primary: true
    })
    const { data: secondaryUtilities } = useFetchCategoryUtilitiesQuery({
        category,
        is_primary: false
    })
    const [addUtilityProduct, { isLoading: loading }] = useCreateProductUtilityMutation()

    // ---------------- Product Utility ----------------

    const changeProductUtility = useCallback(
        (key: keyof Pick<ProductUtility.DTOLocal, 'file' | 'is_default'>, value: unknown) => {
            setProductUtility(prev => ({
                ...prev,
                [key]: value
            }))
    }, [])

    // ---------------- Product Utility Item ----------------
    
    const addNewUtilityItem = useCallback(() => {
        setProductUtility(prev => ({
            ...prev,
            items: [
                ...prev.items, 
                {
                    uuid: uuid(),
                    brand: product.brand.id,
                    category: product.category.id,
                    product: product.id,
                    variant: '',
                    primary_utility: '',
                    secondary_utilities: [],
                    code: '',
                    is_recommended: false,
                    is_new: false,
                    is_hot: false,
                }
            ]
        }))
    }, [product.brand.id, product.category.id, product.id])

    const changeProductUtilityItem = useCallback((id: ID, key: keyof ProductUtility.UtilityItem, value: unknown) => {
        setProductUtility(prev => ({
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

    const changeProductSecodaryUtility = useCallback((id: ID, value: ID, idx: number)=> {
        setProductUtility(prev => ({
            ...prev,
            items: prev.items.map(item => {
                if(item.uuid === id) {
                    const secondaryUtilities = item.secondary_utilities
                    secondaryUtilities[idx] = value

                    return {
                        ...item,
                        secondary_utilities: secondaryUtilities
                    }
                }
                return item
            })
        }))
    }, [])

    const deleteItem = useCallback((id: string) => {
        setProductUtility(prev => ({
            ...prev,
            items: prev.items.filter(item => item.uuid !== id)
        }))
    }, [])

    const reset = useCallback(() => {
        setProductUtility({ 
            product: product.id,
            brand: product.brand.id,
            is_default: false,
            file: [],
            items: [{
                uuid: uuid(),
                product: product.id,
                brand: product.brand.id,
                category: product.category.id,
                variant: '',
                primary_utility: '',
                secondary_utilities: [],
                code: '',
                is_recommended: false,
                is_new: false,
                is_hot: false,
            }]
        })
    }, [product.brand.id, product.category.id, product.id])

    // ---------------- Submit ----------------
    const onFinish = useCallback((again?: boolean, next?: boolean) => {    

        const dataUtility: ProductUtility.DTOUpload = {
            ...productUtility,
            file: productUtility.file[0]?.response?.id as ID
        }

        const promises = [
            addUtilityProduct(dataUtility).unwrap(),
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Варианты продукта и видео успешно добавлены.");
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
    }, [addUtilityProduct, category, navigate, onClick, productUtility, reset]);


    return (
        <Form autoComplete="off">
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Характеристики</StyledTextL2>
                        <FileUpload
                            label='Загрузить Excel'
                            fileList={productUtility.file} 
                            onChange={(info) => changeProductUtility('file', info.fileList)}
                        />
                        <Form.Item
                            valuePropName="checked"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Checkbox
                                checked={productUtility.is_default}
                                onChange={e => changeProductUtility(
                                    'is_default', e.target.checked
                                )}
                            >
                                <StyledText>По умолчанию</StyledText>
                            </Checkbox>
                        </Form.Item>
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>SAP Code</StyledTextL2>
                        {productUtility.items.map((prodUtility, index) => (
                            <div key={prodUtility.uuid} className='d-flex gap-16 jc-start fw-wrap'>
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
                                                onClick={() => deleteItem(prodUtility.uuid)}
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
                                        loading={variantsLoading}
                                        options={variants?.map(variant => ({
                                            value: variant.id,
                                            label: (
                                                <div className='d-flex gap-12 jc-start'>
                                                    <Color link={variant.color.image.file} />
                                                    {variant.color.title}
                                                </div>
                                            ),
                                        }))}
                                        value={prodUtility.variant || undefined}
                                        onChange={(value: ID) => changeProductUtilityItem(
                                            prodUtility.uuid, 'variant', value, 
                                        )}
                                    />
                                </FormItem>
                                {primaryUtility?.map(utility => (
                                    <FormItem
                                        key={utility.id}
                                        label={utility.languages[1]?.title}
                                        style={{ width: 250 }}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <CustomSelect
                                            allowClear
                                            size="large"
                                            placeholder="Выберите"
                                            loading={variantsLoading}
                                            options={utility.items?.map(item => ({
                                                value: item.id,
                                                label: item.languages[1]?.title,
                                            }))}
                                            value={prodUtility.primary_utility || undefined}
                                            onChange={(value: ID) => changeProductUtilityItem(
                                                prodUtility.uuid, 'primary_utility', value 
                                            )}
                                        />
                                    </FormItem>
                                ))}
                                {secondaryUtilities?.map((utility, idx) => (
                                    <FormItem
                                        key={utility.id}
                                        label={utility.languages[1]?.title}
                                        style={{ width: 250 }}
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                    >
                                        <CustomSelect
                                            allowClear
                                            size="large"
                                            placeholder="Выберите"
                                            loading={variantsLoading}
                                            options={utility.items?.map(item => ({
                                                value: item.id,
                                                label: item.languages[1]?.title,
                                            }))}
                                            value={prodUtility.secondary_utilities[idx]}
                                            onChange={(value: ID) => changeProductSecodaryUtility(
                                                prodUtility.uuid, value, idx
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
                                        value={prodUtility.code}
                                        onChange={e => changeProductUtilityItem(
                                            prodUtility.uuid, 'code', e.target.value, 
                                        )}
                                    />
                                </FormItem>
                                <Space size="large">
                                    <Form.Item
                                        valuePropName="checked"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        // className='mt-2'
                                    >
                                        <Checkbox
                                            checked={prodUtility.is_hot}
                                            onChange={e => changeProductUtilityItem(
                                                prodUtility.uuid, 'is_hot', e.target.checked
                                            )}
                                        >
                                            <StyledText>Хитовый товар</StyledText>
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item
                                        valuePropName="checked"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        // className='mt-2'
                                    >
                                        <Checkbox
                                            checked={prodUtility.is_new}
                                            onChange={e => changeProductUtilityItem(
                                                prodUtility.uuid, 'is_new', e.target.checked
                                            )}
                                        >
                                            <StyledText>Новый товар</StyledText>
                                        </Checkbox>
                                    </Form.Item>
                                    <Form.Item
                                        valuePropName="checked"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        // className='mt-2'
                                    >
                                        <Checkbox
                                            checked={prodUtility.is_recommended}
                                            onChange={e => changeProductUtilityItem(
                                                prodUtility.uuid, 'is_recommended', e.target.checked
                                            )}                                        
                                        >
                                            <StyledText>
                                                Рекомендованный товар
                                            </StyledText>
                                        </Checkbox>
                                    </Form.Item>
                                </Space>
                            </div>
                        ))}
                    </BorderBox>
                    <div className='d-flex mt-1'>
                        <Button 
                            type='text' 
                            size='large'
                            shape='round'
                            onClick={addNewUtilityItem}
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
