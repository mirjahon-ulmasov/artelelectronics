import { UploadFile } from "antd"
import { ID } from "../others/api"

// -------------- VariantImage --------------
export declare namespace VariantImage {
    type List = DTO[]

    interface DTO {
        id: number
        variant: number
        image: File
        is_active?: boolean
    }

    interface DTOLocal {
        id?: ID
        uuid: string
        variant: ID
        images: UploadFile[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'uuid' | 'images'> {
        image: ID
    }

}
