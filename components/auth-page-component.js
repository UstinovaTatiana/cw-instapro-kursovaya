import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

/**
 * Компонент страницы авторизации.
 * Этот компонент предоставляет пользователю интерфейс для входа в систему или регистрации.
 * Форма переключается между режимами "Вход" и "Регистрация".
 *
 * @param {HTMLElement} params.appEl - Корневой элемент приложения, в который будет рендериться страница.
 * @param {Function} params.setUser - Функция, вызываемая при успешной авторизации или регистрации.
 *                                    Принимает объект пользователя в качестве аргумента.
 */
export function renderAuthPageComponent({ appEl, setUser }) {
  /**
   * Флаг, указывающий текущий режим формы.
   * Если `true`, форма находится в режиме входа. Если `false`, в режиме регистрации.
   * @type {boolean}
   */
  let isLoginMode = true;

  /**
   * URL изображения, загруженного пользователем при регистрации.
   * Используется только в режиме регистрации.
   * @type {string}
   */
  let imageUrl = "";

  /**
   * Рендерит форму авторизации или регистрации.
   * В зависимости от значения `isLoginMode` отображает соответствующий интерфейс.
   */
  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Вход в&nbsp;Instapro"
                    : "Регистрация в&nbsp;Instapro"
                }
              </h3>
              <div class="form-inputs">
                  ${
                    !isLoginMode
                      ? `
                      <div class="upload-image-container"></div>
                      <input type="text" id="name-input" class="input" placeholder="Имя" />
                      `
                      : ""
                  }
                  <input type="text" id="login-input" class="input" placeholder="Логин" />
                  <input type="password" id="password-input" class="input" placeholder="Пароль" />
                  <div class="form-error"></div>
                  <button class="button" id="login-button">${
                    isLoginMode ? "Войти" : "Зарегистрироваться"
                  }</button>
              </div>
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p>
              </div>
          </div>
      </div>    
    `;

    appEl.innerHTML = appHtml;

    /**
     * Устанавливает сообщение об ошибке в форме.
     * @param {string} message - Текст сообщения об ошибке.
     */
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    // Рендерим заголовок страницы
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    // Если режим регистрации, рендерим компонент загрузки изображения
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    // Обработка клика на кнопку входа/регистрации
    // document.getElementById("login-button").addEventListener("click", () => {
    //   setError("");

    //   if (isLoginMode) {
    //     // Обработка входа
    //     const login = document.getElementById("login-input").value;
    //     const password = document.getElementById("password-input").value;

    //     if (!login) {
    //       alert("Введите логин");
    //       return;
    //     }

    //     if (!password) {
    //       alert("Введите пароль");
    //       return;
    //     }

    //     loginUser({ login, password })
    //       .then((user) => {
    //         setUser(user.user);
    //       })
    //       .catch((error) => {
    //         console.warn(error);
    //         setError(error.message);
    //       });
    //   } else {
    //     // Обработка регистрации
    //     const login = document.getElementById("login-input").value;
    //     const name = document.getElementById("name-input").value;
    //     const password = document.getElementById("password-input").value;

    //     if (!name) {
    //       alert("Введите имя");
    //       return;
    //     }

    //     if (!login) {
    //       alert("Введите логин");
    //       return;
    //     }

    //     if (!password) {
    //       alert("Введите пароль");
    //       return;
    //     }

    //     if (!imageUrl) {
    //       alert("Не выбрана фотография");
    //       return;
    //     }

    //     registerUser({ login, password, name, imageUrl })
    //       .then((user) => {
    //         setUser(user.user);
    //       })
    //       .catch((error) => {
    //         console.warn(error);
    //         setError(error.message);
    //       });
    //   }
    // });

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      // Массив полей для обеих форм, добавьте или уберите хотя бы поля по необходимости
      const fields = [
        { id: "login-input", label: "логин", key: "login" },
        { id: "password-input", label: "пароль", key: "password" },
      ];

      if (!isLoginMode) {
        // Для регистрации добавляем дополнительные поля
        fields.push(
          { id: "name-input", label: "имя", key: "name" }
          // предполагается, что imageUrl — глобальная переменная с выбранным фото
        );
      }

      // Собираем ошибки по всем полям
      const errors = {};
      let allFieldsValid = true; // флаг для проверки валидности
      const values = {};

      fields.forEach((field) => {
        const el = document.getElementById(field.id);
        const value = el ? el.value.trim() : "";
        values[field.key] = value;

        if (!value) {
          errors[field.key] = `Пожалуйста, введите ${field.label}.`;
          allFieldsValid = false;
        } else {
          errors[field.key] = false;
        }
      });

      // Проверка фото при регистрации
      if (!isLoginMode && !imageUrl) {
        errors["image"] = "Не выбрана фотография";
        allFieldsValid = false;
      }

      // Если есть ошибки — показываем список
      const errorMessages = Object.values(errors).filter(Boolean);
      if (errorMessages.length > 0) {
        alert(errorMessages.join("\n"));
        return; // останавливаем
      }

      // Всё проверили — идём дальше
      if (isLoginMode) {
        // Вход
        const { login, password } = values;
        loginUser({ login, password })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        // Регистрация
        const { login, password, name } = values;
        registerUser({ login, password, name, imageUrl })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    // Обработка переключения режима (вход ↔ регистрация)
    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm(); // Перерисовываем форму с новым режимом
    });
  };

  // Инициализация формы
  renderForm();
}
