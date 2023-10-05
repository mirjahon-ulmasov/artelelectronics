import { Col, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { 
    Card, RIncomeIcon, RInsuranceIcon, 
    ROrderIcon, RToningIcon, StyledTextL2 
} from 'components'

const { Title } = Typography

export default function Menu() {
    const navigate = useNavigate()

    return (
        <Row className='d-flex fd-col ai-start'>
            <Col>
                <Title level={3}>Отчеты</Title>
            </Col>
            <Col>
                <div className="d-flex fw-wrap jc-start gap-24 mt-2" style={{ maxWidth: 1100 }}>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("orders")}>
                        <ROrderIcon />
                        <StyledTextL2>Отчет о финансовых результатах</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("incomes")}>
                        <RIncomeIcon />
                        <StyledTextL2>Отчет о прибыли и убытках</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("toning")}>
                        <RToningIcon />
                        <StyledTextL2>Отчет о движении денежных средств</StyledTextL2>
                    </Card>
                    <Card gap={12} p='48px 24px' w={250} ai='center' onClick={() => navigate("insurance")}>
                        <RInsuranceIcon />
                        <StyledTextL2>Отчет об изменении капитала</StyledTextL2>
                    </Card>
                </div>
            </Col>
        </Row>
    )
}
