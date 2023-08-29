import React from "react";
import { Link } from "expo-router";
import RegisterForm from "../../components/RegisterForm";
import Container from "../../components/UI/container";

export default function RegisterScreen() {
	return (
		<Container title="Register">
			<RegisterForm />
			<Link href="/login">Login</Link>
		</Container>
	);
}
