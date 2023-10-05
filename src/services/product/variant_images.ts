import { ID } from 'types/api'
import { api } from '../auth/baseQuery'
import { VariantImage } from 'types/product'

const productVariantImageWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductVariantImage'],
})

interface SearchParams {
    variant: ID
}

export const productVariantImageAPI = productVariantImageWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductVariantImages: build.query<VariantImage.List, SearchParams>({
            query: () => ({
                url: '/product_variant_image/admin_view/',
                method: 'GET',
            }),
            providesTags: () => ['ProductVariantImage'],
        }),
        createProductVariantImage: build.mutation<unknown, VariantImage.DTOUpload>({
            query: data => ({
                url: '/product_variant_image/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductVariantImage'],
        }),
        createProductVariantImages: build.mutation<unknown, VariantImage.DTOUpload[]>({
            query: data => ({
                url: '/product_variant_image/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductVariantImage'],
        }),
        updateProductVariantImage: build.mutation<unknown, VariantImage.DTOUpload>({
            query: data => ({
                url: `/product_variant_image/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['ProductVariantImage'],
        }),
        deleteProductVariantImage: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_variant_image/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductVariantImage'],
        }),
    }),
})

export const {
    useFetchProductVariantImagesQuery,
    useCreateProductVariantImageMutation,
    useCreateProductVariantImagesMutation,
    useUpdateProductVariantImageMutation,
    useDeleteProductVariantImageMutation
} = productVariantImageAPI
