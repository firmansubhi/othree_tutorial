import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Image } from "expo-image";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Carousel, {
	ICarouselInstance,
	Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

//get display width
const width = Dimensions.get("window").width;

export default function HomeScreen() {
	//define empty array variable for images
	const [banners, setBanners] = useState([]);

	//set themes color according to device themes
	const colorScheme = useColorScheme();
	const themeCarousel =
		colorScheme === "light" ? styles.carouselLight : styles.carouselDark;

	//call loadData function only once when the home page appears
	useEffect(() => {
		loadData();
	}, []);

	//get data from server
	const loadData = async () => {
		axios
			.get(`https://tempdev2.roomie.id/newsadmin/banner`, {})
			.then(function (response) {
				if (response.data.success == true) {
					//set banner variable with data from API
					setBanners(response.data.data);
				}
			});
	};

	const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);
	const onPressPagination = (index: number) => {
		ref.current?.scrollTo({
			count: index - progress.value,
			animated: true,
		});
	};

	//content of the image banner to be rendered
	const renderItem = ({ item }: { item: string }) => {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				<Image
					style={styles.imageBanner}
					source={item}
					contentFit="contain"
				/>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.saveContainer}>
			<ScrollView>
				<ThemedView style={styles.imageLogoContainer}>
					<Image
						style={styles.imageLogo}
						source={require("@/assets/images/logo.svg")}
						contentFit="contain"
					/>
				</ThemedView>

				<View style={[themeCarousel]}>
					<Carousel
						ref={ref}
						width={width}
						height={width / 2 - 22}
						data={banners}
						onProgressChange={progress}
						renderItem={renderItem}
						loop={true}
						autoPlay
						autoPlayInterval={5000}
						mode="parallax"
					/>

					<Pagination.Basic
						progress={progress}
						data={banners}
						dotStyle={{
							backgroundColor: "rgba(0,0,0,0.2)",
							borderRadius: 50,
						}}
						containerStyle={{ gap: 10, marginTop: 0 }}
						onPress={onPressPagination}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	saveContainer: {
		flex: 1,
	},
	imageLogoContainer: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
		height: 80,
		paddingTop: 10,
		marginBottom: 0,
	},
	imageLogo: {
		width: 80,
		height: 80 * (144 / 165),
	},

	carouselLight: {
		backgroundColor: Colors.light.background,
	},
	carouselDark: { backgroundColor: Colors.dark.background },
	imageBanner: {
		width: "100%",
		height: "100%",
	},
});
