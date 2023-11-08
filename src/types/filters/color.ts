import { UploadFile } from 'antd'
import { File, ID, LANGUAGE } from '../others/api'

// -------------- Color --------------
export declare namespace Color {
    type List = DTO[]

    interface DTO {
        id: ID
        image: File
        code: string
        languages: Language[]
        is_active?: boolean
    }

    interface DTOCreation extends Omit<DTO, 'id' | 'image'> {
        id?: ID
        image: UploadFile[]
    }

    interface DTOUpload extends Omit<DTOCreation, 'image'> {
        image: ID
    }

    interface Language {
        title: string
        language: LANGUAGE
        is_active?: boolean
    }
}
