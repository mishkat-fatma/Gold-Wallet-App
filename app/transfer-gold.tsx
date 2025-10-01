import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getWallet, updateWallet, addTransaction } from "./utils/wallet";

export default function TransferGoldScreen() {
  const router = useRouter();
  const { email = "Guest" } = useLocalSearchParams();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");

  const validateEmail = (mail: string) => /\S+@\S+\.\S+/.test(mail);

  const handleTransfer = async () => {
    const grams = parseFloat(amount);

    if (!recipient || !validateEmail(recipient)) {
      Alert.alert("Error", "Enter a valid recipient email");
      return;
    }
    if (recipient === email) {
      Alert.alert("Error", "Cannot transfer to yourself");
      return;
    }
    if (!grams || grams <= 0) {
      Alert.alert("Error", "Enter valid gold amount");
      return;
    }

    const { gold: senderGold, cash: senderCash } = await getWallet(email.toString());
    const { gold: recipientGold, cash: recipientCash } = await getWallet(recipient);

    if (grams > senderGold) {
      Alert.alert("Error", "Not enough gold balance");
      return;
    }

    await updateWallet(email.toString(), senderGold - grams, senderCash);
    await updateWallet(recipient, recipientGold + grams, recipientCash);

    await addTransaction(email.toString(), { type: "SEND", grams, to: recipient });
    await addTransaction(recipient, { type: "RECEIVE", grams, from: email });

    Alert.alert("Success", `Transferred ${grams.toFixed(2)} g to ${recipient}`);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transfer Gold</Text>
      <TextInput
        placeholder="Recipient Email"
        style={styles.input}
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Gold amount (g)"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />
      <Button title="Transfer" onPress={handleTransfer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#aaa", borderRadius: 5, padding: 10, marginBottom: 15 }
});
