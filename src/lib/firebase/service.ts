import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);

export async function register(data: {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );

  const snapshot = await getDocs(q);
  const users = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  if (users.length > 0) {
    return {
      status: false,
      statusCode: 400,
      message: "Email already registed",
    };
  } else {
    data.role = "user";
    data.password = await bcrypt.hash(data.password, 10);
    try {
      await addDoc(collection(firestore, "user"), data);
      return { status: true, statusCode: 200, message: "Register successfull" };
    } catch (error) {
      return {
        status: false,
        statusCode: 400,
        message: "Register failed",
        error,
      };
    }
  }
}
