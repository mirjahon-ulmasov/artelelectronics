import { UploadFile } from 'antd'
import { BucketFile, File, ID, LANGUAGE, Language } from '../others/api'

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

    interface Metadata {
        id: ID
        key: string
        value: string
        is_active: boolean
    }
    
    interface ExLanguage extends Language {
        secondary_title: string
    }

    interface View360 {
        id: ID
        dynamic_file: ID
    }

}

// -------------- Variant --------------
export declare namespace Variant {
    type List = DTO[]

    interface DTOLocal {
        id?: ID
        color: ID
        default_image: UploadFile[]
        is_default: boolean
        uuid: string
    }

    interface DTOUpload {
        id?: ID
        color: ID
        product: ID
        default_image: ID
        is_default: boolean
    }

    interface DTO {
        id: ID
        color: Color
        default_image: File
        is_default: boolean
        is_active?: boolean
        product_images?: BucketFile[]
    }

    interface Color {
        id: ID
        image: File
        code: string
        title: string
    }
}

// -------------- VariantImage --------------
export declare namespace VariantImage {
    type List = DTO[]

    interface DTOLocal {
        id?: ID
        variant: ID
        images: UploadFile[]
        uuid: string
    }

    interface DTOUpload {
        id?: ID
        variant: ID
        image: ID
    }

    interface DTO {
        id: number
        variant: number
        image: File
        is_active: boolean
    }
}

// -------------- Advantage --------------
export declare namespace Advantage {
    type List = DTO[]

    interface DTOLocal {
        id?: ID
        logo: UploadFile[]
        image: UploadFile[]
        uuid: string
        languages: Language[]
    }

    interface DTOUpload {
        id?: ID
        product: ID
        logo: ID
        image: ID
        languages: Language[]
    }

    interface DTO {
        id: ID
        logo: File
        image: File
        is_active: boolean
        languages: Language[]
    }

    interface Language {
        title: string
        description: string
        language: LANGUAGE
    }
}

// -------------- Characteristic --------------
export declare namespace Characteristic {
    type List = DTO[]

    interface DTOUpload {
        id?: ID
        product: ID
        title: string
        items: ItemCreation[]
    }

    interface UploadExcel {
        product: ID
        file: ID
    }

    interface DTO {
        id: ID
        title: string
        is_active: boolean
        items: Item[]
    }

    interface ItemCreation {
        id?: ID
        key: string
        value: string
        is_primary: boolean
    }

    interface Item extends ItemCreation {
        id: ID
        is_active: boolean
    }
}

// -------------- Instruction --------------
export declare namespace Instruction {
    type List = DTO[]

    interface DTOLocal {
        id?: ID
        file: UploadFile[]
        image: UploadFile[]
        languages: Language[]
    }

    interface DTOUpload {
        id?: ID
        product: ID
        file: ID
        image: ID
        languages: Language[]
    }

    interface DTO {
        id: ID
        file: File
        image: File
        is_active: boolean
        languages: Language[]
    }

    interface Language {
        title: string
        description: string
        language: LANGUAGE
    }
}

// -------------- Utility --------------
export declare namespace Utility {
    type List = DTO[]
    interface DTOLocal {
        id?: ID
        color: ID
        code: string
        uuid: string
        utility_item: ID
    }

    interface DTOUpload {
        id?: ID
        product: ID
        color: ID
        code: string
        utility_item: ID
    }

    interface DTO {
        id: ID
        product: ID
        color: ID
        code: string
        utility_item: ID
        is_active: boolean
    }
}
