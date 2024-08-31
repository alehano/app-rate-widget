import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppStateStatus,
  AppState,
  Linking,
} from "react-native";

type RateUsProps = {
  runsToShow: number;
  goodRatingFrom?: number;
  badRatingUrl: string;
  goodRatingUrl: string;
};

const RateUs = ({
  runsToShow: countToShow,
  goodRatingFrom = 5,
  badRatingUrl,
  goodRatingUrl,
}: RateUsProps) => {
  const [runCount, setRunCount] = useState(0);

  // Load data from AsyncStorage
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage
  useEffect(() => {
    saveData();
  }, [runCount]);

  // Increment runCount when app state changes to active
  useEffect(() => {
    // If runCount is less than 0, it means do not show prompt anymore
    // If runCount is greater than countToShow, no need to increment anymore
    if (runCount < 0 || runCount > countToShow) {
      return;
    }
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        setRunCount((prevCount) => prevCount + 1);
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  const loadData = async () => {
    const savedCount = await AsyncStorage.getItem("runCount");
    if (savedCount !== null) {
      setRunCount(parseInt(savedCount, 10));
    }
  };

  const saveData = async () => {
    await AsyncStorage.setItem("runCount", runCount.toString());
  };

  const handleStarPress = (rating: number) => {
    setRunCount(-1);
    Linking.openURL(rating >= goodRatingFrom ? goodRatingUrl : badRatingUrl);
  };

  return (
    <>
      {runCount > countToShow && (
        <View style={styles.reviewContainer}>
          <Text style={styles.reviewText}>🙏 Rate us</Text>
          <View style={styles.starContainer}>
            <TouchableOpacity onPress={() => handleStarPress(1)}>
              <Text style={styles.star}>⭐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStarPress(2)}>
              <Text style={styles.star}>⭐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStarPress(3)}>
              <Text style={styles.star}>⭐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStarPress(4)}>
              <Text style={styles.star}>⭐</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleStarPress(5)}>
              <Text style={styles.star}>⭐</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    width: "100%",
    marginBottom: 20,
    borderWidth: 0,
    borderRadius: 12,
    backgroundColor: "#334155",
    overflow: "hidden",
  },
  reviewText: {
    fontSize: 18,
    color: "#f1f5f9",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  star: {
    fontSize: 24,
  },
});

export default RateUs;
