/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, Fragment, useCallback } from 'react'
import { 
    Button, ButtonProps, Col,
    Row, Space, Typography 
} from 'antd'
import { 
    AdvantagesForm, CharacteristicsForm, MainForm, 
    MediaFormPart1, MediaFormPart2 
} from './components'
import { useFetchProductQuery } from 'services'
import { ID } from 'types/api'

const { Title } = Typography

export default function AddProduct() {
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
                        <Button {...getButtonType(2)}>Медиа</Button>
                        <Button {...getButtonType(3)}>SUP code</Button>
                        <Button {...getButtonType(4)}>Преимущества</Button>
                        <Button {...getButtonType(5)}>Характеристики</Button>
                    </Space>
                </Col>
                <Col span={24}>
                    {progress === 1 && (
                        <MainForm 
                            onClick={goNextForm} 
                            onSetID={(id: ID) => setProductID(id)} 
                        />
                    )}
                    {product && (
                        <Fragment>
                            {progress === 2 && <MediaFormPart1 onClick={goNextForm} product={product} />}
                            {progress === 3 && <MediaFormPart2 onClick={goNextForm} product={product} />}
                            {progress === 4 && <AdvantagesForm onClick={goNextForm} product={product}/>}
                            {progress === 5 && <CharacteristicsForm product={product} />}
                        </Fragment>
                    )}
                </Col>
            </Row>
        </Fragment>
    )
}