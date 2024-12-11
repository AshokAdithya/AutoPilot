import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  Button,
  Alert,
  BackHandler,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import axios from "axios";

const YouTube: React.FC = () => {
  const [url, setUrl] = useState("");
  const [group, setGroup] = useState("single");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titleUrl, setTitleUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [subtitleUrl, setSubtitleUrl] = useState<string>("");
  const [titleList, setTitleList] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [audioList, setAudioList] = useState<any[]>([]);
  const [subtitleList, setSubtitleList] = useState<any[]>([]);

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

  const setNull = () => {
    setTitleUrl("");
    setVideoUrl("");
    setAudioUrl("");
    setSubtitleUrl("");
    setTitleList([]);
    setVideoList([]);
    setAudioList([]);
    setSubtitleList([]);
  };

  const handlePress = async (quality: string, type: string) => {
    setNull();

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      Alert.alert("Error", "Please enter a valid URL.");
      return;
    }

    setIsLoading(true);

    try {
      // Send POST request using axios
      const response = await axios.post(
        "http://192.168.1.5:3000/youtube/downloadVideo",
        {
          url: trimmedUrl,
          quality: quality,
          type: type,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { title_url, video_url, audio_url, subtitle_url } = response.data;

      if (response.status == 200) {
        if (type === "single") {
          setTitleUrl(title_url);
          setVideoUrl(video_url);
          setAudioUrl(audio_url);
          setSubtitleUrl(subtitle_url);
        } else if (type == "playlist") {
          setTitleList(title_url);
          setVideoList(video_url);
          setAudioList(audio_url);
          setSubtitleList(subtitle_url);
        }

        setGroup(type);

        Alert.alert("Success", "Video and Audio Found");
      } else {
        Alert.alert("Failed", "Check the Link");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      Alert.alert("Error", "Error while getting details");
    } finally {
      setIsLoading(false);
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  const renderPlaylistItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <View style={styles.urlContainer}>
      <Text style={styles.singleText}>{item}</Text>
      <View style={styles.linkContainer}>
        {videoList[index] && (
          <TouchableOpacity
            onPress={() => openLink(videoList[index])}
            style={styles.singleLink}
          >
            <Text style={styles.linkText}>Click to Download Video</Text>
          </TouchableOpacity>
        )}
        {audioList && audioList[index] && (
          <TouchableOpacity
            onPress={() => openLink(audioList[index])}
            style={styles.singleLink}
          >
            <Text style={styles.linkText}>Click to Download Audio</Text>
          </TouchableOpacity>
        )}
        {subtitleList[index] && (
          <TouchableOpacity
            onPress={() => openLink(subtitleList[index])}
            style={styles.singleLink}
          >
            <Text style={styles.linkText}>Click to Download Subtitle</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  return (
    <View style={styles.screen}>
      <Text style={styles.header}>YouTube Video Downloader</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter YouTube URL"
        value={url}
        onChangeText={setUrl}
        placeholderTextColor="#bbb"
      />
      {!isLoading && (
        <>
          <View style={styles.buttonDiv}>
            <Button
              title="Download - Highest Quality"
              onPress={() => handlePress("high", "single")}
              color="#3b82f6"
            />
            <View style={styles.buttonSpacing}></View>
            <Button
              title="Download"
              onPress={() => handlePress("low", "single")}
              color="#3b82f6"
            />
          </View>

          <View style={styles.buttonDiv}>
            <Button
              title="Playlist - Highest Quality"
              onPress={() => handlePress("high", "playlist")}
              color="#3b82f6"
            />
            <View style={styles.buttonSpacing}></View>
            <Button
              title="Playlist"
              onPress={() => handlePress("low", "playlist")}
              color="#3b82f6"
            />
          </View>
        </>
      )}

      <View style={styles.buttonSpacing}></View>

      {isLoading && (
        <Text style={styles.singleText}>Getting Data from the Server...</Text>
      )}

      {group === "single" && (
        <View style={styles.linkContainer}>
          {titleUrl && <Text style={styles.singleText}>{titleUrl}</Text>}
          <View style={styles.urlContainer}>
            {videoUrl && (
              <TouchableOpacity
                onPress={() => openLink(videoUrl)}
                style={styles.singleLink}
              >
                <Text style={styles.linkText}>Click to Download Video</Text>
              </TouchableOpacity>
            )}
            {audioUrl && (
              <TouchableOpacity
                onPress={() => openLink(audioUrl)}
                style={styles.singleLink}
              >
                <Text style={styles.linkText}>Click to Download Audio</Text>
              </TouchableOpacity>
            )}
            {subtitleUrl && (
              <TouchableOpacity
                onPress={() => openLink(subtitleUrl)}
                style={styles.singleLink}
              >
                <Text style={styles.linkText}>Click to Download Subtitle</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {group === "playlist" && (
        <FlatList
          data={titleList}
          renderItem={renderPlaylistItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonSpacing: {
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  linkContainer: {
    marginTop: 20,
  },
  singleText: {
    padding: 15,
    backgroundColor: "#FFF0DC",
    textAlign: "center",
    color: "black",
    fontSize: 15,
  },
  urlContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 15,
    flexWrap: "wrap",
  },
  singleLink: {
    height: 48,
    padding: 15,
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    margin: 5,
  },
  linkText: {
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
});

export default YouTube;
