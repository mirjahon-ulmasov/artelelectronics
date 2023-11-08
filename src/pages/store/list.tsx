import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { 
    useDeleteStoreMutation, useFetchStoresQuery 
} from 'services'
import { Store } from 'types/others/store'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Store.DTO {
    key: string
}

export default function Stores() {
    const navigate = useNavigate()

    const [deleteStore, { isLoading: deleteLoading }] = useDeleteStoreMutation()   
    const { data: stores } = useFetchStoresQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return stores?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [stores])

    const deleteStoreHandler = useCallback((id: ID) => {
        deleteStore(id).unwrap()
            .then(() => toast.success('Магазин успешно удален'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteStore])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
        },
        {
            title: 'Действия',
            key: 'action',
            width: 420,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteStoreHandler(record.id)}>
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
                <Title level={3} className='fw-400'>Магазины</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/store/add'
                })}>
                    Добавить новый магазин
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
