import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { BorderBox, CustomSelect, FormItem, LanguageToggle } from 'components'
import { useCreateRegionMutation, useFetchCountriesQuery } from 'services'
import { ID, LANGUAGE } from 'types/others/api'
import { Region } from 'types/geography/region'
import { languages } from 'utils/index'

const { Title } = Typography

export default function AddRegion() {
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [region, setRegion] = useState<Region.DTOCreation>({
        country: '',
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })
    const { data: countries, isLoading: loadingCountry } = useFetchCountriesQuery({})
    const [createRegion, { isLoading: createLoading }] = useCreateRegionMutation()

    const changeRegion = useCallback((key: keyof Region.DTOCreation, value: unknown) => {
        setRegion(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeRegionTitle = useCallback((key: keyof Region.Language, value: string) => {
        setRegion(prev => ({
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

    const getValue = useCallback((key: keyof Region.Language) => {
        const foundIdx = region.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return region.languages[foundIdx][key] as string
        }
        return ''
    }, [language, region.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        createRegion(region)
            .unwrap()
            .then(() => {
                toast.success("Регион успешно добавлен")
                navigate("/region/list")
            })
            .catch(() => toast.error("Не удалось добавить регион"))
    }, [region, createRegion, navigate])

    return (
        <Fragment>
            <Title level={3}>Добавить новый регион</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 500 }}
            >
                <Row gutter={[0, 8]} className='mt-1'>
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
                                    onChange={e => changeRegionTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Страна" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={loadingCountry}
                                options={countries?.map(country => ({
                                    label: country.languages[1].title,
                                    value: country.id
                                }))}
                                value={region.country || undefined}
                                onChange={(value: ID) => changeRegion('country', value)}
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
                                onClick={() => navigate(`/region/list`)}
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
