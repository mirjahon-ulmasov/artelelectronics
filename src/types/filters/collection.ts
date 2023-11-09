import { UploadFile } from 'antd'
import { File, ID, LANGUAGE } from '../others/api'

// -------------- Collection --------------
export declare namespace Collection {
    type List = DTO[]

    interface DTO {
        id: ID
        image: File
        languages: Language[]
        categories: Category[]
        is_active?: boolean
    }

    interface DTOCreation extends Omit<DTO, 'id' | 'image' | 'categories'> {
        id?: ID
        image: UploadFile[]
        categories: { category: ID }[]
    }

    interface DTOUpload extends Omit<DTOCreation, 'image'> {
        image: ID
    }

    interface Category {
        id: ID
        title: string
        is_active: boolean
    }

    interface Language {
        title: string
        language: LANGUAGE
        is_active?: boolean
    }
}
