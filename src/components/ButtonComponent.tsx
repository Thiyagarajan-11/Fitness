import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonComponentProps {
    title: string;
    onPress: () => void;
    icon: keyof typeof Ionicons.glyphMap;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ title, onPress, icon }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Ionicons name={icon} size={24} color="white" style={styles.icon} />
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#008080', // Bright yellow for the LemonPie theme
        paddingVertical: 10, // Reduced vertical padding for a smaller button
        paddingHorizontal: 20, // Horizontal padding for a compact look
        borderRadius: 30, // Increased border radius for a pill shape
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8, // Slight margin for spacing
        width: '80%', // Slightly less than full width for a stylish look
        shadowColor: '#000', // Subtle shadow for depth
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3, // Elevation for Android
    },
    icon: {
        marginRight: 10,
        width: 20, // Fixed width for consistent icon size
        height: 20, // Fixed height for consistent icon size
    },
    text: {
        color: '#ffffff', // White text for contrast
        fontSize: 16, // Font size for readability
        fontWeight: 'bold', // Bold font for emphasis
    },
});
export default ButtonComponent;