import { Product } from 'types/product/product'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const productWithTags = api.enhanceEndpoints({
    addTagTypes: ['Product'],
})

interface SearchParams {
    brand?: ID
    category?: ID
    subcategory?: ID
    is_published?: boolean
    is_active?: boolean
}

export const productAPI = productWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProducts: build.query<Product.List, SearchParams>({
            query: params => ({
                url: '/product/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => [{ type: 'Product', id: 'LIST' }],
        }),
        fetchProduct: build.query<Product.DTO, ID>({
            query: id => `/product/${id}/admin_detail_view/`,
            providesTags: () => [{ type: 'Product', id: 'DETAIL' }],
        }),
        createProduct: build.mutation<Product.DTO, Product.DTOUpload>({
            query: data => ({
                url: '/product/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: () => [{ type: 'Product', id: 'LIST' }],
        }),
        updateProduct: build.mutation<Product.DTO, Product.DTOUpload>({
            query: data => ({
                url: `/product/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: () => [{ type: 'Product', id: 'LIST' }],
        }),
        add360View: build.mutation<unknown, Product.View360>({
            query: data => ({
                url: `/product/${data.id}/set_dynamic_file/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: () => [{ type: 'Product', id: 'DETAIL' }],
        }),
        deleteProduct: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: () => [{ type: 'Product', id: 'LIST' }],
        }),
        activateProduct: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: () => [{ type: 'Product', id: 'LIST' }],
        }),
        publishProduct: build.mutation<unknown, { id: ID, is_published: boolean }>({
            query: data => ({
                url: `/product/${data.id}/publish/`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: () => [{ type: 'Product', id: 'LIST' }],
        }),
    }),
})

export const {
    useFetchProductQuery,
    useFetchProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useAdd360ViewMutation,
    useDeleteProductMutation,
    useActivateProductMutation,
    usePublishProductMutation
} = productAPI
