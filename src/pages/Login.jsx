import React, {useContext, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

import { doc, setDoc } from 'firebase/firestore';
import {toast} from "react-toastify";
import { db } from "../../firebase.js";
import {AuthContext} from "../context/AuthContext.jsx";
import { getAuth, GoogleAuthProvider, signInWithPopup,  OAuthProvider } from 'firebase/auth';
import {assets} from "../assets/assets.js";
import './Login.css'
const Login = () => {



    const [authState, setAuthState] = useState('')

    const [password, setPassword] = useState('');

    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const {signup, login, userName, setUserName, email, setEmail } = useContext(AuthContext);

    const [error, setError] = useState(null);
    const [loginState, setLoginState] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState('Error!! at sending the message!')

    async function handleAuthenticate() {
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating) {
            setError("Введите корректные данные");
            setEmail(email)
            setUserName(userName)
            toast.error('Введите корректные данные!')
            return;
        }

        try {
            setIsAuthenticating(true);
            setError(null);
            setAuthState('')
            setEmail(email)
            setUserName(userName)
            let user;
            if (!loginState) {
                setAuthState('signup')
                user = await signup(email, password);

            } else {
                setAuthState('login')
                user = await login(email, password);
            }

            if (user) {
                navigate('/');
                toast.success(`Поздравляем 🎉, вы успешно ${authState === 'signup' ? 'зарегистрировались' : 'вошли в аккаунт'} `)
            }
        } catch (err) {
            console.log(err.message);
            toast.error(`Ошибка авторизации:       Введите верные данные! `)
            setError("Ошибка авторизации: " + err.message);
        } finally {
            setIsAuthenticating(false);
        }
    }

    // РЕГИСТРАЦИЯ И АВТОРИЗАЦИЯ ЧЕРЕЗ ГУГЛ
    async function handleGoogleLogin() {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            setIsAuthenticating(true);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Сохранение данных пользователя в Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                username: user.displayName,
                email: user.email,
            }, {merge: true});
            localStorage.setItem("email", JSON.stringify(user.email))
            setEmail(user.email);
            setUserName(user.displayName); // Set the state


            navigate('/');
            toast.success(`Поздравляем 🎉, вы успешно ${authState === 'signup' ? 'зарегистрировались' : 'вошли в аккаунт'} `)
        } catch (err) {
            console.error("Ошибка при входе через Google: ", err);
            toast.error(`Ошибка при входе через Google: ${err.message} `)
            setError("Ошибка при входе через Google: " + err.message);
        } finally {
            setIsAuthenticating(false);
        }
    }






    return (
        <div className='w-100  ' >
            { isAuthenticating ? (
                <div style={{height: '84vh'}} className='w-full flex flex-col items-center justify-center'>
                    <img src={assets.video} width='350px' alt="Loading animation"/>
                    <img src={assets.logo} className='w-25' alt=""/>


                </div>) : (


                <form id='bgshka' onSubmit={(e) => {
                    e.preventDefault()
                }} className='min-h-[80vh] flex items-center'>

                    <div style={{background: 'white'}}
                         className={'flex  flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'}>
                        <p className='text-2xl font-semibold'>{loginState ? 'Войти' : "Создать аккаунт"}</p>
                        <p className='text-1xl'>Пожалуйста {loginState ? 'Войдите в аккаунт' : 'Зарегистрируйтесь'} чтобы
                            стать покупателем</p>
                        {!loginState && (
                            <div className='w-full'>
                                <p>Имя</p>
                                <input className='border border-zinc-300 rounded w-full p-2 mt-1' required={true}
                                       type='text' value={userName} onChange={(e) => {
                                    setUserName(e.target.value)
                                }}/>
                            </div>
                        )}
                        <div className='w-full'>
                            <p>Email-почта</p>
                            <input className='border border-zinc-300 rounded w-full p-2 mt-1' required={true}
                                   type="email"
                                   value={email} onChange={(e) => {
                                setEmail(e.target.value)
                            }}/>
                        </div>

                        <div>
                            <p>Пароль</p>
                            <input className='border border-zinc-300 rounded w-full p-2 mt-1' required={true}
                                   type="password" value={password} onChange={(e) => {
                                setPassword(e.target.value)
                            }}/>
                        </div>
                        {loginState && (
                            <Link to='/resetPassword'><p className='hover:underline'>Забыли пароль?</p></Link>
                        )}

                        <button onClick={handleAuthenticate}
                                className={'bg-primary text-white w-full py-2 rounded-md text-base'}>{loginState ? 'Авторизироваться' : 'Зарегистрироваться'}

                        </button>

                        <div className='border flex items-center justify-center w-full'>


                            <button style={{marginLeft: 'auto', marginRight: 'auto'}} onClick={handleGoogleLogin}
                                    className='  flex items-center gap-3 justify-center  text-black w-60 py-2 rounded-md text-base'>
                                <svg xmlns="http://www.w3.org/2000/svg"
                                     viewBox="0 0 488 512" width='18px' height='18px'>
                                    <path
                                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                                </svg>
                                {!loginState ? 'Создать через Goggle' : 'Войти через Goggle'}

                            </button>

                        </div>


                        {isAuthenticating ? 'Инициализируем...' :
                            !loginState ? (<p>Уже были у нас? <span onClick={() => {
                                    setLoginState(!loginState)
                                }} className='text-primary underline cursor-pointer'>Войти в аккаунт</span></p>)
                                : (<p>Впервые на сайте? <span className='text-primary underline cursor-pointer'
                                                              onClick={() => {
                                                                  setLoginState(!loginState)
                                                              }}>Создать аккаунт</span></p>)
                        }


                    </div>
                </form>

            )}
        </div>

    )

}
export default Login
