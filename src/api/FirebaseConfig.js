// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBi-Gpf4Yvk5Nlqxmoske-u7jq_-HXuQaA",
    authDomain: "uade-archivos.firebaseapp.com",
    projectId: "uade-archivos",
    storageBucket: "uade-archivos.appspot.com",
    messagingSenderId: "325779479632",
    appId: "1:325779479632:web:af6530b47fd170964d4555",
    measurementId: "G-RXMV9C4P82"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getStorage(app);

export const storage = getStorage(app);

export async function uploadImageToFirebase(file){
    const storageRef = ref(storage, `images/${file.name}-${Date.now()}`);
    await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef)
    return url;
}


