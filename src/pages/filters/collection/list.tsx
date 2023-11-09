import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { useDeleteCountryMutation, useFetchCountriesQuery } from 'services/index'
import { Country } from 'types/geography/country'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Country.DTO {
    key: string
}

export default function CountryList() {
    const navigate = useNavigate()

    const [deleteCountry, { isLoading: deleteLoading }] = useDeleteCountryMutation()   
    const { data: countries } = useFetchCountriesQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return countries?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [countries])

    const deleteCountryHandler = useCallback((id: ID) => {
        deleteCountry(id).unwrap()
            .then(() => toast.success('Страна успешно удалена'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteCountry])


    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.languages[1].title ?? '-',
        },
        {
            title: 'IP',
            dataIndex: 'IP',
            key: 'IP',
            ellipsis: true,
        },
        {
            title: 'Код страны',
            dataIndex: 'country_code',
            key: 'country_code',
            ellipsis: true,
        },
        {
            title: 'Действия',
            key: 'action',
            width: 300,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteCountryHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/country/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>Страны</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/country/add'
                })}>
                    Добавить новую страну
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
