import { Avatar, InputNumber, List,Table } from 'antd';
import {useState, useEffect} from 'react'
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space} from 'antd';
import { useNavigate,Link } from 'react-router-dom'
import Searchl from './Search'
import './adminl.css';
const { Search } = Input;





function Adminl() {
    const token = localStorage.getItem('token');
    const [admin,setAdmin] = useState([])
    const [cp,setCP]=useState(1)
    const [tp,setTP]=useState(0)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 2,showSizeChanger: true, pageSizeOptions: ['2', '5', '10']});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState({});

    const searchl = async (data,page = { current: 1, pageSize: 2 }) => {
      setSearchTerm(true);
      setSearchData(data);
      let values=[];
      if(data.username){
        values.push({
          name: 'username',
          fun: 'include',
          value: data.username
        });
      }
      if(data.age){
        values.push({
          name: 'age',
          fun: 'geater',
          value: data.age
        });
      }

      if(data.gender){
        values.push({
          name: 'gender',
          fun: 'equal',
          value: data.gender
        });
      }
      try {
          const response = await fetch(`http://localhost:3001/users/adminssearch?page=${page.current}&pageSize=${page.pageSize}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(values)
          });
  
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          console.log(responseData)
    setTP(responseData.totalPages);
    setCP(responseData.currentPage);
    setPagination({ ...pagination,current: responseData.currentPage , total: responseData.totalItems }); 

    const transformedData = responseData.students.map(item => ({
      id: item._id,
      name: item.username,
      gender: item.gender,
      age: item.age,
      type: item.type,
      birth: new Date(item.birth).toLocaleDateString()
    }));

    setAdmin(transformedData);
    

  
  
      } catch (error) {
          console.error("Error fetching data:", error);
      }
  };
    const columns = [
      {title: 'id',
      width: 100,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',},
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
        fetchData(pagination)
          const responseData = await response.json();
          console.log('Success:', responseData);
        } catch (error) {
          console.error('Failed:', error);
        }
        
      }
    
   
      const fetchData = async (page, search = '') => {
        setIsLoading(true);
        let url = `http://localhost:3001/users/admins?page=${page.current}&pageSize=${page.pageSize}`;
        
        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log(data)
            setTP(data.totalPages);
            setCP(data.currentPage);
          setPagination({...page, total: data.totalItems }); 
    
          const transformedData = data.students.map(item => ({
              id: item._id||item.id,
              name: item.username,
              gender: item.gender,
              age: item.age,
              type: item.type,
              birth: new Date(item.birth).toLocaleDateString()
          }));
    
          setAdmin(transformedData);
        } catch (error) {
          console.error('Error:', error);
          message.error('Error fetching data');
        } finally {
          setIsLoading(false);
        }
      };
      useEffect(() => {
        fetchData({ ...pagination, current: 1 });
      }, []);
    
      const handleTableChange = (newPagination) => {
        if (searchTerm===true) {
 
          searchl(searchData,newPagination);
      } else{
        fetchData(newPagination);
      }
      };
      return(
        <div>
          <div className="admin-container">
            <div className="search-area">
              <Searchl searchl={searchl} />
              <Button style={{color:'white',background:'red'}} onClick={()=>{fetchData({
                current: 1, pageSize: 2,showSizeChanger: true, pageSizeOptions: ['2', '5', '10']});
                setSearchTerm(false)}}>Stop Searching
              </Button>
            </div>
            <Table className="admin-table"
                columns={columns}
                dataSource={admin}
                onChange={handleTableChange}
                pagination={pagination}
                scroll={{ x: 1400, y: 1600 }}
                title={() => (
                  <div className="table-title-container">
                    <h2>Admin Table</h2>
                    </div>)}
            />

                </div>
          </div>
      )
    

}
export default Adminl;