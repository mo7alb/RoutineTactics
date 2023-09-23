import { View, Text } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthContext } from "../../../context/authContext";
import FetchError from "../../../components/UI/FetchError";
import Loading from "../../../components/UI/Loading";
import { useProjects } from "../../../hooks/useProjects";
import ModalContainer from "../../../components/UI/ModalContainer";
import { useForm } from "react-hook-form";
import { Project } from "../../../types/project";
import { errorStyles } from "../../../components/UI/AuthFormErrors";
import DatePicker from "../../../components/UI/DatePicker";
import AddCategories from "../../../components/addCategory";
import Form from "../../../components/UI/Form";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

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
 * A react native modal to render a form for editing an existing project
 * @component
 */
export default function EditProject() {
	const { id } = useLocalSearchParams();

	const user = useAuthContext();
	if (!user) return null;

	// fetch project
	const { project, updateProject } = useProjects(user);

	const { mutate } = updateProject(id as string);

	const { data, loadingProject, isProjectError, projectError } = project(
		id as string
	);

	if (loadingProject)
		return <Loading title="Dashboard" message="Loading Project" />;
	else if (isProjectError)
		return <FetchError title="Dashboard" error={projectError} />;

	if (data == null) return null;

	const [categories, setCategories] = useState(data.categories);
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: {
			name: data.name,
			description: data.description,
			dueDate: data.dueDate != null ? data.dueDate : "",
		},
	});

	const handleProjectChanges = handleSubmit(data => {
		mutate({ ...data, categories } as Project);
		router.back();
	});

	return (
		<ModalContainer title="Edit project">
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
				action={handleProjectChanges}
				label="Update project"
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
