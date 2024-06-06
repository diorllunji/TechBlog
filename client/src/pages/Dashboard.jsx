import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashPosts from '../components/DashPosts';
import DashUsers from '../components/DashUsers';
import DashCategories from '../components/DashCategories';
import DashComments from '../components/DashComments.jsx';
import DashboardComp from '../components/DashboardComp.jsx';

export default function Dashboard() {
  const location=useLocation();
  const [tab,setTab]=useState('');
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabFromUrl=urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search]);
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
      {/* Sidebar */}
      <DashSidebar/>
    </div>
    {/* profile */}
    {tab==='profile' && <DashProfile/>}
    {/* posts... */}
    {tab==='posts' && <DashPosts/>}
    {/*users */}
    {tab==='users' && <DashUsers/>}
    {/*categories*/}
    {tab==='categories' && <DashCategories/>}
    {/*comments*/}
    {tab==='comments'&& <DashComments/>}
    {/*Dashboard*/}
    {tab==='dashboard'&&<DashboardComp/>}
    </div>
    
    
  );
};
