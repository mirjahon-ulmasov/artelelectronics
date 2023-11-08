import React from 'react'

export type ResultList<T> = Partial<{
    next: null | string
    previous: null | string
    count: number
    page: number
    page_size: number
    results: T[]
}>

export type ID = number | string

export interface File {
    id: number
    file: string
}

export interface BucketFile {
    id: number
    image: File
}

export interface Pagination {
    page: number
    page_size: number
}

export type NullableAll<T> = {
    [K in keyof T]: T[K] | null | undefined
}

export type NullableExcept<T, K extends keyof T> = {
    [P in keyof T]: P extends K ? T[P] : T[P] | null | undefined
}

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