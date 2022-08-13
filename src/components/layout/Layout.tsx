import React, { FC } from 'react'
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import Seo from '@/components/Seo';
import { Navbar } from '@/components/ui/Navbar';

interface Props {
  children: React.ReactNode,
  title?: string;
}

export const Layout: FC<Props> = ({ children, title }) => {
  return (
    <>
      <Seo title={`${title} - PokeApp`} />
      <ToastContainer />
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}
