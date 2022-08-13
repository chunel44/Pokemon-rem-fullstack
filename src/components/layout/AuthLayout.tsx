

import React, { FC } from 'react'
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Seo from '@/components/Seo';

interface Props {
  children: React.ReactNode;
  title?: string;
}

export const AuthLayout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <Seo title={title} />
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {children}
      </div>
    </>
  )
}
