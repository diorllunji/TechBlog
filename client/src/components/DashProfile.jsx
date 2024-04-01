import { useState, React, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateFailure,updateSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess } from '../redux/user/userSlice.js';
import { useDispatch } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import { Navigate, useNavigate } from 'react-router-dom';

export default function DashProfile() {
  const navigate=useNavigate();
  const { currentUser, error } = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileProgress, setImageFileProgress] = useState(null);
  const [imageFileError, setImageFileError] = useState(null);
  const [imageFileUploading,setImageFileUploading]=useState(false);
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
  const [updateUserError,setUpdateUserError]=useState(null);
  const [showModal,setShowModal]=useState(false);
  const [formData,setFormData]=useState({});
  const filePickerRef = useRef();
  const dispatch=useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileProgress(null); // Reset progress when a new image is selected
      setImageFileError(null); // Reset error when a new image is selected
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileError('Could not upload image');
        setImageFileProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({...formData,profilePicture:downloadURL});
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value})
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if(Object.keys(formData).length===0){
      setUpdateUserError("No changes made");
      return;
    }

    if(imageFileUploading){
      setUpdateUserError("Please wait for the image to be uploaded");
      return;
    }

    try{
      dispatch(updateStart());
      const res=await fetch(`/api/user/update/${currentUser.id}`,{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData),
      });
      const data=await res.json();
      if(!res.ok){
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      }
      else{
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User profile updated successfully");
      }
    }catch(error){
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  }

  const handleDeleteUser=async()=>{
    setShowModal(false);
    try{
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser.id}`,{
        method:'DELETE',
      });
      const data=await res.json();

      if(!res.ok){
        dispatch(deleteUserFailure(data.message));
      }else{
        dispatch(deleteUserSuccess(data));
        navigate('/sign-in');
      }

    }catch(error){
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden />
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}>
          {imageFileProgress && (
            <CircularProgressbar value={imageFileProgress || 0}
              text={`${imageFileProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileProgress / 100})`
                }
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
            className={`rounded-full w-full object-cover
           h-full border-8 
          border-[lightgray] ${imageFileProgress && imageFileProgress < 100 && 'opacity-60'}`} />
        </div>
        {imageFileError && (
          <Alert color='failure'>
            {imageFileError}
          </Alert>
        )}
        <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='E-Mail' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='Password'  onChange={handleChange}/>
        <Button type='submit' gradientDuoTone='blueToPurple' outline>
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span onClick={()=>setShowModal(true)} className='cursor-pointer'>Delete</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>
          {updateUserSuccess}
        </Alert>
      )}
       {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>
          {updateUserError}
        </Alert>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>Yes</Button>
              <Button color='gray' onClick={()=>setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

