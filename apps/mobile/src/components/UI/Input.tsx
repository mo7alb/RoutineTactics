import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller } from "react-hook-form";

interface Props extends React.ComponentProps<typeof TextInput> {
	name: string;
	control: any;
	rules: {};
	placeholder: string;
	error: boolean;
	Icon: React.ReactNode;
}

/**
 * A react component that represents an input area with custom styles
 * @param Props
 * @component
 * @example
 * const { control, formState: {errors} } = useForm({ defaultValues: { email: "" }})
 *
 * return <Input name="email" placeholder="email address" control={control} error={errors.email != undefined} rules={{}} />
 */
export default function Input({
	name,
	control,
	rules,
	error,
	Icon,
	...inputProps
}: Props) {
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({ field: { onChange, onBlur, value } }) => (
				<View style={styles.inputContainer}>
					<View style={styles.iconContainer}>{Icon}</View>
					<TextInput
						{...inputProps}
						style={[styles.input, ...(error ? [styles.inputError] : [])]}
						value={value}
						onChangeText={onChange}
						onBlur={onBlur}
					/>
				</View>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	inputContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},
	iconContainer: {
		width: "7%",
	},
	input: {
		borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginHorizontal: 15,
		marginVertical: 5,
		width: "80%",
	},
	inputError: {
		borderColor: "#fc2d57",
	},
});
