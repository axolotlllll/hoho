import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  const productsCol = collection(db, "products");
  
  export async function createProduct(data) {
    const ref = await addDoc(productsCol, {
      ...data,
      createdAt: Date.now(),
    });
    return { id: ref.id, ...data };
  }
  
  export async function getAllProducts() {
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  export async function updateProduct(id, data) {
    const ref = doc(db, "products", id);
    await updateDoc(ref, data);
    return { id, ...data };
  }
  
  export async function deleteProduct(id) {
    const ref = doc(db, "products", id);
    await deleteDoc(ref);
  }
  
  export async function getProduct(id) {
    const ref = doc(db, "products", id);
    const snapshot = await getDoc(ref);
    return { id, ...snapshot.data() };
  }
  