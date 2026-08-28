import react from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClasesScreen from '../screens/ClasesScreen';

const Stack = createNativeStackNavigator();

export default function ClasesStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            title: 'Clases de Ingles',
        }}
        >
            <Stack.Screen 
                name="Home"

                component={ClasesScreen}

                options={{
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}