import { ProductColor } from 'types/product/property'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const prodColorsWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductColor'],
})

interface SearchParams {
    product: ID
}

export const prodColorsAPI = prodColorsWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductColors: build.query<ProductColor.List, SearchParams>({
            query: params => ({
                url: '/product_color/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductColor'],
        }),
        fetchProductColor: build.query<ProductColor.DTO, ID>({
            query: id => ({
                url: `/product_color/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['ProductColor'],
        }),
        createProductColor: build.mutation<unknown, ProductColor.DTOUpload>({
            query: data => ({
                url: '/product_color/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductColor'],
        }),
        deleteProductColor: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_color/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductColor'],
        }),
    }),
})

export const {
    useFetchProductColorQuery,
    useFetchProductColorsQuery,
    useCreateProductColorMutation,
    useDeleteProductColorMutation,
} = prodColorsAPI
