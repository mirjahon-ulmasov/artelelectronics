import { UploadFile } from 'antd'
import { ID, Language } from '../others/api'

// -------------- Product Variant --------------
export declare namespace ProductVariant {
    type List = DTO[]
    interface DTOLocal {
        id?: ID
        product: ID
        file: UploadFile[]
        items: VariantItem[]
    }

    interface DTOUpload extends Omit<DTOLocal, 'uuid' | 'file'> {
        file: ID
    }

    interface DTO {
        id: ID
        slug: string
        brand: ID
        category: ID
        product: ID
        color: ID
        properties: ID[]
        sap_code: string
        is_recommended: boolean
        is_new: boolean
        is_hot: boolean
        languages: Language[]
        is_active?: boolean
    }

    interface VariantItem {
        uuid: string
        brand: ID
        category: ID
        product: ID
        color: ID
        properties: ID[]
        sap_code: string
        is_recommended: boolean
        is_new: boolean
        is_hot: boolean
    }
}
