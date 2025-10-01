import AsyncStorage from "@react-native-async-storage/async-storage";

export const GOLD_PRICE = 10000;

// Get or initialize wallet
export async function getWallet(email: string) {
  const goldKey = `wallet:${email}:gold`;
  const cashKey = `wallet:${email}:cash`;

  let g = await AsyncStorage.getItem(goldKey);
  let c = await AsyncStorage.getItem(cashKey);

  let gold = parseFloat(g || "NaN");
  let cash = parseFloat(c || "NaN");

  if (isNaN(gold) || isNaN(cash)) {
    gold = 100;
    cash = 100000;
    await AsyncStorage.setItem(goldKey, gold.toString());
    await AsyncStorage.setItem(cashKey, cash.toString());
  }

  return { gold, cash };
}

// Update wallet
export async function updateWallet(email: string, gold: number, cash: number) {
  await AsyncStorage.setItem(`wallet:${email}:gold`, gold.toString());
  await AsyncStorage.setItem(`wallet:${email}:cash`, cash.toString());
}

// Add a transaction
export async function addTransaction(email: string, tx: any) {
  const key = `wallet:${email}:transactions`;
  const txs = JSON.parse((await AsyncStorage.getItem(key)) || "[]");
  txs.unshift({ ...tx, date: new Date().toISOString() });
  await AsyncStorage.setItem(key, JSON.stringify(txs));
}

// Get transactions
export async function getTransactions(email: string) {
  const key = `wallet:${email}:transactions`;
  return JSON.parse((await AsyncStorage.getItem(key)) || "[]");
}
