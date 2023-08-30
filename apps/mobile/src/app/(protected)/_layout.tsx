import { Tabs } from "expo-router";

export default function ProtectedLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="app"
				options={{
					headerShown: false,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					headerShown: false,
				}}
			/>
		</Tabs>
	);
}
