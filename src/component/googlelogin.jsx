import React from 'react';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

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

function YourLoginComponent() {
    const navigate = useNavigate();
  const handleGoogleLogin = async (res) => {
    console.log(res)
    try {
        const response = await fetch('http://localhost:3001/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(res),
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
      message.success('Form submitted successfully!');
        } else {
          message.error('Login failed: No token received');
        }
    }catch (error) {
        message.error('Failed to submit form!');
        console.error('Error:', error);
      }
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleGoogleLogin} onError={() => console.log('Login Failed')} />
    </div>
  );
}

export default YourLoginComponent;