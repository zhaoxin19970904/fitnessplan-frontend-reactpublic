import { Avatar, InputNumber, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space,Table} from 'antd';
import { useNavigate } from 'react-router-dom'
import './adminl.css';



function Client() {
    const token = localStorage.getItem('token');
    const [admin,setAdmin] = useState([])
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
        },
        {
          title: 'Edit',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: (text, record) => <Button onClick={() => edit(record.id)}>Edit</Button>
        },
        {
          title: 'Delete',
          key: 'operation',
          fixed: 'right',
          width: 100,
          render: (text, record) => <Button style={{color:'white',background:'red'}} onClick={() => delet(record.id)}>Delete</Button>
        }
  
  ]

    const edit=(id)=>{
        navigate(`/edit/${id}`)
      }
      const add=()=>{
        navigate('/add')
      }

      const delet= async (id)=>{
        try {
          const response = await fetch(`http://localhost:3001/users/delete/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const updatedAdmins = admin.filter(student => student._id !== id);
        setAdmin(updatedAdmins);
          const responseData = await response.json();
          console.log('Success:', responseData);
        } catch (error) {
          console.error('Failed:', error);
        }
        
      }
    
    useEffect(() => {

    
        fetch('http://localhost:3001/users/teachers',{
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
                id: item._id||item.id,
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
      }, [admin,delet]);
      return(
        <div className="admin-container">
        <Table className="admin-table"
    columns={columns}
    dataSource={admin}
    title={() => (
      <div className="table-title-container">
        <h2>Client Table</h2>
        </div>)}
    scroll={{
      x: 1400,
      y: 1600,
    }}
  />
          </div>
      )
    

}
export default Client;