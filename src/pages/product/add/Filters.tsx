import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Row, Space } from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { 
    useCreateProductColorMutation, useFetchCategoryPropertiesQuery, 
    useImportCategoryPropertiesMutation,
    useFetchCategoryColorsQuery
} from 'services'
import { 
    CustomSelect, BorderBox, FormItem, 
    StyledTextL2, Color 
} from 'components'
import { ProductColor, ProductProperty } from 'types/product/property'
import { Product } from 'types/product/product';
import { ID } from 'types/others/api'

interface FilterProps {
    onClick: () => void
    product: Product.DTO
    category: string
}

export function Filters({ onClick, product, category }: FilterProps) {
    const navigate = useNavigate();

    const [prodColors, setProdColors] = useState<ProductColor.DTOUpload>({
        product: product.id,
        colors: []
    })
    const [prodProperties, setProdProperties] = useState<ProductProperty.DTOImport>({
        product: product.id,
        properties: []
    })

    const { data: colors, isLoading: colorsLoading } = useFetchCategoryColorsQuery({
        category: product.category.slug
    })
    const { data: properties, isLoading: propertiesLoading } = useFetchCategoryPropertiesQuery({
        category: product.category.slug
    })

    const [createProductColors, { isLoading: createLoading }] = useCreateProductColorMutation()
    const [importCategoryProperties, { isLoading: importLoading }] = useImportCategoryPropertiesMutation()

    // ---------------- Product Colors ----------------
    function changeProdColors(colors: ID[]) {       
        setProdColors(prev => ({
            ...prev,
            colors
        }))
    }

    // ---------------- Product Properties ----------------
    function changeProdProperty(propertyID: ID, items: ID[]) {
        const foundIdx = prodProperties.properties.findIndex(el => el.property === propertyID)
        if(foundIdx >= 0) {
            setProdProperties(prev => ({
                ...prev,
                properties: prev.properties.map(el => {
                    if(el.property === propertyID) {
                        return { ...el, items }
                    }
                    return el
                })
            }))
        } else {
            setProdProperties(prev => ({
                ...prev,
                properties: [
                    ...prev.properties,
                    { property: propertyID, items }
                ]
            }))
        }
    }

    const getProdProperty = useCallback((propertyID: ID) => {
        const foundIdx = prodProperties.properties.findIndex(el => el.property === propertyID)
        if(foundIdx >= 0) {
            return prodProperties.properties[foundIdx].items
        }
        return []
    }, [prodProperties.properties])

    // ---------------- Submit ----------------
    const onFinish = useCallback((next: boolean) => {
        const properties: ProductProperty.DTOImport = {
            ...prodProperties,
            properties: prodProperties.properties.filter(property => property.items.length > 0)
        }

        const promises = [
            createProductColors(prodColors).unwrap(),
            importCategoryProperties(properties).unwrap(),
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Фильтры продукта успешно добавлены.");
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
    }, [category, createProductColors, importCategoryProperties, navigate, onClick, prodColors, prodProperties]);


    return (
        <Form autoComplete="off" style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Фильтры продукта</StyledTextL2>
                        <div className='d-flex gap-12 jc-start fw-wrap'>
                            <FormItem
                                label="Цвет продукта"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <CustomSelect
                                    mode='multiple'
                                    allowClear
                                    size="large"
                                    value={prodColors.colors || undefined}
                                    placeholder="Выберите"
                                    loading={colorsLoading}
                                    onChange={changeProdColors}
                                    options={colors?.map(categoryColor => ({
                                        value: categoryColor.color.id,
                                        label: (
                                            <div className='d-flex gap-12 jc-start'>
                                                <Color link={categoryColor.color.image.file} />
                                                {categoryColor.color.title}
                                            </div>
                                        ),
                                    }))}
                                />
                            </FormItem>
                            {properties?.map((property) => (
                                <FormItem
                                    key={property.id}
                                    label={property.languages[1]?.title}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        mode='multiple'
                                        allowClear
                                        size="large"
                                        placeholder="Выберите"
                                        loading={propertiesLoading}
                                        options={property.items?.map(item => ({
                                            value: item.id,
                                            label: item.languages[1]?.title,
                                        }))}
                                        value={getProdProperty(property.id as ID)}
                                        onChange={(values: ID[]) => changeProdProperty(
                                            property.id as ID, values
                                        )}
                                    />
                                </FormItem>
                            ))}
                        </div>
                    </BorderBox>
                </Col>
                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            type="default"
                            htmlType="submit"
                            shape="round"
                            loading={createLoading || importLoading}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={createLoading || importLoading}
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
