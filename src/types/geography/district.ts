import { ID, Language } from '../others/api'

// -------------- District --------------
export declare namespace District {
    type List = DTO[]

    interface DTO {
        id: ID
        region: ID
        latitude: string
        longitude: string
        languages: Language[]
        is_active?: boolean
    }

    interface DTOLocal extends Omit<DTO, 'id'> {
        id?: ID
        region: ID
    }
}
