import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import uuid from "react-native-uuid";
import mime from "mime";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBy30UnctzU_FGwYwUJeqsAtqFooqUlaZ4",
    authDomain: "uade-archivos.firebaseapp.com",
    projectId: "uade-archivos",
    storageBucket: "uade-archivos.appspot.com",
    messagingSenderId: "325779479632",
    appId: "1:325779479632:web:8f41087d497258bb4d4555",
    measurementId: "G-32LV0G41B1"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export async function uploadImageToFirebase(uri) {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        // Obtener extensión basada en MIME
        const mimeType = mime.getType(uri); // ej: image/jpeg
        const extension = mime.getExtension(mimeType) || 'jpg'; // fallback en caso de no detectar

        const filename = `${uuid.v4()}.${extension}`;
        const storageRef = ref(storage, `images/${filename}`);

        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error al subir imagen a Firebase:", error);
        return null;
    }
}
