import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { isArray } from 'lodash'
import { useDeleteNewsMutation, useFetchNewsListQuery } from 'services'
import { News } from 'types/others/news'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends News.DTO {
    key: string
}

export default function NewsList() {
    const navigate = useNavigate()

    const [deleteNews, { isLoading: deleteLoading }] = useDeleteNewsMutation()   
    const { data: news } = useFetchNewsListQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return news?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [news])

    const deleteNewsHandler = useCallback((id: ID) => {
        deleteNews(id).unwrap()
            .then(() => toast.success('Новость успешно удалена'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteNews])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => (isArray(record.languages) && record.languages[1]?.title) ?? '-',
        },
        {
            title: 'Действия',
            key: 'action',
            width: 300,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteNewsHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/news/${record.id}/edit` })}>
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
                scroll={{ y: 600, x: 700 }}
            />
        </Fragment>
    )
}
