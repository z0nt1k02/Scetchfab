import "./Header.css";
import { Input } from "antd";

function Header() {
  return (
    <header>
      <h1>Sketchfab</h1>
      <div className="input-container">
        <Input placeholder="Search 3d models" />
      </div>
      <p>Created by z0ntik02</p>
    </header>
  );
}
export default Header;
