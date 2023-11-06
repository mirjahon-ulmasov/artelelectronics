import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { 
    useDeleteColorMutation, useFetchNewsListQuery 
} from 'services/index'
import { News } from 'types/news'
import { ID } from 'types/api'
import { isArray } from 'lodash'

const { Title } = Typography

interface TableDTO extends News.DTO {
    key: string
}

export default function NewsList() {
    const navigate = useNavigate()

    const [deleteColor, { isLoading: deleteLoading }] = useDeleteColorMutation()   
    const { data: news } = useFetchNewsListQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return news?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [news])

    const deleteColorHandler = useCallback((id: ID) => {
        deleteColor(id).unwrap()
            .then(() => toast.success('Цвет успешно удален'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteColor])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => (isArray(record.languages) && record.languages[0]?.title) ?? '-',
        },
        {
            title: 'Действия',
            key: 'action',
            width: 420,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteColorHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/color/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>Новости</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/news/add'
                })}>
                    Добавить новость
                </Button>
            </div>
            <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
            />
        </Fragment>
    )
}
