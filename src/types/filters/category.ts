import { UploadFile } from 'antd'
import { File, ID, Language } from '../others/api'

// -------------- Category --------------
export declare namespace Category {
    type List = DTO[]

    interface DTO {
        id: ID
        parent: ParentCategory | null
        image: File
        secondary_file: File
        custom_order: number
        languages: Language[]
        is_active: boolean
    }

    interface DTOCreation {
        id?: ID
        parent: ID | null
        image: UploadFile[]
        secondary_file: UploadFile[]
        custom_order: number
        languages: Language[]
    }

    interface DTOUpload extends Omit<DTOCreation, 'image' | 'secondary_file'> {
        image: ID
        secondary_file: ID
    }

    interface ParentCategory {
        id: ID
        title: string
    }

    interface Utility {
        id: ID
        title: string
        items: { id: ID; title: string }[]
    }
}

export declare namespace CategoryType {
    type List = DTO[]

    interface DTO {
        id?: ID
        category: ID
        languages: Language[]
        is_active?: boolean
    }
}

export declare namespace CategoryUtility {
    type List = DTO[]

    interface DTO {
        id?: ID
        category: ID
        is_primary: boolean
        languages: Language[]
        items: UtilityItem[]
    }
    
    interface UtilityItem {
        id?: ID
        languages: Language[]
    }
}

