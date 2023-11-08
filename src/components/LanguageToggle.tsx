import { useCallback } from 'react'
import { Button, ButtonProps, Space } from 'antd'
import { LANGUAGE } from 'types/others/api'

export interface Language {
    label: string
    value: LANGUAGE
}

interface LanguageToggleProps {
    languages: Language[],
    currentLanguage: LANGUAGE,
    onChange: (value: LANGUAGE) => void
}

export function LanguageToggle(props: LanguageToggleProps) {
    const { languages, currentLanguage, onChange } = props  

    const getButtonType = useCallback((value: LANGUAGE): ButtonProps => {
        return {
            type: value === currentLanguage ? 'primary': 'default',
            shape: 'round',
            size: 'small'
        }
    }, [currentLanguage])

    const changeLanguage = useCallback((value: LANGUAGE) => {
        onChange(value)
    }, [onChange])

    return (
        <Space>
            {languages.map(language => (
                <Button 
                    key={language.value} 
                    onClick={() => changeLanguage(language.value)} 
                    {...getButtonType(language.value)}
                >
                    {language.label}
                </Button>
            ))}
        </Space>
    )
}
