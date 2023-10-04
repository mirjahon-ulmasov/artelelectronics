import { DatePicker, DatePickerProps } from 'antd'
import { DatePickerIcon } from 'components'

export const CustomDatePicker = (props: DatePickerProps) => {
    return <DatePicker suffixIcon={<DatePickerIcon />} {...props} />
}
