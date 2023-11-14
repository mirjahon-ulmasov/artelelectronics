import { ProductUtility } from 'types/product/utility'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const utilitiesWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductUtility'],
})

interface SearchParams {
    product: ID
}

export const utilitiesAPI = utilitiesWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductUtilities: build.query<ProductUtility.List, SearchParams>({
            query: params => ({
                url: '/product_utility/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductUtility'],
        }),
        createProductUtility: build.mutation<unknown, ProductUtility.DTOUpload>({
            query: data => ({
                url: '/product_utility/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductUtility'],
        }),
        updateProductUtility: build.mutation<unknown, ProductUtility.DTOUpload>({
            query: data => ({
                url: `/product_utility/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['ProductUtility'],
        }),
        deleteProductUtility: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_utility/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductUtility'],
        }),
    }),
})

export const {
    useFetchProductUtilitiesQuery,
    useCreateProductUtilityMutation,
    useUpdateProductUtilityMutation,
    useDeleteProductUtilityMutation,
} = utilitiesAPI
