import { Row, Col, Form, Input, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { toast } from 'react-hot-toast';
import { useLoginMutation } from 'services/auth/auth';
import { useAppDispatch } from 'hooks/redux';
import { setCredentials } from 'store/reducers/authSlice';
import { Account } from 'types/others/auth';

const { Title } = Typography;


export function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const onFinish = (values: unknown) => {
        login(values as Account.Credentials)
            .unwrap()
            .then((response) => {                
                toast.success('Вы успешно вошли в систему');
                dispatch(setCredentials(response));
                navigate('/');
            })
            .catch(() => toast.error('Пользователь не найден'));
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Page>
            <Row gutter={[24, 0]} align="middle">
                <Col span={12}>
                    <Image>
                        <img src="/logo-white.svg" alt="logo" />
                    </Image>
                </Col>
                <Col span={12}>
                    <LeftSide>
                        <StyledForm
                            style={{ maxWidth: 500 }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            initialValues={{}}
                        >
                            <Row gutter={[0, 0]}>
                                <Col span={24}>
                                    <Title level={3}>Login</Title>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="phone_number"
                                        label="Номер телефона"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Пожалуйста, введите номер телефона!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            size="large"
                                            placeholder="Username"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        name="password"
                                        label="Пароль"
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    'Пожалуйста, введите пароль!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            size="large"
                                            placeholder="Password"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24} className="mt-1">
                                    <Button
                                        className="w-100"
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={isLoading}
                                    >
                                        Вход
                                    </Button>
                                </Col>
                            </Row>
                        </StyledForm>
                        <Copyright>Все права защищены. Artel Electronics © 2023</Copyright>
                    </LeftSide>
                </Col>
            </Row>
        </Page>
    );
}

const Page = styled.section`
    margin: auto;
    padding: 40px;
    /* max-width: 1400px; */
`;

const Image = styled.div`
    height: calc(100vh - 80px);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: linear-gradient(
            180deg, 
            rgba(255, 86, 31, 0.00) 55.73%, 
            #1b1c1b 100%),
        url('/login.jpg');

    img {
        width: auto;
        height: 5rem;
        position: absolute;
        bottom: 1rem;
        left: 2rem;
    }
`;

const LeftSide = styled.div`
    height: calc(100vh - 80px);
    display: flex;
    background: #fff;
`;

const StyledForm = styled(Form)`
    width: 250px;
    margin: auto;
    text-align: center;
`;

const Copyright = styled.p`
    font-size: 14px;
    max-width: fit-content;
    color: var(--black-45);
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 1rem auto;
`;
