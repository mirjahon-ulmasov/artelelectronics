import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { Color as ColorComponent } from 'components'
import { 
    useDeleteColorMutation, useFetchColorsQuery 
} from 'services/index'
import { Color } from 'types/filters/color'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Color.DTO {
    key: string
}

export default function Colors() {
    const navigate = useNavigate()

    const [deleteColor, { isLoading: deleteLoading }] = useDeleteColorMutation()   
    const { data: colors } = useFetchColorsQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return colors?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [colors])

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
        },
        {
            title: 'Код',
            dataIndex: 'code',
            key: 'code',
            ellipsis: true,
        },
        {
            title: 'Изображение',
            dataIndex: 'image',
            key: 'image',
            ellipsis: true,
            render: (_, record) => <ColorComponent link={record.image?.file} />,
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
                <Title level={3} className='fw-400'>Цвета</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/color/add'
                })}>
                    Добавить новый цвет
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
