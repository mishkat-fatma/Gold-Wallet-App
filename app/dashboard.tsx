import { useState, useCallback } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getWallet } from "./utils/wallet";

export default function DashboardScreen() {
  const { email = "Guest" } = useLocalSearchParams();
  const router = useRouter();

  const [goldBalance, setGoldBalance] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  const loadBalances = async () => {
    const { gold, cash } = await getWallet(email.toString());
    setGoldBalance(gold);
    setCashBalance(cash);
  };

  useFocusEffect(useCallback(() => { loadBalances(); }, [email]));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome {email}</Text>
      <Text style={styles.balance}>Gold: {goldBalance.toFixed(2)} g</Text>
      <Text style={styles.balance}>Cash: ₹{cashBalance.toFixed(2)}</Text>

      <View style={styles.btn}>
        <Button title="Buy Gold" onPress={() => router.push(`/buy-gold?email=${email}`)} />
      </View>
      <View style={styles.btn}>
        <Button title="Transfer Gold" onPress={() => router.push(`/transfer-gold?email=${email}`)} />
      </View>
      <View style={styles.btn}>
        <Button title="Transaction History" onPress={() => router.push(`/history?email=${email}`)} />
      </View>
      <View style={styles.btn}>
        <Button title="Logout" color="red" onPress={() => router.replace("/login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  balance: { fontSize: 18, marginBottom: 10 },
  btn: { marginVertical: 10 },
});
