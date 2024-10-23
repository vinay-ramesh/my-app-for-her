import React, { useEffect, useState } from 'react';
import Footer from '../../common/Footer/Footer';
import LoginHeader from '../../common/LoginHeader/LoginHeader';
import LoginForm from '../../common/LoginForm/LoginForm';
import secureLocalStorage from 'react-secure-storage';

const Login = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col">
      {/* <LoginHeader /> */}
      <LoginForm />
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
