import { Avatar, InputNumber, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space, Table} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import './adminl.css';



function TeachStudents() {
    const token = localStorage.getItem('token');
    const [admin,setAdmin] = useState([])
    let {id}= useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const columns = [
    
        {
          title: 'Full Name',
          width: 100,
          dataIndex: 'name',
          key: 'name',
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
            title: 'Gender',
            width: 100,
            dataIndex: 'gender',
            key: 'gender',
            fixed: 'left',
          },
          {
            title: 'Type',
            width: 100,
            dataIndex: 'type',
            key: 'type',
            fixed: 'left',
          },
          {
            title: 'Birth',
            width: 100,
            dataIndex: 'birth',
            key: 'birth',
            fixed: 'left',
          }
          
    ]    
    useEffect(() => {
        fetch(`http://localhost:3001/users/coursestudents/${id}`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (Array.isArray(data)) {
              const transformedData = data.map(item => ({
                id: item._id,
                name: item.username,
                gender: item.gender,
                age: item.age,
                type: item.type,
                birth: new Date(item.birth).toLocaleDateString()
              }));
              setAdmin(transformedData); 
            } else {
   
              console.error("Data is not an array:", data);
            }
            setIsLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
            setError(error);
            setIsLoading(false);
          });
      }, []);
      const Back=()=>{
            navigate(-1)
      }
      return(
        <div>
        <Table
    columns={columns}
    dataSource={admin}
    scroll={{
      x: 1400,
      y: 1600,
    }}/>
    <Button onClick={()=>Back()}>Back</Button>
          </div>
      )
    

}
export default TeachStudents;