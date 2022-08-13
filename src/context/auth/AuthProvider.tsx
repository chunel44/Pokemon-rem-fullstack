import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { FC, useEffect, useReducer } from 'react';

import { localApi } from '@/api';
import { AuthContext, authReducer } from '@/context/auth';
import { IUser } from '@/models';


export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

interface Props {
    children: React.ReactNode
}


const AuthProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
    const { data, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        }

    }, [status, data])



    // useEffect(() => {
    //     checkToken();
    // }, [])

    const checkToken = async () => {

        if (!Cookies.get('token')) {
            return;
        }

        try {
            const { data } = await localApi.get('/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }



    const loginUser = async (email: string, password: string): Promise<boolean> => {

        try {
            const { data } = await localApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return true;
        } catch (error) {
            return false;
        }

    }


    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await localApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            //Cookies.set('token', token);
            dispatch({ type: '[Auth] - Login', payload: user });
            return {
                hasError: false
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const { message } = error.response?.data as { message: string };

                return {
                    hasError: true,
                    message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }


    const logout = () => {
        signOut();
    }



    return (
        <AuthContext.Provider value={{
            ...state,

            // Methods
            loginUser,
            registerUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
};

export default AuthProvider;