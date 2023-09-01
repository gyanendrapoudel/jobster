import { useEffect, useState } from "react";
import Wrapper from "../assets/wrappers/RegisterPage"
import { Logo, FormRow } from "../components"
import{Link, useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from '../features/user/userSlice'
import { getUserFromLocalStorage } from "../utils/localStorage";
const initialState = {
  name:'',
  email:'',
  password:'',
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState)
  const {user, isLoading}=useSelector(store=>store.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e)=>{
    const name = e.target.name;
    const value= e.target.value;
    setValues({...values, [name]:value})
    
  }
  const onSubmit = (e)=>{
    e.preventDefault();
    const{name, email, password, isMember}=values
    if(!email||!password ||(!isMember&&!name)){
      toast.warning("please fill out field ")
      return;
    }
    if (isMember){
      dispatch(loginUser({email:email, password: password}));
      return;
    }
    dispatch(registerUser({ name, email, password }))
   
  }
  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember })
  }
  useEffect(()=>{
    if(user){
      setTimeout(()=>{
        navigate('/')
      },2000)
    }
  },[user,navigate])
  return (
    <Wrapper className="full-page">
      <form onSubmit={onSubmit} className="form">
        <Logo />
        <h3>{values.isMember?'Login':'Register'}</h3>
        {!values.isMember&&<FormRow
          type="text"
          name="name"
          value={values.name}
          handleChange={handleChange}
        />}
        {/* email field */}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/* password field */}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {isLoading?'Loading...':'submit'}
        </button>
        {values.isMember?"Not a member yet ?":" Already a member ?"}
        <button type="button" onClick={toggleMember} className="member-btn" >
          {values.isMember?'Register':"login"}
        </button>
        {/* {console.log(values.isMember)} */}
      </form>
    </Wrapper>
  )
}
export default Register