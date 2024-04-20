import { Avatar, InputNumber, List } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space,Table} from 'antd';
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';



function PersonCourse() {
    let {id}= useParams();
        const token = localStorage.getItem('token');
        const [courses,setCourses] = useState([])
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(null);
        const navigate = useNavigate();
        const columns = [
            {
                title: 'CourseId',
                width: 100,
                dataIndex: 'id',
                key: 'id',
                fixed: 'left',
              },
    
            {
              title: 'Full Name',
              width: 100,
              dataIndex: 'name',
              key: 'name',
              fixed: 'left',
            },
            {
              title: 'Des',
              width: 100,
              dataIndex: 'des',
              key: 'des',
              fixed: 'left',
            },
            {
                title: 'Start',
                width: 100,
                dataIndex: 'start',
                key: 'start',
                fixed: 'left',
              },
              {
                title: 'End',
                width: 100,
                dataIndex: 'end',
                key: 'end',
                fixed: 'left',
              },
              {
                title: 'Credit',
                width: 100,
                dataIndex: 'credit',
                key: 'credit',
                fixed: 'left',
              },
              {
                title: 'Add',
                key: 'operation',
                fixed: 'right',
                width: 100,
                render: (text, record) => <Button onClick={() => add(record.id)}>Add</Button>
              }
        ]
       
        const add = async (cid) => {
            try {
              const response = await fetch(`http://localhost:3001/courses/personadd/${id}/${cid}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              });
          
              const responseData = await response.json(); // Always parse the response
          
              if (!response.ok) {
                // If response is not ok, throw an error with the message from the response
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
              }
          
              console.log('Success:', responseData);
              // Optionally, display a success message
              // alert('Success: ' + responseData.message);
          
            } catch (error) {
              console.error('Failed:', error);
              // Display the error message from the catch block
              alert('Failed: ' + error.message); 
            }
            navigate(-1); // Navigate back
          }
          const back=()=>{
            navigate(-1)
          }
    
          const deletc= async (id)=>{
            try {
              const response = await fetch(`http://localhost:3001/deletec/${id}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
              });
          
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const updateCourses = courses.filter(course => course._id !== id);
            setCourses(updateCourses);
              const responseData = await response.json();
              console.log('Success:', responseData);
            } catch (error) {
              console.error('Failed:', error);
            }
            
          }
        
        useEffect(() => {
    
        
            fetch('http://localhost:3001/courses/courses',{
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
                    name: item.name,
                    des: item.des,
                    start: new Date(item.start).toLocaleDateString(),
                    end: new Date(item.start).toLocaleDateString(),
                    credit: item.credit
                  }));
                  setCourses(transformedData); 
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
          return(
            <div>
                <Table
        columns={columns}
        dataSource={courses}
        scroll={{
          x: 1400,
          y: 1600,
        }}/>
        <Button onClick={()=>back()}>Back</Button>
              </div>
          )
        
    
    }
export default PersonCourse;