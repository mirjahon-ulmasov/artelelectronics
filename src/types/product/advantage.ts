import { UploadFile } from "antd"
import { ID, Language } from "../others/api"

// -------------- Advantage --------------
export declare namespace Advantage {
    type List = DTO[]

    interface DTO {
        id: ID
        logo: File
        image: File
        is_active: boolean
        languages: EXLanguage[]
    }

    interface DTOLocal {
        id?: ID
        uuid: string
        logo: UploadFile[]
        image: UploadFile[]
        languages: EXLanguage[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'uuid' | 'logo' | 'image'> {
        logo: ID
        image: ID
        product: ID
    }

    interface EXLanguage extends Language {
        description: string
    }
}