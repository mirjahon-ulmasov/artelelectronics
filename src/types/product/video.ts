import { UploadFile } from "antd"
import { Color } from "../filters/color"
import { File, ID } from "../others/api"
import { Product } from "./product"

// -------------- ProductVideo --------------
export declare namespace ProductVideo {
    type List = DTO[]

    interface DTO {
        id: ID
        product: Product.DTO
        color: Color.DTOWithoutLanguages
        video: File
    }

    interface DTOLocal {
        id?: ID
        product: ID
        color: ID
        video: UploadFile[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'video'> {
        video: ID
    }
}