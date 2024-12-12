import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  BackHandler,
  StatusBar,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
const EmailMess = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert("App", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);

  useEffect(() => {
    StatusBar.setBarStyle("light-content");
    StatusBar.setBackgroundColor("#9AA6B2");
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [email, setEmail] = useState("ashokadithya2310949@ssn.edu.in");
  const [name, setName] = useState("Ashok Adithya L");
  const [department, setDepartment] = useState("B.Tech. IT");
  const [year, setYear] = useState("II-year");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [leaveDays, setLeaveDays] = useState(0);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const calculateLeaveDays = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of both start and end dates
    setLeaveDays(diffDays);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      calculateLeaveDays(selectedDate, endDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      calculateLeaveDays(startDate, selectedDate);
    }
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    Alert.alert(
      "Submi Leave Application",
      `
      Email:${email}
      Name: ${name}
      Department: ${department}
      Year: ${year}
      Leave Dates: ${startDate.toLocaleDateString(
        "en-GB"
      )} - ${endDate.toLocaleDateString("en-GB")}
      Leave Days: ${leaveDays}
    `,
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Leave application canceled, email not sent.");
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              setIsLoading(true);
              const formData = {
                email: email,
                name: name,
                department: department,
                year: year,
                startDate: startDate.toLocaleDateString("en-GB"),
                endDate: endDate.toLocaleDateString("en-GB"),
                leaveDays: leaveDays,
              };

              const trimmedIp = ipAddress.trim();

              const response = await axios.post(
                `http://${trimmedIp}:8000/email/send-email`,
                formData
              );

              if (response.status === 200) {
                Alert.alert("Success", "Leave application sent successfully!");
              } else {
                Alert.alert("Error", "Failed to send leave application.");
              }
            } catch (error) {
              Alert.alert("Error", "An error occurred while sending email.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Leave Application</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your IP Address"
        value={ipAddress}
        onChangeText={setIpAddress}
        placeholderTextColor="#bbb"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Department</Text>
      <TextInput
        style={styles.input}
        value={department}
        onChangeText={setDepartment}
        placeholder="Enter your department"
      />

      <Text style={styles.label}>Year</Text>
      <TextInput
        style={styles.input}
        value={year}
        onChangeText={setYear}
        placeholder="Enter your year"
      />

      <Text style={styles.label}>Start Date:</Text>
      <Button
        title={formatDate(startDate)}
        onPress={() => setShowStartPicker(true)}
        color="#3b82f6"
      />
      <View style={styles.buttonSpacing}></View>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <Text style={styles.label}>End Date:</Text>
      <Button
        title={formatDate(endDate)}
        onPress={() => setShowEndPicker(true)}
        color="#3b82f6"
      />
      <View style={styles.buttonSpacing}></View>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <View style={styles.buttonDiv}>
        <Text style={styles.leaveDaysText}>Leave Days: </Text>
        <Text style={styles.leaveDays}>{leaveDays} days</Text>
      </View>

      {isLoading && <Text style={styles.sending}>Sending Email...</Text>}

      {!isLoading && (
        <Button title="Submit" onPress={handleSubmit} color="#3b82f6" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    padding: 20,
  },
  buttonDiv: {
    display: "flex",
    flexDirection: "row",
    width: 100,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  leaveDays: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  leaveDaysText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buttonSpacing: {
    marginBottom: 10,
  },
  sending: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
});

export default EmailMess;
