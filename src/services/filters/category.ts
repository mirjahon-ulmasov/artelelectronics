import { Category } from 'types/filters/category'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const categoryWithTags = api.enhanceEndpoints({
    addTagTypes: ['Category'],
})

interface SearchParams {
    parent?: ID
    category?: ID
    collection?: ID
    is_parent?: boolean
    is_active?: boolean
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
        fetchCategoryUtility: build.query<Category.Utility[], SearchParams>({
            query: params => ({
                url: '/category_utility/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Category'],
        }),
        createCategory: build.mutation<unknown, Category.DTOUpload>({
            query: data => ({
                url: '/category/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: build.mutation<unknown, Category.DTOUpload>({
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
    useFetchCategoryUtilityQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useActivateCategoryMutation,
} = categoryAPI
