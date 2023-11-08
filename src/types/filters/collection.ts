import { File, ID } from '../others/api'

// -------------- Collection --------------
export declare namespace Collection {
    type List = DTO[]

    interface DTOCreation {
        id?: ID
        title: string
        image: ID
        categories: CategoryCreation[]
    }

    interface CategoryCreation {
        category: ID
    }
    
    interface DTO {
        id: ID
        title: string
        image: File
        is_active: boolean
        categories: Category[]
    }
    
    interface Category {
        id: ID
        title: string
        is_active: boolean
    }
}
