import React, { useState, useEffect } from "react";

import {
	View,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	SafeAreaView,
	ScrollView,
	Dimensions,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView2 } from "@/components/ThemedView2";
import { Image } from "expo-image";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

import axios from "axios";
import {
	router,
	useLocalSearchParams,
	useNavigation,
	usePathname,
} from "expo-router";
import { baseUrl, showAlert, getToken } from "../../utils";
import { useColorScheme } from "@/hooks/useColorScheme";

const width = Dimensions.get("window").width;
export default function ScanScreen() {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();

	const [cameraActive, setCameraActive] = useState(true);

	const [scanResult, setScanResult] = useState("");
	const [loading, setLoading] = useState(false);

	const colorScheme = useColorScheme();
	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;
	const themeTextSelect =
		colorScheme === "light" ? styles.selectLight : styles.selectDark;

	const navigation = useNavigation();
	const focused = navigation.isFocused();

	function toggleCameraFacing() {
		setFacing((current) => (current === "back" ? "front" : "back"));
	}

	useEffect(() => {
		if (focused) {
			setCameraActive(true);

			if (!permission) {
				requestPermission();
				showAlert("Allow Camera", "Please enable camera permission");
			} else {
				setCameraActive(true);
			}
		} else {
			setCameraActive(false);
		}

		setScanResult("");
	}, [focused]);

	const qrScanned = (result: any) => {
		setCameraActive(false);

		showAlert("Success", "scan successful");
		setScanResult(result.data);
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				{cameraActive && (
					<View style={styles.containerCamera}>
						<CameraView
							active={cameraActive}
							style={styles.camera}
							facing={facing}
							barcodeScannerSettings={{
								barcodeTypes: ["qr"],
							}}
							onBarcodeScanned={(scanningResult) =>
								qrScanned(scanningResult)
							}
						>
							<View style={styles.buttonContainer}>
								<TouchableOpacity
									style={styles.buttonCamera}
									onPress={toggleCameraFacing}
								>
									<Text style={styles.text}>Flip Camera</Text>
								</TouchableOpacity>
							</View>
						</CameraView>
					</View>
				)}

				<ThemedView2 style={styles.mainContainer}>
					<ThemedText type="title">Scan QR Code</ThemedText>
					<ThemedText type="title2">
						point the camera at the qr code image
					</ThemedText>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setScanResult}
						value={scanResult}
						placeholder="Seller"
						placeholderTextColor="#777"
					/>
				</ThemedView2>

				<Image
					style={[
						{
							marginTop: 60,
							width: width,
							height: width * (218 / 262),
						},
					]}
					source={require("@/assets/images/plstic-bottle.svg")}
					contentFit="cover"
				/>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		margin: 64,
	},

	buttonCamera: {
		flex: 1,
		alignSelf: "flex-end",
		alignItems: "center",
	},
	text: {
		fontSize: 24,
		fontWeight: "bold",
		color: "white",
	},
	containerCamera: {
		flex: 1,
		justifyContent: "center",
		height: 570,
	},
	message: {
		textAlign: "center",
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
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
	},

	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 0,
		borderBottomWidth: 1,
		borderColor: "#ccc",
		marginBottom: 20,
	},

	titleContainer: {
		flexDirection: "row",
		gap: 8,
	},

	input: {
		height: 40,
		margin: 5,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	inputLight: {
		color: "#000",
	},
	inputDark: {
		color: "#fff",
	},

	selectLight: {
		color: "black",
	},

	selectDark: {
		color: "white",
	},

	inputPass: {
		height: 40,
		margin: 5,
		padding: 10,
		flex: 1,
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
		marginTop: 5,
		padding: 10,
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
