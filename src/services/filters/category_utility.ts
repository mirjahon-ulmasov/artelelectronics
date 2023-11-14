import { CategoryUtility } from 'types/filters/category'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const categoryUtilityWithTags = api.enhanceEndpoints({
    addTagTypes: ['CategoryUtility'],
})

interface SearchParams {
    category?: ID
    is_primary?: boolean
    is_active?: boolean
}

export const categoryUtilityAPI = categoryUtilityWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCategoryUtilities: build.query<CategoryUtility.List, SearchParams>({
            query: params => ({
                url: '/category_utility/admin_view/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['CategoryUtility'],
        }),
        fetchCategoryUtility: build.query<CategoryUtility.DTO, ID>({
            query: id => ({
                url: `/category_utility/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['CategoryUtility'],
        }),
        createCategoryUtility: build.mutation<unknown, CategoryUtility.DTO>({
            query: data => ({
                url: '/category_utility/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CategoryUtility'],
        }),
        updateCategoryUtility: build.mutation<unknown, CategoryUtility.DTO>({
            query: data => ({
                url: `/category_utility/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['CategoryUtility'],
        }),
        deleteCategoryUtility: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_utility/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['CategoryUtility'],
        }),
        activateCategoryUtility: build.mutation<unknown, ID>({
            query: id => ({
                url: `/category_utility/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['CategoryUtility'],
        }),
    }),
})

export const {
    useFetchCategoryUtilitiesQuery,
    useFetchCategoryUtilityQuery,
    useCreateCategoryUtilityMutation,
    useUpdateCategoryUtilityMutation,
    useDeleteCategoryUtilityMutation,
    useActivateCategoryUtilityMutation,
} = categoryUtilityAPI
