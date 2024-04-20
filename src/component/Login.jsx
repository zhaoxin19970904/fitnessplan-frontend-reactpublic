
import { useState } from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import YourLoginComponent from './googlelogin';
import '../App.css';


function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}
function Login() {
    const navigate = useNavigate();
    const onFinish = async (values) => {
      try {
        const response = await fetch('http://localhost:3001/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log('Received response:', responseData);
    
        if (responseData.token) {
          localStorage.setItem('token', responseData.token); 

          const decodedToken = parseJwt(responseData.token);
          console.log(decodedToken.role)
          console.log(decodedToken.username)
      if (decodedToken && decodedToken.role === 'admin') {
        navigate('/admin');
      }
      else if (decodedToken.id && decodedToken.role === 'client') {
        navigate(`/edit/${decodedToken.id}`);
      }
      else if (decodedToken.id && decodedToken.role === 'student') {
        navigate(`/edit/${decodedToken.id}`);
      }
      
      else {
        navigate('/'); 
      }
          message.success('Form submitted successfully!');
        } else {
          message.error('Login failed: No token received');
        }
      } catch (error) {
        message.error('Failed to submit form!');
        console.error('Error:', error);
      }
    };
    

  return (
    <div className="App">
        <h1>Welcome</h1>
        <h2>Please enter the username and password</h2>
        <Form 
    initialValues={{ remember: true }}
    onFinish={onFinish}
    autoComplete="off"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
  >
    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: 'Please input your password!',
        },
      ]}
    >
      <Input.Password />
    </Form.Item>


    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit" >
        Submit
      </Button>
    </Form.Item>
    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <GoogleOAuthProvider clientId="892749453222-ckthm4h2leeonk0fvh8e7sefuau11i75.apps.googleusercontent.com">
      <YourLoginComponent />
    </GoogleOAuthProvider>
    </Form.Item>
  </Form>
    </div>
  );
}

export default Login;