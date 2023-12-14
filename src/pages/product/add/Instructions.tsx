import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Form, Input, Row, Space } from 'antd'
import toast from 'react-hot-toast'
import _ from 'lodash'
import { 
    useCreateInstructionImagesMutation, useCreateInstructionMutation, 
    useFetchProductColorsQuery 
} from 'services'
import { 
    BorderBox, LanguageToggle, StyledText, Color,
    FormItem, StyledTextL2, ImageUpload, FileUpload, CustomSelect 
} from 'components'
import { Instruction, InstructionImage } from 'types/product/instruction'
import { Product } from 'types/product/product';
import { ID, LANGUAGE } from 'types/others/api'
import { languages } from 'utils/index'
import { PlusOutlined } from '@ant-design/icons'

interface InstructionsProps {
    product: Product.DTO
    category: string
}

export function Instructions({ product, category }: InstructionsProps) {
    const navigate = useNavigate();
    const [language, setLanguage] = useState<LANGUAGE>(LANGUAGE.RU)
    const [instruction, setInstruction] = useState<Instruction.DTOLocal>({ 
        file: [], 
        languages: [
            { title: '', description: '', language: LANGUAGE.UZ },
            { title: '', description: '', language: LANGUAGE.RU },
            { title: '', description: '', language: LANGUAGE.EN },
        ],
    })
    const [instructionImages, setInstructionImages] = useState<InstructionImage.DTOLocal>({ 
        images: [
            { color: '', image: [] }
        ]
    })

    const { data: colors, isLoading: colorsLoading } = useFetchProductColorsQuery({
        product: product.id
    })
    const [createInstruction, { isLoading: loading }] = useCreateInstructionMutation()
    const [createInstructionImage, { isLoading: loadingImages }] = useCreateInstructionImagesMutation()

    // ---------------- Product Instruction ----------------

    const changeInstruction = useCallback((key: keyof Instruction.DTOLocal, value: unknown) => {
        setInstruction(prev => ({
            ...prev,
            [key]: value
        }))
    }, [])

    const changeInstructionInfo = useCallback((key: keyof Instruction.EXLanguage, value: string) => {
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

    const getValue = useCallback((key: keyof Instruction.EXLanguage) => {
        const foundIdx = instruction.languages.findIndex(el => el.language === language)
        if(foundIdx !== -1) {
            return instruction.languages[foundIdx][key]
        }
        return ''
    }, [instruction.languages, language])


    // ---------------- Instruction Image -------------------

    const changeInstructionImage = useCallback(
        (idx: number, key: keyof InstructionImage.ImageLocal, value: unknown) => {
        setInstructionImages(prev => ({
            ...prev,
            images: prev.images.map((el, index) => {
                if(index === idx) {
                    return {
                        ...el,
                        [key]: value
                    }
                }
                return el
            })
        }))
    }, [])

    const addNewInstructionImage = useCallback(() => {
        setInstructionImages(prev => ({
            ...prev,
            images: [
                ...prev.images,
                { color: '', image: [] }
            ]
        }))
    }, [])

    // ---------------- Submit ----------------
    const onFinish = () => {
        const dataInstruction: Instruction.DTOUpload = {
            product: product.id,
            languages: instruction.languages,
            file: instruction.file[0]?.response?.id as ID,
        }

        createInstruction(dataInstruction).unwrap().then(res => {
            const dataInstructionImages: InstructionImage.DTOUpload = {
                product_instruction: res.id as ID,
                images: instructionImages.images.map(el => ({
                    ...el,
                    image: el.image[0]?.response?.id as ID
                }))
            }
            createInstructionImage(dataInstructionImages).unwrap().then(() => {
                toast.success("Инструкции по продукту успешно добавлены.");
                navigate({
                    pathname: '/product/list',
                    search: `?category=${category}`
                })
            }).catch(() => toast.error("Что-то пошло не так"))
        }).catch(() => toast.error("Что-то пошло не так"))
    };

    return (
        <Form autoComplete="off" onFinish={onFinish} style={{ maxWidth: 1000 }}>
            <Row gutter={[0, 20]}>
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
                        <FileUpload
                            label='Загрузить Pdf'
                            fileList={instruction.file} 
                            onChange={(info) => changeInstruction('file', info.fileList)}
                        />
                    </BorderBox>
                </Col>
                <Col span={24}>
                    <BorderBox>
                        {instructionImages.images.map((el, index) => (
                            <div className='d-flex fd-col gap-16 ai-start' key={index}>
                                <FormItem
                                    label="Цвет продукта"
                                    style={{ width: 250 }}
                                    labelCol={{ span: 24 }}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <CustomSelect
                                        allowClear
                                        size="large"
                                        placeholder="Выберите"
                                        loading={colorsLoading}
                                        options={colors?.map(prodColor => ({
                                            value: prodColor.color.id,
                                            label: (
                                                <div className='d-flex gap-12 jc-start'>
                                                    <Color link={prodColor.color?.image?.file} />
                                                    {prodColor.color.title}
                                                </div>
                                            ),
                                        }))}
                                        value={el.color || undefined}
                                        onChange={(value: ID) => changeInstructionImage(
                                            index, 'color', value, 
                                        )}
                                    />
                                </FormItem>
                                <div>
                                    <ImageUpload
                                        maxCount={1}
                                        fileList={el.image} 
                                        onChange={(info) => changeInstructionImage(index, 'image', info.fileList)}
                                    />
                                    <StyledText>Загрузить фото</StyledText>
                                </div>
                            </div>
                        ))}
                    </BorderBox>
                    <div className='d-flex mt-1'>
                        <Button 
                            type='text' 
                            size='large'
                            shape='round'
                            onClick={addNewInstructionImage}
                            icon={<PlusOutlined />} 
                            style={{ fontWeight: 400 }} 
                        >
                            Добавить еще
                        </Button>
                    </div>
                </Col>

                <Col span={24} className='mt-2'>
                    <Space size="large">
                        <Button
                            size="large"
                            type="primary"
                            htmlType="submit"
                            shape="round"
                            loading={loading || loadingImages}
                        >
                            Сохранить
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    )
}
