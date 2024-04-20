import { Avatar, InputNumber, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space} from 'antd';
import { useNavigate } from 'react-router-dom'
import './adminl.css';


function Add() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [rvalue, setRValue] = useState('male');
    const genderChange = (e) => {
        console.log('radio checked', e.target.value);
        setRValue(e.target.value);
      };
      const [tvalue, setTValue] = useState(1);
    const typeChange = (e) => {
        console.log('radio checked', e.target.value);
        setTValue(e.target.value);
      };
      const [dvalue, setDValue] = useState('');
      const dateChange = (date, dateString) => {
        setDValue(date);
        console.log(date)
      };
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const onFinish = async (values) => {
    try {
        console.log(values)
        const response = await fetch('http://localhost:3001/users/student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(values),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const responseData = await response.json();
        console.log('Success:', responseData);
        navigate(`/admin`)
      } catch (error) {
        console.error('Failed:', error);
      }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  const back=()=>{
    navigate(-1)
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="admin">
      <h1>Add new User</h1>
      <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,gender:'male',type:'admin'
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
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
      label="Email"
      name="email"
      rules={[
        {
          required: true,
          message: 'Please input your email!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Gender"
      name="gender"
      rules={[
        {
          required: true,
          message: 'Please input your gender!',
        },
      ]}
    >
      <Radio.Group onChange={genderChange} value={rvalue}>
      <Radio value='male'>Male</Radio>
    <Radio value='female'>Female</Radio>
    </Radio.Group>
    </Form.Item>

    <Form.Item
      label="Type"
      name="type"
      rules={[
        {
          required: true,
          message: 'Please input your type!',
        },
      ]}
    >
      <Radio.Group onChange={typeChange} value={tvalue}>
      <Radio value='admin'>Admin</Radio>
      <Radio value='client'>Client</Radio>

    </Radio.Group>
    </Form.Item>

    <Form.Item
      label="Birth"
      name="birth"
      rules={[
        {
          required: true,
          message: 'Please input your birth!',
        },
      ]}
    >
    <DatePicker format="YYYY-MM-DD"/>

    </Form.Item>


    <Form.Item
      label='age'
      name="age"
      rules={[
        {
          required: true,
          message: 'Please input your age!',
        },
        {
          type: 'number',
          message: 'Age must be a number!',
          transform: value => Number(value),
        },
        {
          validator: (_, value) =>
            Number.isInteger(value)
              ? Promise.resolve()
              : Promise.reject(new Error('Age must be an integer')),
        },
      ]}

    >
        <InputNumber />
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Add
      </Button>
    </Form.Item>
  </Form>
  <Button onClick={()=>{back()}}>
        Back
      </Button>
    </div>
  );
}

export default Add;