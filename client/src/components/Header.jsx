import { Avatar, Button, Dropdown, DropdownDivider, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate,Navigate } from 'react-router-dom'
import {AiOutlineSearch} from 'react-icons/ai'
import {FaMoon,FaSun} from 'react-icons/fa'
import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice.js';
import { signoutSuccess } from '../redux/user/userSlice.js'

export default function Header() {
    const path=useLocation().pathname;
    const {currentUser}=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const {theme}=useSelector((state)=>state.theme);
    const navigate=useNavigate();

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
            navigate('/sign-in')
          } 
        }
        catch(error){
          console.log(error.message);
        }
      }

  return (
    <Navbar className='border-b-2'>
        <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-700 
            via-purple-700 to-cyan-900 rounded-lg text-white'>Tech</span>
            Blog
        </Link>
        <form>
            <TextInput 
                type='text'
                placeholder='Search...'
                rightIcon={AiOutlineSearch}
                className='hidden lg:inline'
            />
        </form>
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
            <AiOutlineSearch/>
        </Button>
        <div className='flex gap-2 md:order-2'>
            <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={()=>dispatch(toggleTheme())}>
                {theme==='light'?<FaSun/>:<FaMoon/>}
            </Button>
            {currentUser?(
                <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.profilePicture}/>}>
                    <Dropdown.Header>
                        <span className='block text-sm'>@{currentUser.username}</span>
                        <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
                    </Dropdown.Header>
                    <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item>Profile</Dropdown.Item>
                    </Link>
                    <Dropdown.Divider/>
                    <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
                </Dropdown>
            ):
            (
                <Link to='/sign-in'>
                <Button gradientDuoTone='purpleToBlue'>
                    Sign In
                </Button>
            </Link>
            )
        }
            
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path==="/"}>
                    <Link to='/'>
                        Home
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==="/about"}>
                    <Link to='/about'>
                        About
                    </Link>
                </Navbar.Link>
                <Navbar.Link active={path==="/projects"}>
                    <Link to='/projects'>
                        Projects
                    </Link>
                </Navbar.Link>
            </Navbar.Collapse>
        
    </Navbar>
  )
}
