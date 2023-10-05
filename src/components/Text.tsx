import { Image, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { styled } from 'styled-components'

const { Text } = Typography

export const StyledText = styled(Text)<{ fs?: number, fw?: number, color?: string }>`
    font-weight: ${props => (props.fw ? props.fw : 400)};
    font-size: ${props => (props.fs ? `${props.fs}px` : '16px')};
    color: ${props => (props.color ? props.color : 'var(--black-65)')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '22px')};
`

export const StyledTextL1 = styled(Text)<{ fs?: number }>`
    font-weight: 400;
    color: var(--black-88);
    font-size: ${props => (props.fs ? `${props.fs}px` : '14px')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '22px')};
`

export const StyledTextL2 = styled(Text)<{ fs?: number }>`
    font-weight: 500;
    font-size: ${props => (props.fs ? `${props.fs}px` : '16px')};
    line-height: ${props => (props.fs ? `${props.fs + 8}px` : '24px')};
`

export const StyledLink = styled(Link)<{ color?: string, underline?: number }>`
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${props => (props.color ? props.color : '#ff561f')} ;
    text-decoration-line: ${props => props.underline ? 'underline' : 'none'};

    &:hover {
        color: ${props => (props.color ? props.color : '#eb3a00')} ;
    }
`

export const BorderBox = styled.div<{ bg?: string; p?: string; gap?: string }>`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 20px;
    border: 1px solid #CDCDCD;
    gap: ${props => (props.gap ? props.gap : '14px')};
    padding: ${props => (props.p ? props.p : '20px')};
    background: ${props => (props.bg ? props.bg : '#fff')};

    a {
        color: inherit;
        cursor: pointer;
        font-weight: inherit;
        border-bottom: 1px solid;
    }
    &.bill {
        gap: 4px;
        padding: 8px 16px;

        &.income {
            background: #f0fff5;
        }
        &.outgoings {
            background: #fff1f0;
        }
    }
`

export const SmallImg = styled(Image)<{ w?: number; h?: number }>`
    width: ${props => props.w ? `${props.w}px` : '90px' };
    height: ${props => props.h ? `${props.h}px` : '90px' };
    border-radius: 4px;
    object-fit: cover;
    object-position: center;
`

export const Card = styled.div<{ w?: number, p?: string, gap?: number, ai?: string}>`
    display: flex;
    width: ${props => props.w ? `${props.w}px` : 'auto'};
    padding: ${props => props.p ? props.p : '24px 32px'};
    flex-direction: column;
    gap: ${props => props.gap ? `${props.gap}px` : '8px'};
    align-items: ${props => props.ai ? props.ai : 'flex-start'};
    text-align: center;
    border-radius: 16px;
    background: #FFF3EB;
    transition: 0.2s ease-in;

    &:hover {
        background: #FFD9C2;
    }
`