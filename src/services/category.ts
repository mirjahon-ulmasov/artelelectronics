import { ID } from 'types/api'
import { api } from './auth/baseQuery'
import { Category } from 'types/category'

const categoryWithTags = api.enhanceEndpoints({
    addTagTypes: ['Category'],
})

interface SearchParams {
    parent?: ID
    collection?: ID
    is_parent?: boolean
}

export const categoryAPI = categoryWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCategories: build.query<Category.List, SearchParams>({
            query: params => ({
                url: '/category/admin_view/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Category'],
        }),
        createCategory: build.mutation<unknown, Category.DTOCreation>({
            query: data => ({
                url: '/category/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: build.mutation<unknown, Category.DTOCreation>({
            query: data => ({
                url: `/category/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        deleteCategory: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
        activateCategory: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
})

export const {
    useFetchCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useActivateCategoryMutation,
} = categoryAPI
