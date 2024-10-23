import React from 'react';
import LoginHeader from '../../../common/LoginHeader/LoginHeader';
import Footer from '../../../common/Footer/Footer';
import NewPasswordForm from '../../../common/NewPasswordForm/NewPasswordForm';

const NewPassword = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col">
      <LoginHeader />
      <NewPasswordForm />
      <Footer />
    </div>
  );
};

export default NewPassword;
