import { ID } from 'types/api'
import { api } from '../auth/baseQuery'
import { Variant } from 'types/product'

const productVariantsWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductVariant'],
})

interface SearchParams {
    product: ID
}

export const productVariantsAPI = productVariantsWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductVariants: build.query<Variant.List, SearchParams>({
            query: params => ({
                url: '/product_variant/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductVariant'],
        }),
        createProductVariant: build.mutation<unknown, Variant.DTOUpload>({
            query: data => ({
                url: '/product_variant/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductVariant'],
        }),
        createProductVariants: build.mutation<unknown, Variant.DTOUpload[]>({
            query: data => ({
                url: '/product_variant/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductVariant'],
        }),
        updateProductVariant: build.mutation<unknown, Variant.DTOUpload>({
            query: data => ({
                url: `/product_variant/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['ProductVariant'],
        }),
        deleteProductVariant: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_variant/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductVariant'],
        }),
    }),
})

export const {
    useFetchProductVariantsQuery,
    useCreateProductVariantMutation,
    useCreateProductVariantsMutation,
    useUpdateProductVariantMutation,
    useDeleteProductVariantMutation
} = productVariantsAPI
