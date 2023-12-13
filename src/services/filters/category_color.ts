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
        addCategoryColor: build.mutation<unknown, CategoryColor.DTOUpload>({
            query: data => ({
                url: '/category_color/multiple_update/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['CategoryColor'],
        }),
    }),
})

export const {
    useFetchCategoryColorQuery,
    useFetchCategoryColorsQuery,
    useAddCategoryColorMutation,
} = categoryColorAPI
