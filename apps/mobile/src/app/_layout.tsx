import {
	Slot,
	useRootNavigationState,
	useRouter,
	useSegments,
} from "expo-router";
import AuthProvider, { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";

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

export default function RootLayout() {
	return (
		<AuthProvider>
			<AppStack />
		</AuthProvider>
	);
}
