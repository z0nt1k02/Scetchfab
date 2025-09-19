import { useState } from "react";
import "./Header.css";

import { useNavigate } from "react-router-dom";

function Header(/*{ isModal, setModal }*/) {
  const [isModal, setModal] = useState(false);
  function SetModal() {
    setModal(true);
  }

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/upload");
    console.log("Страница загрузки");
  };

  return (
    <header>
      {/* <h1>Sketchfab</h1> */}
      <button
        className="h1-button"
        onClick={() => {
          navigate("/");
        }}
      >
        Sketchfab
      </button>
      <div className="input-container">
        <img className="iconImage" src="/icon_search.png"></img>
        <input></input>
      </div>
      <button className="upload-button" onClick={handleButtonClick}>
        <img className="upload-image" src="/upload.png" alt="" />
        Загрузить <br />
        модель
      </button>
    </header>
  );
}
export default Header;
