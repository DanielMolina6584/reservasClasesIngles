import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import createTabsNavigator from "./TabsNavigator";
import ClasesScreen from "../screens/ClasesScreen";
import DetalleClaseScreen from "../screens/DetalleClaseScreen";
import ReservasScreen from "../screens/ReservasScreen";
import PerfilScreen from "../screens/PerfilScreen";
import RegistroScreen from "../screens/RegistroScreen";

const Stack = createNativeStackNavigator();
const Tabs = createTabsNavigator();

function PestanasPrincipales() {
    return (
        <Tabs.Navigator initialRouteName="Inicio" backBehavior="firstRoute">
            <Tabs.Screen
                name="Inicio"
                component={ClasesScreen}
                options={{ icono: 'home', etiqueta: 'Inicio' }}
            />
            <Tabs.Screen
                name="Reservas"
                component={ReservasScreen}
                options={{ icono: 'calendar', etiqueta: 'Reservas' }}
            />
            <Tabs.Screen
                name="Perfil"
                component={PerfilScreen}
                options={{ icono: 'person', etiqueta: 'Perfil' }}
            />
        </Tabs.Navigator>
    )
}

export default function RootNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Tabs"
                component={PestanasPrincipales}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetalleClase"
                component={DetalleClaseScreen}
                options={{ title: 'Detalle de la clase' }}
            />
            <Stack.Screen
                name="Registro"
                component={RegistroScreen}
                options={{ title: 'Crear cuenta' }}
            />
        </Stack.Navigator>
    )
}
