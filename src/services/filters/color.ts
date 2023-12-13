import { Color } from 'types/filters/color'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const colorWithTags = api.enhanceEndpoints({
    addTagTypes: ['Color'],
})

interface SearchParams {
    is_active?: boolean
}

export const colorAPI = colorWithTags.injectEndpoints({
    endpoints: build => ({
        fetchColors: build.query<Color.List, SearchParams>({
            query: params => ({
                url: '/color/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Color'],
        }),
        fetchColor: build.query<Color.DTO, ID>({
            query: id => ({
                url: `/color/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['Color'],
        }),
        createColor: build.mutation<unknown, Color.DTOUpload>({
            query: data => ({
                url: '/color/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Color'],
        }),
        updateColor: build.mutation<unknown, Color.DTOUpload>({
            query: data => ({
                url: `/color/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Color'],
        }),
        deleteColor: build.mutation<unknown, ID>({
            query: id => ({
                url: `/color/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Color'],
        }),
        activateColor: build.mutation<unknown, ID>({
            query: id => ({
                url: `/color/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Color'],
        }),
    }),
})

export const {
    useFetchColorQuery,
    useFetchColorsQuery,
    useCreateColorMutation,
    useUpdateColorMutation,
    useDeleteColorMutation,
    useActivateColorMutation
} = colorAPI
