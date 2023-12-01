import { CategoryProperty } from 'types/filters/category'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const categoryPropertyWithTags = api.enhanceEndpoints({
    addTagTypes: ['CategoryProperty'],
})

interface SearchParams {
    category?: ID
    is_primary?: boolean
    is_active?: boolean
}

export const categoryPropertyAPI = categoryPropertyWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCategoryProperties: build.query<CategoryProperty.List, SearchParams>({
            query: params => ({
                url: '/category_property/admin_view/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['CategoryProperty'],
        }),
        fetchCategoryProperty: build.query<CategoryProperty.DTO, ID>({
            query: id => ({
                url: `/category_property/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['CategoryProperty'],
        }),
        createCategoryProperty: build.mutation<unknown, CategoryProperty.DTO>({
            query: data => ({
                url: '/category_property/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CategoryProperty'],
        }),
        updateCategoryProperty: build.mutation<unknown, CategoryProperty.DTO>({
            query: data => ({
                url: `/category_property/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['CategoryProperty'],
        }),
        deleteCategoryProperty: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_property/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CategoryProperty'],
        }),
        activateCategoryProperty: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_property/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['CategoryProperty'],
        }),
    }),
})

export const {
    useFetchCategoryPropertyQuery,
    useFetchCategoryPropertiesQuery,
    useCreateCategoryPropertyMutation,
    useUpdateCategoryPropertyMutation,
    useDeleteCategoryPropertyMutation,
    useActivateCategoryPropertyMutation,
} = categoryPropertyAPI
