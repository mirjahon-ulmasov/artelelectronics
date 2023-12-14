import { Fragment, useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Col, Form, Row, Space, Typography } from 'antd'
import toast from 'react-hot-toast'
import { 
    useAddCategoryColorMutation, useFetchCategoryColorsQuery, 
    useFetchCategoryQuery, useFetchColorsQuery 
} from 'services'
import { FormItem, CustomSelect, Color } from 'components'
import { CategoryColor as ICategoryColor } from 'types/filters/category'
import { ID } from 'types/others/api'

const { Title } = Typography

export default function CategoryColor() {
    const navigate = useNavigate()
    const { categoryID } = useParams()
    const [categoryColor, setCategoryColor] = useState<ICategoryColor.DTOUpload>({
        category: categoryID as ID,
        colors: []
    })

    const { data: category } = useFetchCategoryQuery(categoryID as ID)
    const { data: colors, isLoading: colorsLoading } = useFetchColorsQuery({
        is_active: true
    })
    const { data: categoryColors, isError } = useFetchCategoryColorsQuery(
        { category: category?.slug },
        { skip: !category?.slug }
    )

    const [ addCategoryColor, { isLoading: createLoading }] = useAddCategoryColorMutation()

    useEffect(() => {
        if(isError) return;

        setCategoryColor(prev => ({
            ...prev,
            colors: categoryColors?.map(el => el.color.id) || []
        }))
    }, [categoryColors, isError])

    // ---------------- Submit ----------------
    const onFinish = useCallback(() => {  
    
        const promises = [
            addCategoryColor(categoryColor).unwrap(),
        ];
    
        Promise.all(promises)
            .then(() => {
                toast.success("Цвет категории успешно добавлен")
                navigate("/category/list")
            })
            .catch(() => toast.error("Не удалось добавить цвет категории"))
    }, [categoryColor, addCategoryColor, navigate])
    
    return (
        <Fragment>
            <Title level={3}>Добавить цвета в категорию - {category?.languages[1].title}</Title>
            <Form autoComplete="off" onFinish={onFinish} style={{ maxWidth: 500 }}>
                <Row gutter={[0, 8]} className="mt-1">
                    <Col span={24}>
                        <FormItem label="Цвет категории" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
                            <CustomSelect
                                mode='multiple'
                                allowClear
                                size="large"
                                placeholder="Выберите"
                                loading={colorsLoading}
                                options={colors?.map(color => ({
                                    value: color.id,
                                    label: (
                                        <div className='d-flex gap-12 jc-start'>
                                            <Color link={color.image.file} />
                                            {color.languages[1].title}
                                        </div>
                                    ),
                                }))}
                                value={categoryColor.colors || undefined}
                                onChange={(value) => setCategoryColor(prev => ({
                                    ...prev,
                                    colors: value
                                }))}
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
                                onClick={() => navigate(`/category/list`)}
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
