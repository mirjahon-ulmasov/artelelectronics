import { Fragment, useState } from 'react'
import { useAppSelector } from 'hooks/redux'
import { Modal, Upload } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { RcFile } from 'antd/es/upload'
import { API_BASE_URL } from 'services/auth/baseQuery'

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = error => reject(error)
    })

interface ImageUploadProps extends UploadProps {
    fileList?: UploadFile<any>[];
    loading?: boolean
}
      

export function ImageUpload(props: ImageUploadProps) {
    const { fileList, maxCount = 10, listType = "picture-card" } = props

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const { access_token } = useAppSelector(state => state.auth)

    const handleCancel = () => setPreviewOpen(false)

    const exProps: UploadProps = {
        name: 'file',
        method: 'POST',
        action: API_BASE_URL + '/media_file/',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        async onPreview(file) {
            if (!file.url && !file.preview) {
                file.preview = await getBase64(file.originFileObj as RcFile)
            }

            setPreviewImage(file.url || (file.preview as string))
            setPreviewOpen(true)
        },
    }

    return (
        <Fragment>
            <Upload {...exProps} {...props} progress={{ showInfo: false }} listType={listType}>
                {(fileList?.length || 0) >= maxCount ? null : (
                    <PlusOutlined style={{ color: '#116DFF', scale: '1.5' }} />
                )}
            </Upload>
            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                <img
                    alt="example"
                    src={previewImage}
                    style={{ width: '100%' }}
                />
            </Modal>
        </Fragment>
    )
}