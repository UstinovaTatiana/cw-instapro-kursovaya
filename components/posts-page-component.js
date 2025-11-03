import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { initLikeListeners } from "./initListeners.js";

import { formatDistanceToNow } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/index.js';
import { ru } from 'https://cdn.jsdelivr.net/npm/date-fns@2.29.3/esm/locale/index.js';


export function renderPostsPageComponent({ appEl, userId = null }) {
  // Проверяем, есть ли посты
  if (!posts || posts.length === 0) {
    appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <p class="Post-component">Нет постов для отображения.</p>
      </div>`;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    return; // Выходим из функции, если постов нет
  }

  console.log("Актуальный список постов:", posts);
  const filteredPosts =
    userId !== null ? posts.filter((post) => post.user.id == userId) : posts;
  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postsHtml = filteredPosts
    .map((post) => {
      const createdAt = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
        locale: ru,
      });
      return `<li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image" alt="${
        post.user.name
      }">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${
                        post.imageUrl
                      }" alt="Изображение поста">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" class="like-button">
                        <img src="./assets/images/${
                          post.isLiked ? "like-active" : "like-not-active"
                        }.svg" alt="Кнопка лайка">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>${post.likes.length}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.text}
                    </p>
                   <p class="post-date">${createdAt}</p>
                  </li>`;
    })
    .join("");

  appEl.innerHTML = `
  <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
      ${postsHtml}
    </ul>
  </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  initLikeListeners();
}

export function renderUserPhotosPageComponent({ appEl, userId }) {
  // Получить посты этого пользователя
  const userPosts = posts.filter((post) => post.user.id == userId);

  if (userPosts.length === 0) {
    appEl.innerHTML = `
      <div class="page-container">
        <div class="header-container"></div>
        <p>У этого пользователя нет фотографий.</p>
      </div>`;
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
    return;
  }

  const photosHtml = userPosts
    .map(
      (post) => `
      <div class="user-photo" style="margin:10px;">
        <img src="${post.imageUrl}" alt="Фото пользователя" style="width:200px; height:auto;">
      </div>`
    )
    .join("");

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <h2>Фотографии пользователя ${userId}</h2>
      <div class="photos-grid" style="display:flex; flex-wrap:wrap;">
        ${photosHtml}
      </div>
    </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  initLikeListeners();
}
