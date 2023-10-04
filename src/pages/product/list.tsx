/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Table, TableProps, Typography } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import { Status } from 'components'
import { useFetchProductsQuery } from 'services/index'
import { useQuery } from 'hooks/useQuery'
import { Product } from 'types/product'
import { isArray } from 'lodash'

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
    const { data: products } = useFetchProductsQuery({
        category,
        is_published: 
            isArray(filters?.is_published) && 
            (filters?.is_published.length > 1
                ? undefined 
                : filters?.is_published[0] as boolean),
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

    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
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
            title: 'Активен',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (_, record) => (
                <Status value={record.is_active} type='active'>
                    {record.is_active ? 'активный' : 'неактивный'}
                </Status>
            ),
            filters: [
                {
                    text: 'активный',
                    value: true,
                },
                {
                    text: 'неактивный',
                    value: false,
                },
            ],
            filterSearch: true,
        },
        {
            title: 'Опубликовано',
            dataIndex: 'is_published',
            key: 'is_published',
            render: (_, record) => (
                <Status value={record.is_published} type='active'>
                    {record.is_published ? 'опубликован' : 'не опубликовано'}
                </Status>
            ),
            filters: [
                {
                    text: 'опубликован',
                    value: true,
                },
                {
                    text: 'не опубликовано',
                    value: false,
                },
            ],
            filterSearch: true,
        }
    ]

    return (
        <>
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
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                scroll={{ y: 600, x: 1000 }} 
            />
        </>
    )
}
