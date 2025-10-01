import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Stack.Screen name="buy-gold" options={{ title: "Buy Gold" }} />
      <Stack.Screen name="transfer-gold" options={{ title: "Transfer Gold" }} />
      <Stack.Screen name="history" options={{ title: "Transaction History" }} />
    </Stack>
  );
}
