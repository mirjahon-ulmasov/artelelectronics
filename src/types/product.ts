import { UploadFile } from 'antd'
import { BucketFile, File, ID } from './api'

// -------------- Product --------------
export declare namespace Product {
    type List = DTO[]

    interface DTOCreation {
        id?: ID
        title: string
        category: ID
        subcategory: ID
        brand: ID
        default_image: ID
        is_recommended: boolean
        is_hot: boolean
        is_new: boolean
    }

    interface DTO {
        id: ID
        title: string
        brand?: Brand
        category?: Category
        subcategory?: Category
        default_image?: File
        dynamic_view?: File
        variants?: Variant.List
        metadata?: Metadata[]
        advantages?: Advantage[]
        is_recommended?: boolean
        is_new?: boolean
        is_hot?: boolean
        is_active: boolean
        is_published: boolean
    }

    interface View360 {
        id: ID
        dynamic_file: ID
    }

    interface Category {
        id: ID
        title: string
        is_active: boolean
    }

    interface Brand extends Category {
        image: File
    }

    interface Metadata {
        id: ID
        key: string
        value: string
        is_active: boolean
    }

    interface Advantage {
        id: ID
        title: string
        is_active: boolean
        logo: File
        image: File
    }
}

export declare namespace Variant {
    type List = DTO[]

    interface DTOLocal {
        id?: ID
        color: ID
        product: ID
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
        is_active: boolean
        product_images?: BucketFile[]
    }

    interface Color {
        id: ID
        image: File
        code: string
        title: string
    }
}

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
