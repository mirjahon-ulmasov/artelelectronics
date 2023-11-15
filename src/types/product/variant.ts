import { UploadFile } from "antd"
import { BucketFile, File, ID } from "../others/api"

// -------------- Variant --------------
export declare namespace Variant {
    type List = DTO[]

    interface DTO {
        id: ID
        color: Color
        default_image: File
        is_default: boolean
        product_images?: BucketFile[]
        is_active?: boolean
    }

    interface DTOLocal {
        id?: ID
        color: ID
        default_image: UploadFile[]
        is_default: boolean
        uuid: string
    }

    interface DTOUpload extends Omit<DTOLocal, 'uuid' | 'default_image'> {
        product: ID
        default_image: ID
    }

    interface Color {
        id: ID
        image: File
        code: string
        title: string
    }
}