import firebase from 'firebase/app'
import 'firebase/firestore'
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: 'poker-118ed',
    storageBucket: 'poker-118ed.appspot.com',
    messagingSenderId: '153769650459',
    appId: '1:153769650459:web:076517b7199ee8730fcbb'
}
firebase.initializeApp(firebaseConfig)
export default firebase