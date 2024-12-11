import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  textStyles?: string;
  containerStyles?: string;
}

const CustomButton = ({
  onPress,
  title,
  textStyles = "",
  containerStyles = "",
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={styles.button}
      className={containerStyles}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={styles.text} className={textStyles}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    borderRadius: 50,
    minHeight: 62,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "semibold",
    fontSize: 30,
  },
});
