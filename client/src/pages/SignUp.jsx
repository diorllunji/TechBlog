import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import OAuth from '../components/OAuth';

export default function SignUp() {

  const [formData,setFormData]=useState();
  const [errorMessage, setErrorMessage]=useState(null);
  const [loading, setLoading]=useState(false);
  const navigate=useNavigate();

  const handleChange=(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value.trim()});
  };

  const handleSubmit=async (e)=>{
    e.preventDefault();

    if(!formData.username||!formData.email||!formData.password){
      return setErrorMessage('Please fill out all fields');
    }
    try{
      setLoading(true);
      setErrorMessage(null);
      const res=await fetch('/api/auth/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      });
      const data=await res.json();
      if(data.success===false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    }catch(error){
      setErrorMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left side */}
        <div className="flex-1">
        <Link to="/" className='whitespace-nowrap font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-700 
            via-purple-700 to-cyan-900 rounded-lg text-white'>Tech</span>
            Blog
        </Link>
        <p className='text-sm mt-5'>
        Welcome! You can sign up using your email and password or Google Account.
        </p>
        </div>
        {/*right side*/}
        <div className="flex-1">
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div className="">
            <Label value='Your username'/>
            <TextInput 
            type='text'
            placeholder='Username'
            id='username'
            onChange={handleChange}
            />
          </div>
          <div className="">
            <Label value='Your email'/>
            <TextInput 
            type='email'
            placeholder='Email'
            id='email'
            onChange={handleChange}
            />
          </div>
          <div className="">
            <Label value='Your password'/>
            <TextInput 
            type='password'
            placeholder='Password'
            id='password'
            onChange={handleChange}
            />
          </div>
          <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
            {
              loading ? (
                <>
                <Spinner size='sm'/>
                <span className='pl-3'>Loading...</span>
                </>
              ) : 'Sign Up'
            }
          </Button>
          <OAuth/>
        </form>
        <div className="flex gap-2 text-sm mt-5">
          <span>Already have an account?</span>
          <Link to='/sign-in' className='text-blue-500'>
            Sign in
          </Link>
        </div>
        {
          errorMessage&&(
            <Alert className='mt-5' color='failure'>
              {errorMessage}
            </Alert>
          )
        }
        </div>
      </div>
    </div>
  )
}
