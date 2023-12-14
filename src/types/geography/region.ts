import { ID, Language } from '../others/api'

// -------------- Region --------------
export declare namespace Region {
    type List = DTO[]

    interface DTO {
        id: ID
        country: ID
        languages: Language[]
        is_active?: boolean
    }

    interface DTOLocal extends Omit<DTO, 'id'> {
        id?: ID
        country: ID
    }
}
