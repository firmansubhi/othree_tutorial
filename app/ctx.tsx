import { createContext, useContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";

const AuthContext = createContext<{
	signIn: (username: string, role: string, tokenString: string) => void;
	signOut: () => void;
	session?: string | null;
	role?: string | null;
	token?: string | null;
	isLoading: boolean;
}>({
	signIn: (username: string, role: string, tokenString: string) => null,
	signOut: () => null,
	session: null,
	role: null,
	token: null,
	isLoading: false,
});

// This hook can be used to access the user info.
export const useSession = () => {
	const value = useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error(
				"useSession must be wrapped in a <SessionProvider />"
			);
		}
	}

	return value;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
	const [[isLoading, session], setSession] = useStorageState("session");
	const [[tmp1, role], setRole] = useStorageState("role");
	const [[tmp2, token], setToken] = useStorageState("token");

	return (
		<AuthContext.Provider
			value={{
				signIn: (
					username: string,
					role: string,
					tokenString: string
				) => {
					// Perform sign-in logic here
					setSession(username);
					setRole(role);
					setToken(tokenString);
				},
				signOut: () => {
					setSession(null);
					setRole(null);
					setToken(null);
				},
				session,
				role,
				token,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

//module.exports = { useSession, SessionProvider };
