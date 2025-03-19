// StackNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ProgressInputScreen from "../../app/progressInput";
import ProgressChartScreen from "../../app/progressChart";
import AnalyticsScreen from "../../app/analytics";
import LoginScreen from "../../app/LoginScreen";
import RegisterScreen from "../../app/RegisterScreen";
import ProfileScreen from "../../app/profile";
import IndexScreen from "../../app/index";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Home" component={IndexScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                {/* Add the new screens here */}
                <Stack.Screen name="progressInput" component={ProgressInputScreen} />
                <Stack.Screen name="progressChart" component={ProgressChartScreen} />
                <Stack.Screen name="analytics" component={AnalyticsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}