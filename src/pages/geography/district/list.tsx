import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { useDeleteDistrictMutation, useFetchDistrictsQuery } from 'services'
import { District } from 'types/geography/district'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends District.DTO {
    key: string
}

export default function Districts() {
    const navigate = useNavigate()

    const [deleteDistrict, { isLoading: deleteLoading }] = useDeleteDistrictMutation()   
    const { data: districts } = useFetchDistrictsQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return districts?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [districts])

    const deleteDistrictHandler = useCallback((id: ID) => {
        deleteDistrict(id).unwrap()
            .then(() => toast.success('Район успешно удален'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteDistrict])


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
                        <Button type='text' loading={deleteLoading} onClick={() => deleteDistrictHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/district/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>Районы</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/district/add'
                })}>
                    Добавить новый район
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
