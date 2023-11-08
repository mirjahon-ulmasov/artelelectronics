import { Fragment, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { 
    Button, Checkbox, Col, Divider, Form, Input, 
    Row, Space, TimePicker, Typography 
} from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { 
    FormItem, ImageUpload, StyledText,
    BorderBox, CustomSelect, StyledTextL1 
} from 'components'
import { useCreateStoreMutation, useFetchCountriesQuery } from 'services'
import { getWeekDay } from 'utils/index'
import { Store, STORE, DAYS } from 'types/others/store'
import { ID } from 'types/others/api'

const { Title } = Typography

const format = 'HH:mm';

const store_types = [
    { value: STORE.BRAND_SHOP, label: 'Фирменный магазин' },
    { value: STORE.MARKETPLACE, label: 'Рынок' },
    { value: STORE.PREMIUM_STORE, label: 'Премиум-магазин' },
]

export default function AddStore() {
    const navigate = useNavigate()
    const [store, setStore] = useState<Store.NullableDTOCreation>({ 
        title: '',
        latitude: '',
        longitude: '',
        country: null,
        region: null,
        district: null,
        address: '',
        phone_number: '',
        store_type: STORE.BRAND_SHOP,
        default_image: [],
        images: [],
        timetable: [
            { day: DAYS.MONDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
            { day: DAYS.TUESDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
            { day: DAYS.WEDNESDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
            { day: DAYS.THURSDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
            { day: DAYS.FRIDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
            { day: DAYS.SATURDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
            { day: DAYS.SUNDAY, opens_at: dayjs('09:00', format), closes_at: dayjs('18:00', format), is_open: true },
        ]
    })

    const { data: countries, isLoading: loadingCountry } = useFetchCountriesQuery({})
    const [createStore, { isLoading: createLoading }] = useCreateStoreMutation()


    const changeStore = useCallback((key: keyof Store.DTOCreation, value: unknown) => {
        setStore(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeStoreTimetable = useCallback((day: DAYS, key: keyof Store.TimeTable<Dayjs | null>, value: unknown) => {
        setStore(prev => ({
            ...prev,
            timetable: prev.timetable.map(el => {
                if(el.day === day) {
                    return {
                        ...el,
                        [key]: value
                    }
                }
                return el
            })
        }))
    }, [])


    // ---------------- Submit ----------------
    const onFinish = () => {
        const data: Store.DTOUpload = {
            ...store,
            default_image: store.default_image[0].response?.id as ID,
            images: store.images.map(image => ({
                image: image.response?.id as ID
            })),
            timetable: store.timetable.map(timetable => ({
                ...timetable,
                opens_at: timetable.opens_at?.format(format) ?? '',
                closes_at: timetable.closes_at?.format(format) ?? '',
            }))
        }

        createStore(data)
            .unwrap()
            .then(() => {
                toast.success("Магазин успешно добавлен")
                navigate("/store/list")
            })
            .catch(() => toast.error("Не удалось добавить новость"))
    }   

    return (
        <Fragment>
            <Title level={3}>Добавить новый магазин</Title>
            <Form
                autoComplete="off"
                onFinish={onFinish}
                style={{ maxWidth: 1000 }}
            >
                <Row gutter={[18, 18]} className='mt-1'>
                    <Col span={12}>
                        <FormItem
                            label="Название магазина"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="Название магазина"
                                value={store.title ?? ''}
                                onChange={e => changeStore('title', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Тип магазина"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                options={store_types}
                                value={store.store_type}
                                onChange={(value: ID) => changeStore('store_type', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Страна"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={loadingCountry}
                                options={countries?.map(country => ({
                                    label: country.languages[1].title,
                                    value: country.id
                                }))}
                                value={store.country}
                                onChange={(value: ID) => changeStore('country', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Регион"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={loadingCountry}
                                options={countries?.map(country => ({
                                    label: country.languages[1].title,
                                    value: country.id
                                }))}
                                value={store.region}
                                onChange={(value: ID) => changeStore('region', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Район"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <CustomSelect
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={loadingCountry}
                                options={countries?.map(country => ({
                                    label: country.languages[1].title,
                                    value: country.id
                                }))}
                                value={store.district}
                                onChange={(value: ID) => changeStore('district', value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Адрес"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="Махтумкули (бывш. Тараккиёт), 2"
                                value={store.address ?? ''}
                                onChange={e => changeStore('address', e.target.value)}
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
                                value={store.longitude ?? ''}
                                onChange={e => changeStore('longitude', e.target.value)}
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
                                value={store.latitude ?? ''}
                                onChange={e => changeStore('latitude', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="Номер телефона"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
                        >
                            <Input 
                                size="large" 
                                placeholder="+998 71 255 61 58"
                                value={store.phone_number ?? ''}
                                onChange={e => changeStore('phone_number', e.target.value)}
                            />
                        </FormItem>
                    </Col>
                    <div>
                        <Divider>
                            <StyledText>Рабочее время</StyledText>
                        </Divider>
                        <BorderBox>
                            {store.timetable.map(timetable => (
                                <Fragment key={timetable.day}>
                                    <div className='d-flex gap-24'>
                                        <StyledTextL1 style={{ maxWidth: 100, minWidth: 100 }}>
                                            {getWeekDay(timetable.day)}
                                        </StyledTextL1>
                                        <TimePicker
                                            size="large"
                                            format={format}
                                            placeholder="9:00"
                                            style={{ maxWidth: 100, minWidth: 100 }}
                                            value={timetable.opens_at}
                                            onChange={data => changeStoreTimetable(timetable.day, 'opens_at', data)}
                                        />
                                        <TimePicker
                                            size="large"
                                            format={format}
                                            placeholder="18:00"
                                            style={{ maxWidth: 100, minWidth: 100 }}
                                            value={timetable.closes_at}
                                            onChange={data => changeStoreTimetable(timetable.day, 'closes_at', data)}
                                        />
                                        <Form.Item
                                            valuePropName="checked"
                                            style={{ maxWidth: 150, minWidth: 150 }}
                                            labelCol={{ span: 24 }}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <Checkbox
                                                checked={timetable.is_open}
                                                onChange={e => changeStoreTimetable(timetable.day, 'is_open', e.target.checked)}
                                            >
                                                <StyledText style={{ marginLeft: 5 }}>Открыто</StyledText>
                                            </Checkbox>
                                        </Form.Item>
                                    </div>
                                </Fragment>
                            ))}
                        </BorderBox>
                    </div>
                    <Col span={24}>
                        <ImageUpload
                            maxCount={1}
                            fileList={store.default_image} 
                            onChange={(info) => changeStore('default_image', info.fileList)}
                        />
                        <StyledText>Загрузите основное изображение магазина</StyledText>
                    </Col>
                    <Col span={24}>
                        <ImageUpload
                            maxCount={5}
                            fileList={store.images} 
                            onChange={(info) => changeStore('images', info.fileList)}
                        />
                        <StyledText>Загрузить изображения магазина</StyledText>
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
                                onClick={() => navigate(`/store/list`)}
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