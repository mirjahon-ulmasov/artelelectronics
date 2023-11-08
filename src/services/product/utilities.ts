import { Utility } from 'types/product/product'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const utilitiesWithTags = api.enhanceEndpoints({
    addTagTypes: ['Utility'],
})

interface SearchParams {
    product: ID
}

export const utilitiesAPI = utilitiesWithTags.injectEndpoints({
    endpoints: build => ({
        fetchUtilities: build.query<Utility.List, SearchParams>({
            query: params => ({
                url: '/product_utility/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Utility'],
        }),
        createUtilities: build.mutation<unknown, Utility.DTOUpload[]>({
            query: data => ({
                url: '/product_utility/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Utility'],
        }),
        updateUtility: build.mutation<unknown, Utility.DTOUpload>({
            query: data => ({
                url: `/product_utility/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Utility'],
        }),
        deleteUtility: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_utility/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Utility'],
        }),
    }),
})

export const {
    useFetchUtilitiesQuery,
    useCreateUtilitiesMutation,
    useUpdateUtilityMutation,
    useDeleteUtilityMutation,
} = utilitiesAPI
