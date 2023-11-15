import { Region } from 'types/geography/region'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const regionWithTags = api.enhanceEndpoints({
    addTagTypes: ['Region'],
})

interface SearchParams {
    is_active?: boolean
    country?: ID
}

export const regionAPI = regionWithTags.injectEndpoints({
    endpoints: build => ({
        fetchRegions: build.query<Region.List, SearchParams>({
            query: params => ({
                url: '/region/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Region'],
        }),
        fetchRegion: build.query<Region.DTO, ID>({
            query: id => ({
                url: `/region/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['Region'],
        }),
        createRegion: build.mutation<unknown, Region.DTOLocal>({
            query: data => ({
                url: '/region/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Region'],
        }),
        updateRegion: build.mutation<unknown, Region.DTOLocal>({
            query: data => ({
                url: `/region/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Region'],
        }),
        deleteRegion: build.mutation<unknown, ID>({
            query: id => ({
                url: `/region/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Region'],
        }),
        activateRegion: build.mutation<unknown, ID>({
            query: id => ({
                url: `/region/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Region'],
        }),
    }),
})

export const {
    useFetchRegionsQuery,
    useFetchRegionQuery,
    useCreateRegionMutation,
    useUpdateRegionMutation,
    useDeleteRegionMutation,
    useActivateRegionMutation,
} = regionAPI
