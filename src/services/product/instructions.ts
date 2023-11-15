import { Instruction } from 'types/product/instruction'
import { ID } from 'types/others/api'
import { api } from '../auth/baseQuery'

const instructionsWithTags = api.enhanceEndpoints({
    addTagTypes: ['Instruction'],
})

interface SearchParams {
    product: ID
}

export const instructionsAPI = instructionsWithTags.injectEndpoints({
    endpoints: build => ({
        fetchInstructions: build.query<Instruction.List, SearchParams>({
            query: params => ({
                url: '/product_instruction/admin_view/',
                method: 'GET',
                params,
            }),
            providesTags: () => ['Instruction'],
        }),
        createInstruction: build.mutation<unknown, Instruction.DTOUpload>({
            query: data => ({
                url: '/product_instruction/',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Instruction'],
        }),
        updateInstruction: build.mutation<unknown, Instruction.DTOUpload>({
            query: data => ({
                url: `/product_instruction/${data.id}/`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Instruction'],
        }),
        deleteInstruction: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_instruction/${id}/`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Instruction'],
        }),
        activateInstruction: build.mutation<unknown, ID>({
            query: id => ({
                url: `/product_instruction/${id}/activate/`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Instruction'],
        }),
    }),
})

export const {
    useFetchInstructionsQuery,
    useCreateInstructionMutation,
    useUpdateInstructionMutation,
    useDeleteInstructionMutation,
    useActivateInstructionMutation,
} = instructionsAPI
