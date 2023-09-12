import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

type Props = {
	options: string[];
	label: string;
	selected: string[];
	setSelected: React.Dispatch<React.SetStateAction<string[]>>;
};

/**
 * A react component that renders a drop down that is able to select multiple elements
 * @component
 */
export default function MultiSelectDropDown({
	options,
	label,
	selected,
	setSelected,
}: Props) {
	const [dropedDown, setDropedDown] = useState(false);

	const addItem = (item: string) => {
		setSelected(previous => {
			return previous.some(content => content === item)
				? previous
				: [...previous, item];
		});
		setDropedDown(false);
	};

	const removeItem = (item: string) => {
		setSelected(previous => {
			return previous.filter(previousItem => previousItem != item);
		});
	};

	return (
		<View
			style={{
				width: "100%",
				zIndex: 120,
				height: "40%",
			}}
		>
			<Text
				style={{ fontSize: 20, textAlign: "center", paddingVertical: 3 }}
			>
				Selected Categories
			</Text>
			<FlatList
				data={selected}
				renderItem={({ item }) => (
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							marginVertical: 4,
							marginHorizontal: 20,
							alignItems: "center",
						}}
					>
						<Text>{item}</Text>
						<TouchableOpacity onPress={() => removeItem(item)}>
							<AntDesign name="close" size={20} color="black" />
						</TouchableOpacity>
					</View>
				)}
			/>

			<TouchableOpacity
				style={{
					width: "90%",
					height: 35,
					borderRadius: 10,
					borderWidth: 0.5,
					alignSelf: "center",
					marginTop: 20,
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					paddingHorizontal: 15,
				}}
				onPress={() => {
					setDropedDown(!dropedDown);
				}}
			>
				<Text style={{ fontWeight: "600" }}>{label}</Text>
				{dropedDown ? (
					<AntDesign name="upcircleo" size={24} color="black" />
				) : (
					<AntDesign name="downcircleo" size={24} color="black" />
				)}
			</TouchableOpacity>
			{dropedDown ? (
				<View
					style={{
						zIndex: 1,
						marginTop: 20,
						alignSelf: "center",
						width: "90%",
						backgroundColor: "white",
						borderRadius: 10,
					}}
				>
					<FlatList
						data={options}
						renderItem={({ item }) => {
							return (
								<TouchableOpacity
									style={{
										width: "85%",
										alignSelf: "center",
										height: 50,
										justifyContent: "center",
										borderBottomWidth: 0.5,
										borderColor: "#8e8e8e",
									}}
									onPress={() => addItem(item)}
								>
									<Text style={{ fontWeight: "600" }}>{item}</Text>
								</TouchableOpacity>
							);
						}}
					/>
				</View>
			) : null}
		</View>
	);
}
