import { View, Text, Button } from "react-native";
import React from "react";
import Input from "../UI/input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { addMember } from "../../api/member";
import { User } from "firebase/auth";

type Props = {
	user: User;
	id: string;
};

export default function NewMember({ user, id }: Props) {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: { email: "" } });

	const { mutate } = useMutation({
		mutationFn: (email: string) => addMember(user, email, id as string),
	});

	const handleAddMember = handleSubmit(data => {
		mutate(data.email);
	});

	return (
		<View>
			<Text>Add new member</Text>
			<Input
				control={control}
				placeholder="Email address"
				rules={{}}
				error={errors.email != null}
				name="email"
				autoCapitalize="none"
			/>
			<Button onPress={handleAddMember} title="Add member" />
		</View>
	);
}
