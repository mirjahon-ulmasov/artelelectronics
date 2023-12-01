import { ProductProperty } from 'types/product/property'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const productPropertyWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductProperty'],
})

interface SearchParams {
    product: ID
}

export const productPropertyAPI = productPropertyWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductProperties: build.query<ProductProperty.List, SearchParams>({
            query: params => ({
                url: '/product_property/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductProperty'],
        }),
        fetchProductProperty: build.query<ProductProperty.DTO, ID>({
            query: id => ({
                url: `/product_property/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['ProductProperty'],
        }),
        createProductProperty: build.mutation<unknown, ProductProperty.DTOUpload>({
            query: data => ({
                url: '/product_property/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductProperty'],
        }),
        importCategoryProperties: build.mutation<unknown, ProductProperty.DTOImport>({
            query: data => ({
                url: '/product_property/import_objects/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductProperty'],
        }),
        updateProductProperty: build.mutation<unknown, ProductProperty.DTOUpload>({
            query: data => ({
                url: `/product_property/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['ProductProperty'],
        }),
        deleteProductProperty: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_property/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductProperty'],
        }),
    }),
})

export const {
    useFetchProductPropertyQuery,
    useFetchProductPropertiesQuery,
    useCreateProductPropertyMutation,
    useImportCategoryPropertiesMutation,
    useUpdateProductPropertyMutation,
    useDeleteProductPropertyMutation,
} = productPropertyAPI
