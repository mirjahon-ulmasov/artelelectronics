import { useCallback, useMemo, useRef } from 'react'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import { formats } from 'utils/richtext'
import { useUploadMediaMutation } from 'services/index'
import styled from 'styled-components'

type Props = {
    onChange: (value: string) => void
    value: string
}

const CustomizedReactQuill = ({ onChange, value }: Props) => {
    const quillRef = useRef<ReactQuill>(null)
    const [uploadMedia, { isLoading: uploadLoading }] = useUploadMediaMutation()

    const handleQuillImage = useCallback(() => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()

        input.onchange = async () => {
            if (!input.files) return
            const formData = new FormData()
            formData.append('file', input.files[0])

            toast.loading('Загрузка файла...');

            uploadMedia(formData)
                .unwrap()
                .then(response => {
                    toast.dismiss();
                    toast.success('Файл успешно загружен')
                    if (!quillRef.current) return
                    const range = quillRef.current.getEditor().getSelection(true)
                    quillRef.current.getEditor().insertEmbed(range.index, 'image', response.file)
                })
                .catch(() => toast.error('Не удалось загрузить файл'))
        }
    }, [uploadMedia])

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: '1' }, { header: '2' }, { font: [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [
                        { list: 'ordered' },
                        { list: 'bullet' },
                        { indent: '-1' },
                        { indent: '+1' },
                    ],
                    ['link', 'image', 'video'],
                    ['clean'],
                ],
                handlers: {
                    image: handleQuillImage,
                },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        [handleQuillImage]
    )

    return (
        <StyledReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            formats={formats}
            onChange={onChange}
            value={value}
            loading={uploadLoading}
        />
    )
}

export default CustomizedReactQuill

const StyledReactQuill = styled(ReactQuill)<{loading: boolean}>`
    position: relative;
    
    &::after {
        content: ${props => props.loading ? '""' : 'none'};
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(2px);
        background: rgba(255, 255, 255, 0.5);
        z-index: 1;
    }
`