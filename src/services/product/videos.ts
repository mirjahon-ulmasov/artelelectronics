import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'
import { ProductVideo } from 'types/product/video'

const prodVideosWithTags = api.enhanceEndpoints({
    addTagTypes: ['ProductVideo'],
})

interface SearchParams {
    product: ID
}

export const prodVideosAPI = prodVideosWithTags.injectEndpoints({
    endpoints: build => ({
        fetchProductVideos: build.query<ProductVideo.List, SearchParams>({
            query: params => ({
                url: '/product_video/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['ProductVideo'],
        }),
        fetchProductVideo: build.query<ProductVideo.DTO, ID>({
            query: id => ({
                url: `/product_video/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['ProductVideo'],
        }),
        createProductVideo: build.mutation<unknown, ProductVideo.DTOUpload>({
            query: data => ({
                url: '/product_video/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['ProductVideo'],
        }),
        deleteProductVideo: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_video/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ProductVideo'],
        }),
    }),
})

export const {
    useFetchProductVideoQuery,
    useFetchProductVideosQuery,
    useCreateProductVideoMutation,
    useDeleteProductVideoMutation
} = prodVideosAPI
