import { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
	Home: undefined;
	Login: undefined;
	Register: undefined;
};

export type ScreenProps = NativeStackScreenProps<
	RootStackParamList,
	"Home",
	"MyStack"
>;
