import dayjs, { Dayjs } from 'dayjs'
import { Language } from 'components/LanguageToggle'
import { LANGUAGE } from 'types/index'

export type format = 'client' | 'car' | 'order' | 'active'

export const languages: Language[] = [
    { label: 'Ru', value: LANGUAGE.RU },
    { label: 'Uz', value: LANGUAGE.UZ },
    { label: 'En', value: LANGUAGE.EN },
]

export function formatPhone(data: string) {
    return data
        .replace(/\D/g, '')
        .replace(/^(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})$/, '+$1 $2 $3-$4-$5')
}

export function formatPlate(data: string) {
    const isCommon = /[a-zA-Z]/.test(data[2])

    if (isCommon) return data.replace(/(\d+)([A-Z]+)/g, '$1 $2 ')
    return data.replace(/(\d+)(\d{3})([A-Z]+)/, '$1 $2 $3')
}

export const formatDate = 'YYYY-MM-DD'

export const disabledDate = (current: Dayjs): boolean => {
    // Disable dates before today
    if (!current) return false
    return current.isBefore(dayjs().subtract(1, 'day'))
}
