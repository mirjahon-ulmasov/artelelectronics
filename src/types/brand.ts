import { File, ID } from './api'

// -------------- Brand --------------
export declare namespace Brand {
    type List = DTO[]

    interface DTOCreation {
        id?: ID
        title: string
        image: number
        secondary_image: number
        custom_order: number
    }

    interface DTO {
        id: ID
        title: string
        image: File
        secondary_image: File
        custom_order: number
        is_active: boolean
    }
}
