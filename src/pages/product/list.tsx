import { Fragment, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, TableProps, Typography } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { Status } from 'components'
import { 
    useDeleteProductMutation, useFetchBrandsQuery, 
    useFetchProductsQuery, usePublishProductMutation 
} from 'services/index'
import { useQuery } from 'hooks/useQuery'
import { Product } from 'types/product/product'
import { isArray } from 'lodash'
import { ID } from 'types/others/api'

const { Title } = Typography

interface TableDTO extends Product.DTO {
    key: string
}

export default function Products() {
    const navigate = useNavigate()
    const { search } = useLocation()
    const query = useQuery();
    const category = query.get("category") ?? undefined

    const [sorters, setSorters] = useState<SorterResult<TableDTO>[]>([]);    
    const [filters, setFilters] = useState<Record<string, FilterValue | null>>({})  

    const [publishProduct, { isLoading: publishLoading }] = usePublishProductMutation()   
    const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation()   

    const { data: brands } = useFetchBrandsQuery({})
    const { data: products } = useFetchProductsQuery({
        category,
        brand: isArray(filters?.brand) ? filters?.brand.join() : '',
        // object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        // status: isArray(filters?.status) ? filters?.status.join() : '',
        is_published:
            (!isArray(filters?.is_published) || 
            filters?.is_published.length > 1)
                ? undefined 
                : filters?.is_published[0] as boolean,
        is_active: true
                
    })

    const dataSource: TableDTO[] = useMemo(() => {
        return products?.map((el, idx) => ({
            ...el,
            key: idx.toString()
        })) || []
    }, [products])

    // ---------------- Table Change ----------------
    const handleChange: TableProps<TableDTO>['onChange'] = (_pagination, filters, sorter) => {        
        setFilters(filters);        
    
        if (!sorter) return;
    
        const sorterArray = isArray(sorter) ? sorter : [sorter];
        sorterArray.forEach((element) => {
            if(!element.field) return;
    
            const sortIndex = sorters.findIndex((item) => item.field === element.field);
            if(sortIndex === -1) {
                setSorters(prev => [...prev, element])
                return;
            }
            const updatedSorters = [...sorters];
            updatedSorters[sortIndex].order = element.order;
            setSorters(updatedSorters)
        })
    };

    const deleteProductHandler = useCallback((id: ID) => {
        deleteProduct(id).unwrap()
            .then(() => toast.success('Продукт успешно удален'))
            .catch(() => toast.error('Что-то пошло не так'))
    }, [deleteProduct])

    const publishProductHandler = useCallback((id: ID, is_published: boolean) => {
        publishProduct({ id, is_published }).unwrap()
            .then(() => toast.success('Продукт успешно изменен'))
            .catch(() => toast.error('Что-то пошло не так'))

    }, [publishProduct])

    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (_, record) => record.languages[1]?.title ?? "-",
        },
        {
            title: 'Бренд',
            dataIndex: 'brand',
            key: 'brand',
            width: 150,
            ellipsis: true,
            render: (_, record) => record.brand?.title,
            filters: brands?.map(brand => ({
                text: brand.title,
                value: brand.id
            })),
            filterSearch: true,
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            ellipsis: true,
            render: (_, record) => record.category?.title,
        },
        {
            title: 'Подкатегория',
            dataIndex: 'subcategory',
            key: 'subcategory',
            ellipsis: true,
            render: (_, record) => record.subcategory?.title,
        },
        {
            title: 'Опубликовано',
            dataIndex: 'is_published',
            key: 'is_published',
            width: 200,
            render: (_, record) => (
                <Status value={record.is_published} type='active'>
                    {record.is_published ? 'опубликован' : 'не опубликовано'}
                </Status>
            ),
            filters: [
                { text: 'опубликован', value: true },
                { text: 'не опубликовано', value: false },
            ],
            filterSearch: true,
        },
        {
            title: 'Действия',
            key: 'action',
            width: 420,
            render: (_, record) => (
               <Row>
                    <Col flex="160px">
                        <Button type='text' loading={publishLoading} onClick={() => publishProductHandler(record.id, !record.is_published)}>
                            {record.is_published ? 'Не публиковать' : 'Публиковать'}
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' loading={deleteLoading} onClick={() => deleteProductHandler(record.id)}>
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button type='text' onClick={() => navigate({ pathname: `/product/${record.id}/edit`, search })}>
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
                <Title level={3} className='fw-400'>Продукты</Title>
                <Button type='primary' size='large' onClick={() => navigate({
                    pathname: '/product/add',
                    search
                })}>
                    Добавить новый продукт
                </Button>
            </div>
            <Table
                pagination={false}
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                scroll={{ y: 600, x: 1500 }}
            />
        </Fragment>
    )
}
