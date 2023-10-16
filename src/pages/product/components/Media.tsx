import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Checkbox, Col, Divider, Form, 
    Row, Space, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import _, { isArray } from 'lodash'
import { v4 as uuid } from 'uuid'
import { useFetchColorsQuery, useCreateProductVariantsMutation, useAdd360ViewMutation } from 'services'
import { 
    CustomSelect, BorderBox, StyledText, 
    FormItem, StyledTextL2, ImageUpload, FileUpload, Color, TrashIcon 
} from 'components'
import { ID } from 'types/api'
import { Product, Variant } from 'types/product';
import { PlusOutlined } from '@ant-design/icons';


interface MediaProps {
    onClick: () => void
    product: Product.DTO
    category: string
}

export function Media({ onClick, product, category }: MediaProps) {
    const navigate = useNavigate();
    const [view360, setView360] = useState<UploadFile[]>([])
    const [variants, setVariants] = useState<Variant.DTOLocal[]>([
        { color: '', default_image: [], is_default: false, uuid: uuid() }
    ])

    const { data: colors, isLoading: colorsLoading } = useFetchColorsQuery({})
    const [add360View, { isLoading: createLoading1 }] = useAdd360ViewMutation()
    const [createProductVariants, { isLoading: createLoading2 }] = useCreateProductVariantsMutation()

    // ---------------- Product Variants ----------------

    function addNewVariant() {
        setVariants(prev => [
            ...prev, 
            { color: '', default_image: [], is_default: false, uuid: uuid() }
        ])
    }

    function changeVariant(key: keyof Variant.DTOLocal, value: unknown, uuid: string) {
        setVariants(prev => prev.map(variant => {
            if(variant.uuid === uuid) {
                return {
                    ...variant,
                    [key]: value
                }
            }
            return variant
        }))
    }

    const deleteItem = useCallback((id: string) => {
        setVariants(prev => prev.filter(variant => variant.uuid !== id))
    }, [])

    // ---------------- Submit ----------------
    const onFinish = useCallback((next: boolean) => {

        const hasError = 
        variants.some(variant => 
            !variant.color || 
            !isArray(variant.default_image) ||
            !variant.default_image.length
        ) 
        || !isArray(view360) 
        || !view360.length

        if(hasError) {
            toast.error("Пожалуйста заполните поля")
            return;
        }

        const data360: Product.View360 = {
            id: product.id,
            dynamic_file: view360[0]?.response?.id as ID
        }

        const dataVariants: Variant.DTOUpload[] = variants.map(variant => ({
            product: product.id,
            color: variant.color,
            is_default: variant.is_default,
            default_image: variant.default_image[0]?.response?.id as ID
        }))

        const promises = [
            add360View(data360).unwrap(),
            createProductVariants(dataVariants).unwrap(),
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Варианты продукта и видео успешно добавлены.");
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
    }, [add360View, category, createProductVariants, navigate, onClick, product.id, variants, view360]);


    return (
        <Form autoComplete="off" style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Видео продукта</StyledTextL2>
                        <FileUpload
                            label='Загрузить видео'
                            fileList={view360} 
                            onChange={(info) => setView360(info.fileList)}
                        />
                    </BorderBox>
                </Col>

                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Изображение каталога</StyledTextL2>
                        {variants.map((variant, index) => (
                            <Fragment key={variant.uuid}>
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
                                                onClick={() => deleteItem(variant.uuid)}
                                            />
                                        </Space>
                                    </Divider>
                                )}
                                <FormItem
                                    label="Выбрать цвет продукта"
                                    style={{ maxWidth: 300 }}
                                    wrapperCol={{ span: 24 }}
                                    labelCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        value={variant.color}
                                        placeholder="Выберите"
                                        loading={colorsLoading}
                                        onChange={(value: ID) => changeVariant('color', value, variant.uuid)}
                                        options={colors?.map(color => ({
                                            value: color.id,
                                            label: (
                                                <div className='d-flex gap-12 jc-start'>
                                                    <Color link={color.image.file} />
                                                    {color.title}
                                                </div>
                                            ),
                                        }))}
                                    ></CustomSelect>
                                </FormItem>
                                <div>
                                    <ImageUpload
                                        maxCount={1}
                                        fileList={variant.default_image} 
                                        onChange={(info) => changeVariant('default_image', info.fileList, variant.uuid)}
                                    />
                                    <StyledText>Загрузить основное фото каталога</StyledText>
                                </div>
                                <Form.Item
                                    valuePropName="checked"
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Checkbox 
                                        checked={variant.is_default} 
                                        onChange={(e) => changeVariant('is_default', e.target.checked, variant.uuid)}
                                    >
                                        <StyledText>По умолчанию</StyledText>
                                    </Checkbox>
                                </Form.Item>
                            </Fragment>
                        ))}
                    </BorderBox>
                    <div className='d-flex mt-1'>
                        <Button 
                            type='text' 
                            size='large'
                            shape='round'
                            onClick={addNewVariant}
                            icon={<PlusOutlined />} 
                            style={{ fontWeight: 400 }} 
                        >
                            Добавить еще
                        </Button>
                    </div>
                </Col>
                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            type="default"
                            htmlType="submit"
                            shape="round"
                            loading={createLoading1 || createLoading2}
                            onClick={() => onFinish(true)}
                        >
                            Сохранить
                        </Button>
                        <Button
                            shape="round"
                            size="large"
                            type="primary"
                            loading={createLoading1 || createLoading2}
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
