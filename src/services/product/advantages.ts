import { Advantage } from 'types/product/product'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const advantagesWithTags = api.enhanceEndpoints({
    addTagTypes: ['Advantage'],
})

interface SearchParams {
    product: ID
}

export const advantagesAPI = advantagesWithTags.injectEndpoints({
    endpoints: build => ({
        fetchAdvantages: build.query<Advantage.List, SearchParams>({
            query: params => ({
                url: '/product_advantage/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Advantage'],
        }),
        createAdvantage: build.mutation<unknown, Advantage.DTOUpload>({
            query: data => ({
                url: '/product_advantage/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Advantage'],
        }),
        createAdvantages: build.mutation<unknown, Advantage.DTOUpload[]>({
            query: data => ({
                url: '/product_advantage/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Advantage'],
        }),
        updateAdvantage: build.mutation<unknown, Advantage.DTOUpload>({
            query: data => ({
                url: `/product_advantage/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Advantage'],
        }),
        deleteAdvantage: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_advantage/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Advantage'],
        }),
        activateAdvantage: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_advantage/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Advantage'],
        }),
    }),
})

export const {
    useFetchAdvantagesQuery,
    useCreateAdvantageMutation,
    useCreateAdvantagesMutation,
    useUpdateAdvantageMutation,
    useDeleteAdvantageMutation,
    useActivateAdvantageMutation
} = advantagesAPI
