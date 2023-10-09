import styled from 'styled-components'


interface ColorProps {
    link: string
}

export function Color({ link }: ColorProps) {
    return <ColorImage src={link} alt="color" />
}

const ColorImage = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
`