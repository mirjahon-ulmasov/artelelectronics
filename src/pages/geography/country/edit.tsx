import { Fragment, useCallback, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import { BorderBox, FormItem, ImageUpload, LanguageToggle, StyledText } from 'components'
import { useFetchCountryQuery, useUpdateCountryMutation } from 'services'
import { ID, LANGUAGE, Language } from 'types/others/api'
import { Country } from 'types/geography/country'
import { languages } from 'utils/index'

const { Title } = Typography

export default function EditCountry() {
    const navigate = useNavigate()
    const { countryID } = useParams()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [country, setCountry] = useState<Country.DTOLocal>({
        flag: [],
        IP: '',
        country_code: '',
        languages: [
            { title: '', language: LANGUAGE.UZ },
            { title: '', language: LANGUAGE.RU },
            { title: '', language: LANGUAGE.EN },
        ]
    })

    const { data: countryData } = useFetchCountryQuery(countryID as ID)
    const [updateCountry, { isLoading: updateLoading }] = useUpdateCountryMutation()

    useEffect(() => {
        if(!countryData) return;
        setCountry({
            ...countryData,
            flag: [{
                uid: uuid(),
                response: countryData?.flag,
                status: 'done',
                name: 'country.png',
                url: countryData?.flag.file
            }],
        })
    }, [countryData])

    const changeCountry = useCallback((key: keyof Country.DTOLocal, value: unknown) => {
        setCountry(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeCountryTitle = useCallback((key: keyof Language, value: string) => {
        setCountry(prev => ({
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

    const getValue = useCallback((key: keyof Language) => {
        const foundIdx = country.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return country.languages[foundIdx][key] as string
        }
        return ''
    }, [language, country.languages])


    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {
        const data: Country.DTOUpload = {
            ...country,
            flag: country.flag[0]?.response?.id as ID
        }

        updateCountry(data)
            .unwrap()
            .then(() => {
                toast.success("Страна успешно добавлена")
                navigate("/country/list")
            })
            .catch(() => toast.error("Не удалось добавить страну"))
    }, [country, updateCountry, navigate])

    return (
        <Fragment>
            <Title level={3}>Изменить страну</Title>
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
                            <FormItem
                                label="Название"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                            >
                                <Input 
                                    size="large" 
                                    placeholder="Название"
                                    value={getValue('title')}
                                    onChange={e => changeCountryTitle('title', e.target.value)} 
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            name="country_code"
                            label="Код страны"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="uz"
                                value={country.country_code}
                                onChange={e => changeCountry('country_code', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem
                            name="IP"
                            label="IP-адрес"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните это поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="127.0.0.1"
                                value={country.IP}
                                onChange={e => changeCountry('IP', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24} className="mt-1">
                        <ImageUpload
                            maxCount={1}
                            fileList={country.flag} 
                            onChange={(info) => changeCountry('flag', info.fileList)}
                        />
                        <StyledText>Загрузить флаг страны</StyledText>
                    </Col>
                    <Col span={24} className="mt-2">
                        <Space size="large">
                            <Button
                                size="large"
                                shape="round"
                                type="primary"
                                htmlType="submit"
                                loading={updateLoading}
                            >
                                Сохранить
                            </Button>
                            <Button
                                size="large"
                                shape="round"
                                type="default"
                                onClick={() => navigate(`/country/list`)}
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
