import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loginForm } from '../../../api/login';
import toast, { Toaster } from 'react-hot-toast';
import ReactPlayer from 'react-player/youtube';
import InputField from '../InputField/InputField';
import SubmitButton from '../SubmitButton/SubmitButton';
import SelectSchoolModal from '../SelectSchoolModal/SelectSchoolModal';
import axios from 'axios';

const LoginForm = () => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const {
    setValue,
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
    clearErrors(name);
  };

  const toggleModalOpenClose = () => {
    setOpenModal(!openModal);
  };

  const getVal = (name) => {
    return getValues(name);
  };

  // const testCloseOnError = () => {
  //   if (url) {
  //     toast.error('Cannot play preview for this video');
  //     setTimeout(() => {
  //       modalOpenClose();
  //     }, 3000);
  //   } else {
  //     modalOpenClose();
  //     toast.error('Cannot play video due to invalid url');
  //   }
  // };

  const onSubmit = async () => {
    const formData = {
      emailId: getValues('username'),
      phoneNumber: getValues('phone'),
    };
    try {
      let response = await axios.post(`https://mongodbtest-g09z.onrender.com/saveUser`, formData);
      console.log('response', response);
      if (response.data.code == 200) {
        toast.success('Thank you');
      } else {
        toast.error('Something went wrong');
      }
    } catch (err) {
      toast.error(err.response.data?.message, { duration: 3000 });
      console.log('error in login', err);
    }
  };

  return (
    <>
      <main className="grow flex flex-wrap sm:flex-col-reverse md:flex-col-reverse md:mx-auto justify-center sm:w-full md:w-full w-[75%] mx-auto">
        <div className="w-full md:self-end sm:h-1/2 md:max-w-[350px] md:mx-auto  lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex justify-center items-center sm:p-6 md:p-8 lg:p-0 xl:p-2 2xl:p-2">
          <form className="flex flex-col gap-y-5 w-[80%] 2xl:w-[70%] max-w-[40rem] mx-auto sm:w-full md:w-full">
            <InputField
              name="username"
              type="text"
              placeholder="Gombe antha save madla?? or type here anything"
              // placeholder="Name"
              errorMessage={'Please Enter Valid Email'}
              value={getVal('username') ? getVal('username') : ''}
              error={!!errors.username}
              handleChange={handleChange}
            />
            <InputField
              name="phone"
              type="phone"
              placeholder="Phone number please"
              errorMessage={'Please Enter Phone Number'}
              value={getVal('phone') ? getVal('phone') : ''}
              error={!!errors.phone}
              handleChange={handleChange}
            />
            <SubmitButton handleSubmit={handleSubmit(onSubmit)} />
          </form>
        </div>
        <div className="w-full justify-center items-center sm:h-1/2 md:w-auto lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex">
          {/* <img
            src={ImageAssets.Login_Male}
            alt="login_illustration"
            className="w-[100%] sm:w-auto sm:h-[calc(100dvh-440px)] md:h-[calc(100dvh-440px)]  ml-auto sm:mx-auto md:mx-auto "
          /> */}
          <ReactPlayer
            url="https://www.youtube.com/watch?v=Y0cf2U1IHl4"
            controls={true}
            // onError={testCloseOnError}
            // width={'50%'}
            // height={'50%'}
            muted={true}
            playing={true}
            pip={true}
            stopOnUnmount={false}
          />
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </main>
      {openModal ? <SelectSchoolModal openModal={openModal} toggleModalOpenClose={toggleModalOpenClose} /> : null}
    </>
  );
};

export default LoginForm;
