import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

export default function Router() {
	const authenticated: boolean = true;
	return (
		<NavigationContainer>
			{authenticated ? <AppStack /> : <AuthStack />}
		</NavigationContainer>
	);
}
