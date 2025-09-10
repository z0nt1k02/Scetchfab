import "./Header.css";

function Header() {
  return (
    <header>
      <h1>Sketchfab</h1>
      <div className="input-container">
        <img className="iconImage" src="/icon_search.png"></img>
        <input></input>
      </div>
      <button className="upload-button">
        <img className="upload-image" src="/upload.png" alt="" />
        Загрузить <br />
        модель
      </button>
    </header>
  );
}
export default Header;
