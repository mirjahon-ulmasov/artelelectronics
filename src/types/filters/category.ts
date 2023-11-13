import { UploadFile } from 'antd'
import { File, ID, LANGUAGE } from '../others/api'

// -------------- Category --------------
export declare namespace Category {
    type List = DTO[]

    interface DTO {
        id: ID
        parent: ParentCategory | null
        image: File
        secondary_file: File
        custom_order: number
        languages: Language[]
        is_active: boolean
    }

    interface DTOCreation {
        id?: ID
        parent: ID | null
        image: UploadFile[]
        secondary_file: UploadFile[]
        custom_order: number
        languages: Language[]
    }

    interface DTOUpload extends Omit<DTOCreation, 'image' | 'secondary_file'> {
        image: ID
        secondary_file: ID
    }

    interface ParentCategory {
        id: ID
        title: string
    }

    interface Utility {
        id: ID
        title: string
        items: { id: ID; title: string }[]
    }

    interface Language {
        title: string
        language: LANGUAGE
        is_active?: boolean
    }
}

export declare namespace CategoryType {
    type List = DTO[]

    interface DTO {
        id?: ID
        category: ID
        languages: Language[]
        is_active?: boolean
    }

    interface Language {
        title: string
        language: LANGUAGE
        is_active?: boolean
    }
}
