import { Country } from 'types/geography/country'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const countryWithTags = api.enhanceEndpoints({
    addTagTypes: ['Country'],
})

interface SearchParams {
    is_active?: boolean
}

export const countryAPI = countryWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCountries: build.query<Country.List, SearchParams>({
            query: () => ({
                url: '/country/admin_view/',
                method: 'GET',
            }),
            providesTags: () => ['Country'],
        }),
        fetchCountry: build.query<Country.DTO, ID>({
            query: id => ({
                url: `/country/${id}/admin_detail_view/`,
                method: 'GET',
            }),
            providesTags: () => ['Country'],
        }),
        createCountry: build.mutation<unknown, Country.DTOUpload>({
            query: data => ({
                url: '/country/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Country'],
        }),
        updateCountry: build.mutation<unknown, Country.DTOUpload>({
            query: data => ({
                url: `/country/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Country'],
        }),
        deleteCountry: build.mutation<unknown, ID>({
            query: id => ({
                url: `/country/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Country'],
        }),
        activateCountry: build.mutation<unknown, ID>({
            query: id => ({
                url: `/country/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Country'],
        }),
    }),
})

export const {
    useFetchCountriesQuery,
    useFetchCountryQuery,
    useCreateCountryMutation,
    useUpdateCountryMutation,
    useDeleteCountryMutation,
    useActivateCountryMutation,
} = countryAPI
