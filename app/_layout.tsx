import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: "Inicio" }} />
      <Tabs.Screen name="crear" options={{ title: "Crear Evento" }} />
    </Tabs>
  );
}
