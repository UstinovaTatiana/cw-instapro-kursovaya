import { posts } from "../index.js";
import { likePost, dislikePost } from "../api.js";
import { getToken } from "../index.js";

export const initLikeListeners = () => {
  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", async (event) => {
      event.stopPropagation();

      const postId = likeButton.dataset.postId;
      const post = posts.find((p) => p.id === postId);
      if (!post) return;
      console.log("Объём posts:", posts);

      try {
        let updatedPost;
        if (post.isLiked) {
          // Убираем лайк
          updatedPost = await dislikePost({ token: getToken(), postId });
        } else {
          // Ставим лайк
          updatedPost = await likePost({ token: getToken(), postId });
        }

        // Предположим, API возвращает обновлённый пост
        Object.assign(post, updatedPost.post);

        // Обновляем UI для этого поста
        updatePostLikeUI(post);
        
      } catch (error) {
        alert(`Ошибка: ${error.message}`);
        console.error("Ошибка при лайке или дизлайке:", error);
      }
    });
  }
};
function updatePostLikeUI(post) {
  // Найти блок поста по id
  const postElements = document.querySelectorAll(".post");
  postElements.forEach((postEl) => {
    const btn = postEl.querySelector(".like-button");
    if (btn && btn.dataset.postId === post.id) {
      // Обновляем изображение
      const imgEl = btn.querySelector("img");
      imgEl.src = `./assets/images/${
        post.isLiked ? "like-active" : "like-not-active"
      }.svg`;

      // Обновляем счетчик лайков
      //   const likesText = postEl.querySelector(".post-likes-text strong");
      //   likesText.textContent = String(post.likes.length);
      const likesText = postEl.querySelector(".post-likes-text strong");
      if (likesText && Array.isArray(post.likes)) {
        likesText.textContent = String(post.likes.length);
      }
    }
  });
}
