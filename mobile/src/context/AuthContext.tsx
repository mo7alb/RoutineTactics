import React, { useContext, createContext, useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { Auth } from "../config/firebaseConfig";

const AuthContext = createContext<User | null>(null);

interface ProviderProps {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: ProviderProps) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(Auth, user => setUser(user));

		return () => unsubscribe();
	}, []);

	return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
	return useContext(AuthContext);
};
