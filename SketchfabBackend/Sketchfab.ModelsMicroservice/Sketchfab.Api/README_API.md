# Sketchfab API - Асинхронная работа с файлами

## Описание

API для асинхронной работы с 3D моделями. Поддерживает загрузку, скачивание и получение информации о файлах.

## Endpoints

### 1. Получение файла (обычный)
```
GET /api/model/getmodel/{fileName}
```
Возвращает файл с правильным MIME-типом.

### 2. Получение файла (потоковый)
```
GET /api/model/getmodelstream/{fileName}
```
Возвращает файл с поддержкой Range запросов для больших файлов.

### 3. Получение информации о файле
```
GET /api/model/getmodelinfo/{fileName}
```
Возвращает метаданные файла без загрузки самого файла.

**Пример ответа:**
```json
{
  "fileName": "model.fbx",
  "fileSize": 1048576,
  "mimeType": "application/octet-stream",
  "lastModified": "2024-01-15T10:30:00",
  "fileSizeFormatted": "1.0 MB"
}
```

### 4. Загрузка файла
```
POST /api/model/postModel
Content-Type: multipart/form-data
```
Загружает FBX файл (максимум 20MB).

## Особенности асинхронной реализации

1. **Асинхронное чтение файлов** - используется `FileStream` с `useAsync: true`
2. **Оптимизированный буфер** - размер буфера 65536 байт для лучшей производительности
3. **Потоковая передача** - поддержка Range запросов для больших файлов
4. **Автоматическое освобождение ресурсов** - Stream освобождается автоматически после отправки
5. **Правильные MIME-типы** - для различных форматов 3D моделей

## Поддерживаемые форматы

- .fbx - application/octet-stream
- .glb - model/gltf-binary
- .gltf - model/gltf+json
- .obj - model/obj
- .stl - model/stl
- .3ds - application/octet-stream

## Примеры использования

### JavaScript (Fetch API)
```javascript
// Получение файла
const response = await fetch('/api/model/getmodel/model.fbx');
const blob = await response.blob();

// Получение информации о файле
const infoResponse = await fetch('/api/model/getmodelinfo/model.fbx');
const fileInfo = await infoResponse.json();
console.log(fileInfo.fileSizeFormatted); // "1.0 MB"
```

### C# (HttpClient)
```csharp
using var httpClient = new HttpClient();
var response = await httpClient.GetAsync("/api/model/getmodel/model.fbx");
var fileBytes = await response.Content.ReadAsByteArrayAsync();
```





