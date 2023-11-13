import { CategoryType } from 'types/filters/category'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const categoryTypeWithTags = api.enhanceEndpoints({
    addTagTypes: ['CategoryType'],
})

interface SearchParams {
    category?: ID
    is_active?: boolean
}

export const categoryTypeAPI = categoryTypeWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCategoryTypes: build.query<CategoryType.List, SearchParams>({
            query: params => ({
                url: '/category_type/admin_view/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['CategoryType'],
        }),
        fetchCategoryType: build.query<CategoryType.DTO, ID>({
            query: id => ({
                url: `/category_type/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['CategoryType'],
        }),
        createCategoryType: build.mutation<unknown, CategoryType.DTO>({
            query: data => ({
                url: '/category_type/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CategoryType'],
        }),
        updateCategoryType: build.mutation<unknown, CategoryType.DTO>({
            query: data => ({
                url: `/category_type/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['CategoryType'],
        }),
        deleteCategoryType: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_type/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CategoryType'],
        }),
        activateCategoryType: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_type/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['CategoryType'],
        }),
    }),
})

export const {
    useFetchCategoryTypesQuery,
    useFetchCategoryTypeQuery,
    useCreateCategoryTypeMutation,
    useUpdateCategoryTypeMutation,
    useDeleteCategoryTypeMutation,
    useActivateCategoryTypeMutation,
} = categoryTypeAPI
