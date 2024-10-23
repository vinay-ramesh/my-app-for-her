import React from 'react';
import Footer from '../../../common/Footer/Footer';
import LoginHeader from '../../../common/LoginHeader/LoginHeader';
import ResetPasswordForm from '../../../common/ResetPasswordForm/ResetForm';

const ResetPassword = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col">
      <LoginHeader />
      <ResetPasswordForm />
      <Footer />
    </div>
  );
};

export default ResetPassword;
