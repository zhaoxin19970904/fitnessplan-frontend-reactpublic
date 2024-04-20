import logo from './logo.svg';
import './App.css';
import React from 'react';
import {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Link,Navigate,useLocation,useNavigate } from "react-router-dom";
import Login from './component/Login';
import Admin from './component/admin';
import Add from './component/add'
import Edit from './component/edit'
import Editc from './component/editcourse'
import Adminl from './component/adminl'
import Teacherl from './component/teacherl'
import Studentl from './component/studentl'
import { jwtDecode } from 'jwt-decode'
import PersonCourse from './component/personCourse';
import TeachStudents from './component/techStudents';
import Plan from './component/plan'
import Plandetails from './component/detials';

function App() {


  const RequireAuth = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = React.useState(true);
  
    useEffect(() => {
      if (!token) {
        navigate("/");
      } else {
        try {
          const decodedToken = jwtDecode(token);
          const userRole = decodedToken.role;
  
          if (!allowedRoles.includes(userRole)) {
            alert("No Permission");
            setIsAuthorized(false); // Set state to trigger useEffect
          }
        } catch (error) {
          console.error('Token decoding failed:', error);
          navigate("/");
        }
      }
    }, [token, allowedRoles, navigate]);
  
    useEffect(() => {
      if (!isAuthorized) {
        navigate(-1); // Navigate back if not authorized
      }
    }, [isAuthorized, navigate]);
  
    if (!isAuthorized) {
      return null; // Prevent rendering children if not authorized
    }
  
    return children;
  };

  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<Login />} />
          <Route path="/admin" element={<RequireAuth allowedRoles={['admin']}><Admin/></RequireAuth>} />
          <Route path="/add" element={<RequireAuth allowedRoles={['admin']}><Add/></RequireAuth>} />
          <Route path="/adminl" element={<RequireAuth><Adminl/></RequireAuth>} />
          <Route path="/studentl" element={<Studentl/>} />
          <Route path="/teacherl" element={<Teacherl/>} />
          <Route path="/edit/:id" element={<Edit /> }/>
          <Route path="/editc/:id" element={<Editc /> }/>
          <Route path="/personcourse/:id" element={<PersonCourse /> }/>
          <Route path="/course/students/:id" element={<TeachStudents/>}></Route>
          <Route path="/plan/:id" element={<Plan/>}></Route>
          <Route path="/personPlan/:id" element={<Plandetails/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
    
  );
}

export default App;
