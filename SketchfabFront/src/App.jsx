import "./App.css";
import Header from "./assets/Header/Header.jsx";
import ModelCard from "./assets/ModelCard/ModelCard.jsx";
import CardsContainer from "./assets/CardsContainer.jsx";
import Modal from "./assets/InputModelWindow/InputModel.jsx";
import { useState } from "react";
import InputFile from "./assets/InputModelWindow/InputFile.jsx";

function App() {
  // const [isModal, setModal] = useState(false);

  return (
    <div>
      <Header /*isModal={isModal} setModal={setModal} */ />
      <main>
        <CardsContainer />
        {/* <Modal open={isModal} onClose={() => setModal(false)}></Modal> */}
        {/* <Modal open={isModal} onClose={null}></Modal> */}
      </main>
    </div>
  );
}

export default App;
