import { useAppSelector } from 'hooks/redux'
import { Button, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { API_BASE_URL } from 'services/auth/baseQuery'

interface ImageUploadProps extends UploadProps {
    fileList?: UploadFile<any>[]
    loading?: boolean
    label?: string
}

export function FileUpload(props: ImageUploadProps) {
    const { fileList, label = 'Загрузить', maxCount = 1 } = props
    const { access_token } = useAppSelector(state => state.auth)

    const exProps: UploadProps = {
        name: 'file',
        method: 'POST',
        action: API_BASE_URL + '/media_file/',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }

    return (
        <Upload {...exProps} {...props} progress={{ showInfo: false }}>
            {(fileList?.length || 0) >= maxCount ? null : (
                <Button
                    icon={<PlusOutlined />}
                    type="primary"
                    shape="round"
                    className="d-flex"
                >
                    {label}
                </Button>
            )}
        </Upload>
    )
}
