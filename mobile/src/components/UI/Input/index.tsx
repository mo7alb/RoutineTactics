import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

interface Props extends React.ComponentProps<typeof TextInput> {
	name: string;
	control: any;
	rules: {};
	placeholder: string;
	error: boolean;
}

export default function Input({
	name,
	control,
	rules,
	error,
	...inputProps
}: Props) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<TextInput
					{...inputProps}
					style={[styles.input, ...(error ? [styles.inputError] : [])]}
					value={value}
					onChangeText={onChange}
					onBlur={onBlur}
				/>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	input: {
		borderWidth: 1,
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 10,
		marginHorizontal: 15,
		marginVertical: 5,
	},
	inputError: {
		borderColor: "#fc2d57",
	},
});
