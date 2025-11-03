import { renderUploadImageComponent } from "./upload-image-component.js";
import { posts } from "../index.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const postsHtml = posts
      .map(
        (post) => `
        <div class="post">
          <img src="${post.imageUrl}" alt="Post Image" class="post-image" />
          <p class="post-description">${post.description}</p>
        </div>
      `
      )
      .join("");

    const appHtml = `
    <div class="page-container">
    
      <div class="header-container"></div>

      <div class="add ">
        <h1 class="add-post">Добавить пост</h1>
      </div>

        <div class="posts-container">${postsHtml}</div>

      <div class="add ">  
        <div class="add-post-container">
          <div class="upload-image-container">
            <!-- Компонент загрузки изображения -->
          </div>
          <textarea id="description-input" placeholder="Введите описание..." class="description-input"></textarea>
          <button id="add-button" class="add-post-button">Добавить пост</button>
      
        </div>


      </div>
      
    </div>
      

  `;

    appEl.innerHTML = appHtml;
      
    // Инициализируем компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    let imageUrl = ""; // По умолчанию пусто

    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl; // Сохраняем загруженное изображение
      },
    });

    
    // Обработчик клика по кнопке "Добавить пост"
    document.getElementById("add-button").addEventListener("click", () => {
      
      const description = document
        .getElementById("description-input")
        .value.trim();

      if (!description) {
        alert("Введите описание для поста.");
        return;
      }

      if (!imageUrl) {
        alert("Пожалуйста, выберите изображение.");
        return;
      }

      // Передаем данные в функцию-обработчик
      onAddPostClick({ description, imageUrl });
    });
  };

  render();
}
