import React from 'react'
import {Sidebar} from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiDocumentReport, HiDocumentSearch, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import { useEffect,useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { useSelector } from 'react-redux';

export default function DashSidebar() {
    const location=useLocation();
    const [tab,setTab]=useState('');
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {currentUser}=useSelector(state=>state.user);

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
          method:'POST'
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
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
            {currentUser.isAdmin && (
                  <Link to='/dashboard?tab=dashboard'>
                  <Sidebar.Item active={tab==='dashboard'||!tab} icon={HiDocumentSearch} as='div'>
                    Dashboard
                  </Sidebar.Item>
                </Link>
                )}
                <Link to='/dashboard?tab=profile'>
                <Sidebar.Item active={tab==='profile'} icon={HiUser} label={currentUser.isAdmin?'Admin':'User'} labelColor='dark' as='div'>
                    Profile
                </Sidebar.Item>
                </Link>
                {currentUser.isAdmin && (
                  <Link to='/dashboard?tab=posts'>
                  <Sidebar.Item active={tab==='posts'} icon={HiDocumentText} as='div'>
                    Posts
                  </Sidebar.Item>
                </Link>
                )}
                {currentUser.isAdmin && (
                  <Link to='/dashboard?tab=users'>
                  <Sidebar.Item active={tab==='users'} icon={HiOutlineUserGroup} as='div'>
                    Users
                  </Sidebar.Item>
                </Link>
                )}
                {currentUser.isAdmin && (
                  <Link to='/dashboard?tab=categories'>
                  <Sidebar.Item active={tab==='categories'} icon={HiDocumentReport} as='div'>
                    Categories
                  </Sidebar.Item>
                </Link>
                )}
                {currentUser.isAdmin && (
                  <Link to='/dashboard?tab=comments'>
                  <Sidebar.Item active={tab==='comments'} icon={HiAnnotation} as='div'>
                    Comments
                  </Sidebar.Item>
                </Link>
                )}
                <Sidebar.Item icon={HiArrowSmRight} classname='cursor-pointer' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}
