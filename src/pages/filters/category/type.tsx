import { ChangeEvent, Fragment, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Form, Button, Input, Typography, Row, Col, Space } from 'antd'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { 
    useCreateCategoryTypeMutation, useDeleteCategoryTypeMutation, useFetchCategoryQuery, 
    useFetchCategoryTypesQuery, useUpdateCategoryTypeMutation, 
} from 'services'
import { BorderBox, PlusIcon, LanguageToggle, FormItem } from 'components'
import { CategoryType as ICategoryType } from 'types/filters/category'
import { ID, LANGUAGE } from 'types/others/api'
import { languages } from 'utils/index'

const { Title } = Typography

export default function CategoryType() {
    const { categoryID } = useParams()    
    
    const [state, setState] = useState<ICategoryType.List>([])
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    
    const { data: category } = useFetchCategoryQuery(categoryID as ID)
    const { data: types } = useFetchCategoryTypesQuery({
        category: categoryID,
        is_active: true
    })
    const [createType, { isLoading: createLoading }] = useCreateCategoryTypeMutation()
    const [updateType, { isLoading: updateLoading }] = useUpdateCategoryTypeMutation()
    const [deleteType, { isLoading: deleteLoading }] = useDeleteCategoryTypeMutation()

    useEffect(() => {
        if(!types) return;
        setState(types.map(type => ({
            ...type,
            languages: type.languages.map(lang => ({
                ...lang,
                originalTitle: lang.title
            }))
        })))
    }, [types])

    function addNew() {
        if(!category) return;
        const filtered = state.filter(el => !el.id);
        
        if(filtered.length >= 1) {
            toast.error('Сначала добавьте тип категории')
            return;
        }
        setState(prev => [
            ...prev,
            { 
                category: category.id as ID, 
                languages: [
                    { title: '', originalTitle: '', language: LANGUAGE.UZ },
                    { title: '', originalTitle: '', language: LANGUAGE.RU },
                    { title: '', originalTitle: '', language: LANGUAGE.EN },
                ]
            }
        ])
    }

    const getValue = useCallback((index: number) => {
        const foundIdx = state[index].languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return state[index].languages[foundIdx].title
        }
        return ''
    }, [state, language])

    function changeTitle(index: number, e: ChangeEvent<HTMLInputElement>) {
        setState(prev => prev.map((el, idx) => {
            if(idx === index) {
                return { 
                    ...el, 
                    languages: el.languages.map(lang => {
                        if(lang.language === language) {
                            return {
                                ...lang,
                                title: e.target.value
                            }
                        }
                        return lang
                    })
                }
            }
            return el
        }))
    }

    function cancelState(index: number, el: ICategoryType.DTO) {
        setState(prev => prev.filter((_, idx) => idx !== index))

        if(el.id) {
            deleteType(el.id)
        }
    }

    const getIsUpdated = useCallback((el: ICategoryType.DTO): boolean => {
        return el.languages.some(lang => lang.title !== lang.originalTitle)
    }, [])

    return (
        <Fragment>
            <Title level={3}>Добавить тип категории - {category?.languages[1].title}</Title>
            <Form autoComplete="off" style={{ maxWidth: 500, marginTop: '2rem' }}>
                <Button 
                    size='large'
                    className='d-flex mb-2' 
                    icon={<PlusIcon />}
                    onClick={addNew}
                >
                    Добавить новое
                </Button>
                {state.length > 0 && (
                    <BorderBox>
                        <LanguageToggle
                            languages={languages}
                            currentLanguage={language}
                            onChange={lang => {
                                setLanguage(lang)
                            }}
                        />
                        <Row gutter={[0, 24]}>
                            {state.map((el, index) => (
                                <Col span={24} key={index}>
                                    <FormItem label="Название" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                                        <Input 
                                            size="large" 
                                            placeholder="Название"
                                            value={getValue(index)} 
                                            onChange={e => changeTitle(index, e)} 
                                        />
                                    </FormItem>
                                    {!el.id && (
                                        <Space className={clsx('mt-1', 'animate__animated', 'animate__fadeIn')}>
                                            <Button 
                                                size='large'
                                                shape="round" 
                                                type='primary'
                                                loading={createLoading}
                                                onClick={() => createType(el)}
                                            >
                                                Создать
                                            </Button>
                                            <Button 
                                                size='large'
                                                shape="round"
                                                loading={deleteLoading}
                                                onClick={() => cancelState(index, el)}
                                            >
                                                Удалить
                                            </Button>
                                        </Space>
                                    )}
                                    {(el.id) && getIsUpdated(el) && (
                                        <Space className={clsx('mt-1', 'animate__animated', 'animate__fadeIn')}>
                                            <Button 
                                                size='large'
                                                shape="round"
                                                type='primary'
                                                loading={updateLoading}
                                                onClick={() => updateType(el)}
                                            >
                                                Обновить
                                            </Button>
                                            <Button 
                                                size='large'
                                                shape="round"
                                                loading={deleteLoading}
                                                onClick={() => cancelState(index, el)}
                                            >
                                                Удалить
                                            </Button>
                                        </Space>
                                    )}
                                </Col>
                            ))}
                        </Row>
                    </BorderBox>
                )}
            </Form>
        </Fragment>
    )
}
