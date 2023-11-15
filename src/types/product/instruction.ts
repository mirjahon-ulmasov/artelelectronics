import { UploadFile } from "antd"
import { ID, Language } from "../others/api"

// -------------- Instruction --------------
export declare namespace Instruction {
    type List = DTO[]

    interface DTO {
        id: ID
        file: File
        image: File
        is_active: boolean
        languages: EXLanguage[]
    }

    interface DTOLocal {
        id?: ID
        file: UploadFile[]
        image: UploadFile[]
        languages: EXLanguage[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'file' | 'image'> {
        file: ID
        image: ID
        product: ID
    }

    interface EXLanguage extends Language {
        description: string
    }
}