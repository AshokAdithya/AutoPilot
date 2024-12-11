import React, { useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
// Define the image source (optional, since you're using a static import)
import beachImage from "@/assets/images/beach.webp";
import CustomButton from "@/components/CustomButton";
import { useRouter } from "expo-router";

const App: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    StatusBar.setBackgroundColor("#9AA6B2");
  }, []);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={beachImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        {/* Use the correct component name: LinearGradient */}
        <LinearGradient
          colors={["rgba(0, 0, 0, 0.4)", "rgba(0,0,0,0.8)"]} // Gradient colors
          style={styles.gradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <Text style={styles.text}>AutoPilot</Text>
            <View></View>
          </SafeAreaView>
          <SafeAreaView style={styles.safeArea2}>
            <CustomButton
              onPress={() => router.push("/(tabs)/Youtube")}
              title="Get Started"
            />
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 100,
  },
  imageBackground: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  text: {
    fontSize: 36,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  safeArea: {
    flex: 1,
    margin: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea2: {
    margin: 20,
    display: "flex",
    justifyContent: "center",
  },
});

export default App;
