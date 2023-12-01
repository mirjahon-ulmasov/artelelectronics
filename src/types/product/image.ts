import { UploadFile } from "antd"
import { Color } from "../filters/color"
import { File, ID } from "../others/api"
import { Product } from "./product"

// -------------- ProductImage --------------
export declare namespace ProductImage {
    type List = DTO[]

    interface DTO {
        id: ID
        product: Product.DTO
        color: Color.DTOWithoutLanguages
        image: File
        is_default: boolean
    }

    // Product Main Image
    interface DTOLocal {
        id?: ID
        product: ID
        color: ID
        image: UploadFile[]
        is_default: boolean
    }

    interface DTOUpload extends Omit<DTOLocal, 'image'> {
        image: ID
    }

    // Product Detail Images
    interface DTOLocalMultiple {
        id?: ID
        product: ID
        color: ID
        images: UploadFile[]
    }

    interface DTOUploadMultiple extends Omit<DTOLocalMultiple, 'images'> {
        images: ID[]
    }
}