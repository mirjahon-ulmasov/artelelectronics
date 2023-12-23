import { File, ID, Language } from '../others/api'
import { Advantage } from './advantage'

// -------------- Product --------------
export declare namespace Product {
    type List = DTO[]

    interface DTO {
        id: ID
        slug: string
        brand: Brand
        category: Category
        external_url: string
        dynamic_view?: File
        languages: ExLanguage[]
        advantages: Advantage.List
        is_published?: boolean
        is_active?: boolean
    }

    interface DTOUpload {
        id?: ID
        brand: ID
        category: ID
        category_type: ID
        external_url: string
        languages: ExLanguage[]
    }

    interface Category {
        id: ID
        slug: string
        title: string
        is_active?: boolean
    }

    interface Brand extends Category {
        id: ID
        image: File
        title: string
        is_active?: boolean
    }

    interface ExLanguage extends Language {
        secondary_title: string
    }

    interface View360 {
        id: ID
        dynamic_file: ID
    }

}