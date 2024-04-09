import { useState, useEffect } from 'react';
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdateCategory() {

  const [categoryName, setCategoryName] = useState('');
  const [updateCategorySuccess, setUpdateCategorySuccess] = useState(null);
  const [updateCategoryError, setUpdateCategoryError] = useState(null);
  const [loading, setLoading] = useState(false);
  const {categoryId}=useParams();
  const {currentUser}=useSelector(state=>state.user);

  useEffect(() => {
    const fetchCategoryName=async()=>{
        try{
            const res=await fetch(`/api/category/getcategorybyid/${categoryId}`);
            const data=await res.json();
            if (res.ok){
                setCategoryName(data.name);
            }else{
                setUpdateCategoryError('Failed to fetch name');
            }
        }catch(error){
            setUpdateCategoryError("Error occurred");
        }
    };
    fetchCategoryName();
  }, []);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateCategoryError(null);
    setUpdateCategorySuccess(null);

    if (!categoryName) {
      setUpdateCategoryError('Category name is required');
      return;
    }

    setLoading(true);

    try {
      // Make API request to update category
      // Example:
      const res = await fetch(`/api/category/updatecategory/${categoryId}/${currentUser.id}`, {
         method: 'PUT',
         headers: {
          'Content-Type': 'application/json'
         },
         body: JSON.stringify({ name: categoryName })
      });
       const data = await res.json();
      
       if (!res.ok) {
         setUpdateCategoryError(data.message);
       } else {
         setUpdateCategorySuccess('Category updated successfully');
       }
    } catch (error) {
      setUpdateCategoryError('An error occurred while updating the category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Update Category</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <TextInput type='text' id='categoryName' placeholder='Category Name' value={categoryName} onChange={handleChange} />
        <Button type='submit' gradientDuoTone='blueToPurple' outline disabled={loading}>
          {loading ? 'Loading' : 'Update'}
        </Button>
      </form>
      {updateCategorySuccess && (
        <Alert color='success' className='mt-5'>
          {updateCategorySuccess}
        </Alert>
      )}
      {updateCategoryError && (
        <Alert color='failure' className='mt-5'>
          {updateCategoryError}
        </Alert>
      )}
      
    </div>
  );
}
