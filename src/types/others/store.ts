import { UploadFile } from 'antd'
import { Dayjs } from 'dayjs'
import { BucketFile, File, ID, NullableExcept } from './api'

// -------------- Store --------------
export declare namespace Store {
    type List = DTO[]
    type NullableDTOCreation = NullableExcept<DTOCreation, 'timetable' | 'images' | 'default_image'>

    interface DTO {
        id: ID
        title: string
        latitude: string
        longitude: string
        address: string
        phone_number: string
        store_type: STORE
        default_image: File
        images: BucketFile[]
        timetable: TimeTable<string>[]
        is_active?: boolean
    }

    interface DTOCreation extends Omit<DTO, 'id' | 'images' | 'default_image' | 'timetable'> {
        id?: ID
        country: ID
        region: ID
        district: ID
        images: UploadFile[]
        default_image: UploadFile[]
        timetable: TimeTable<Dayjs | null>[]
    }

    interface DTOUpload extends Omit<NullableDTOCreation, 'images' | 'default_image' | 'timetable'> {
        images: { image: ID }[]
        default_image: ID
        timetable: TimeTable<string>[]
    }

    interface TimeTable<T> {
        id?: ID
        day: DAYS
        opens_at: T
        closes_at: T
        is_open: boolean
        is_active?: boolean
    }

}

export enum STORE {
    BRAND_SHOP = 1,
    PREMIUM_STORE,
    MARKETPLACE,
}

export enum DAYS {
    MONDAY = 1,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
}
