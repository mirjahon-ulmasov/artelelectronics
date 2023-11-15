import { File, ID, Language } from '../others/api'
import { Variant } from './variant'
import { Advantage } from './advantage'

// -------------- Product --------------
export declare namespace Product {
    type List = DTO[]

    interface DTO {
        id: ID
        brand: Brand
        category: Category
        dynamic_view?: File
        languages: ExLanguage[]
        variants: Variant.List
        advantages: Advantage.List
        is_published: boolean
        is_active?: boolean
    }

    interface DTOUpload {
        id?: ID
        brand: ID
        category: ID
        category_type: ID
        languages: ExLanguage[]
    }

    interface Category {
        id: ID
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