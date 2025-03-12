import { Text, View, StyleSheet, Image } from 'react-native';
import ButtonComponent from '../src/components/ButtonComponent';
import { useRouter } from 'expo-router';
import 'react-native-get-random-values';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';


export default function Index() {
    const router = useRouter();
    return (
<LinearGradient colors={["#f5f5f5", "#008080"]} style={styles.container}>
            {/* App Logo */}
            <Image source={require("../assets/fit1.png")} style={styles.logo} />

            {/* Welcome Text */}
            <Text style={styles.title}>Welcome to Fitness App</Text>
            <Text style={styles.subtitle}>Your journey to fitness starts here!</Text>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <ButtonComponent title="View Workouts" onPress={() => router.push('/workout')} icon="barbell-outline" />
                <ButtonComponent title="Track Calories" onPress={() => router.push('/calorie')} icon="flame-outline" />
                <ButtonComponent title="Profile" onPress={() => router.push('/profile')} icon="person-outline" />
            </View>
        </LinearGradient>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#ffffff", // Clean white background
    },
    logo: {
        width: 100, // Adjusted size to fit better
        height: 100,
        marginBottom: 20,
        resizeMode: "contain",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000", // Black for better contrast
        textAlign: "center",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#555", // Dark gray for better readability
        textAlign: "center",
        marginBottom: 30, // Increased margin for spacing
    },
    inputContainer: {
        width: "100%", // Full width for inputs
        marginBottom: 15, // Space between inputs
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#f9f9f9", // Light gray background for inputs
    },
    buttonContainer: {
        width: "100%",
        alignItems: "center",
        marginBottom: 20, // Space below the button
    },
    button: {
        backgroundColor: "#FFB600", // Bright yellow for the button
        paddingVertical: 14, // Comfortable padding
        borderRadius: 8, // Rounded corners
        width: "100%", // Full width for button
        alignItems: "center",
    },
    buttonText: {
        color: "#000", // Black text for contrast
        fontSize: 18,
        fontWeight: "bold",
    },
    linkText: {
        marginTop: 10,
        color: "#007BFF", // Bright blue for links
        textDecorationLine: "underline",
        fontWeight: "600",
    },
});