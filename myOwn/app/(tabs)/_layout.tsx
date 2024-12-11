import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const Layout: React.FC = () => {
  return (
    <LinearGradient
      colors={["rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 1)"]} // Dark gradient colors
      style={styles.gradient}
    >
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveBackgroundColor: "#D3F1DF",
        }}
      >
        <Tabs.Screen
          name="EmailMess"
          options={{
            tabBarLabel: "EmailMess",
            tabBarIcon: () => (
              <MaterialIcons name="email" size={30} color="blue" />
            ),
          }}
        />
        <Tabs.Screen
          name="Youtube"
          options={{
            tabBarLabel: "YouTube",
            tabBarIcon: () => (
              <MaterialIcons name="play-arrow" size={30} color="red" />
            ),
          }}
        />
      </Tabs>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export default Layout;
