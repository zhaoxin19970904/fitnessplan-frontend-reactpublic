import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Form, Input, message , Radio, DatePicker, Space, InputNumber, Table} from 'antd';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';

function Plandetails() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const { id } = useParams();
    const [plan,setPlan] = useState([]);
    const [details,setDetails]=useState('');
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        pid: id,
        age: '',
        gender: '',
        weight: '',
        goal: ''
    });

    
    const back=()=>{
        navigate(-1);
    }

    useEffect(() => {
        fetch(`http://localhost:3001/plans/plandetails/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {

            setPlan(data);
            setDetails(data.plan.split('\n').filter(paragraph => paragraph.trim() !== ''));
            console.log(data)
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          setError(error);
        });
      }, [id, token]);
      if (!details) {
        return <div>No plan available</div>;
      }
      const paragraphs = plan.plan.split('\n').filter(paragraph => paragraph.trim() !== '');
    

    return (
        <div>
            <h1>Plan Details</h1>
            <h3>Created Date: {moment(plan.createdAt).format('YYYY-MM-DD')}</h3>
            <h3>Gender: {plan.gender}</h3>
            <h3>Weight: {plan.weight}</h3>
            <h3>Goal: {plan.goal}</h3>
            <div className="plan">
            {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
            </div>
            <Button  onClick={()=>{back()} }>Back</Button>
        </div>
    );
}

export default Plandetails;
