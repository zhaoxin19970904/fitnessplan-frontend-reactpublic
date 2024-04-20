import { Avatar, InputNumber, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space,Table} from 'antd';
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';

const Searchl=(props)=>{

//props


    const [rvalue, setRValue] = useState('male');
    const genderChange = (e) => {
        console.log('radio checked', e.target.value);
        setRValue(e.target.value);
      };

    const onFinish = (values) => {
        console.log('Success:', values);
        props.searchl(values)
      };
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };
    return(
        <div>
          <h1 style={{color:'White'}}>Search Form</h1>
            <pre>{JSON.stringify(props.pagination, null, 2)}</pre>
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
      remember: true,
      gender:'male'
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
          message: 'Please input your username!',
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
  label="Age"
  name="age"
  rules={[
    {
      type: 'number',
      message: 'Age must be a number!',
      transform: value => (value ? Number(value) : value),
    },
    {
      validator: (_, value) =>
        value === undefined || value === '' || Number.isInteger(value)
          ? Promise.resolve()
          : Promise.reject(new Error('Age must be an integer')),
    },
  ]}
>
  <InputNumber />
</Form.Item>
    <Form.Item
      label="Gender"
      name="gender"
      rules={[
        {
          message: 'Please input your gender',
        },
      ]}
    >
      <Radio.Group onChange={genderChange} value={rvalue}>
      <Radio value='male'>Male</Radio>
    <Radio value='female'>Female</Radio>
    <Radio value='other'>Other</Radio>
    </Radio.Group>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit" >
        Search
      </Button>
    </Form.Item>
  </Form>
    </div>
    )
}

export default Searchl;