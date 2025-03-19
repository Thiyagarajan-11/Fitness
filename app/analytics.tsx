import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";

const AnalyticsScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [totalReps, setTotalReps] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    if (auth.currentUser) {
      const workoutsSnapshot = await getDocs(collection(db, "workouts"));
      const data = workoutsSnapshot.docs.map((doc) => doc.data());
      console.log("Fetched Workouts:", data); // Debugging
  
      // Calculate analytics
      const totalReps = data.reduce((sum, item) => sum + (item.reps || 0), 0);
      const totalCalories = data.reduce((sum, item) => sum + (item.calories || 0), 0); // Use calories field
      setTotalReps(totalReps);
      setTotalCalories(totalCalories);
      setWorkouts(data);
    }
  };

  return (
    <LinearGradient colors={["#008080", "#004d4d"]} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Workout Analytics</Text>

        {/* Total Reps */}
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsText}>Total Reps: {totalReps}</Text>
        </View>

        {/* Total Calories Burned */}
        <View style={styles.analyticsCard}>
          <Text style={styles.analyticsText}>Total Calories Burned: {totalCalories.toFixed(2)} kcal</Text>
        </View>

        {/* Workout History */}
        <Text style={styles.subtitle}>Workout History</Text>
        {workouts.map((workout, index) => (
          <View key={index} style={styles.workoutCard}>
            <Text style={styles.workoutText}>{workout.exercise}: {workout.reps} reps</Text>
            <Text style={styles.workoutDate}>{new Date(workout.date).toLocaleDateString()}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  analyticsCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  analyticsText: {
    fontSize: 16,
    color: "#008080",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  workoutCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutText: {
    fontSize: 16,
    color: "#008080",
    textAlign: "center",
  },
  workoutDate: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});

export default AnalyticsScreen;