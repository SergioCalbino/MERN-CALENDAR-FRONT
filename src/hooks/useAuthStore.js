//Tiene como objetivo hacer tareas sobre nuestro authStore. Es una forma alternativa a los thunks

import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { onLogoutCalendar } from "../store";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const startLogin = async ({ email, password }) => {
    dispatch( onChecking() )

    try {
        const { data } = await calendarApi.post("/auth", { email, password });// Hacemos destructoring de data
        localStorage.setItem('token', data.token) // Almacenamos en el localStorage el token
        localStorage.setItem('token-init-date', new Date().getTime() ) // Almacenamos en el localStorage una representacion de la fecha del token
        dispatch( onLogin({ name: data.name, uid: data.uid }) )
    
    } catch (error) {
      dispatch( onLogout('Credenciales incorrectas') );
      setTimeout(() => {
        dispatch( clearErrorMessage() )
        
      }, 10);
    }
  };

  const startRegister = async ({ email, password, name }) => {
    dispatch( onChecking() )

    try {
        const { data } = await calendarApi.post("/auth/new", { email, password, name });// Hacemos destructoring de data
       
        localStorage.setItem('token', data.token) // Almacenamos en el localStorage el token
        localStorage.setItem('token-init-date', new Date().getTime() ) // Almacenamos en el localStorage una representacion de la fecha del token
        dispatch( onLogin({ name: data.name, uid: data.uid }) )
    
    } catch (error) {
      dispatch( onLogout( error.response.data?.msg || '---' ) );
      setTimeout(() => {
        dispatch( clearErrorMessage() )
        
      }, 10);
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if ( !token ) return dispatch( onLogout() );

    try {
        const { data } = await calendarApi.get('auth/renew')
        console.log(data)
        localStorage.setItem('token', data.token) // Almacenamos en el localStorage el token
        localStorage.setItem('token-init-date', new Date().getTime() ) // Almacenamos en el localStorage una representacion de la fecha del token
        dispatch( onLogin({ name: data.name, uid: data.uid }) )
    } catch (error) {
        localStorage.clear();
        dispatch( onLogout() )
        
    }

  }

  const startLogout = () => {
    localStorage.clear();
    dispatch( onLogoutCalendar() )
    dispatch( onLogout() )
  }



  return {
    //propiedades
    status,
    user,
    errorMessage,

    //metodos
    startLogin,
    startRegister,
    checkAuthToken,
    startLogout
  };
};
