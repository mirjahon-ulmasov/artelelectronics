import { UploadFile } from 'antd'
import { File, ID } from '../others/api'

// -------------- Brand --------------
export declare namespace Brand {
    type List = DTO[]

    interface DTO {
        id: ID
        title: string
        image: File
        secondary_image: File
        third_image: File
        custom_order: number
        is_active: boolean
    }

    interface DTOLocal {
        id?: ID
        title: string
        image: UploadFile[]
        secondary_image: UploadFile[]
        third_image: UploadFile[]
        custom_order: number
    }

    interface DTOUpload extends Omit<DTOLocal, 'image' | 'secondary_image' | 'third_image'> {
        image: ID
        secondary_image: ID
        third_image: ID
    }
}
