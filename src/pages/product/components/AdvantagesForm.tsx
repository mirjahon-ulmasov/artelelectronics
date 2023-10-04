/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
    Button, Checkbox, Col, Divider, Form, Input, 
    Row, Space, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import type { Dayjs } from 'dayjs';
import _ from 'lodash'
import { useFetchBranchesQuery, useCreateClientMutation } from 'services'
import { CustomSelect, BorderBox, LanguageToggle, Language, StyledText, FormItem, StyledTextL2, CustomUpload } from 'components'
import { Client } from 'types/api'
import { formatDate } from 'utils/index';
import { LANGUAGE } from 'types/index';
import { Product } from 'types/product';

const languages: Language[] = [
    { label: 'Ru', value: LANGUAGE.RU },
    { label: 'Uz', value: LANGUAGE.UZ },
    { label: 'En', value: LANGUAGE.EN }
]

interface AdvantagesFormProps {
    onClick: () => void
    product: Product.DTO
}

export function AdvantagesForm({ onClick }: AdvantagesFormProps) {

    const { state } = useLocation()
    const navigate = useNavigate();
    const [progress, setProgress] = useState(1)
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [titleLanguage, setTitleLanguage] = useState<LANGUAGE>(LANGUAGE.RU)


    const [createClient, { isLoading: createLoading }] = useCreateClientMutation()
    const { data: branches, isLoading: branchesLoading } = useFetchBranchesQuery({})

    // ---------------- Submit ----------------
    const onFinish = (values: Client.DTO) => {

        const data: Client.DTO = {
            ...values,
            customer_images: imageFiles.map(file => file.response.id),
            birth_date: (values?.birth_date as Dayjs)?.format(formatDate),
            customer_records: clientRecords
                .filter(record => record.birth_date && record.full_name)
                .map(record => ({
                    full_name: record.full_name,
                    birth_date: (record.birth_date as Dayjs).format(formatDate)
                })),
            phone_number: _.replace(values.phone_number ?? '', /\D/g, '')
        }

        createClient(data)
            .unwrap()
            .then(() => {
                toast.success("Клиент успешно создан")
                
                if(state?.order) navigate('/order/add')
                else navigate('/client/list')
            })
            .catch(() => toast.error("Не удалось создать клиент"))
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed: ', errorInfo)        
    }

    return (
        <Form
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <BorderBox>
                <StyledTextL2>Преимущества продукта</StyledTextL2>
                <LanguageToggle
                    languages={languages}
                    currentLanguage={titleLanguage}
                    onChange={lang => {
                        setTitleLanguage(lang)
                    }}
                />
                <FormItem
                    name="full_name"
                    label="Заголовок"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message:
                                'Iltimos mijozning ismini kiriting',
                        },
                    ]}
                >
                    <Input size="large" placeholder="Ism-sharifi" />
                </FormItem>
                <FormItem
                    name="full_name"
                    label="Описание"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    rules={[
                        {
                            required: true,
                            message:
                                'Iltimos mijozning ismini kiriting',
                        },
                    ]}
                >
                    <Input size="large" placeholder="Ism-sharifi" />
                </FormItem>
                <CustomUpload
                    fileList={imageFiles} 
                    onChange={(info) => setImageFiles(info.fileList)}
                />
                <StyledText>Загрузить логотип</StyledText>
                <Divider style={{ margin: '10px 0'}}/>
                <CustomUpload
                    fileList={imageFiles} 
                    onChange={(info) => setImageFiles(info.fileList)}
                />
                <StyledText>Загрузить фото</StyledText>
            </BorderBox>               
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
