import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";

const Stack = createNativeStackNavigator();

export default function AppStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name="Login Screen" component={Login} />
			<Stack.Screen name="Register Screen" component={Register} />
		</Stack.Navigator>
	);
}
