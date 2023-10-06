import React from 'react'
export interface Route {
    path: string
    title: string
    roles?: ROLE[]
    icon: React.ComponentType<{ color: string }>
}

export enum LANGUAGE {
    UZ = 'uz',
    RU = 'ru',
    EN = 'en',
}

export enum ROLE {
    ADMIN = 1,
    OPERATOR,
    BRANCH_MAIN,
}

export type STATUSES = string | number
