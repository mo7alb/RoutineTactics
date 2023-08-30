import { View, Text, KeyboardAvoidingView, Button, Alert } from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../UI/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import { createProject } from "../../api/project";
import { Project } from "../../types/project";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router } from "expo-router";
import { Controller } from "react-hook-form";
import DatePicker from "../UI/datePicker";

export default function NewProjectForm() {
	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newProject: Project) => createProject(user, newProject),
		onSuccess: () => queryClient.invalidateQueries(["projects"]),
		onError: error =>
			Alert.alert(
				"Error",
				error instanceof Error
					? error.message
					: "An unknown error occured, try again later"
			),
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			description: "",
			dueDate: new Date(),
		},
	});

	const handleProjectSubmission = handleSubmit(data => {
		mutation.mutateAsync(data, {
			onSuccess: () => console.log("this was a success"),
		});

		router.back();
	});

	return (
		<KeyboardAvoidingView>
			<Input
				name="name"
				control={control}
				rules={{
					required: "Name is required",
					length: {
						value: 3,
						message: "Name should at least be 3 characters long",
					},
				}}
				placeholder="Project Name"
				error={errors.name != null}
			/>
			<Input
				name="description"
				control={control}
				rules={{
					length: {
						value: 5,
						message: "Description should at least be 5 characters long",
					},
				}}
				placeholder="Project Description"
				error={errors.description != null}
			/>
			<DatePicker control={control} />
			<Button title="Submit" onPress={handleProjectSubmission} />
		</KeyboardAvoidingView>
	);
}
