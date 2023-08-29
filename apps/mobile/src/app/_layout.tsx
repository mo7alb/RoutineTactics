import {
	Slot,
	useRootNavigationState,
	useRouter,
	useSegments,
} from "expo-router";
import AuthProvider, { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AppStack() {
	const user = useAuthContext();
	const router = useRouter();
	const segments = useSegments();
	const navigationState = useRootNavigationState();

	useEffect(() => {
		if (!navigationState?.key) return;
		const inPublicRoute = segments[0] === "(public)";

		if (user != null && !inPublicRoute) router.replace("/dashboard");
		if (user == null) router.replace("/");
	}, [user]);

	return <Slot />;
}

const queryClient = new QueryClient();

export default function RootLayout() {
	return (
		<AuthProvider>
			<QueryClientProvider client={queryClient}>
				<AppStack />
			</QueryClientProvider>
		</AuthProvider>
	);
}
