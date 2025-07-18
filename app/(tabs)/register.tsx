import React, { useState } from "react";

import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	Pressable,
	ScrollView,
	Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView2 } from "@/components/ThemedView2";
import Ionicons from "@expo/vector-icons/Ionicons";

import axios from "axios";
import { router } from "expo-router";
import { baseUrl, showAlert } from "../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const width = Dimensions.get("window").width;
export default function RegisterScreen() {
	const [firstname, onChangeFirstname] = useState("");
	const [lastname, onChangeLastname] = useState("");
	const [username, onChangeUsername] = useState("");
	const [email, onChangeEmail] = useState("");
	const [city, onChangeCity] = useState("");
	const [password, onChangePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onPress = async () => {
		setLoading(true);
		axios
			.post(baseUrl() + "auth/join", {
				firstname: firstname,
				lastname: lastname,
				username: username,
				email: email,
				city: city,
				password: password,
			})
			.then(async function (response) {
				if (response.data.success == true) {
					router.replace(`./verify/${email}`);
				} else {
					showAlert("Failed", response.data.message);
				}

				setLoading(false);
			})
			.catch(function (error) {
				setLoading(false);
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView2 style={styles.imageLogoContainer}>
					<Pressable onPress={() => router.replace(`./index`)}>
						<Image
							style={styles.imageLogo}
							source={require("@/assets/images/logo.svg")}
							contentFit="contain"
						/>
					</Pressable>
				</ThemedView2>

				<ThemedView2 style={styles.mainContainer}>
					<ThemedText>Username</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeUsername}
						value={username}
						placeholderTextColor="#777"
					/>

					<ThemedText>First Name</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeFirstname}
						value={firstname}
						placeholderTextColor="#777"
					/>

					<ThemedText>Last Name</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeLastname}
						value={lastname}
						placeholderTextColor="#777"
					/>

					<ThemedText>Email</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeEmail}
						value={email}
						placeholderTextColor="#777"
					/>

					<ThemedText>City</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={onChangeCity}
						value={city}
						placeholderTextColor="#777"
					/>

					<ThemedText>Password</ThemedText>
					<View style={styles.container}>
						<TextInput
							style={[styles.inputPass, themeTextInput]}
							onChangeText={onChangePassword}
							value={password}
							placeholderTextColor="#777"
							secureTextEntry={!showPassword}
						/>

						<Ionicons
							size={24}
							name={showPassword ? "eye-off" : "eye"}
							color="#aaa"
							style={styles.icon}
							onPress={toggleShowPassword}
						/>
					</View>
					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={onPress}
					>
						<Text style={styles.buttonText}>Join</Text>
					</TouchableOpacity>

					<ThemedText
						onPress={() => router.replace("/login")}
						type="link"
						style={{ paddingTop: 10, textAlign: "center" }}
					>
						Already joined, click here
					</ThemedText>
				</ThemedView2>

				<Image
					style={[
						{
							marginTop: 0,
							width: width,
							height: width * (147 / 390),
						},
					]}
					source={require("@/assets/images/hello2.svg")}
					contentFit="cover"
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	imageLogoContainer: {
		flex: 1,
		alignItems: "center",
		height: 80,
		paddingTop: 10,
		marginBottom: 0,
	},
	imageLogo: {
		width: 80,
		height: 80 * (144 / 165),
	},
	saveContainer: {
		flex: 1,
	},

	imageContainer: {
		flex: 1,
		flexDirection: "row",
		maxHeight: 200,
	},
	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
	},

	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderWidth: 1,
		borderColor: "#CBD5E1",
		backgroundColor: "#F8FAFC",
		borderRadius: 5,
		marginTop: 5,
		marginBottom: 15,
		paddingRight: 10,
	},

	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},

	input: {
		height: 40,
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: "#CBD5E1",
		borderRadius: 5,
		marginTop: 5,
	},

	inputPass: {
		height: 40,
		margin: 0,
		padding: 10,
		flex: 1,
	},

	inputLight: {
		color: Colors.light.text2,
		backgroundColor: Colors.light.background,
	},
	inputDark: {
		color: Colors.dark.text2,
		backgroundColor: Colors.dark.background,
	},
	reactLogo: {
		height: 10,
		flex: 1,
		width: null,
	},

	icon: {
		marginLeft: 10,
	},
	button: {
		marginTop: 10,
		padding: 14,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#374982",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 20,
	},
	buttonText: {
		color: "white",
	},
	image: {
		flex: 1,
		maxHeight: 200,
		marginBottom: 20,
	},
});
