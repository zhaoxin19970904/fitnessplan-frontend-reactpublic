import { Avatar, List } from 'antd';
import {useState, useEffect,useCallback} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space, InputNumber, Table} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode'
import './adminl.css';
import Details from './detials';

function Edit() {

    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [rvalue, setRValue] = useState(1);
    const decodedToken = jwtDecode(token);
    const userRole = decodedToken.role;
    let {id}= useParams();
    const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
    const [columns,setColums] = useState([
      
      {
        title: 'Date',
        width: 100,
        dataIndex: 'date',
        key: 'date',
        fixed: 'left',
      },
      {
        title: 'Age',
        width: 100,
        dataIndex: 'age',
        key: 'age',
        fixed: 'left',
      },
      {
          title: 'Weight',
          width: 100,
          dataIndex: 'weight',
          key: 'weight',
          fixed: 'left',
        },
        {
          title: 'Gender',
          width: 100,
          dataIndex: 'gender',
          key: 'gender',
          fixed: 'left',
        },
        {
          title: 'Goal',
          width: 100,
          dataIndex: 'goal',
          key: 'goal',
          fixed: 'left',
        },
        {
          title: 'Details',
          key: 'operation',

          width: 100,
          render: (text, record) => <Button style={{color:'black',background:'yellow'}} onClick={() => details(record.id)}>Details</Button>
        },
        {
          title: 'Remove',
          key: 'operation',

          width: 100,
          render: (text, record) => <Button style={{color:'white',background:'red'}} onClick={() => remove(record.id)}>Remove</Button>
        },
      ])
      const details = async (pid) => {
        navigate(`/personPlan/${pid}`);
      }
    const genderChange = (e) => {
        console.log('radio checked', e.target.value);
        setRValue(e.target.value);
      };
      const remove=useCallback(async(pid)=>{
        console.log(pid)

      try {
        const response = await fetch(`http://localhost:3001/plans/delete/${pid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updateCourses = courses.filter(course => course.id !== pid);
      setCourses(updateCourses);
        const responseData = await response.json();
        console.log('Success:', responseData);
      } catch (error) {
        console.error('Failed:', error);
      }
    },[])
  const onFinish = async (values) => {
    try {
        const response = await fetch(`http://localhost:3001/users/update/${id}`, {
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
        if(userRole==='admin'){navigate(`/admin`)}
        else {navigate(`/edit/${id}`)}
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

  const addplan=()=>{
    navigate(`/plan/${id}`)
  }

  useEffect(() => {
    fetch(`http://localhost:3001/users/students/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
      setStudentData({ ...data, birth: data.birth ? moment(data.birth) : null });

    })
    .catch(error => {
      console.error('Error:', error);
      setError(error);
    });
  }, [id, token]);

  useEffect(() => {
    fetch(`http://localhost:3001/plans/personplan/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      if (Array.isArray(data)) {
        const transformedData = data.map(item => {
          return {
            key: item._id,
            id: item._id,
            date: moment(item.createdAt).format('YYYY-MM-DD'),
            age: item.age,
            weight: item.weight,
            gender: item.gender,
            goal: item.goal,
          };
        });
        setCourses(transformedData);
        console.log(data)
      } else {
        console.log('No plan data available');
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      setError(error);
    });
  }, [id, remove,courses, token]);
  

 


  
  return (
    <div className="admin-container">
      <div className="leftBackground"></div>
      <div className="rightBackground"></div>
      {!studentData || error ? <div>Loading...</div>:
      <div>{studentData.type==='admin'?<h1>Edit {studentData.username} </h1>:<h1>Hello {studentData.username},Accoumt Type:{studentData.type} </h1>}
      <div className="search-area">
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
    initialValues={studentData}
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
      <Radio.Group onChange={genderChange}  >
      <Radio value='male'>Male</Radio>
    <Radio value='female'>Female</Radio>
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
    <DatePicker format="YYYY-MM-DD" />

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
        Update
      </Button>
    </Form.Item>
  </Form>
  </div>
  <Button onClick={()=>{back()}}>
        Back
      </Button>
      {studentData.type==='admin'?null:<div>
      {<div><h3>Plan list  </h3></div>}
      <Table className="admin-table"
    columns={columns}
    dataSource={courses}
    scroll={{
      x: 1400,
      y: 1600,
    }}/>
  
     <Button style={{color:'white',background:'green'}} onClick={()=>{addplan()}}>
        Add Plan
      </Button>
      </div>}
      </div>}
    </div>
    

  );
}

export default Edit;