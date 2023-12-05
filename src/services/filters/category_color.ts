import { CategoryColor } from 'types/filters/category'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const categoryColorWithTags = api.enhanceEndpoints({
    addTagTypes: ['CategoryColor'],
})

interface SearchParams {
    category?: ID
    is_active?: boolean
}

export const categoryColorAPI = categoryColorWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCategoryColors: build.query<CategoryColor.List, SearchParams>({
            query: params => ({
                url: '/category_color/admin_view/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['CategoryColor'],
        }),
        fetchCategoryColor: build.query<CategoryColor.DTO, ID>({
            query: id => ({
                url: `/category_color/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['CategoryColor'],
        }),
        createCategoryColor: build.mutation<unknown, CategoryColor.DTOUpload>({
            query: data => ({
                url: '/category_color/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CategoryColor'],
        }),
        updateCategoryColor: build.mutation<unknown, CategoryColor.DTOUpload>({
            query: data => ({
                url: `/category_color/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['CategoryColor'],
        }),
        deleteCategoryColor: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_color/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CategoryColor'],
        }),
        activateCategoryColor: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_color/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['CategoryColor'],
        }),
    }),
})

export const {
    useFetchCategoryColorQuery,
    useFetchCategoryColorsQuery,
    useCreateCategoryColorMutation,
    useUpdateCategoryColorMutation,
    useDeleteCategoryColorMutation,
    useActivateCategoryColorMutation,
} = categoryColorAPI
