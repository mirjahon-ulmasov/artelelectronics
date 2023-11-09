import { Collection } from 'types/filters/collection'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const collectionWithTags = api.enhanceEndpoints({
    addTagTypes: ['Collection'],
})

export const collectionAPI = collectionWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCollections: build.query<Collection.List, void>({
            query: () => ({
                url: '/collection/admin_view/',
                method: 'GET',
            }),
            providesTags: () => ['Collection'],
        }),
        createCollection: build.mutation<unknown, Collection.DTOUpload>({
            query: data => ({
                url: '/collection/create_with_category/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Collection'],
        }),
        updateCollection: build.mutation<unknown, Collection.DTOUpload>({
            query: data => ({
                url: `/collection/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Collection'],
        }),
        deleteCollection: build.mutation<unknown, ID>({
            query: id => ({
                url: `/collection/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Collection'],
        }),
        activateCollection: build.mutation<unknown, ID>({
            query: id => ({
                url: `/collection/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Collection'],
        }),
    }),
})

export const {
    useFetchCollectionsQuery,
    useCreateCollectionMutation,
    useUpdateCollectionMutation,
    useDeleteCollectionMutation,
    useActivateCollectionMutation
} = collectionAPI
