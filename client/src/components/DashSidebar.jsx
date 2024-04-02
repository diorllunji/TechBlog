import React from 'react'
import {Sidebar} from 'flowbite-react'
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { useEffect,useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';

export default function DashSidebar() {
    const location=useLocation();
    const [tab,setTab]=useState('');
    const dispatch=useDispatch();
    const navigate=useNavigate();

    useEffect(()=>{
      const urlParams=new URLSearchParams(location.search);
      const tabFromUrl=urlParams.get('tab');
      if(tabFromUrl){
        setTab(tabFromUrl);
      }
    },[location.search])

    const handleSignout=async()=>{
      try{
        const res=await fetch('/api/user/signout',{
          method:'POST',
        });
        const data=await res.json();
  
        if(!res.ok){
          console.log(data.message);
        }
        else{
          dispatch(signoutSuccess());
          navigate('/sign-in');
        } 
      }
      catch(error){
        console.log(error.message);
      }
    }
  return (
    <Sidebar classname='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={"User"} labelColor='dark'>
                    Profile
                </Sidebar.Item>
                </Link>
                <Sidebar.Item icon={HiArrowSmRight} classname='cursor-pointer' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
