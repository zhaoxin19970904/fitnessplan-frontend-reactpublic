import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space, InputNumber, Table} from 'antd';

function Plan() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [plan,setPlan] = useState('');
    const [formData, setFormData] = useState({
        pid: id,
        age: '',
        gender: '',
        weight: '',
        goal: ''
    });

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

    const handleSubmit = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const [rvalue, setRValue] = useState('male');
    const genderChange = (e) => {
        console.log('radio checked', e.target.value);
        setRValue(e.target.value);
      };

      const [gvalue, setRGalue] = useState('gain');
      const goalChange = (e) => {
          console.log('radio checked', e.target.value);
          setRGalue(e.target.value);
        };
    const back=()=>{
        navigate(-1);
    }


    const onFinish = async (values) => {
        const response = await fetch('http://localhost:3001/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });
        const data = await response.json();
        setPlan(`Your personalized fitness plan: ${data.plan}`);
    };
    const handleChange = async (event) => {
        event.preventDefault();
        const response = await fetch('/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        setPlan(`Your personalized fitness plan: ${data.plan}`);
    };

    return (
        <div>
            <h2>Enter your details for a personalized fitness plan</h2>
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
        remember: true,gender:'male',goal:'gain'
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
  >
    <Form.Item
      label="Personal Info"
      name="title"
      style={{fontSize:20}}
    >
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
      <Radio.Group onChange={genderChange}  >
      <Radio value='male'>Male</Radio>
    <Radio value='female'>Female</Radio>
    </Radio.Group>
    </Form.Item>

    <Form.Item
      label='Age'
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
      label='Weight'
      name="weight"
      rules={[
        {
          required: true,
          message: 'Please input your weight!',
        },
        {
          type: 'number',
          message: 'Weight must be a number!',
          transform: value => Number(value),
        },
        {
          validator: (_, value) =>
            Number.isInteger(value)
              ? Promise.resolve()
              : Promise.reject(new Error('Weight must be an integer')),
        },
      ]}

    >
    <InputNumber />
    </Form.Item>

    <Form.Item
      label="Fitness Goal"
      name="goal"
      rules={[
        {
          required: true,
          message: 'Please input your goal',
        },
      ]}
    >
      <Radio.Group onChange={goalChange}  >
      <Radio value='gain'>Muscle Gain</Radio>
    <Radio value='loss'>Fat Loss</Radio>
    </Radio.Group>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Add New Plan
      </Button>
    </Form.Item>
  </Form>

            
            <Button onClick={()=>{back()}}>Back</Button>
        </div>
    );
}

export default Plan;
