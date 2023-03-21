import firebase from "firebase";

const user = {
    id: "",
    name: "",
    updatedAt: firebase.firestore.Timestamp.now(),
    createdAt: firebase.firestore.Timestamp.now()
  };

const initialUser = {
  name: "",
  updatedAt: firebase.firestore.Timestamp.now(),
  createdAt: firebase.firestore.Timestamp.now(),
};