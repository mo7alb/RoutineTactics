import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	Slot,
	useRootNavigationState,
	useRouter,
	useSegments,
} from "expo-router";
import React, { useEffect } from "react";
import AuthProvider, { useAuthContext } from "../context/authContext";

/**
 * A react component that authenticates users and redirects them to the correct page
 * @component
 */
function AppStack() {
	const user = useAuthContext();
	const router = useRouter();
	const segments = useSegments();
	const navigationState = useRootNavigationState();

	useEffect(() => {
		if (!navigationState?.key) return;
		const inPublicRoute = segments[0] === "(public)";

		if (user != null && !inPublicRoute) router.push("/(protected)/dashboard");

		if (user == null) router.replace("/");
	}, [user]);

	return <Slot />;
}

const queryClient = new QueryClient();

/**
 * A layout that provides user and tanstack query provider to the whole app
 * @component
 */
export default function RootLayout() {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<AppStack />
			</QueryClientProvider>
		</AuthProvider>
	);
}
