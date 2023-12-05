import { ProductVariant } from 'types/product/variant'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const productVariantsWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductVariant'],
})

interface SearchParams {
    product: ID
}

export const productVariantsAPI = productVariantsWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductVariants: build.query<ProductVariant.List, SearchParams>({
            query: params => ({
                url: '/product_variant/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductVariant'],
        }),
        fetchProductVariant: build.query<ProductVariant.DTO, ID>({
            query: id => ({
                url: `/product_variant/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['ProductVariant'],
        }),
        createProductVariants: build.mutation<unknown, ProductVariant.DTOUpload>({
            query: data => ({
                url: '/product_variant/multiple_create/',
                method: 'POST',
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
    useFetchProductVariantQuery,
    useCreateProductVariantsMutation,
    useDeleteProductVariantMutation
} = productVariantsAPI
