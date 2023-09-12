import { AntDesign, Entypo } from "@expo/vector-icons";
import { useForm } from "react-hook-form";

/**
 * A hook to abstract some properties required by login and register form
 * @hook
 * @returns an array with list of inputs, and control, handleSubmit and errors from react hook form
 */
function useAuthForm() {
	const inputs = [
		{
			name: "email",
			rules: {
				required: "Email address is required",
				pattern: {
					value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
					message:
						"Email address should be of the form something@example.com",
				},
			},
			secure: false,
			placeholder: "Email address",
			Icon: <Entypo name="email" size={24} color="black" />,
		},
		{
			name: "password",
			rules: {
				required: "Password is required",
				minLength: {
					value: 6,
					message: "Password should be at least 6 characters long",
				},
			},
			placeholder: "Password",
			secure: true,
			Icon: <AntDesign name="unlock" size={24} color="black" />,
		},
	];

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	return { inputs, control, handleSubmit, errors };
}

export { useAuthForm };
