import { District } from 'types/geography/district'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const districtWithTags = api.enhanceEndpoints({
    addTagTypes: ['District'],
})

interface SearchParams {
    is_active?: boolean
    region: ID
}

export const districtAPI = districtWithTags.injectEndpoints({
    endpoints: build => ({
        fetchDistricts: build.query<District.List, SearchParams>({
            query: params => ({
                url: '/district/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['District'],
        }),
        fetchDistrict: build.query<District.DTO, ID>({
            query: id => ({
                url: `/district/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['District'],
        }),
        createDistrict: build.mutation<unknown, District.DTOCreation>({
            query: data => ({
                url: '/district/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['District'],
        }),
        updateDistrict: build.mutation<unknown, District.DTOCreation>({
            query: data => ({
                url: `/district/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['District'],
        }),
        deleteDistrict: build.mutation<unknown, ID>({
            query: id => ({
                url: `/district/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['District'],
        }),
        activateDistrict: build.mutation<unknown, ID>({
            query: id => ({
                url: `/district/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['District'],
        }),
    }),
})

export const {
    useFetchDistrictsQuery,
    useFetchDistrictQuery,
    useCreateDistrictMutation,
    useUpdateDistrictMutation,
    useDeleteDistrictMutation,
    useActivateDistrictMutation,
} = districtAPI
