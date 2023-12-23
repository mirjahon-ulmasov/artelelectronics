import { UploadFile } from 'antd'
import { Dayjs } from 'dayjs'
import { File, ID, LANGUAGE } from './api'

// -------------- News --------------
export declare namespace News {
    type List = DTO[]

    interface DTO {
        id: ID
        image: File
        news_type: NEWS
        publish_date: string
        external_source_url: string
        languages: Content[]
        add_to_carousel: boolean
        is_published?: boolean
        is_active?: boolean
    }

    interface DTOLocal extends Omit<DTO, 'image' | 'id' | 'publish_date'> {
        id?: ID
        news_type: NEWS
        image: UploadFile[]
        publish_date: Dayjs | null
    }

    interface DTOUpload extends Omit<DTO, 'image' | 'id'> {
        id?: ID
        image: ID
    }

    interface Content {
        title: string
        content: string
        introduction_text: string
        language: LANGUAGE
    }
}

export enum NEWS {
    ARTICLE = 'article',
    EVENT = 'event',
}
