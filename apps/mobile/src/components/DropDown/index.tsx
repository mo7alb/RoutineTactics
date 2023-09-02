import { View, Text, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

type Props = {
	options: string[];
	label: string;
	selected: string;
	setSelected: React.Dispatch<React.SetStateAction<string>>;
};

export default function Dropdown({
	options,
	label,
	selected,
	setSelected,
}: Props) {
	const [dropedDown, setDropedDown] = useState(false);

	return (
		<View style={{ height: "10%", width: "100%", zIndex: 120 }}>
			<TouchableOpacity
				style={{
					width: "90%",
					height: "45%",
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
				<Text style={{ fontWeight: "600" }}>
					{selected == "" ? label : selected}
				</Text>
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
						height: "250%",
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
									onPress={() => {
										setSelected(item);
										setDropedDown(!dropedDown);
									}}
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
