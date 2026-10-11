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
	  let cancelled = false;

	  void Promise.resolve().then(() => {
		if (!cancelled) {
		  setToken(getToken());
		}
	  });

	  return () => {
		cancelled = true;
	  };
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