import "./App.css";
import Header from "./assets/Header/Header.jsx";
import ModelCard from "./assets/ModelCard/ModelCard.jsx";
import { useState, useEffect } from "react";
import CardsContainer from "./assets/CardsContainer.jsx";

function App() {
  return (
    <div>
      <Header />
      <main>
        <CardsContainer />
      </main>
    </div>
  );
}

export default App;
