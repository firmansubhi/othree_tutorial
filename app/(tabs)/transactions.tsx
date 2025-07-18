import React, { useState, useEffect, memo } from "react";
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	TextInput,
	TouchableOpacity,
	Modal,
	Pressable,
	SafeAreaView,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import {
	baseUrl,
	showAlert,
	getToken,
	allowGroup,
	currency,
} from "../../utils";
import { Link } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { router, useNavigation, usePathname } from "expo-router";
import { Colors } from "@/constants/Colors";

type ItemProps = {
	id: string;
	sid: string;
	transID: string;
	sellerName: string;
	receiverName: string;
	buyerName: string;
	productName: string;
	weight: number;
	amount: number;
	status: string;
	createdAt: string;
};

export default function TransactionsScreen() {
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [sellerUsername, setSellerUsername] = useState("");
	const [confirm, setConfirm] = useState(false);
	const [confirmAction, setConfirmAction] = useState("");
	const [confirmMessage, setConfirmMessage] = useState("");
	const [modalId, setModalId] = useState("");
	const [totalPages, setTotalPages] = useState(0);
	const [data, setData] = useState([
		{
			id: "",
			sid: "",
			transID: "",
			sellerName: "",
			receiverName: "",
			buyerName: "",
			productName: "",
			weight: 0,
			amount: 0,
			status: "",
			createdAt: "",
		},
	]);

	const Item = memo(
		({
			id,
			sid,
			transID,
			sellerName,
			receiverName,
			buyerName,
			productName,
			weight,
			amount,
			status,
			createdAt,
		}: ItemProps) => (
			<View style={[themeBG, styles.listItem]}>
				<View style={styles.listTop}>
					{allowGroup(["administrator", "receiver"]) && (
						<TouchableOpacity
							onPress={() => deleteData(id, transID)}
							style={{
								width: 50,
								justifyContent: "flex-end",
								alignItems: "flex-end",
							}}
						>
							<FontAwesome6
								name="trash-can"
								size={16}
								color="green"
							/>
						</TouchableOpacity>
					)}

					{allowGroup(["administrator", "receiver"]) && (
						<Link
							href={{
								pathname: "/transaction/[id]",
								params: { id: id },
							}}
						>
							<FontAwesome6 name="edit" size={16} color="green" />
						</Link>
					)}
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
					}}
				>
					<ThemedText style={{ fontWeight: "bold" }}>
						{transID}
					</ThemedText>
				</View>
				<View>
					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText style={styles.grey}>Seller</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{sellerName}</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText style={styles.grey}>
								Receiver
							</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{receiverName}</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText style={styles.grey}>Buyer</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{buyerName}</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText style={styles.grey}>Product</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>
								{productName} {weight}gr
							</ThemedText>
						</View>
					</View>

					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText style={styles.grey}>Price</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{currency(amount)}</ThemedText>
						</View>
					</View>
					<View style={styles.subtitle}>
						<View style={styles.subtitleLeft}>
							<ThemedText style={styles.grey}>Status</ThemedText>
						</View>
						<View style={styles.subtitleRight}>
							<ThemedText>{status}</ThemedText>
						</View>
					</View>

					<View style={[styles.listFooter]}>
						<View style={styles.listFooterLeft}>
							<ThemedText>{createdAt}</ThemedText>
						</View>
						<View style={styles.listFooterRight}>
							{status !== "finalized" &&
								allowGroup(["administrator", "buyer"]) && (
									<TouchableOpacity
										style={styles.button2}
										onPress={() =>
											finalizeData(id, transID)
										}
									>
										<Text style={styles.buttonText}>
											Finalize
										</Text>
									</TouchableOpacity>
								)}
						</View>
					</View>
				</View>
			</View>
		),
		(prevProps, nextProps) => {
			return prevProps.sid === nextProps.sid;
		}
	);

	const colorScheme = useColorScheme();

	const themeTextInput =
		colorScheme === "light" ? styles.inputLight : styles.inputDark;

	const themeBG = colorScheme === "light" ? styles.bgLight : styles.bgDark;

	const deleteData = async (id: string, name: string) => {
		setConfirm(true);
		setConfirmAction("delete");
		setModalId(id.toString());
		setConfirmMessage("Delete " + name + " ?");
	};

	const finalizeData = async (id: string, name: string) => {
		setConfirm(true);
		setConfirmAction("finalize");
		setModalId(id.toString());
		setConfirmMessage("Finilize " + name + " ?");
	};

	const navigation = useNavigation();
	const focused = navigation.isFocused();
	const path = usePathname();

	useEffect(() => {
		if (path == "/transactions" && focused == true) {
			loadData();
		}
	}, [focused]);

	const refreshData = () => {
		setPage(1);
		loadData();
	};

	const moreData = () => {
		if (page + 1 <= totalPages) {
			setPage(page + 1);
		}
	};

	const renderFooter = () => (
		<View style={{ justifyContent: "center", alignItems: "center" }}>
			{page == totalPages && <Text>all data has been displayed</Text>}
		</View>
	);

	const loadData = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "transactions/all", {
				params: {
					sellerUsername: sellerUsername,
					page: page,
				},
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					setTotalPages(response.data.data.totalPages);

					if (page == 1) {
						setData(response.data.data.rows);
					} else {
						setData([...data, ...response.data.data.rows]);
					}
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

	const confirmPress = () => {
		if (confirmAction == "delete") {
			deleteRow();
		}

		if (confirmAction == "finalize") {
			finalizeRow();
		}
	};

	const deleteRow = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.delete(baseUrl() + "transactions/" + modalId, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					loadData();
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
				setConfirm(false);
			});
	};

	const finalizeRow = async () => {
		setLoading(true);
		let token = await getToken();
		axios
			.get(baseUrl() + "transactions/finalize/" + modalId, {
				headers: {
					Authorization: "Bearer " + token,
				},
			})
			.then(function (response) {
				if (response.data.success == true) {
					loadData();
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
				setConfirm(false);
			});
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ThemedView style={styles.container}>
				<Modal
					animationType="fade"
					transparent={true}
					visible={confirm}
				>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>
								{confirmMessage}
							</Text>
							<View style={styles.modalButtonView}>
								<Pressable
									style={[
										styles.buttonConfirm,
										styles.buttonContinue,
									]}
									onPress={() => confirmPress()}
								>
									<Text style={styles.textStyle}>
										Continue
									</Text>
								</Pressable>
								<Pressable
									style={[
										styles.buttonConfirm,
										styles.buttonClose,
									]}
									onPress={() => setConfirm(false)}
								>
									<Text style={styles.textStyle}>Cancel</Text>
								</Pressable>
							</View>
						</View>
					</View>
				</Modal>

				<ThemedView style={styles.titleContainer}>
					<ThemedText type="title">Transaction</ThemedText>
				</ThemedView>
				<ThemedText type="title2">
					Transaction management page
				</ThemedText>

				<View style={[themeBG, styles.containerSearch]}>
					<ThemedText type="subtitle">Search Form</ThemedText>
					<TextInput
						style={[styles.input, themeTextInput]}
						onChangeText={setSellerUsername}
						value={sellerUsername}
						placeholder="Seller User Name"
						placeholderTextColor="#777"
					/>

					<View
						style={{
							flexDirection: "row",
						}}
					>
						<View
							style={{
								flex: 1,
								paddingRight: 5,
							}}
						>
							<TouchableOpacity
								disabled={loading}
								style={styles.button}
								onPress={loadData}
							>
								<Text style={styles.buttonText}>Search</Text>
							</TouchableOpacity>
						</View>
						<View
							style={{
								flex: 1,
								paddingLeft: 5,
							}}
						>
							{allowGroup(["administrator", "receiver"]) && (
								<TouchableOpacity
									style={styles.button}
									onPress={() =>
										router.replace(`./transaction/0`)
									}
								>
									<Text style={styles.buttonText}>
										Create New
									</Text>
								</TouchableOpacity>
							)}
						</View>
					</View>
				</View>
				<FlatList
					data={data}
					ListFooterComponent={renderFooter}
					onEndReachedThreshold={0.1}
					onEndReached={moreData}
					onRefresh={refreshData}
					refreshing={loading}
					renderItem={({ item }) => (
						<Item
							id={item.id}
							sid={item.sid}
							transID={item.transID}
							sellerName={item.sellerName}
							receiverName={item.receiverName}
							buyerName={item.buyerName}
							productName={item.productName}
							weight={item.weight}
							amount={item.amount}
							status={item.status}
							createdAt={item.createdAt}
						/>
					)}
					keyExtractor={(item) => item.sid}
				/>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	bgLight: {
		backgroundColor: Colors.light.background2,
	},
	bgDark: { backgroundColor: Colors.dark.background2 },
	listTop: {
		flex: 1,
		flexDirection: "row-reverse",
		borderBottomColor: "#efefef",
		borderBottomWidth: 1,
		paddingBottom: 5,
	},

	listFooter: {
		flexDirection: "row",
	},

	listFooterLeft: {
		flex: 2,
		justifyContent: "flex-end",
	},

	listFooterRight: {
		flex: 1,
		flexDirection: "row-reverse",
	},
	subtitle: {
		flex: 1,
		flexDirection: "row",
	},

	subtitleLeft: {
		flex: 1,
	},
	subtitleRight: {
		flex: 3,
	},

	grey: {
		color: "#aaa",
	},

	saveContainer: {
		flex: 1,
	},

	mainContainer: {
		padding: 30,
		flex: 1,
		flexDirection: "column",
	},

	container: {
		flex: 1,
		justifyContent: "center",

		padding: 15,
	},

	titleContainer: {
		//flexDirection: "column",
		//gap: 8,
	},

	containerSearch: {
		marginTop: 20,
		padding: 20,
		borderRadius: 20,
	},
	input: {
		height: 40,
		margin: 5,
		padding: 10,
		borderBottomWidth: 1,
		borderColor: "#ccc",
	},

	selectLight: {
		color: "black",
	},

	selectDark: {
		backgroundColor: "black",
		color: "white",
	},

	inputLight: {
		color: "#000",
	},
	inputDark: {
		color: "#fff",
	},

	button2: {
		marginTop: 5,
		padding: 10,
		shadowColor: "rgba(0,0,0, .4)", // IOS
		shadowOffset: { height: 1, width: 1 }, // IOS
		shadowOpacity: 1, // IOS
		shadowRadius: 1, //IOS
		backgroundColor: "#198754",
		elevation: 2, // Android
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		borderRadius: 5,
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

	listItem: {
		padding: 20,
		margin: 10,
		width: "100%",
		alignSelf: "center",
		borderRadius: 5,
	},
	textItem: { flex: 1 },

	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	modalView: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 5,
		padding: 35,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,

		justifyContent: "center",
		flexDirection: "column",
	},

	modalButtonView: {
		justifyContent: "center",
		flexDirection: "row",
	},
	buttonConfirm: {
		borderRadius: 5,
		padding: 10,
		margin: 10,
		elevation: 2,
	},

	buttonClose: {
		backgroundColor: "#aaa",
	},
	buttonContinue: {
		backgroundColor: "red",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
});
