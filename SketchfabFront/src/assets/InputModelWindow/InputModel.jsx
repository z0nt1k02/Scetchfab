import React, { useState } from "react";
import axios from "axios";
import "./InputModel.css";

export default function InputModel({ open, onClose }) {
  const [modelFile, setModelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState(""); // Инициализируем пустой строкой

  if (!open) return null;

  function getFileExtension(filename) {
    const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
    return match ? match[1] : "";
  }

  async function sendModel(e) {
    e.preventDefault();

    if (!modelFile || !imageFile || !title) {
      console.log("Все поля обязательны для заполнения");
      return null;
    }

    if (getFileExtension(modelFile.name) !== "fbx") {
      console.log("Файл модели должен быть .fbx");
      return null;
    }

    const imageExt = getFileExtension(imageFile.name);
    if (imageExt !== "png" && imageExt !== "jpeg") {
      console.log("Только png или jpeg");
      return null;
    }

    try {
      const formData = new FormData();
      formData.append("model", modelFile);
      formData.append("modelImage", imageFile);
      formData.append("title", title);

      const response = await axios.post("/api/model", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      onClose();

      // Очищаем форму
      setModelFile(null);
      setImageFile(null);
      setTitle("");
    } catch (error) {
      console.error("Ошибка при отправке:", error);
    }
  }

  const handleModelChange = (e) => {
    setModelFile(e.target.files[0]);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="inputModel-visible">
      <div className="inputModel-container">
        <form onSubmit={sendModel}>
          <label>
            <button type="button" className="close-button" onClick={onClose}>
              X
            </button>
          </label>

          <label>
            Файл модели (.fbx):
            <input
              type="file"
              accept=".fbx"
              onChange={handleModelChange}
              required
            />
            {modelFile && <span>Выбран: {modelFile.name}</span>}
          </label>

          <label>
            Изображение (.png, .jpeg):
            <input
              type="file"
              accept=".png,.jpeg,.jpg"
              onChange={handleImageChange}
              required
            />
            {imageFile && <span>Выбран: {imageFile.name}</span>}
          </label>

          <label>
            Название модели:
            <input
              type="text"
              value={title} // Теперь это контролируемый input
              onChange={handleTitleChange}
              placeholder="Введите название"
              required
            />
          </label>

          <button type="submit" className="send-button">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}
