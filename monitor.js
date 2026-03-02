import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCO7mbV1gb_c7QOU5X_Cfse-VfXomO6qIk",
    authDomain: "downtime-monitor-8f10a.firebaseapp.com",
    projectId: "downtime-monitor-8f10a",
    storageBucket: "downtime-monitor-8f10a.firebasestorage.app",
    messagingSenderId: "789651161921",
    appId: "1:789651161921:web:8a99acb4aaf123cecc97c0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// The system we are checking
const TARGET_URL = 'https://www.google.com';

async function runPing() {
    const start = Date.now();
    let status = 'DOWN';
    let latency = 0;

    try {
        const res = await fetch(TARGET_URL);
        if (res.ok) {
            status = 'UP';
            latency = Date.now() - start;
        }
    } catch (error) {
        status = 'DOWN';
    }

    // Save the result directly to your Firestore database
    await addDoc(collection(db, "pings"), {
        status: status,
        latency: latency,
        timestamp: new Date().toISOString()
    });

    console.log(`Logged ${status} with ${latency}ms latency`);
    process.exit(0); // Exit so GitHub Actions knows the job is finished
}

runPing();