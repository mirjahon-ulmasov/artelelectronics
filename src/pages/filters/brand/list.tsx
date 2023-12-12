import { Fragment, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Popover, Row, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { useDeleteBrandMutation, useFetchBrandsQuery } from 'services'
import { Brand } from 'types/filters/brand'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Brand.DTO {
    key: string
}

export default function Brands() {
    const navigate = useNavigate()

    const [deleteBrand, { isLoading: deleteLoading }] = useDeleteBrandMutation()   
    const { data: brands } = useFetchBrandsQuery({
        is_active: true
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return brands?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [brands])

    const deleteBrandHandler = useCallback((id: ID) => {
        deleteBrand(id).unwrap()
            .then(() => toast.success('Бренд успешно удален'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteBrand])

    const content = (file: string) => {
        return (
            <div>
                <img src={file} alt='image' />
            </div>
        ) 
    }

    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.title ?? '-',
        },
        {
            title: 'Порядок',
            dataIndex: 'custom_order',
            key: 'custom_order',
            ellipsis: true,
        },
        {
            title: 'Главный логотип',
            dataIndex: 'image',
            key: 'image',
            ellipsis: true,
            render: (_, record) => (
                <Popover content={content(record.image?.file)} trigger="click">
                    <Button type='default' size='small' shape='round'>Просмотреть</Button>
                </Popover>
            ),
        },
        {
            title: '2-й логотип',
            dataIndex: 'secondary_image',
            key: 'secondary_image',
            ellipsis: true,
            render: (_, record) => (
                <Popover content={content(record.secondary_image?.file)} trigger="click">
                    <Button type='default' size='small' shape='round'>Просмотреть</Button>
                </Popover>
            ),
        },
        {
            title: 'Действия',
            key: 'action',
            width: 300,
            render: (_, record) => (
               <Row>
                    <Col flex="100px">
                        <Button 
                            danger type='text' 
                            loading={deleteLoading} 
                            onClick={() => deleteBrandHandler(record.id)}
                        >
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/brand/${record.id}/edit` })}>
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
                <Title level={3} className='fw-400'>Бренды</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/brand/add'
                })}>
                    Добавить новую бренд
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
