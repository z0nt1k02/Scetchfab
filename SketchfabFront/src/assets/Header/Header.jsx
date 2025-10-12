import { useState } from "react";
import "./Header.css";
import Login from "../Login/Login";
import Registration from "../Registraton/Registration";

import { useNavigate } from "react-router-dom";

function Header() {
  const [isModal, setModal] = useState(false);
  const [isRegistrationModal, setRegistrationModal] = useState(false);
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
      <button onClick={() => setModal(true)}>Войти</button>
      <button onClick={() => setRegistrationModal(true)}>Регистрация</button>
      <button className="upload-button" onClick={handleButtonClick}>
        <img className="upload-image" src="/upload.png" alt="" />
        Загрузить <br />
        модель
      </button>
      <Login isOpen={isModal} onClose={() => setModal(false)} />
      <Registration
        isOpen={isRegistrationModal}
        onClose={() => setRegistrationModal(false)}
      />
    </header>
  );
}
export default Header;
