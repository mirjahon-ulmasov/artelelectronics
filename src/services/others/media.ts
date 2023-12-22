import { File as BucketFile } from 'types/others/api'
import { api } from '../auth/baseQuery'

const mediaWithTags = api.enhanceEndpoints({
    addTagTypes: ['Store'],
})

export const mediaAPI = mediaWithTags.injectEndpoints({
    endpoints: build => ({
        uploadMedia: build.mutation<BucketFile, FormData>({
            query: data => ({
                url: '/media_file/',
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Store'],
        }),
    }),
})

export const { useUploadMediaMutation } = mediaAPI
