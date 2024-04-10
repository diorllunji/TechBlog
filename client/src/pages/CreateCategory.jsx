import { useState, useEffect } from 'react';
import { Alert, Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function CreateCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [createCategorySuccess, setCreateCategorySuccess] = useState(null);
  const [createCategoryError, setCreateCategoryError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector(state => state.user);

  const handleChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateCategoryError(null);
    setCreateCategorySuccess(null);

    if (!categoryName) {
      setCreateCategoryError('Category name is required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/category/createcategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: categoryName, userId: currentUser.id })
      });
      const data = await res.json();

      if (!res.ok) {
        setCreateCategoryError(data.message);
      } else {
        setCreateCategorySuccess('Category created successfully');
      }
    } catch (error) {
      setCreateCategoryError('An error occurred while creating the category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Create Category</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <TextInput type='text' id='categoryName' placeholder='Category Name' value={categoryName} onChange={handleChange} />
        <Button type='submit' gradientDuoTone='blueToPurple' outline disabled={loading}>
          {loading ? 'Creating' : 'Create'}
        </Button>
      </form>
      {createCategorySuccess && (
        <Alert color='success' className='mt-5'>
          {createCategorySuccess}
        </Alert>
      )}
      {createCategoryError && (
        <Alert color='failure' className='mt-5'>
          {createCategoryError}
        </Alert>
      )}
    </div>
  );
}