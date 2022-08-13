

import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { validations } from '@/utilites';

import { AuthLayout } from '../../components/layout/AuthLayout';

type FormData = {
  email: string,
  password: string,
};

const LoginPage = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);


  const onLoginUser = async ({ email, password }: FormData) => {

    setShowError(false);

    // const isValidLogin = await loginUser( email, password );
    // if ( !isValidLogin ) {
    //     setShowError(true);
    //     setTimeout(() => setShowError(false), 3000);
    //     return;
    // }
    // // Todo: navegar a la pantalla que el usuario estaba
    // const destination = router.query.p?.toString() || '/';
    // router.replace(destination);
    const login = await signIn('credentials', { email, password, redirect: false });
    if (!login?.ok) {
      toast.error('Error al iniciar sesión', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });
      return;
    }

    router.reload();

  }

  return (
    <AuthLayout title='Inicia Sesión'>
      <div className="w-full mx-4 max-w-sm sm:max-w-md md:max-w-lg 2xl:max-w-2xl sm:mx-0 p-8 mt-4  text-left sm:p-6 md:p-8  bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Inicia Sesion</h3>
        <form onSubmit={handleSubmit(onLoginUser)} noValidate>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Email</label>
              <input type="email" placeholder="Email" {...register('email', {
                required: 'Este campo es requerido',
                validate: validations.isEmail

              })}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-0 ${errors.email ? 'focus:ring-red-600 border-red-600' : 'focus:ring-blue-600'}`} />
              {!!errors.email && <span className='text-sm text-red-700'>{errors.email.message}</span>}
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input type="password" placeholder="Password"  {...register('password', {
                required: 'Este campo es requerido',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
                className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-0 ${errors.password ? 'focus:ring-red-600 border-red-600' : 'focus:ring-blue-600'}`} />
              {!!errors.password && <span className='text-sm text-red-700'>{errors.password.message}</span>}
            </div>
            <div className="flex items-baseline justify-between">
              <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
              <Link href="/auth/register"><a className="text-sm text-blue-600 hover:underline">Registrate</a></Link>
            </div>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const session = await getSession({ req });
  console.log({ session });

  const { p = '/' } = query;

  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false
      }
    }
  }


  return {
    props: {}
  }
}

export default LoginPage;