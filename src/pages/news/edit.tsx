import { Fragment, useCallback, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
    Button, Checkbox, Col, DatePickerProps, 
    Form, Input, Row, Space, Typography 
} from 'antd'
import dayjs from 'dayjs'
import { v4 as uuid } from 'uuid'
import ReactQuill from 'react-quill'
import { 
    FormItem, ImageUpload, StyledText,
    BorderBox, LanguageToggle, CustomDatePicker 
} from 'components'
import { useFetchNewsQuery, useUpdateNewsMutation } from 'services'
import { formatDate, languages } from 'utils/index'
import { modules, formats } from 'utils/richtext'
import { ID, LANGUAGE } from 'types/others/api'
import { News } from 'types/others/news'

const { Title } = Typography

export default function EditNews() {
    const { newsID } = useParams()
    const navigate = useNavigate()
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [news, setNews] = useState<News.DTOLocal>({ 
        languages: [
            { title: '', introduction_text: '', content: '', language: LANGUAGE.UZ },
            { title: '', introduction_text: '', content: '', language: LANGUAGE.RU },
            { title: '', introduction_text: '', content: '', language: LANGUAGE.EN },
        ],
        image: [],
        publish_date: dayjs(),
        add_to_carousel: false,
        external_source_url: '',
    })

    const { data: newsData } = useFetchNewsQuery(newsID as ID)
    const [updateNews, { isLoading: createLoading }] = useUpdateNewsMutation()

    useEffect(() => {
        if(!newsData) return;
        setNews({
            ...newsData,
            image: [{
                uid: uuid(),
                response: newsData?.image,
                status: 'done',
                name: 'news.png',
                url: newsData?.image?.file
            }],
            publish_date: dayjs(newsData.publish_date)
        })
    }, [newsData])  

    const changePublishDateHandler: DatePickerProps['onChange'] = date => {      
        setNews(prev => ({ ...prev, publish_date: date }))
    }

    const changeNews = useCallback((key: keyof News.DTOLocal, value: unknown) => {
        setNews(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeNewsContent = useCallback((key: keyof News.Content, value: string) => {

        if (key === 'content' && value === '<p><br></p>') return;

        setNews(prev => ({
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

    const getValue = useCallback((key: keyof News.Content) => {
        const foundIdx = news.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return news.languages[foundIdx][key]
        }
        return ''
    }, [language, news.languages])

    // ---------------- Submit ----------------
    const onFinish = () => {
        const data: News.DTOUpload = {
            ...news,
            image: news.image[0]?.response?.id as ID,
            publish_date: news.publish_date?.format(formatDate) ?? ''
        }

        updateNews(data)
            .unwrap()
            .then(() => {
                toast.success("Новость успешно добавлен")
                navigate("/news/list")
            })
            .catch(() => toast.error("Не удалось добавить новость"))
    }   

    return (
        <Fragment>
            <Title level={3}>Изменить новости</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 1000 }}
            >
                <Row gutter={[18, 18]} className='mt-1'>
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
                                label="Название новости"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                            >
                                <Input 
                                    size="large" 
                                    placeholder="Название новости"
                                    value={getValue('title')}
                                    onChange={e => changeNewsContent('title', e.target.value)}
                                />
                            </FormItem>
                            <FormItem
                                label="Вводный текст"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                            >
                                <Input.TextArea 
                                    rows={3}
                                    size="large"
                                    placeholder="Вводный текст"
                                    value={getValue('introduction_text')}
                                    onChange={e => changeNewsContent('introduction_text', e.target.value)}
                                />
                            </FormItem>
                            <FormItem
                                label="Содержание"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                            >
                                <ReactQuill
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    onChange={value => changeNewsContent('content', value)}
                                    value={getValue('content')}
                                />
                            </FormItem>
                        </BorderBox>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Внешний URL"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        > 
                            <Input 
                                size="large" 
                                className='w-100' 
                                placeholder="Внешний URL"
                                value={news.external_source_url}
                                onChange={e => changeNews('external_source_url', e.target.value)} 
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem 
                            label="Дата публикации" 
                            labelCol={{ span: 24 }} 
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                             <CustomDatePicker
                                size="large"
                                className='w-100' 
                                placeholder="Дата публикации"
                                value={news.publish_date}
                                onChange={changePublishDateHandler}
                            />
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            valuePropName="checked"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Checkbox
                                checked={news.add_to_carousel}
                                onChange={e => changeNews('add_to_carousel', e.target.checked)}
                            >
                                <StyledText style={{ marginLeft: 5 }}>
                                    Добавить в карусель
                                </StyledText>
                            </Checkbox>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <ImageUpload
                            maxCount={1}
                            fileList={news.image} 
                            onChange={(info) => changeNews('image', info.fileList)}
                        />
                        <StyledText>Загрузить изображение новости</StyledText>
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
                                onClick={() => navigate(`/news/list`)}
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