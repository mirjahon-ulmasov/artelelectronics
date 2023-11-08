export declare namespace Account {
    export interface DTO {
        full_name: string
        profile_picture: {
            file: unknown
        }
        background_image: {
            file: unknown
        }
        date_of_birth: string
        region: string
        gender: unknown
        user: {
            username: string
            user_type: string
        }
        registered: unknown
        repairs: unknown
        favourites: unknown
        token: {
            Success: boolean
            refresh: string
            access: string
        }
    }
    export interface Credentials {
        phone_number: string
        password: string
    }
}
