import { Avatar, List } from 'antd';
import {useState, useEffect,useMemo} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space, InputNumber} from 'antd';
import './adminl.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;



function Editc() {
    const [formInitialValues, setFormInitialValues] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    let {id}= useParams();
    const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const onFinish = async (values) => {
    const courseData = {
      name: values.name,
      des: values.des,
      credit: values.credit,
      start: values.range[0].format('YYYY-MM-DD'),
      end: values.range[1].format('YYYY-MM-DD')
    };
    try {
        const response = await fetch(`http://localhost:3001/courses/updatec/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(courseData),
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
    navigate('/admin')
  }

  useEffect(() => {
    fetch(`http://localhost:3001/courses/courses/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
        setStudentData({...data});
        setStartDate(data.start);
        setEndDate(data.end);
    })
    .catch(error => {
        console.error('Error:', error);
        setError(error);
    });
}, []);

  return (
    <div className="admin">
      {!studentData || error?<div>Loading </div>:
      <div>
      <h1>Edit {studentData.name}</h1>
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
    initialValues={{...studentData,range:[dayjs(studentData.start),dayjs(studentData.end)]}}

    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Form.Item
      label="Name"
      name="name"
      rules={[
        {
          required: true,
          message: 'Please input your name!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Description"
      name="des"
      rules={[
        {
          required: true,
          message: 'Please input your description!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Time Range"
      name="range"
      rules={[
        {
          required: true,
          message: 'Please input your start!',
        },
      ]}
      
    >
      <RangePicker />
    </Form.Item>

    <Form.Item
      label='Credit'
      name="credit"
      rules={[
        {
          required: true,
          message: 'Please input your credit!',
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
        Update
      </Button>
    </Form.Item>
  </Form>
  <Button onClick={()=>{back()}}>
        Back
      </Button>
      </div>}
    </div>
  );
}

export default Editc;