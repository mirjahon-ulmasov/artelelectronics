import { ProductImage } from 'types/product/image'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const prodImagesWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductImage'],
})

interface SearchParams {
    product: ID
}

export const prodImagesAPI = prodImagesWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductImages: build.query<ProductImage.List, SearchParams>({
            query: params => ({
                url: '/product_gallery/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductImage'],
        }),
        fetchProductImage: build.query<ProductImage.DTO, ID>({
            query: id => ({
                url: `/product_gallery/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['ProductImage'],
        }),
        createProductImage: build.mutation<unknown, ProductImage.DTOUpload>({
            query: data => ({
                url: '/product_gallery/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductImage'],
        }),
        createProductImages: build.mutation<unknown, ProductImage.DTOUploadMultiple>({
            query: data => ({
                url: '/product_gallery/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductImage'],
        }),
        deleteProductImage: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_gallery/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductImage'],
        }),
    }),
})

export const {
    useFetchProductImageQuery,
    useFetchProductImagesQuery,
    useCreateProductImageMutation,
    useCreateProductImagesMutation,
    useDeleteProductImageMutation
} = prodImagesAPI
