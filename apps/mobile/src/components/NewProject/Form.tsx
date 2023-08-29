import { View, Text, KeyboardAvoidingView, Button } from "react-native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../UI/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/AuthContext";
import { createProject } from "../../api/project";
import { Project } from "../../types/project";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { router } from "expo-router";

export default function NewProjectForm() {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [dueDate, setDueDate] = useState<Date | null>();

	const user = useAuthContext();
	if (!user) return null;

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (newProject: Project) =>
			createProject(user, {
				...newProject,
				dueDate: dueDate != null ? dueDate.toISOString() : null,
			}),
		onSuccess: data => queryClient.invalidateQueries(["projects"]),
		onError: error => {
			console.error("An error occured");

			console.error(error);
		},
	});

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: "",
			description: "",
		},
	});

	const handleProjectSubmission = handleSubmit(data => {
		mutation.mutate(data);

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
			{/* add date time picker here */}
			<Button title="Due Date" onPress={() => setShowDatePicker(true)} />
			<DateTimePickerModal
				isVisible={showDatePicker}
				onConfirm={date => {
					setDueDate(date);
					setShowDatePicker(false);
				}}
				onCancel={() => setShowDatePicker(false)}
			/>
			<Button title="Submit" onPress={handleProjectSubmission} />
		</KeyboardAvoidingView>
	);
}
