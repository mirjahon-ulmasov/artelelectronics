/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
    Button, Checkbox, Col, Form, Input, 
    Row, Space, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import type { Dayjs } from 'dayjs';
import _ from 'lodash'
import { useFetchBranchesQuery, useCreateClientMutation } from 'services'
import { CustomSelect, BorderBox, LanguageToggle, Language, StyledText, FormItem, StyledTextL2, CustomUpload, FileUpload } from 'components'
import { Client } from 'types/api'
import { formatDate } from 'utils/index';
import { LANGUAGE } from 'types/index';
import { Product } from 'types/product';

interface CharacteristicsFormProps {
    product: Product.DTO
}

export function CharacteristicsForm(props: CharacteristicsFormProps) {

    const { state } = useLocation()
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([])

    const [titleLanguage, setTitleLanguage] = useState<LANGUAGE>(LANGUAGE.RU)

    const [createClient, { isLoading: createLoading }] = useCreateClientMutation()

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
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Характеристики</StyledTextL2>
                        <FileUpload
                            label='Загрузить Excel'
                            fileList={imageFiles} 
                            onChange={(info) => setImageFiles(info.fileList)}
                        />
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Руководство пользователя</StyledTextL2>
                        <CustomUpload
                            fileList={imageFiles} 
                            onChange={(info) => setImageFiles(info.fileList)}
                        />
                        <StyledText>Загрузить фото</StyledText>
                        <FileUpload
                            label='Загрузить Pdf'
                            fileList={imageFiles} 
                            onChange={(info) => setImageFiles(info.fileList)}
                        />
                    </BorderBox>
                </Col>
                <Col span={24} className='mt-2'>
                    <Space size="large">
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
                            Сохранить и опубликовать
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
