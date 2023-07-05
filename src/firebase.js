// import React from 'react'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBclGn6Ryq0p_3mkJmCHxnQK6frLF2uJxI",
    authDomain: "insta-clone-59a70.firebaseapp.com",
    projectId: "insta-clone-59a70",
    storageBucket: "insta-clone-59a70.appspot.com",
    messagingSenderId: "49102695559",
    appId: "1:49102695559:web:47d9eff0005ab5216a9c22"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const storage = firebase.storage()
const db = app.firestore()

export { auth, db, storage }