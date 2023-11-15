import { UploadFile } from 'antd'
import { File, ID, Language } from '../others/api'

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

    interface DTOLocal extends Omit<DTO, 'id' | 'image'> {
        id?: ID
        image: UploadFile[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'image'> {
        image: ID
    }
}
