import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage" 

// Cấu hình Firebase của bạn
const firebaseConfig = {
  apiKey: "AIzaSyAv95nCdBzWn7D41PmpMVb8NhmSRN5YZAY",
  authDomain: "toannv1712-c7ea9.firebaseapp.com",
  projectId:"toannv1712-c7ea9",
  storageBucket: "toannv1712-c7ea9.firebasestorage.app",
  messagingSenderId: "1053254127862",
  appId: "1:1053254127862:web:5ad5260edce2accbbd1cd7",
}

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig)

// Khởi tạo Firebase Storage
export const storage = getStorage(app)

export default app
