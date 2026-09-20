"use client";


import {
  useEffect,
  useState
} from "react";


import {
  getToken,
  removeToken
} from "@/lib/auth";



export function useAuth() {


  const [token, setToken] = useState<string | null>(null);


  useEffect(() => {

    setToken(
      getToken()
    );

  }, []);



  function logout() {

    removeToken();

    setToken(null);

  }



  return {

    token,

    isLoggedIn: !!token,

    logout

  };

}