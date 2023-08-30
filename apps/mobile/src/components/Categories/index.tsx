import {
	View,
	Text,
	Alert,
	ScrollView,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

export default function Categories({ categories, setCategories }) {
	const [category, setCategory] = useState("");
	return (
		<View>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder="Category"
					onChangeText={text => setCategory(text)}
					value={category}
					style={styles.input}
				/>
				<TouchableOpacity
					style={styles.btn}
					onPress={() => {
						if (category === "") {
							Alert.alert(
								"Invalid category",
								"Category cannot be an empty string"
							);
							return;
						}
						if (categories.includes(category)) {
							Alert.alert(
								"Category already exists",
								"Category cannot be added twice"
							);
							return;
						}
						setCategories(previous => [...previous, category]);
						setCategory("");
					}}
				>
					<Text style={styles.btnText}>Add</Text>
				</TouchableOpacity>
			</View>
			<Text style={styles.subheading}>Categories:</Text>
			<ScrollView style={styles.categories}>
				{categories.map(category => (
					<View style={styles.categoryContainer} key={category}>
						<Text style={styles.category}>{category}</Text>
						<AntDesign
							name="delete"
							size={24}
							color="black"
							style={styles.deleteCategory}
							onPress={() => {
								setCategories(previous =>
									previous.filter(_category => _category !== category)
								);
							}}
						/>
					</View>
				))}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	categoryContainer: {
		display: "flex",
		flexDirection: "row",
		padding: 5,
		paddingHorizontal: 25,
	},
	category: {
		width: "90%",
		fontSize: 18,
		marginBottom: 2,
	},
	deleteCategory: {
		width: "10%",
	},
	inputContainer: {
		display: "flex",
		flexDirection: "row",
		padding: 5,
		marginRight: 10,
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginHorizontal: 15,
		marginVertical: 5,
		width: "60%",
	},
	btn: {
		borderWidth: 1,
		backgroundColor: "#343541",
		borderRadius: 10,
		justifyContent: "center",
		alignItems: "center",
		width: "30%",
		height: 41,
	},
	btnText: { color: "white" },
	subheading: {
		fontWeight: "400",
		textAlign: "center",
		fontSize: 25,
		marginVertical: 5,
	},
	categories: {
		height: "40%",
	},
});
