/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, useCallback, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Space, Table, TableProps, Typography } from 'antd'
import type { ColumnsType, FilterValue, SorterResult } from 'antd/es/table/interface'
import { Status } from 'components'
import { useActivateProductMutation, useDeleteProductMutation, useFetchBrandsQuery, useFetchProductsQuery, usePublishProductMutation } from 'services/index'
import { useQuery } from 'hooks/useQuery'
import { Product } from 'types/product'
import { isArray } from 'lodash'
import { ID } from 'types/api'

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

    const [deleteProduct, { isLoading: deleteLoading }] = useDeleteProductMutation()
    const [activateProduct, { isLoading: activateLoading }] = useActivateProductMutation()
    const [publishProduct, { isLoading: publishLoading }] = usePublishProductMutation()

    const { data: brands } = useFetchBrandsQuery({})
    const { data: products } = useFetchProductsQuery({
        category,
        brand: isArray(filters?.brand) ? filters?.brand[0].toString() : '',
        // object_index: isArray(filters?.id) ? filters?.id[0].toString() : '',
        // status: isArray(filters?.status) ? filters?.status.join() : '',
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

    const changeActivateStat = useCallback((id: ID, is_active: boolean) => {
        if(is_active) {
            deleteProduct(id)
            return;
        }
        activateProduct(id)
    }, [activateProduct, deleteProduct])

    const changePublishStat = useCallback((id: ID, is_published: boolean) => {
        publishProduct({
            id,
            is_published
        })
    }, [publishProduct])

    const columns: ColumnsType<TableDTO> = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
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
            title: 'Активен',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 180,
            render: (_, record) => (
                <Status value={record.is_active} type='active'>
                    {record.is_active ? 'активный' : 'неактивный'}
                </Status>
            ),
            filters: [
                { text: 'активный', value: true },
                { text: 'неактивный', value: false },
            ],
            filterSearch: true,
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
            width: 380,
            render: (_, record) => (
               <Space>
                    <Button type='text' loading={publishLoading} onClick={() => changePublishStat(record.id, record.is_published)}>
                        {record.is_published ? 'Не публиковать' : 'Публиковать'}
                    </Button>
                    <Button type='text' loading={deleteLoading || activateLoading} onClick={() => changeActivateStat(record.id, record.is_active)}>
                        {record.is_active ? 'Удалить' : 'Активировать'}
                    </Button>
                    <Button type='text' onClick={() => navigate({ pathname: `/product/${record.id}/edit`, search })}>
                        Изменить
                    </Button>
               </Space>
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
                columns={columns}
                dataSource={dataSource}
                onChange={handleChange}
                scroll={{ y: 600, x: 1500 }} 
            />
        </Fragment>
    )
}
