import React, { useState } from "react";
import axios from "axios";
import "./UploadModel.css";
import { useNavigate } from "react-router-dom";

export default function UploadModel() {
  const [modelFile, setModelFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState(""); // Инициализируем пустой строкой
  const navigate = useNavigate();

  const cancelButtonClick = () => {
    navigate("/");
  };

  function getFileExtension(filename) {
    const match = /\.([a-zA-Z0-9]+)$/.exec(filename);
    return match ? match[1] : "";
  }
  async function uploadModel(file, url) {
    // console.log(url);
    // console.log(file.name);
    const ude = url;
    await axios.put(ude, file, {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });
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
      const dto = {
        title: title,
        modelName: modelFile.name,
      };

      const response = await axios.post(
        "http://localhost:5105/api/model",
        dto,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      // Очищаем форму
      // setModelFile(null);
      // setImageFile(null);
      // setTitle("");
      await uploadModel(modelFile, response.data);
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
    <>
      <h1>Загрузить модель</h1>
      <div className="inputModel-container">
        <form onSubmit={sendModel} className="upload-form">
          <div className="form-row">
            <div className="form-label">
              <span>Модель (.fbx)</span>
            </div>
            <label className="file-upload">
              <input
                type="file"
                accept=".fbx"
                onChange={handleModelChange}
                required
              />
              <span className="file-button">Выберите файл</span>
            </label>
            <div className="file-status">
              {modelFile ? `Выбран: ${modelFile.name}` : "Файл не выбран"}
            </div>
          </div>

          <div className="form-row">
            <div className="form-label">
              <span>
                Изображение
                <br />
                (.png, .jpeg)
              </span>
            </div>
            <label className="file-upload">
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={handleImageChange}
                required
              />
              <span className="file-button">Выберите файл</span>
            </label>
            <div className="file-status">
              {imageFile ? `Выбран: ${imageFile.name}` : "Файл не выбран"}
            </div>
          </div>

          <div className="title-row">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Введите название модели"
              required
              className="title-input"
            />
          </div>

          <div className="actions">
            <button type="submit" className="send-button">
              Отправить
            </button>
            <button
              type="button"
              className="send-button cancel"
              onClick={cancelButtonClick}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
