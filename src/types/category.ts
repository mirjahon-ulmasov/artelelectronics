import { File, ID } from './api'

// -------------- Category --------------
export declare namespace Category {
    type List = DTO[]

    interface DTOCreation {
        id?: ID
        title: string
        parent: ID | null 
        image: ID
        secondary_file: ID
        custom_order: number
    }

    interface DTO {
        id: ID
        title: string
        image: File
        secondary_file: File
        parent: ParentCategory | null
        custom_order: number
        is_active: boolean
    }

    interface ParentCategory {
        id: ID
        title: string
    }
}