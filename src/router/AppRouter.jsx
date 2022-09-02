import { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPage } from "../auth"
import { CalendarPage } from "../calendar"
import { useAuthStore } from "../hooks"


export const AppRouter = () => {

    // let authStatus = 'not-authenticated'
    
     const { status, checkAuthToken } = useAuthStore();

     useEffect(() => {
        checkAuthToken()
      
     }, [])
     
     
     if ( status === 'checking' ) {
        return (
            <h3> Cargando... </h3>
        )
        
     }
    

   
        return (
            
        <Routes>
        {
            ( status === 'not-authenticated' ) 
            ? (
                <>
                <Route path="/auth/*" element={ <LoginPage/> } />
                 <Route path="/*" element={ <Navigate to='/auth/login' /> } /> /*Esta ruta en principio en innecesaria pero la utilizo como un "Safe"

                </>
            ) 
            :  (
                <>
                <Route path="/" element={ <CalendarPage /> } />
                <Route path="/*" element={ <Navigate to='/' /> } />

                </>
                
                )
           
        }
            
        </Routes>
  )
}
