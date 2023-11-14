import { UploadFile } from 'antd'
import { File, ID, Language } from '../others/api'

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
}
