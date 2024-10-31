// context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthAdmin, setIsAuthAdmin] = useState(false);
  const [authuser, setAuthUser] = useState('')
  const [authadmin, setAuthAdmin] = useState('')
  const router = useRouter();

  // Check for token in localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try{
        const decode = jwtDecode(token)
        setAuthUser(decode)
        setIsAuthenticated(true);
      } catch(err) {
        console.log('Invalid token')
        setIsAuthenticated(false);
      }
    }
  }, []);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decode = jwtDecode(token);
        setAuthAdmin(decode);
        

        // Check roles or claims to set isAuthAdmin if applicable
        if (decode.role === 'admin') { // Assuming the token has a role field
          setIsAuthAdmin(true);
        }
        setIsAuthenticated(true);
      } catch (err) {
        console.log('Invalid token');
        setIsAuthenticated(false);
        setIsAuthAdmin(false); // Reset admin auth state if token is invalid
      }
    }
  }, []);

  console.log(authadmin?.Full_name,"data2")

  const signOut = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    // router.push('/auth/signin');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAuthAdmin, setIsAuthAdmin, signOut, authuser, authadmin }}>
      {children}
    </AuthContext.Provider>
  );
};
