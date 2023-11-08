import { News } from 'types/others/news'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const newsWithTags = api.enhanceEndpoints({
    addTagTypes: ['News'],
})

interface SearchParams {
    is_active?: boolean
}

export const newsAPI = newsWithTags.injectEndpoints({
    endpoints: build => ({
        fetchNewsList: build.query<News.List, SearchParams>({
            query: () => ({
                url: '/news/admin_view/',
                method: 'GET',
            }),
            providesTags: () => ['News'],
        }),
        fetchNews: build.query<News.DTO, ID>({
            query: id => ({
                url: `/news/${id}/`,
                method: 'GET',
            }),
            providesTags: () => ['News'],
        }),
        createNews: build.mutation<unknown, News.DTOUpload>({
            query: data => ({
                url: '/news/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['News'],
        }),
        updateNews: build.mutation<unknown, News.DTOUpload>({
            query: data => ({
                url: `/news/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['News'],
        }),
        deleteNews: build.mutation<unknown, ID>({
            query: id => ({
                url: `/news/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['News'],
        }),
        activateNews: build.mutation<unknown, ID>({
            query: id => ({
                url: `/news/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['News'],
        }),
        publishNews: build.mutation<unknown, { id: ID, is_published: boolean }>({
            query: data => ({
                url: `/news/${data.id}/publish/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['News'],
        }),
    }),
})

export const {
    useFetchNewsListQuery,
    useFetchNewsQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
    useActivateNewsMutation,
    usePublishNewsMutation
} = newsAPI
