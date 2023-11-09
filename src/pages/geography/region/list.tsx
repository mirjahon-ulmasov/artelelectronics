import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { useDeleteRegionMutation, useFetchRegionsQuery } from 'services'
import { Region } from 'types/geography/region'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Region.DTO {
    key: string
}

export default function Regions() {
    const navigate = useNavigate()

    const [deleteRegion, { isLoading: deleteLoading }] = useDeleteRegionMutation()   
    const { data: regions } = useFetchRegionsQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return regions?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [regions])

    const deleteRegionHandler = useCallback((id: ID) => {
        deleteRegion(id).unwrap()
            .then(() => toast.success('Регион успешно удален'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteRegion])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.languages[1].title ?? '-',
        },
        {
            title: 'Действия',
            key: 'action',
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteRegionHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/region/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>Регионы</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/region/add'
                })}>
                    Добавить новый регион
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
