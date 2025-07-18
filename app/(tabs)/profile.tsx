import React, { useState, useEffect, memo } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	SafeAreaView,
	ScrollView,
	Dimensions,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Image } from "expo-image";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { router, useNavigation } from "expo-router";
import { baseUrl, showAlert, getToken } from "../../utils";

const width = Dimensions.get("window").width;

export default function ProfileScreen() {
	const colorScheme = useColorScheme();
	const themeBG = colorScheme === "light" ? styles.bgLight : styles.bgDark;
	const themeText =
		colorScheme === "light" ? styles.textLight : styles.textDark;

	const [name, setName] = useState("");
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);

	const navigation = useNavigation();
	const focused = navigation.isFocused();

	useEffect(() => {
		if (focused) {
			loadProfile();
		}
	}, [focused]);

	const loadProfile = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "users/myprofile", {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setName(
						response.data.data.firstname +
							" " +
							response.data.data.lastname
					);
					setUserName(response.data.data.username);
					setEmail(response.data.data.email);
				} else {
					showAlert("Failed", response.data.message);
				}
			})
			.catch(function (error) {
				if (error.response) {
					showAlert("Failed", error.response.data.message);
				}
			})
			.finally(function () {
				setLoading(false);
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<View style={{}}>
					<Image
						style={{ width: width, height: width * (200 / 390) }}
						source={require("@/assets/images/top-elips.svg")}
						contentFit="contain"
					/>
				</View>
				<ThemedText
					style={{
						textAlign: "center",
						color: "#eee",
						fontWeight: "bold",
						fontSize: 24,
						marginTop: width * (200 / 390) * -1 + 50,
					}}
				>
					Profile
				</ThemedText>

				<View style={{ padding: 30 }}>
					<View style={[themeBG, { padding: 20, borderRadius: 20 }]}>
						<ThemedText
							style={[styles.itemText, { fontWeight: "bold" }]}
						>
							{name}
						</ThemedText>
						<ThemedText style={[styles.itemText]}>
							{userName}
						</ThemedText>
						<ThemedText style={[styles.itemText]}>
							{email}
						</ThemedText>

						<View
							style={{
								borderBottomColor: "#ABABAB",
								borderBottomWidth: 1,
							}}
						></View>
					</View>
				</View>

				<View style={{ padding: 20, paddingTop: 0 }}>
					<View style={[themeBG, { paddingBottom: 20 }]}>
						<View style={[styles.list]}>
							<View style={styles.listInner}>
								<View style={styles.listA}>
									<AntDesign
										size={24}
										name="customerservice"
										style={[themeText]}
									/>
								</View>
								<View style={styles.listB}>
									<ThemedText style={[styles.itemText]}>
										Help
									</ThemedText>
								</View>
								<View style={styles.listC}>
									<MaterialIcons
										name="keyboard-arrow-right"
										size={24}
										color="black"
									/>
								</View>
							</View>
							<View style={styles.listLine}></View>
						</View>

						<View style={[themeBG, styles.list]}>
							<View style={styles.listInner}>
								<View style={styles.listA}>
									<MaterialIcons
										size={24}
										name="info-outline"
										style={[themeText]}
									/>
								</View>
								<View style={styles.listB}>
									<ThemedText style={[styles.itemText]}>
										About Us
									</ThemedText>
								</View>
								<View style={styles.listC}>
									<MaterialIcons
										name="keyboard-arrow-right"
										size={24}
										color="black"
									/>
								</View>
							</View>
							<View style={styles.listLine}></View>
						</View>

						<View style={[themeBG, styles.list]}>
							<View style={styles.listInner}>
								<View style={styles.listA}>
									<MaterialCommunityIcons
										size={24}
										name="web"
										style={[themeText]}
									/>
								</View>
								<View style={styles.listB}>
									<ThemedText style={[styles.itemText]}>
										Website
									</ThemedText>
								</View>
								<View style={styles.listC}>
									<MaterialIcons
										name="keyboard-arrow-right"
										size={24}
										color="black"
									/>
								</View>
							</View>
							<View style={styles.listLine}></View>
						</View>

						<View style={[themeBG, styles.list]}>
							<View style={styles.listInner}>
								<View style={styles.listA}>
									<MaterialIcons
										size={24}
										name="star-border"
										style={[themeText]}
									/>
								</View>
								<View style={styles.listB}>
									<ThemedText style={[styles.itemText]}>
										Rate and Review
									</ThemedText>
								</View>
								<View style={styles.listC}>
									<MaterialIcons
										name="keyboard-arrow-right"
										size={24}
										color="black"
									/>
								</View>
							</View>
							<View style={styles.listLine}></View>
						</View>
					</View>

					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={() => {
							router.replace("/logout");
						}}
					>
						<Text style={styles.buttonText}>Logout</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	list: {
		padding: 20,
		paddingBottom: 0,
		alignContent: "space-between",
	},
	listInner: {
		flex: 1,
		flexDirection: "row",
	},

	listA: { flexBasis: 40, flexShrink: 1, flexGrow: 0, paddingLeft: 10 },
	listB: { flexBasis: "auto", flexShrink: 0, flexGrow: 1 },
	listC: { flexBasis: 24, flexShrink: 1, flexGrow: 0 },

	listLine: {
		borderBottomColor: "#ABABAB",
		borderBottomWidth: 1,
		paddingTop: 10,
	},

	saveContainer: {
		flex: 1,
	},

	mainContainer: {
		padding: 20,
		flex: 1,
		flexDirection: "column",
		paddingBottom: 0,
	},

	bgLight: {
		backgroundColor: Colors.light.background2,
	},
	bgDark: { backgroundColor: Colors.dark.background2 },

	textLight: {
		color: Colors.light.text2,
	},

	textDark: {
		color: Colors.dark.text2,
	},

	itemText: {
		paddingBottom: 7,
	},

	button: {
		marginTop: 20,
		padding: 14,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#A9A9A9",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 20,
	},
	buttonText: {
		color: "white",
	},
});
