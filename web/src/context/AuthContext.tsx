import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../api/axios';
import Cookies from 'js-cookie';

type SignInProps = {
  email: string
  password: string
}

type UserProps = {
  userId: number
  username: string
  email: string
}

type AuthContextProps = {
  user: UserProps
  signIn(form : SignInProps): Promise<string>
  logOut: () => void
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children } : AuthProviderProps) {

	const [ isAuthenticated, setIsAuthenticated ] = useState(false)
	const [ user, setUser ] = useState<UserProps>({} as any)

	useEffect(() => {
	}, [])
	
	async function signIn(form : SignInProps) : Promise<string> {
		try {
			const { data } = await api.post("UserAccount/login", {
				email: form.email,
				password: form.password
			})

			setUser(data.user)
			setIsAuthenticated(true)
			Cookies.set("token", data.token)

			return new Promise((res) => {
				res("Success")
			})
		} catch {
			setUser({} as any)
			setIsAuthenticated(false)
			return new Promise((__, rej) => {
				rej("Email or Password invalid!")	
			})
		}
	}

	function logOut() {
		setIsAuthenticated(false)
	}

	return (
    <AuthContext.Provider value={{isAuthenticated, signIn, logOut, user}}>
      {children}
    </AuthContext.Provider>
  )
}