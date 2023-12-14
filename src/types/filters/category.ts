import { UploadFile } from 'antd'
import { File, ID, Language } from '../others/api'
import { Color } from './color'

// -------------- Category --------------
export declare namespace Category {
    type List = DTO[]

    interface DTO {
        id: ID
        slug: string
        parent: null
        image: File
        secondary_file: File
        custom_order: number
        languages: Language[]
        is_active: boolean
    }

    interface DTOLocal {
        id?: ID
        parent: null
        image: UploadFile[]
        secondary_file: UploadFile[]
        custom_order: number
        languages: Language[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'image' | 'secondary_file'> {
        image: ID
        secondary_file: ID
    }
}

export declare namespace CategoryType {
    type List = DTO[]

    interface DTO {
        id?: ID
        category: ID
        languages: EXLanguage[]
        is_active?: boolean
    }

    interface EXLanguage extends Language {
        originalTitle?: string
    }
}

export declare namespace CategoryProperty {
    type List = DTO[]

    interface DTO {
        id?: ID
        category: ID
        languages: Language[]
        items: PropertyItem[]
    }
    
    interface PropertyItem {
        id?: ID
        languages: Language[]
    }
}

export declare namespace CategoryColor {
    type List = DTO[]

    interface DTO {
        id: ID
        category: {
            id: ID
            title: string
            slug: string
        }
        color: Color.DTOWithoutLanguages
    }
    
    interface DTOUpload {
        id?: ID
        category: ID
        colors: ID[]
    }
}
