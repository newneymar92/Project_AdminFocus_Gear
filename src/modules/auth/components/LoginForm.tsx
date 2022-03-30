import React from 'react';
import { ILoginParams } from '../../../models/auth';
import { Form, Input, Button, Card } from 'antd';

interface Props {
  onLogin(values: ILoginParams): void;
}

const LoginForm = (props: Props) => {
  const { onLogin } = props;
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const styleLogin = {
    width: '100%',
    padding: '15px',
    margin: '25vh auto',
    maxWidth: '410px',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji',
    fontSize: '1rem',
    // fontWeight: "400",
    lineHeight: '1.5',
    color: '#FFFFFF',
    // textAlign: "left",
    backgroundColor: '#f3f3f3',
  };

  const styleLogintext = {
    // textAlign: "center",
    // fontWeight: "400!important",
    marginBottom: '1rem!important',
    fontSize: '1.75rem',
    lineHeight: '1.2',
    margin: '.67em 0',
    // boxSizing: "inherit",
    display: 'block',
  };

  const styleLoginbutton = {
    marginTop: '10px',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    color: '#fff',
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  };

  return (
    <div className="login-container">
      <Card title={<h1>Login</h1>} style={styleLogin}>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onLogin}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'Email not valid',
              },
            ]}
          >
            <Input style={{ color: 'black', backgroundColor: '#FFFFFF' }} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
              { min: 6, message: 'Password must be minimum 6 characters.' },
            ]}
          >
            <Input.Password style={{ color: 'black', backgroundColor: '#FFFFFF' }} />
          </Form.Item>

          <Form.Item>
            <Button style={styleLoginbutton} htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginForm;
