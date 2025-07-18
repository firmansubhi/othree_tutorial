import React, { useEffect, useState } from "react";

import {
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Picker } from "@react-native-picker/picker";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";

import { useColorScheme } from "@/hooks/useColorScheme";
import axios from "axios";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { baseUrl, getToken, showAlert } from "../../../utils";

export default function TransactionFormScreen() {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();

	const [cameraActive, setCameraActive] = useState(true);

	const [sellerId, setSellerId] = useState("");
	const [productId, setProductId] = useState("");
	const [weight, setWeight] = useState("");
	const [loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);

	const { id } = useLocalSearchParams();

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
			loadProduct();

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

		if (id != "0") {
			loadData(id);
			setCameraActive(false);
		} else {
			setSellerId("");
			setProductId("");
			setWeight("");
		}
	}, [focused]);

	const loadProduct = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "product/all", {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setProducts(response.data.data.rows);
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

	type ListProps = {
		id: string;
		name: string;
	};

	const renderList = () => {
		return products.map(({ id, name }: ListProps) => {
			return <Picker.Item key={id} label={name} value={id} />;
		});
	};

	const loadData = async (id: any) => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "transactions/" + id, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setSellerId(response.data.data.seller._id);
					setProductId(response.data.data.product._id);
					setWeight(response.data.data.weight.toString());
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

	const onPress = async () => {
		setLoading(true);

		let token = await getToken();

		let uri = "transactions/edit";
		if (id == "0") {
			uri = "transactions/add";
		}

		axios
			.post(
				baseUrl() + uri,
				{
					_id: id,
					sellerId: sellerId,
					productId: productId,
					weight: weight,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: "Bearer " + token,
					},
				}
			)
			.then(async function (response) {
				if (response.data.success == true) {
					router.replace("/transactions");
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

	const qrScanned = (result: any) => {
		setCameraActive(false);
		setSellerId(result.data);
		//showAlert("bisa", "ada nih");
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.mainContainer}>
					<ThemedText type="title">Transaction Form</ThemedText>
					<ThemedText type="title2">
						Update transaction data
					</ThemedText>

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
										<Text style={styles.text}>
											Flip Camera
										</Text>
									</TouchableOpacity>
								</View>
							</CameraView>
						</View>
					)}

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setSellerId}
						value={sellerId}
						placeholder="Seller"
						placeholderTextColor="#777"
					/>

					<Picker
						accessibilityLabel="Basic Picker Accessibility Label"
						selectedValue={productId}
						style={[themeTextSelect]}
						onValueChange={(itemValue, itemIndex) => {
							if (itemIndex > 0) {
								setProductId(itemValue);
							} else {
								setProductId("");
							}
						}}
					>
						{renderList()}
					</Picker>

					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setWeight}
						value={weight}
						placeholder="Weight"
						placeholderTextColor="#777"
						keyboardType="numeric"
					/>

					<TouchableOpacity
						disabled={loading}
						style={styles.button}
						onPress={onPress}
					>
						<Text style={styles.buttonText}>Save</Text>
					</TouchableOpacity>
				</ThemedView>
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
		height: 320,
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
