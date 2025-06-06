import { UploadFile } from 'antd'
import { File, ID, Language } from '../others/api'

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

    interface DTOLocal extends Omit<DTO, 'id' | 'image' | 'categories'> {
        id?: ID
        image: UploadFile[]
        categories: ID[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'image' | 'categories'> {
        image: ID
        categories: { category: ID }[]
    }

    interface Category {
        id: ID
        languages: Language[]
        is_active: boolean
    }
}
