import Router from "./src/navigation/Router";
import AuthProvider from "./src/context/AuthContext";

export default function App() {
	return (
		<AuthProvider>
			<Router />
		</AuthProvider>
	);
}
