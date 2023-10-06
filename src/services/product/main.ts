import { ID } from 'types/api'
import { api } from '../auth/baseQuery'
import { Product } from 'types/product'

const productWithTags = api.enhanceEndpoints({
    addTagTypes: ['Product'],
})

interface SearchParams {
    category?: ID
    subcategory?: ID
    is_published?: boolean
}

export const productAPI = productWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProducts: build.query<Product.List, SearchParams>({
            query: params => ({
                url: '/product/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Product'],
        }),
        fetchProduct: build.query<Product.DTO, ID>({
            query: id => `/product/${id}/admin_detail_view/`,
            providesTags: () => ['Product'],
        }),
        createProduct: build.mutation<Product.DTO, Product.DTOUpload>({
            query: data => ({
                url: '/product/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: build.mutation<Product.DTO, Product.DTOUpload>({
            query: data => ({
                url: `/product/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        add360View: build.mutation<unknown, Product.View360>({
            query: data => ({
                url: `/product/${data.id}/set_dynamic_file/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Product'],
        }),
        deleteProduct: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
})

export const {
    useFetchProductQuery,
    useFetchProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useAdd360ViewMutation,
    useDeleteProductMutation
} = productAPI
