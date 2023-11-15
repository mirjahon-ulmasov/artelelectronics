import { useState, Fragment, useCallback } from 'react'
import { 
    Button, ButtonProps, Col,
    Row, Space, Typography 
} from 'antd'
import { 
    Advantages, Main, Variants, 
    VariantImages, SAPCode, Instructions 
} from './components'
import { useFetchProductQuery } from 'services'
import { useQuery } from 'hooks/useQuery'
import { ID } from 'types/others/api'

const { Title } = Typography

export default function AddProduct() {
    const query = useQuery();
    const category = query.get("category") ?? ''
    const [progress, setProgress] = useState(1)
    const [productID, setProductID] = useState<ID>('')

    const { data: product } = useFetchProductQuery(productID, {
        skip: !productID
    })

    const getButtonType = useCallback((idx: number): ButtonProps => {
        return {
            type: progress === idx ? 'primary': 'default',
            shape: 'round',
            size: 'middle'
        }
    }, [progress])

    function goNextForm() {
        setProgress(prev => prev + 1)
    }

    return (
        <Fragment>
            <Title level={3}>Добавить новый продукт</Title>
            <Row gutter={[0, 24]} className='mt-2'>
                <Col span={24}>
                    <Space>
                        <Button {...getButtonType(1)}>Главная</Button>
                        <Button {...getButtonType(2)} onClick={() => setProgress(2)}>Варианты</Button>
                        <Button {...getButtonType(3)} onClick={() => setProgress(3)}>Изображений</Button>
                        <Button {...getButtonType(4)} onClick={() => setProgress(4)}>SAP Code</Button>
                        <Button {...getButtonType(5)} onClick={() => setProgress(5)}>Преимущества</Button>
                        <Button {...getButtonType(6)} onClick={() => setProgress(6)}>Инструкции</Button>
                    </Space>
                </Col>
                <Col span={24}>
                    {progress === 1 && (
                        <Main
                            category={category}
                            onClick={goNextForm} 
                            onSetID={(id: ID) => setProductID(id)} 
                        />
                    )}
                    {product && (
                        <Fragment>
                            {progress === 2 && (
                                <Variants 
                                    onClick={goNextForm} 
                                    product={product} 
                                    category={category}
                                />
                            )}
                            {progress === 3 && (
                                <VariantImages 
                                    onClick={goNextForm} 
                                    product={product} 
                                    category={category}
                                />
                            )}
                            {progress === 4 && (
                                <SAPCode 
                                    onClick={goNextForm} 
                                    product={product} 
                                    category={category}
                                />
                            )}
                            {progress === 5 && (
                                <Advantages 
                                    onClick={goNextForm} 
                                    product={product} 
                                    category={category}
                                />
                            )}
                            {progress === 6 && (
                                <Instructions 
                                    product={product} 
                                    category={category}
                                />
                            )}
                        </Fragment>
                    )}
                </Col>
            </Row>
        </Fragment>
    )
}