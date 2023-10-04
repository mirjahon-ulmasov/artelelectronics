import { Form, FormItemProps } from 'antd'
import { StyledText } from './Text'

export function FormItem(props: FormItemProps) {
    const { children, label, ...restProps } = props
    return (
        <Form.Item
            style={{ width: '100%' }}
            label={<StyledText>{label}</StyledText>} 
            {...restProps}
        >
            {children}
        </Form.Item>)
}
