import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import createTabsNavigator from "./TabsNavigator";
import ClasesScreen from "../screens/ClasesScreen";
import DetalleClaseScreen from "../screens/DetalleClaseScreen";
import ReservasScreen from "../screens/ReservasScreen";

const Stack = createNativeStackNavigator();
const Tabs = createTabsNavigator();

// `icono` es el nombre base de Ionicons (activo: relleno, inactivo: `-outline`).
// `etiqueta` no se muestra: es el accessibilityLabel del ícono.
// Perfil usa ClasesScreen de forma temporal hasta que exista su pantalla.
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
                component={ClasesScreen}
                options={{ icono: 'person', etiqueta: 'Perfil' }}
            />
        </Tabs.Navigator>
    )
}

// DetalleClase vive fuera de las pestañas para que se abra encima de la barra inferior
// y se pueda llegar a ella desde Inicio o desde Reservas.
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
        </Stack.Navigator>
    )
}
