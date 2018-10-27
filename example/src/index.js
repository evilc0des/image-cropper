import React from "react";
import ReactDOM from "react-dom";

import CropComponent from "./CropComponent";

import "./styles.css";

function saveImage(imageFile) {
  return Promise.resolve("http://lorempixel.com/800/100/sports/");
}

function App() {
  return (
    <div className="App">
      <CropComponent onSaveImage={saveImage} />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
