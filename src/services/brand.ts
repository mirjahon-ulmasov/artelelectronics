import { ID } from 'types/api'
import { api } from './auth/baseQuery'
import { Brand } from 'types/brand'

const brandWithTags = api.enhanceEndpoints({
    addTagTypes: ['Brand'],
})

interface SearchParams {
    category?: number | string
}

export const brandAPI = brandWithTags.injectEndpoints({
    endpoints: build => ({
        fetchBrands: build.query<Brand.List, SearchParams>({
            query: params => ({
                url: '/brand/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Brand'],
        }),
        createBrand: build.mutation<unknown, Brand.DTOCreation>({
            query: data => ({
                url: '/brand/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Brand'],
        }),
        updateBrand: build.mutation<unknown, Brand.DTOCreation>({
            query: data => ({
                url: `/brand/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Brand'],
        }),
        deleteBrand: build.mutation<unknown, ID>({
            query: id => ({
                url: `/brand/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Brand'],
        }),
        activateBrand: build.mutation<unknown, ID>({
            query: id => ({
                url: `/brand/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Brand'],
        }),
    }),
})

export const {
    useFetchBrandsQuery,
    useCreateBrandMutation,
    useUpdateBrandMutation,
    useDeleteBrandMutation,
    useActivateBrandMutation
} = brandAPI
