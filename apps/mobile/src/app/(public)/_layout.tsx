import { Stack } from "expo-router";

/**
 * A react layout component that defines structure of the public screens like login, register, and reset password
 * @component
 */
export default function PublicLayout() {
	return (
		<Stack>
			<Stack.Screen name="register" options={{ headerShown: false }} />
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="resetPass" options={{ headerShown: false }} />
		</Stack>
	);
}
