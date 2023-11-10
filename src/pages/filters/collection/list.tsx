import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { useDeleteCollectionMutation, useFetchCollectionsQuery } from 'services'
import { Collection } from 'types/filters/collection'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Collection.DTO {
    key: string
}

export default function Collections() {
    const navigate = useNavigate()

    const [deleteCollection, { isLoading: deleteLoading }] = useDeleteCollectionMutation()   
    const { data: collections } = useFetchCollectionsQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return collections?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [collections])

    const deleteCollectionHandler = useCallback((id: ID) => {
        deleteCollection(id).unwrap()
            .then(() => toast.success('Коллекция успешно удалена'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteCollection])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.languages[1]?.title ?? '-',
        },
        {
            title: 'Действия',
            key: 'action',
            width: 300,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteCollectionHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/collection/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>Коллекции</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/collection/add'
                })}>
                    Добавить новую коллекцию
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
