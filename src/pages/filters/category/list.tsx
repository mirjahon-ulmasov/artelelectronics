import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Popover, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { useDeleteCategoryMutation, useFetchCategoriesQuery } from 'services'
import { Category } from 'types/filters/category'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Category.DTO {
    key: string
}

export default function Categories() {
    const navigate = useNavigate()

    const [deleteCategory, { isLoading: deleteLoading }] = useDeleteCategoryMutation()   
    const { data: categories } = useFetchCategoriesQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return categories?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [categories])

    const deleteCategoryHandler = useCallback((id: ID) => {
        deleteCategory(id).unwrap()
            .then(() => toast.success('Категория успешно удалена'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteCategory])

    const content = (file: string) => {
        return <video src={file} autoPlay muted loop />
    }

    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.languages[1]?.title ?? '-',
        },
        {
            title: 'Анимация',
            dataIndex: 'secondary_file',
            key: 'secondary_file',
            ellipsis: true,
            render: (_, record) => (
                <Popover content={content(record.secondary_file?.file)} trigger="click">
                    <Button type='default' size='small' shape='round'>Превью</Button>
                </Popover>
            ),
        },
        {
            title: 'Действия',
            key: 'action',
            width: 300,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' danger loading={deleteLoading} onClick={() => deleteCategoryHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/category/${record.id}/edit` })}>
                            Изменить
                        </Button>
                    </Col>  
               </Row>
            ),
        },
    ]

    return (
        <Fragment>
            <div className='d-flex jc-sb mb-2'>
                <Title level={3} className='fw-400'>Категории</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/category/add'
                })}>
                    Добавить новую категорию
                </Button>
            </div>
            <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                scroll={{ y: 600, x: 800 }}
            />
        </Fragment>
    )
}
