import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

export async function updateProductStock(productId, quantity) {
  const ref = doc(db, "products", productId);
  const snapshot = await getDoc(ref);
  const data = snapshot.data();

  if (!data || data.stock < quantity) {
    throw new Error("Not enough stock");
  }

  await updateDoc(ref, { stock: data.stock - quantity });
}

export async function addCheckout(items) {
  const ref = collection(db, "checkouts");
  const data = {
    items,
    createdAt: Date.now(),
    total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
  await addDoc(ref, data);
}
