import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import { v4 as uuid } from 'uuid'
import toast from 'react-hot-toast'
import { 
    useDeleteCategoryPropertyMutation,
    useFetchCategoryPropertiesQuery 
} from 'services/index'
import { Category, CategoryProperty } from 'types/filters/category'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends CategoryProperty.DTO {
    key: string
}

interface PropertyProps {
    category?: Category.DTO
}

export default function Properties({ category }: PropertyProps) {
    const navigate = useNavigate()

    const [deleteProperty, { isLoading: deleteLoading }] = useDeleteCategoryPropertyMutation()   
    const { data: categoryProperties } = useFetchCategoryPropertiesQuery({
        is_active: true,
        category: category?.slug
    }, { skip: !category })

    const dataSource: TableDTO[] = useMemo(() => {
        return categoryProperties?.map(el => ({ ...el, key: uuid() })) || []
    }, [categoryProperties])

    const deletePropertyHandler = useCallback((id: ID) => {
        deleteProperty(id).unwrap()
            .then(() => toast.success('Свойство категории успешно удалено'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteProperty])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.languages?.[1]?.title ?? '-',
        },
        {
            title: 'Действия',
            key: 'action',
            width: 300,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' danger loading={deleteLoading} onClick={() => deletePropertyHandler(record.id as ID)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: 
                            `/category/${category?.id}/property/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>
                    Свойства категории - {category?.languages?.[1]?.title}
                </Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: `/category/${category?.id}/property/add`
                })}>
                    Добавить новое
                </Button>
            </div>
            <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                scroll={{ y: 600 }}
            />
        </Fragment>
    )
}
