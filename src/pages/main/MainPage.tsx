import { Fragment, useEffect, useMemo, useState } from 'react'
import { Typography, Row, Col, DatePicker, Space, Select, Divider } from 'antd'
import { Line, Bar } from '@ant-design/plots'
import { getBarConfig, getLineConfig } from 'utils/config'
import barData from "./bar.json"

const { Title } = Typography
const { RangePicker } = DatePicker

export function MainPage() {
    const [lineData, setLineData] = useState([])

    useEffect(() => {
        asyncFetch()
    }, [])

    const asyncFetch = () => {
        fetch(
            'https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json'
        )
            .then(response => response.json())
            .then(json => setLineData(json))
            .catch(error => {
                console.log('fetch data failed', error)
            })
    }

    const lineConfig = useMemo(() => getLineConfig(lineData), [lineData])
    const barConfig = useMemo(() => getBarConfig(barData), [])

    return (
        <Fragment>
            <Title level={3}>Главная</Title>
            <Row gutter={[0, 32]}>
                <Col span={24}>
                    <div className='d-flex jc-sb ai-center mt-2'>
                        <Title level={5}>
                            Финансовые отчеты
                        </Title>
                        <RangePicker />
                    </div>
                    <Line color='#FF561F' {...lineConfig} className='mt-2' />
                </Col>
                <Divider style={{ margin: '10px 0'}}/>
                <Col span={24}>
                    <Title level={5}>
                        Отчеты о продажах
                    </Title>
                    <div className='d-flex jc-sb ai-center mt-2'>
                        <Space size='middle'>
                            <Select
                                defaultValue="lucy"
                                style={{ width: 120 }}
                                allowClear
                                options={[{ value: 'lucy', label: 'Lucy' }]}
                            />
                            <Select
                                defaultValue="lucy"
                                style={{ width: 120 }}
                                allowClear
                                options={[{ value: 'lucy', label: 'Lucy' }]}
                            />
                        </Space>
                        <RangePicker />
                    </div>
                    <Line {...lineConfig} className='mt-2' />
                </Col>
                <Divider style={{ margin: '10px 0'}}/>
                <Col span={24}>
                    <Title level={5}>
                        Отчет о рекламе в социальных сетях
                    </Title>
                    <div className='d-flex jc-sb ai-center mt-2'>
                        <Select
                            defaultValue="lucy"
                            style={{ width: 120 }}
                            allowClear
                            options={[{ value: 'lucy', label: 'Lucy' }]}
                        />
                        <RangePicker />
                    </div>
                    <Bar color='#1BBE72' {...barConfig} className='mt-2' />
                </Col>
            </Row>
        </Fragment>
    )
}
