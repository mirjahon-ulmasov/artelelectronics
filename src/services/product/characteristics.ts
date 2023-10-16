import { ID } from 'types/api'
import { api } from '../auth/baseQuery'
import { Characteristic } from 'types/product'

const characteristicsWithTags = api.enhanceEndpoints({
    addTagTypes: ['Characteristic'],
})

interface SearchParams {
    product: ID
}

export const characteristicsAPI = characteristicsWithTags.injectEndpoints({
    endpoints: build => ({
        fetchCharacteristics: build.query<Characteristic.List, SearchParams>({
            query: params => ({
                url: '/product_characteristic/admin_view/',
                method: 'GET',
                params
            }),
            providesTags: () => ['Characteristic'],
        }),
        createCharacteristic: build.mutation<unknown, Characteristic.DTOUpload>({
            query: data => ({
                url: '/product_characteristic/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Characteristic'],
        }),
        createCharacteristics: build.mutation<unknown, Characteristic.DTOUpload[]>({
            query: data => ({
                url: '/product_characteristic/multiple_create/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Characteristic'],
        }),
        uploadExcelCharacteristics: build.mutation<unknown, Characteristic.UploadExcel>({
            query: data => ({
                url: '/product_characteristic/upload_excel/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Characteristic'],
        }),
        updateCharacteristic: build.mutation<unknown, Characteristic.DTOUpload>({
            query: data => ({
                url: `/product_characteristic/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Characteristic'],
        }),
        deleteCharacteristic: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_characteristic/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Characteristic'],
        }),
        activateCharacteristic: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_characteristic/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Characteristic'],
        }),
    }),
})

export const {
    useFetchCharacteristicsQuery,
    useCreateCharacteristicMutation,
    useCreateCharacteristicsMutation,
    useUpdateCharacteristicMutation,
    useDeleteCharacteristicMutation,
    useActivateCharacteristicMutation,
    useUploadExcelCharacteristicsMutation
} = characteristicsAPI
