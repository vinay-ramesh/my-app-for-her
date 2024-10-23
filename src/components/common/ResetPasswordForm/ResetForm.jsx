import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getResetPasswordEmail } from '../../../api/login';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import ImageAssets from '../../../assets/imageAsset';
import InputField from '../InputField/InputField';
import SubmitButton from '../SubmitButton/SubmitButton';

const ResetPasswordForm = () => {
  const [showSuccessText, setShowSuccessText] = useState(false);
  const {
    setValue,
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  useEffect(() => {
    register('email', {
      required: true,
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/i,
      },
    });
    return () => {
      setShowSuccessText(false);
    };
  }, [register]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
    clearErrors(name);
  };

  const onSubmit = async () => {
    const formData = {
      email_id: getValues('email'),
    };
    try {
      let response = await getResetPasswordEmail(formData);
      console.log('response', response);
      if (response?.status) {
        toast.success('Email sent successfully!', { duration: 3000 });
        setShowSuccessText(!showSuccessText);
      } else {
        toast.error('Something wrong in sending reset email!');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message, { duration: 3000 });
      console.log('error in getResetPasswordEmail', err);
    }
  };

  return (
    <main className="grow flex flex-wrap sm:flex-col-reverse  justify-center sm:w-full md:w-full  w-[75%] mx-auto">
      <div className="w-full  sm:h-auto md:h-auto md:w-full  lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex sm:gap-y-5 justify-center gap-y-5 flex-col sm:p-6 md:p-8 lg:p-2 xl:p-2 2xl:p-2">
        <div className="lg:w-[90%] xl:w-[90%] 2xl:w-[90%]">
          <div className="max-w-[25rem] mx-auto mb-8">
            <div className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-sans font-medium text-gray-900 pb-3">
              Reset Password
            </div>
            <div className="text-sm md:text-md lg:text-md xl:text-md 2xl:text-lg font-sans font-medium text-gray-500">
              Please reset the password for security reasons or if you cannot remember it. We will send you a link to your
              registered email id. Click on the link, reset the password and you are ready to go again!
            </div>
          </div>
          {showSuccessText ? (
            <div className="max-w-[25rem] mx-auto">
              <div className="text-sm md:text-sm lg:text-md xl:text-md 2xl:text-lg font-sans font-medium text-green-500 flex  gap-3">
                <img src={ImageAssets.Green_Check} alt="success_tick" className="flex-shrink-0" />
                <>{`Password Reset email link has been sent to ${getValues('email')}`}</>
              </div>
              <div className="text-sm md:text-sm lg:text-md xl:text-lg 2xl:text-lg font-sans font-medium text-gray-400 pt-3">
                Sent to wrong email?{' '}
                <Link style={{ color: '#3F83F8' }} onClick={() => setShowSuccessText(!showSuccessText)}>
                  Change
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-y-5 max-w-[25rem] mx-auto w-full">
              <InputField
                name="email"
                type="email"
                placeholder="Please enter registered email id here"
                errorMessage={'Please Enter Valid Email'}
                value={getValues('email')}
                error={!!errors.email}
                handleChange={handleChange}
              />
              <SubmitButton handleSubmit={handleSubmit(onSubmit)} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full sm:h-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex">
        <img
          src={ImageAssets.Login_Female}
          alt="login_illustration"
          className="w-[75%] sm:w-auto sm:h-[calc(100dvh-440px)] md:h-[calc(100dvh-440px)]  ml-auto sm:mx-auto md:mx-auto "
        />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
};

export default ResetPasswordForm;
