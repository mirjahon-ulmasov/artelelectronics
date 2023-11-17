import { Brand } from 'types/filters/brand'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const brandWithTags = api.enhanceEndpoints({
    addTagTypes: ['Brand'],
})

interface SearchParams {
    category?: ID
    is_active?: boolean
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
        createBrand: build.mutation<unknown, Brand.DTOUpload>({
            query: data => ({
                url: '/brand/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Brand'],
        }),
        updateBrand: build.mutation<unknown, Brand.DTOUpload>({
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
