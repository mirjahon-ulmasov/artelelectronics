import { File, ID } from './api'

// -------------- Color --------------
export declare namespace Color {
    type List = DTO[]

    interface DTOCreation {
        id?: ID
        image: ID
        code: string
    }

    interface DTO {
        id: ID
        image: File
        code:  string
        is_active: boolean
    }
}