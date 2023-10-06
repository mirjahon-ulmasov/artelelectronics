import { css, styled } from 'styled-components'
import { format } from 'utils/index'

export const Status = styled.span<{ value?: boolean; type?: format }>`
    font-size: 12px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;

    color: #555;
    background: #e6f4ff;
    border: 1px solid #aaa;

    ${props =>
        props.type === 'active' && props.value &&
        css`
            color: #1bbe72;
            background: #f0fff5;
            border: 1px solid #1bbe72;
        `}

    ${props =>
        props.type === 'active' && !props.value &&
        css`
            color: #ff4d4f;
            background: #fff1f0;
            border: 1px solid #ffa39e;
        `}
`
