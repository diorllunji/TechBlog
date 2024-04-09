import { Table, Modal, Button } from 'flowbite-react';
import  { useEffect, React, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashCategories() {
    const {currentUser}=useSelector(state=>state.user);
    const [userCategories,setUserCategories]=useState([]);
    const [showMore,setShowMore]=useState(false);
    const [showModal,setShowModal]=useState(false);
    const [categoryIdToDelete,setCategoryIdToDelete]=useState('');

    useEffect(()=>{
        const fetchCategories=async()=>{
            try{
                const res=await fetch(`/api/category/getcategory?userId=${currentUser.id}`)
                const data=await res.json();
                if(res.ok){
                    setUserCategories(data);
                    if(data.categories&&data.categories.length<9){
                        setShowMore(false);
                    }
                }
            }
            catch(error){
                console.log(error.message);
            }
        };
        if(currentUser.isAdmin){
            fetchCategories();
        }
    },[currentUser.id]);

    const handleShowMore=async()=>{
        const startIndex=userCategories.length;
        try{
            const res=await fetch(`/api/category/getcategory?userId=${currentUser.id}&startIndex=${startIndex}`);
            const data=await res.json();

            if(res.ok){
                setUserCategories((prev)=>[...prev,...data.categories]);
                if(data.categories && data.categories.length<9){
                    setShowMore(false);
                }
            }
        }
        catch(error){
            console.log(error.message);
        }
    }

    const handleDeleteCategory = async () => {
        setShowModal(false);
        try {
            const res = await fetch(`/api/category/deletecategory/${categoryIdToDelete}/${currentUser.id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
    
            if (!res.ok) {
                console.log(data.message);
            } else {
                setUserCategories(prev => prev.filter(category => category._id !== categoryIdToDelete));
            }
        } catch (error) {
            console.log(error.message);
        }
    };
    

  return (
    <div className='p-3 pl-20 table-auto overflow-x-scroll 
    md:mx-auto 
    scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300
    dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'
    >
        {currentUser.isAdmin && userCategories && userCategories.length>0 ? (
            <>
            <Table hoverable className='shadow-md'>
                <Table.Head>
                    <Table.HeadCell>Date updated</Table.HeadCell>
                    <Table.HeadCell>Date Created</Table.HeadCell>
                    <Table.HeadCell>Category Name</Table.HeadCell>
                    <Table.HeadCell>Delete</Table.HeadCell>
                    <Table.HeadCell><span>Edit</span></Table.HeadCell>
                </Table.Head>
                {userCategories.map((category)=>(
                    <Table.Body className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'> 
                            <Table.Cell>{new Date(category.updatedAt).toLocaleDateString()}</Table.Cell>
                            <Table.Cell>
                                {new Date(category.createdAt).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                                {category && category.name}
                            </Table.Cell>
                            <Table.Cell>
                                <span onClick={()=>{
                                    setShowModal(true);
                                    setCategoryIdToDelete(category._id);
                                }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                    Delete
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <Link className='text-green-400' to={`/update-category/${category._id}`}>
                                <span>
                                    Edit
                                </span>
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
            {
                showMore && (
                    <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
                        Show More
                    </button>
                )
            }
            </>
        ): (
            <p>You have no categories yet</p>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this category?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteCategory}>Yes</Button>
              <Button color='gray' onClick={()=>setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}