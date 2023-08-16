import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Register from "../screens/Register";

const Stack = createNativeStackNavigator();

export default function AppStack() {
	const options = { headerShown: false };

	return (
		<Stack.Navigator>
			<Stack.Screen name="Home" component={Home} options={options} />
			<Stack.Screen name="Login" component={Login} options={options} />
			<Stack.Screen name="Register" component={Register} options={options} />
		</Stack.Navigator>
	);
}
