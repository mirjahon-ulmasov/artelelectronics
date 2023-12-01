import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Form, 
    Row, Space, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import { 
    CustomSelect, BorderBox, StyledText, FormItem, 
    StyledTextL2, ImageUpload, Color, 
} from 'components'
import { 
    useCreateProductImageMutation, useCreateProductImagesMutation, 
    useFetchProductColorsQuery 
} from 'services'
import { ID } from 'types/others/api'
import { Product } from 'types/product/product';
import { ProductImage } from 'types/product/image'

interface ImageProps {
    onClick: () => void
    product: Product.DTO
    category: string
}

export function Images({ onClick, product, category }: ImageProps) {
    const navigate = useNavigate();
    const [prodImage, setProdImage] = useState<ProductImage.DTOLocal>({
        product: product.id,
        color: '',
        image: [],
        is_default: true
    })
    const [prodImages, setProdImages] = useState<ProductImage.DTOLocalMultiple>({
        product: product.id,
        color: '',
        images: []
    })

    const { data: colors, isLoading: colorsLoading } = useFetchProductColorsQuery({
        product: product.id
    })

    const [createProductImage, { isLoading: createLoading1 }] = useCreateProductImageMutation()
    const [createProductImages, { isLoading: createLoading2 }] = useCreateProductImagesMutation()


    // ---------------- Product Variants ----------------

    const changeProdColor = useCallback((color: ID) => {
        setProdImage(prev => ({ ...prev, color }))
        setProdImages(prev => ({ ...prev, color }))
    }, [])

    const changeMainImage = useCallback((image: UploadFile[]) => {
        setProdImage(prev => ({
            ...prev,
            image
        }))
    }, [])

    const changeProdImages = useCallback((images: UploadFile[]) => {
        setProdImages(prev => ({
            ...prev,
            images
        }))
    }, [])

    // ---------------- Submit ----------------
    const onFinish = useCallback((next: boolean) => {
        const product_image: ProductImage.DTOUpload = {
            ...prodImage,
            image: prodImage.image[0]?.response?.id as ID
        }

        const product_images: ProductImage.DTOUploadMultiple = {
            ...prodImages,
            images: prodImages.images.map(image => image.response?.id as ID)
        }

        const promises = [
            createProductImage(product_image).unwrap(),
            createProductImages(product_images).unwrap(),
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
    }, [category, createProductImage, createProductImages, navigate, onClick, prodImage, prodImages]);


    return (
        <Form autoComplete="off" style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox gap='24px'>
                        <StyledTextL2>Изображение каталога</StyledTextL2>
                        <FormItem
                            label="Выбрать цвет продукта"
                            style={{ maxWidth: 300 }}
                            wrapperCol={{ span: 24 }}
                            labelCol={{ span: 24 }}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                value={prodImage.color || undefined}
                                placeholder="Выберите"
                                loading={colorsLoading}
                                onChange={(value: ID) => changeProdColor(value)}
                                options={colors?.map(prodColor => ({
                                    value: prodColor.color.id,
                                    label: (
                                        <div className='d-flex gap-12 jc-start'>
                                            <Color link={prodColor.color.image.file} />
                                            {prodColor.color.title}
                                        </div>
                                    ),
                                }))}
                            ></CustomSelect>
                        </FormItem>
                        <div>
                            <ImageUpload
                                maxCount={1}
                                fileList={prodImage.image} 
                                onChange={(info) => changeMainImage(info.fileList)}
                            />
                            <StyledText>Загрузить основное изображение</StyledText>
                        </div>
                        <div>
                            <ImageUpload
                                maxCount={8}
                                fileList={prodImages.images} 
                                onChange={(info) => changeProdImages(info.fileList)}
                            />
                            <StyledText>Загрузить варианты изображений</StyledText>
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
