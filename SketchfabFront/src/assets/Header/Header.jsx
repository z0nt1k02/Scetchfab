import { useState } from "react";
import "./Header.css";
import InputModel from "../InputModelWindow/InputModel";

function Header(/*{ isModal, setModal }*/) {
  const [isModal, setModal] = useState(false);
  function SetModal() {
    setModal(true);
  }
  return (
    <header>
      <h1>Sketchfab</h1>
      <div className="input-container">
        <img className="iconImage" src="/icon_search.png"></img>
        <input></input>
      </div>
      <button className="upload-button" onClick={SetModal}>
        <img className="upload-image" src="/upload.png" alt="" />
        Загрузить <br />
        модель
      </button>
      <InputModel open={isModal} onClose={() => setModal(false)}></InputModel>
    </header>
  );
}
export default Header;
