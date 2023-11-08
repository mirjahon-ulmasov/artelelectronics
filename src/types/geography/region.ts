import { ID, LANGUAGE } from '../others/api'

// -------------- Region --------------
export declare namespace Region {
    type List = DTO[]

    interface DTO {
        id: ID
        languages: Language[]
        is_active?: boolean
    }

    interface DTOCreation extends Omit<DTO, 'id'> {
        id?: ID
        country: ID
    }

    interface Language {
        id?: ID
        title: string
        language: LANGUAGE
        is_active?: boolean
    }
}
