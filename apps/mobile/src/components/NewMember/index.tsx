import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { useAuthContext } from "../../context/authContext";
import Form from "../UI/Form";
import { createInvitation } from "../../api/invitations";
import { Entypo } from "@expo/vector-icons";

type Props = {
	projectId: string;
};

/**
 * A react component to add a new member to the project
 * Should only be visible to the project owner
 * @component
 */
export default function NewMember({ projectId }: Props) {
	const user = useAuthContext();
	if (!user) return null;

	const {
		control,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm({ defaultValues: { email: "" } });

	const { mutate, error } = useMutation({
		mutationFn: (email: string) => createInvitation(user, email, projectId),
	});

	const handleNewMember = handleSubmit(data => {
		mutate(data.email);
		// @ts-ignore
		if (error && error.message == "User does not exist") {
			Alert.alert(
				"Error",
				"User does not exist, make sure you use a valid email"
			);

			return;
		} else {
			Alert.alert("Message", "Successfully send invitation to user");
			reset();
		}
	});

	return (
		<View style={{ marginVertical: 25 }}>
			<Text
				style={{
					fontSize: 20,
					textAlign: "center",
					fontWeight: "500",
					marginBottom: 5,
				}}
			>
				Add new member
			</Text>
			<Form
				control={control}
				errors={errors}
				label="Add Member"
				action={handleNewMember}
				inputs={[
					{
						placeholder: "Email Address",
						rules: {
							required: "Email address is required",
							pattern: {
								value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
								message:
									"Email address should be of the form something@example.com",
							},
						},
						secure: false,
						name: "email",
						Icon: <Entypo name="email" size={24} color="black" />,
					},
				]}
			/>
		</View>
	);
}
