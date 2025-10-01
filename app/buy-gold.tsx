import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { GOLD_PRICE, getWallet, updateWallet, addTransaction } from "./utils/wallet";

export default function BuyGoldScreen() {
  const router = useRouter();
  const { email = "Guest" } = useLocalSearchParams();
  const [amount, setAmount] = useState("");

  const handleBuy = async () => {
    const val = parseFloat(amount);
    if (!val || val <= 0) {
      Alert.alert("Error", "Enter valid INR amount");
      return;
    }

    const { gold, cash } = await getWallet(email.toString());
    if (val > cash) {
      Alert.alert("Error", "Not enough cash balance");
      return;
    }

    const grams = val / GOLD_PRICE;
    await updateWallet(email.toString(), gold + grams, cash - val);
    await addTransaction(email.toString(), { type: "BUY", grams, inr: val });

    Alert.alert("Success", `Bought ${grams.toFixed(2)} g`);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Gold</Text>
      <TextInput
        placeholder="Amount in INR"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Buy" onPress={handleBuy} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 5, padding: 10, marginBottom: 15 }
});
