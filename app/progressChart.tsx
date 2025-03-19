import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../src/firebaseConfig";
import { LinearGradient } from "expo-linear-gradient";
import { format, parseISO } from "date-fns";

const ProgressChartScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
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
      const totalWorkouts = data.length;
      const totalCalories = data.reduce((sum, item) => sum + (item.calories || 0), 0);
      setTotalWorkouts(totalWorkouts);
      setTotalCalories(totalCalories);
      setWorkouts(data);
    }
  };

  if (workouts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No progress data available.</Text>
      </View>
    );
  }

  // Group workouts by date and calculate total calories burned per day
  const groupedWorkouts = workouts.reduce((acc, workout) => {
    const date = format(parseISO(workout.date), "yyyy-MM-dd");
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += workout.calories || 0; // Use calories field (default to 0 if missing)
    return acc;
  }, {} as { [key: string]: number });

  // Sort dates in ascending order
  const sortedDates = Object.keys(groupedWorkouts).sort();

  // Format data for the chart
  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        data: sortedDates.map((date) => groupedWorkouts[date] || 0), // Ensure data is an array of numbers
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White line color
        strokeWidth: 3, // Thicker line
      },
    ],
  };

  return (
    <LinearGradient colors={["#008080", "#004d4d"]} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Calories Burned Progress</Text>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          <LineChart
            data={chartData}
            width={350} // Wider chart
            height={220} // Taller chart
            yAxisSuffix=" kcal"
            chartConfig={{
              backgroundColor: "#008080", // Gradient background
              backgroundGradientFrom: "#008080", // Gradient start
              backgroundGradientTo: "#004d4d", // Gradient end
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White text and lines
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // White labels
              style: {
                borderRadius: 16, // Rounded corners
              },
              propsForDots: {
                r: "5", // Larger dots
                strokeWidth: "2",
                stroke: "#ffffff", // White dots
              },
            }}
            bezier // Smooth curve
            style={styles.chart}
          />
        </View>

        {/* Analytics Section */}
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsTitle}>Analytics</Text>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsText}>Total Workouts: {totalWorkouts}</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsText}>Total Calories Burned: {totalCalories.toFixed(2)} kcal</Text>
          </View>
        </View>
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
    color: "#ffffff", // White text
    marginBottom: 20,
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#ffffff", // White background for the chart
    borderRadius: 16, // Rounded corners
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  chart: {
    borderRadius: 16, // Rounded corners for the chart
  },
  analyticsContainer: {
    marginTop: 20,
    width: "100%",
  },
  analyticsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 10,
    textAlign: "center",
  },
  analyticsCard: {
    backgroundColor: "#ffffff", // White background
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsText: {
    fontSize: 16,
    color: "#008080", // Teal text
    textAlign: "center",
  },
});

export default ProgressChartScreen;