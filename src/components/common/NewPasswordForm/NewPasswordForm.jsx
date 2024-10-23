import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { generateNewPassword } from '../../../api/login';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ImageAssets from '../../../assets/imageAsset';
import InputField from '../InputField/InputField';
import SubmitButton from '../SubmitButton/SubmitButton';

const NewPasswordForm = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const [showSuccessText, setShowSuccessText] = useState(false);
  const [togglePassword, setTogglePassword] = useState(false);
  const {
    setValue,
    clearErrors,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
  } = useForm();

  useEffect(() => {
    register('password', {
      required: true,
      minLength: {
        value: 8,
        message: 'Password Must Contain Minimum 8 Characters',
      },
      maxLength: {
        value: 16,
        message: 'Password Cannot Exceed 16 Characters',
      },
      validate: (value) => {
        return (
          [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/].every((pattern) => pattern.test(value)) ||
          'Password Must Include Lower, Upper, Number and Special Characters'
        );
      },
    });
    register('confirmPassword', {
      required: true,
      min: 8,
      max: 16,
      validate: (val) => {
        if (watch('password') != val) {
          return 'Your Passwords do no match';
        }
      },
    });
  }, [register]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
    clearErrors(name);
  };

  const handleToggle = () => {
    setTogglePassword(!togglePassword);
  };

  const onSubmit = async () => {
    const formData = {
      user_id: user_id,
      password: getValues('password'),
    };
    try {
      let response = await generateNewPassword(formData);
      //   console.log('response', response);
      if (response?.status) {
        toast.success('Password reset done successfully!', { duration: 3000 });
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
    <main className="grow flex flex-wrap sm:flex-col-reverse justify-center sm:w-full md:w-full w-[75%] lg:w-[80%] mx-auto">
      <div className="w-full sm:h-auto md:h-auto md:w-auto lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex sm:gap-y-5 justify-center gap-y-5 flex-col sm:p-6 md:p-8 lg:p-2 xl:p-2 2xl:p-2">
        <div className="max-w-[25rem] mx-auto flex flex-col gap-4">
          <div className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-xl font-sans font-medium text-gray-900 pb-3">
            New Password
          </div>
          <div className="text-sm md:text-md lg:text-md xl:text-lg 2xl:text-lg font-sans font-medium text-gray-500">
            To change your current Password, type the new password, and then retype it. Click Save.
          </div>
          <div className="text-sm md:text-md lg:text-md xl:text-lg 2xl:text-lg font-sans font-medium text-gray-500">
            We recommend you to have long password with a mix of capital and lowercase letters, numbers, and symbols.
          </div>
        </div>
        {showSuccessText ? (
          <div className="max-w-[25rem] mx-auto">
            <div className="text-sm md:text-md lg:text-lg xl:text-xl 2xl:text-2xl font-sans font-medium text-green-500 pb-6">
              Your new password has been saved.
            </div>
            <button
              className="border border-[#1A56DB] p-4 rounded-lg text-[#1A56DB] font-medium"
              onClick={() => {
                navigate('/');
              }}
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-y-5 max-w-[25rem] mx-auto w-full">
            <InputField
              name="password"
              type="password"
              placeholder="Password"
              errorMessage={errors.password?.message || 'Please Enter Your Password'}
              value={getValues('password')}
              error={!!errors.password}
              handleChange={handleChange}
            />
            <InputField
              name="confirmPassword"
              type={togglePassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message || 'Please Enter Same Password as Above'}
              value={getValues('confirmPassword')}
              handleChange={handleChange}
              showPassword={true}
              handleToggle={handleToggle}
            />
            <SubmitButton handleSubmit={handleSubmit(onSubmit)} />
          </div>
        )}
      </div>
      <div className="w-full sm:h-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 flex">
        <img
          src={ImageAssets.Login_Male}
          alt="login_illustration"
          className="w-[75%] sm:w-auto sm:h-[calc(100dvh-500px)]   ml-auto sm:mx-auto md:mx-auto "
        />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
};

export default NewPasswordForm;
