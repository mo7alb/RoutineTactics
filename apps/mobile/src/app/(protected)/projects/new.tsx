import React, { useState } from "react";
import ModalContainer from "../../../components/UI/ModalContainer";
import { View, Text } from "react-native";
import { useAuthContext } from "../../../context/authContext";
import { useProjects } from "../../../hooks/useProjects";
import { router } from "expo-router";
import { useForm } from "react-hook-form";
import { Project } from "../../../types/project";
import { errorStyles } from "../../../components/UI/AuthFormErrors";
import Form from "../../../components/UI/Form";
import DatePicker from "../../../components/UI/DatePicker";
import AddCategories from "../../../components/addCategory";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

const defaultValues = {
	name: "",
	description: "",
	dueDate: "",
};

const inputs = [
	{
		name: "name",
		rules: {
			required: "Name is required",
			minLength: {
				value: 3,
				message: "Name should at least be 3 characters long",
			},
			maxLength: {
				value: 25,
				message: "Name should be less than 25 characters",
			},
		},
		placeholder: "Project Name",
		secure: false,
		Icon: <AntDesign name="folder1" size={24} color="black" />,
	},
	{
		name: "description",
		rules: {
			minLength: {
				value: 5,
				message: "Description should at least be 5 characters long",
			},
			maxLength: {
				value: 100,
				message: "Description should be less than 100 characters",
			},
		},
		placeholder: "Project Description",
		secure: false,
		Icon: <MaterialIcons name="description" size={24} color="black" />,
	},
];

/**
 * A screen to render a form for creating a new project
 * @component
 */
export default function NewProject() {
	const [categories, setCategories] = useState<string[]>([]);

	const user = useAuthContext();
	if (!user) return null;

	const { newProject } = useProjects(user);
	const { mutate } = newProject();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues });

	const handleProjectSubmission = handleSubmit((data: Partial<Project>) => {
		mutate({ ...data, categories } as Project);
		router.back();
	});

	return (
		<ModalContainer title="New Project">
			<View style={errorStyles.errorContainer}>
				{errors.name && (
					<Text style={errorStyles.error}>{errors.name.message}</Text>
				)}
				{errors.description && (
					<Text style={errorStyles.error}>
						{errors.description.message}
					</Text>
				)}
			</View>
			<Form
				inputs={inputs}
				control={control}
				errors={errors}
				action={handleProjectSubmission}
				label="Create new project"
			>
				<DatePicker control={control} name="dueDate" />
				<AddCategories
					categories={categories}
					setCategories={setCategories}
				/>
			</Form>
		</ModalContainer>
	);
}
