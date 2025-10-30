import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
/* import { formatDistanceToNow } from "date-fns"; 
import { ru } from "date-fns/locale";  */

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
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

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const postsHtml = posts
    .map((post) => {
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
                        Нравится: <strong>${post.likes}</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.text}
                    </p>
                    <p class="post-date">
                      19 минут назад
                    </p>
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
}
