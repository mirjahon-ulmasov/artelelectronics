import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { BorderBox, CustomSelect, FormItem, LanguageToggle } from 'components'
import { useCreateDistrictMutation, useFetchRegionsQuery } from 'services'
import { District } from 'types/geography/district'
import { ID, LANGUAGE } from 'types/others/api'
import { languages } from 'utils/index'

const { Title } = Typography

export default function AddDistrict() {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [district, setDistrict] = useState<District.DTOCreation>({
        region: '',
        latitude: '',
        longitude: '',
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })
    const { data: regions, isLoading: loadingRegion } = useFetchRegionsQuery({})
    const [createDistrict, { isLoading: createLoading }] = useCreateDistrictMutation()

    const changeDistrict = useCallback((key: keyof District.DTOCreation, value: unknown) => {
        setDistrict(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeDistrictTitle = useCallback((key: keyof District.Language, value: string) => {
        setDistrict(prev => ({
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

    const getValue = useCallback((key: keyof District.Language) => {
        const foundIdx = district.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return district.languages[foundIdx][key] as string
        }
        return ''
    }, [language, district.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        createDistrict(district)
            .unwrap()
            .then(() => {
                toast.success("Район успешно добавлен")
                navigate("/district/list")
            })
            .catch(() => toast.error("Не удалось добавить район"))
    }, [district, createDistrict, navigate])

    return (
        <Fragment>
            <Title level={3}>Добавить новый район</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
            >
                <Row gutter={[16, 8]} className='mt-1'>
                    <Col span={24}>
                        <BorderBox>
                            <LanguageToggle
                                languages={languages}
                                currentLanguage={language}
                                onChange={lang => {
                                    setLanguage(lang)
                                }}
                            />
                            <FormItem label="Название" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                <Input 
                                    size="large" 
                                    placeholder="Название"
                                    value={getValue('title')}
                                    onChange={e => changeDistrictTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Регион" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={loadingRegion}
                                options={regions?.map(region => ({
                                    label: region.languages[1].title,
                                    value: region.id
                                }))}
                                value={district.region || undefined}
                                onChange={(value: ID) => changeDistrict('region', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Долгота"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="41.311081"
                                value={district.longitude}
                                onChange={e => changeDistrict('longitude', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Широта"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="69.240562"
                                value={district.latitude}
                                onChange={e => changeDistrict('latitude', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-2">
                        <Space size="large">
                            <Button
                                size="large"
                                shape="round"
                                type="primary"
                                htmlType="submit"
                                loading={createLoading}
                            >
                                Сохранить
                            </Button>
                            <Button
                                size="large"
                                shape="round"
                                type="default"
                                onClick={() => navigate(`/district/list`)}
                            >
                                Отменить
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}
