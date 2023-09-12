import React, { useState } from "react";
import {
	KeyboardAvoidingView,
	Pressable,
	StyleSheet,
	Text,
} from "react-native";
import Input from "./Input";

type input = {
	name: string;
	placeholder: string;
	secure: boolean;
	rules: Record<string, any>;
	Icon: React.ReactNode;
};

type Props = {
	inputs: input[];
	control: any;
	errors: any;
	action: () => void;
	label: string;
	children?: React.ReactNode;
};

/**
 * A react component that represents a form
 * @param Props
 * @component
 * @example
 * const inputs = [{ name: "email", placeholder: "email address", secure: false, rules: {} }]
 * const { control, handleSubmit, formState: {errors} } = useForm()
 *
 * const handleFormSubmit = handleSubmit(() => console.log("submitted form"))
 *
 * return <Form inputs={inputs} control={control} action={handleFormSubmit} lable="Register" />
 */
export default function Form({
	inputs,
	control,
	errors,
	action,
	label,
	children,
}: Props) {
	const [disableBtn, setDisableBtn] = useState(false);
	return (
		<KeyboardAvoidingView>
			{inputs.map(input => (
				<Input
					key={input.name}
					name={input.name}
					Icon={input.Icon}
					control={control}
					rules={input.rules}
					autoCapitalize="none"
					autoCorrect={false}
					placeholder={input.placeholder}
					secureTextEntry={input.secure}
					error={errors[input.name] != null}
				/>
			))}
			{children}
			<Pressable
				onPress={() => {
					setDisableBtn(true);
					action();
					setDisableBtn(false);
				}}
				style={styles.btn}
				disabled={disableBtn}
			>
				<Text style={styles.btnText}>{label}</Text>
			</Pressable>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	btn: {
		backgroundColor: "#555",
		width: "90%",
		paddingVertical: 15,
		alignSelf: "center",
		marginRight: 10,
		borderRadius: 10,
		marginTop: 10,
	},
	btnText: { color: "white", textAlign: "center", fontSize: 16 },
});
