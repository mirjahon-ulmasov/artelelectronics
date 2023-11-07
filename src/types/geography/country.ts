import { UploadFile } from 'antd'
import { File, ID } from '../api'
import { LANGUAGE } from '..'

// -------------- Country --------------
export declare namespace Country {
    type List = DTO[]

    interface DTO {
        id: ID
        IP: string
        flag: File
        country_code: string
        languages: Language[]
        is_active?: boolean
    }

    interface DTOCreation extends Omit<DTO, 'id' | 'flag'> {
        id?: ID
        flag: UploadFile[]
    }

    interface DTOUpload extends Omit<DTOCreation, 'flag'> {
        flag: ID
    }

    interface Language {
        id?: ID
        title: string
        language: LANGUAGE
        is_active?: boolean
    }
}
