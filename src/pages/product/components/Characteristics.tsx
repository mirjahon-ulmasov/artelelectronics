/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    Button, Col, Form,
    Input,
    Row, Space, UploadFile 
} from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { useCreateInstructionMutation, useUploadExcelCharacteristicsMutation } from 'services'
import { 
    BorderBox, LanguageToggle, StyledText, 
    FormItem, StyledTextL2, ImageUpload, FileUpload 
} from 'components'
import { languages } from 'utils/index'
import { ID } from 'types/api'
import { LANGUAGE } from 'types/index';
import { Characteristic, Instruction, Product } from 'types/product';

interface CharacteristicsProps {
    product: Product.DTO
    category: string
}

export function Characteristics({ product, category }: CharacteristicsProps) {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [fileCharacteristics, setFileCharacteristics] = useState<UploadFile[]>([])
    const [instruction, setInstruction] = useState<Instruction.DTOLocal>({ 
        file: [], 
        image: [], 
        languages: [
            { title: '', description: '', language: LANGUAGE.UZ },
            { title: '', description: '', language: LANGUAGE.RU },
            { title: '', description: '', language: LANGUAGE.EN },
        ],
    })

    const [uploadExcelCharacteristics, { isLoading: loading1 }] = useUploadExcelCharacteristicsMutation()
    const [createInstruction, { isLoading: loading2 }] = useCreateInstructionMutation()

    // ---------------- Product Instruction ----------------

    const changeInstruction = useCallback((key: keyof Instruction.DTOLocal, value: unknown) => {
        setInstruction(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeInstructionInfo = useCallback((key: keyof Instruction.Language, value: string) => {
        setInstruction(prev => ({
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

    const getValue = useCallback((key: keyof Instruction.Language) => {
        const foundIdx = instruction.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return instruction.languages[foundIdx][key]
        }
        return ''
    }, [instruction.languages, language])

    // ---------------- Submit ----------------
    const onFinish = () => {

        const dataCharacteristics: Characteristic.UploadExcel = {
            product: product.id,
            file: fileCharacteristics[0]?.response?.id as ID
        }

        const dataInstruction: Instruction.DTOUpload = {
            product: product.id,
            languages: instruction.languages,
            file: instruction.file[0]?.response?.id as ID,
            image: instruction.image[0]?.response?.id as ID
        }

        const promises = [
            uploadExcelCharacteristics(dataCharacteristics).unwrap(),
            createInstruction(dataInstruction).unwrap(),
        ];

        Promise.all(promises)
            .then(() => {
                toast.success("Характеристики и инструкция успешно добавлены.");
                navigate({
                    pathname: '/product/list',
                    search: `?category=${category}`
                })
            })
            .catch(() => toast.error("Что-то пошло не так"));
    };

    return (
        <Form autoComplete="off" onFinish={onFinish} style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Характеристики</StyledTextL2>
                        <FileUpload
                            label='Загрузить Excel'
                            fileList={fileCharacteristics} 
                            onChange={(info) => setFileCharacteristics(info.fileList)}
                        />
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        <StyledTextL2>Руководство пользователя</StyledTextL2>
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
                                value={getValue('title')}
                                onChange={e => changeInstructionInfo('title', e.target.value)}
                            />
                        </FormItem>
                        <FormItem
                            label="Описание"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Input.TextArea
                                showCount
                                style={{ height: 120 }}
                                placeholder="Описание"
                                value={getValue('description')}
                                onChange={e => changeInstructionInfo('description', e.target.value)}
                            />
                        </FormItem>
                        <div>
                            <ImageUpload
                                maxCount={1}
                                fileList={instruction.image} 
                                onChange={(info) => changeInstruction('image', info.fileList)}
                            />
                            <StyledText>Загрузить фото</StyledText>
                        </div>
                        <FileUpload
                            label='Загрузить Pdf'
                            fileList={instruction.file} 
                            onChange={(info) => changeInstruction('file', info.fileList)}
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
                            loading={loading1 || loading2}
                            style={{ background: '#25A55A' }}
                        >
                            Сохранить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
