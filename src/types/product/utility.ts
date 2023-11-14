import { UploadFile } from 'antd'
import { ID, Language } from '../others/api'

// -------------- Product Utility --------------
export declare namespace ProductUtility {
    type List = DTO[]
    interface DTOLocal {
        id?: ID
        brand: ID
        product: ID
        is_default: boolean
        file: UploadFile[]
        items: UtilityItem[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'uuid' | 'file'> {
        file: ID
    }

    interface DTO {
        id: ID
        brand: ID
        category: ID
        product: ID
        primary_utility: ID
        secondary_utilities: ID[]
        variant: ID
        code: string
        is_recommended: boolean
        is_new: boolean
        is_hot: boolean
        languages: Language[]
        is_active?: boolean
    }

    interface UtilityItem {
        uuid: string
        brand: ID
        category: ID
        product: ID
        variant: ID
        primary_utility: ID
        secondary_utilities: ID[]
        code: string
        is_recommended: boolean
        is_new: boolean
        is_hot: boolean
    }
}
