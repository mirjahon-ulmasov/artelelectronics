import { Fragment, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Col, Row, Table, TableProps, Typography } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import toast from 'react-hot-toast'
import { isArray } from 'lodash'
import { v4 as uuid } from 'uuid'
import { 
    useDeleteProductMutation, useFetchBrandsQuery, 
    useFetchProductsQuery, 
    usePublishProductMutation
} from 'services/index'
import { Status } from 'components/Status'
import { useQuery } from 'hooks/useQuery'
import { Product } from 'types/product/product'
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

    const [
        deleteProduct, 
        { isLoading: deleteLoading, originalArgs: deletedArgs }
    ] = useDeleteProductMutation() 

    const [
        publishProduct, 
        { isLoading: publishLoading, originalArgs: publishedArgs }
    ] = usePublishProductMutation()   

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
        return products?.map(el => ({ ...el, key: uuid() })) || []
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

    const publishProductHandler = useCallback((slug: string, is_published: boolean) => {
        publishProduct({ slug, is_published }).unwrap()
            .then(() => toast.success('Статус новости успешно изменен'))
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
                        <Button 
                            danger 
                            type='text' 
                            loading={deleteLoading && deletedArgs === record.slug} 
                            onClick={() => deleteProductHandler(record.slug)}
                        >
                            Удалить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button 
                            type='text' 
                            onClick={() => navigate({ pathname: `/product/${record.slug}/edit`, search })}
                        >
                            Изменить
                        </Button>
                    </Col>
                    <Col flex="100px">
                        <Button
                            type='text' 
                            loading={publishLoading && publishedArgs?.slug === record.slug} 
                            onClick={() => publishProductHandler(record.slug, !record.is_published)}
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
                scroll={{ y: 600, x: 1000 }}
            />
        </Fragment>
    )
}
