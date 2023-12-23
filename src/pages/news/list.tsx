import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { isArray } from 'lodash'
import { v4 as uuid } from 'uuid'
import { 
    useDeleteNewsMutation, useFetchNewsListQuery, 
    usePublishNewsMutation } from 'services'
import { News } from 'types/others/news'
import { ID } from 'types/others/api'
import { Status } from 'components/Status'

const { Title } = Typography

interface TableDTO extends News.DTO {
    key: string
}

export default function NewsList() {
    const navigate = useNavigate()

    const [deleteNews, { isLoading: deleteLoading, originalArgs: deletedArgs }] = useDeleteNewsMutation()  
    const [publishNews, { isLoading: publishLoading, originalArgs: publishedArgs }] = usePublishNewsMutation()   

    const { data: news } = useFetchNewsListQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return news?.map(el => ({ ...el, key: uuid() })) || []
    }, [news])

    const deleteNewsHandler = useCallback((id: ID, news: TableDTO) => {
        if(!news.is_published) {
            toast.error('Пожалуйста, сначала опубликуйте новость')
            return;
        }
        deleteNews(id).unwrap()
            .then(() => toast.success('Новость успешно удалена'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteNews])

    const publishNewsHandler = useCallback((id: ID, is_published: boolean) => {
        publishNews({ id, is_published }).unwrap()
            .then(() => toast.success('Статус новости успешно изменен'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [publishNews])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => (isArray(record.languages) && record.languages[1]?.title) ?? '-',
        },
        {
            title: 'Статус',
            dataIndex: 'is_published',
            key: 'is_published',
            ellipsis: true,
            width: 200,
            render: (_, record) => record.is_published 
                ? <Status type='active' value>Опубликовано</Status> 
                : <Status type='active' value={false}>Не опубликовано</Status>,
        },
        {
            title: 'Действия',
            key: 'action',
            width: 420,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' 
                            danger 
                            loading={deleteLoading && deletedArgs === record.id} 
                            onClick={() => deleteNewsHandler(record.id, record)}
                        >
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button 
                            type='text' 
                            onClick={() => navigate({ pathname: `/news/${record.id}/edit` })}
                        >
                            Изменить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button
                            type='text' 
                            loading={publishLoading && publishedArgs?.id === record.id} 
                            onClick={() => publishNewsHandler(record.id, !record.is_published)}
                        >
                           {record.is_published ? 'Не публиковать' : 'Публиковать'}
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
