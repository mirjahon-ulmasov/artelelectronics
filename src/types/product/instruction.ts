import { UploadFile } from 'antd'
import { ID, Language } from '../others/api'

// -------------- Instruction --------------
export declare namespace Instruction {
    type List = DTO[]

    interface DTO {
        id: ID
        file: File
        is_active: boolean
        languages: EXLanguage[]
    }

    interface DTOLocal {
        id?: ID
        file: UploadFile[]
        languages: EXLanguage[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'file'> {
        file: ID
        product: ID
    }

    interface EXLanguage extends Language {
        description: string
    }
}

export declare namespace InstructionImage {

    interface DTOLocal {
        images: ImageLocal[]
    }
    interface DTOUpload extends Omit<DTOLocal, 'images'> {
        product_instruction: ID
        images: ImageUpload[]
    }

    interface ImageLocal {
        color: ID
        image: UploadFile[]
    }

    interface ImageUpload extends Omit<ImageLocal, 'image'> { 
        image: ID
    }
}
