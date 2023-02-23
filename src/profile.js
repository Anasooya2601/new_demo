import React, { useState, Fragment } from "react";
import Form from "./form";
import Table from "./table";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import "./App.css";
// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyCMdoeLXriVDxfUNLszGbAyxLPqughLORU",
  authDomain: "fir-c8d46.firebaseapp.com",
  projectId: "fir-c8d46",
  storageBucket: "fir-c8d46.appspot.com",
  messagingSenderId: "911114993865",
  appId: "1:911114993865:web:ab9ba32d706c2007e50d18",
  measurementId: "G-B3Y00ZV34Z"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function Profile() {
  const [tableData, setTableData] = useState([]);
  const [formObject, setFormObject] = useState({
    pageno: "",
    date: "",
    Title: "",
    pdf: "",
    time: ""
  });
  const onValChange = (event) => {
    const value = (res) => ({
      ...res,
      [event.target.name]: event.target.value
    });
    setFormObject(value);
  };
  const onFormSubmit = async (event) => {
    event.preventDefault();
    const checkVal = !Object.values(formObject).every((res) => res === "");
    if (checkVal) {
      // Upload the PDF file to Firebase Storage
      if (formObject.pdfFile) {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(formObject.pdfFile.name);
        await fileRef.put(formObject.pdfFile);
        const pdfUrl = await fileRef.getDownloadURL();
        formObject.pdf = pdfUrl;
      }

      const dataObj = (data) => [...data, formObject];
      setTableData(dataObj);
      const isEmpty = { pageno: "", date: "", Title: "", pdf: "", time: "" };
      setFormObject(isEmpty);
    }
  };

  const onFileChange = async (event) => {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(file.name);
    await fileRef.put(file);
    const downloadUrl = await fileRef.getDownloadURL();
    setFormObject((prev) => ({ ...prev, pdf: downloadUrl }));
  };

  const onDeleteRow = (rowIndex) => {
    const newData = [...tableData];
    newData.splice(rowIndex, 1);
    setTableData(newData);
  };

  return (
    <Fragment>
      <Form
        onFileChange={onFileChange}
        onValChange={onValChange}
        formObject={formObject}
        onFormSubmit={onFormSubmit}
      />

      <Table tableData={tableData} onDeleteRow={onDeleteRow} />
    </Fragment>
  );
}
export default Profile;
