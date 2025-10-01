import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getTransactions } from "./utils/wallet";

export default function HistoryScreen() {
  const { email = "Guest" } = useLocalSearchParams();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const txs = await getTransactions(email.toString());
      setTransactions(txs);
    })();
  }, [email]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length === 0 ? (
        <Text>No transactions yet.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.tx}>
              <Text>
                {item.type} {item.grams ? `${item.grams.toFixed(2)} g` : ""}
              </Text>
              {item.to && <Text>→ {item.to}</Text>}
              {item.from && <Text>← {item.from}</Text>}
              {item.inr && <Text>₹{item.inr}</Text>}
              <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  tx: { borderBottomWidth: 1, borderColor: "#ddd", paddingVertical: 10 },
  date: { fontSize: 12, color: "#666" },
});
