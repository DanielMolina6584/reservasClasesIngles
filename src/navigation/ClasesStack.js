import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/ClasesScreen";
import DetalleClaseScreen from "../screens/DetalleClaseScreen";

const Stack = createNativeStackNavigator();

export default function ClasesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Clases" 
                component={StartScreen} 
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetalleClase"
                component={DetalleClaseScreen}
                options={{ title: 'Detalle de la clase' }}
            />
        </Stack.Navigator>
    )
}