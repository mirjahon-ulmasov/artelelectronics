import { Store } from 'types/others/store'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const storeWithTags = api.enhanceEndpoints({
    addTagTypes: ['Store'],
})

interface SearchParams {
    is_active?: boolean
}

export const storeAPI = storeWithTags.injectEndpoints({
    endpoints: build => ({
        fetchStores: build.query<Store.List, SearchParams>({
            query: () => ({
                url: '/store/admin_view/',
                method: 'GET',
            }),
            providesTags: () => ['Store'],
        }),
        fetchStore: build.query<Store.DTO, ID>({
            query: id => ({
                url: `/store/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['Store'],
        }),
        createStore: build.mutation<unknown, Store.DTOUpload>({
            query: data => ({
                url: '/store/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Store'],
        }),
        updateStore: build.mutation<unknown, Store.DTOUpload>({
            query: data => ({
                url: `/store/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Store'],
        }),
        deleteStore: build.mutation<unknown, ID>({
            query: id => ({
                url: `/store/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Store'],
        }),
        activateStore: build.mutation<unknown, ID>({
            query: id => ({
                url: `/store/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Store'],
        }),
    }),
})

export const {
    useFetchStoresQuery,
    useFetchStoreQuery,
    useCreateStoreMutation,
    useUpdateStoreMutation,
    useDeleteStoreMutation,
    useActivateStoreMutation,
} = storeAPI
