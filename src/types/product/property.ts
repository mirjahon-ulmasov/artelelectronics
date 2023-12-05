import { ID, Language } from '../others/api'
import { Color } from '../filters/color'

// -------------- Product Property --------------
export declare namespace ProductProperty {
    type List = DTO[]

    interface DTOUpload {
        id?: ID
        product: ID
        languages: Language[]
        items: {
            uuid?: string
            languages: Language[]
        }[]
    }

    interface DTOImport {
        product: ID
        properties: {
            property: ID
            items: ID[]
        }[]
    }

    interface DTO extends Omit<DTOUpload, 'id' | 'items'> {
        id: ID
        items: {
            id: ID
            languages: Language[]
        }[]
    }
}

export declare namespace ProductColor {
    type List = DTO[]

    interface DTOUpload {
        id?: ID
        product: ID
        colors: ID[]
    }

    interface DTO {
        id: ID
        product: {
            id: ID
            title: string
        }
        color: Color.DTOWithoutLanguages
    }
}
