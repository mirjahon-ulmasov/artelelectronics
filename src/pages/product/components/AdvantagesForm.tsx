/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Divider, Form, Input, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast'
import { v4 as uuid } from 'uuid'
import _ from 'lodash'
import { useCreateAdvantagesMutation } from 'services'
import { 
    BorderBox, LanguageToggle, Language, 
    StyledText, FormItem, StyledTextL2, ImageUpload 
} from 'components'
import { Advantage, Product } from 'types/product';
import { LANGUAGE } from 'types/index';
import { ID } from 'types/api'

const languages: Language[] = [
    { label: 'Ru', value: LANGUAGE.RU },
    { label: 'Uz', value: LANGUAGE.UZ },
    { label: 'En', value: LANGUAGE.EN }
]

interface AdvantagesFormProps {
    onClick: () => void
    product: Product.DTO
}

export function AdvantagesForm({ onClick, product }: AdvantagesFormProps) {
    const navigate = useNavigate();

    const [createAdvantages, { isLoading: createLoading }] = useCreateAdvantagesMutation()
    
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [advantages, setAdvantages] = useState<Advantage.DTOLocal[]>([
        { 
            languages: [
                { title: '', description: '', language: LANGUAGE.UZ },
                { title: '', description: '', language: LANGUAGE.RU },
                { title: '', description: '', language: LANGUAGE.EN },
            ], 
            logo: [], 
            image: [], 
            uuid: uuid() 
        }
    ])

    // ---------------- Product Advantages ----------------

    function addNewAdvantage() {
        setAdvantages(prev => [
            ...prev, 
            { 
                languages: [
                    { title: '', description: '', language: LANGUAGE.UZ },
                    { title: '', description: '', language: LANGUAGE.RU },
                    { title: '', description: '', language: LANGUAGE.EN },
                ], 
                logo: [], 
                image: [], 
                uuid: uuid() 
            }
        ])
    }

    const changeAdvantage = useCallback((key: keyof Advantage.DTOLocal, value: unknown, uuid: string) => {
        setAdvantages(prev => prev.map(advantage => {
            if(advantage.uuid === uuid) {
                return {
                    ...advantage,
                    [key]: value
                }
            }
            return advantage
        }))
    }, [])

    const changeAdvantageInfo = useCallback((key: keyof Advantage.Language, value: string, uuid: string) => {
        setAdvantages(prev => prev.map(advantage => {
            if(advantage.uuid === uuid) {
                return {
                    ...advantage,
                    languages: advantage.languages.map(el => {
                        if(el.language === language) {
                            return {
                                ...el,
                                [key]: value
                            }
                        }
                        return el
                    })
                }
            }
            return advantage
        }))
    }, [language])

    const getValue = useCallback((advantage: Advantage.DTOLocal, key: keyof Advantage.Language) => {
        const foundIdx = advantage.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return advantage.languages[foundIdx][key]
        }
        return ''
    }, [language])

    // ---------------- Submit ----------------
    const onFinish = () => {

        const data: Advantage.DTOUpload[] = advantages.map(advantage => ({
            product: product.id,
            title: advantage.languages[2].title,
            description: advantage.languages[2].description,
            logo: advantage.logo[0]?.response?.id as ID,
            image: advantage.image[0]?.response?.id as ID,
        }))

        createAdvantages(data)
            .unwrap()
            .then(() => {
                toast.success("Преимущества успешно добавленного продукта")
                onClick()
            })
            .catch(() => toast.error("Что-то пошло не так"))
    };

    return (
        <Form autoComplete="off" onFinish={onFinish}>
            <BorderBox>
                <StyledTextL2>Преимущества продукта</StyledTextL2>
                {advantages.map((advantage, index) => (
                    <Fragment key={advantage.uuid}>
                        {!!index && (
                            <Divider style={{ margin: '15px 0'}}>
                                <StyledText>{index + 1}</StyledText>
                            </Divider>
                        )}
                        <LanguageToggle
                            languages={languages}
                            currentLanguage={language}
                            onChange={lang => {
                                setLanguage(lang)
                            }}
                        />
                        <FormItem 
                            label="Заголовок" 
                            labelCol={{ span: 24 }} 
                            wrapperCol={{ span: 24 }}
                        >
                            <Input 
                                size="large" 
                                placeholder="Заголовок"
                                value={getValue(advantage, 'title')}
                                onChange={e => changeAdvantageInfo('title', e.target.value, advantage.uuid)}
                            />
                        </FormItem>
                        <FormItem
                            label="Описание"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.TextArea
                                showCount
                                maxLength={100}
                                style={{ height: 120 }}
                                placeholder="Описание"
                                value={getValue(advantage, 'description')}
                                onChange={e => changeAdvantageInfo('description', e.target.value, advantage.uuid)}
                            />
                        </FormItem>
                        <div className='mt-1'>
                            <ImageUpload
                                maxCount={1}
                                fileList={advantage.logo} 
                                onChange={(info) => changeAdvantage('logo', info.fileList, advantage.uuid)}
                            />
                            <StyledText>Загрузить логотип</StyledText>
                        </div>
                        <div>
                            <ImageUpload
                                maxCount={1}
                                fileList={advantage.image} 
                                onChange={(info) => changeAdvantage('image', info.fileList, advantage.uuid)}
                            />
                            <StyledText>Загрузить фото</StyledText>
                        </div>
                    </Fragment>
                ))}
            </BorderBox>  
            <div className='d-flex mt-1'>
                <Button 
                    type='text' 
                    size='large'
                    shape='round'
                    onClick={addNewAdvantage}
                    icon={<PlusOutlined />} 
                    style={{ fontWeight: 400 }} 
                >
                    Добавить еще
                </Button>
            </div>

            <Space size="large" className='mt-2'>
                <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    shape="round"
                    loading={createLoading}
                    style={{ background: '#25A55A' }}
                >
                    Сохранить
                </Button>
                <Button
                    shape="round"
                    size="large"
                    type="primary"
                    onClick={() => navigate('/client/list')}
                >
                    Сохранить и продолжить
                </Button>
            </Space>
           
        </Form>
    )
}
