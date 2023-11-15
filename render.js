const blockComments = document.querySelector(".comments");

import { format } from "date-fns";
import { login, registration, setToken } from "./api.js";
// import { formatDate } from "./date.js";
import {
    isLoading,
    nameElementError,
    commentElementError,
    addComments,
} from "./main.js";
let userName;
// isLoading
export const renderCommentsModule = ({ comments }) => {
    blockComments.innerHTML = comments
        .map((comment, index) => {
            const createDate = format(
                new Date(comment.date),
                "yyyy-MM-dd hh.mm.ss",
            );
            return `
            <li class="comment" data-index='${index}'>
            <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${createDate}</div>
            </div>
            <div class="comment-body">
            ${
                comment.isEdit
                    ? `<textarea class="update-input">${comment.text}</textarea>`
                    : `<div>${comment.text}</div>`
            }
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${comment.likes}</span>
                <button data-index='${index}' class="${
                    comment.isLike ? "like-button -active-like" : "like-button"
                }"></button> 
              </div>
            </div>
            <button data-index='${index}' type="button" class= ${
                comment.isEdit
                    ? '"save-btn"> Сохранить </button>'
                    : '"update-btn">Редактировать</button>'
            }
          </li>
            `;
        })
        .join("");
};

function isActive() {
    const writeButton = document.querySelector(".add-form-button");
    writeButton.disabled = true;
    writeButton.style.backgroundColor = "grey";

    // document.querySelector('.add-form-name').addEventListener('input', () => {
    //   if (document.querySelector('.add-form-name').value.trim() !== '' && document.querySelector('.add-form-text').value.trim() !== '') {
    //     writeButton.disabled = false;
    //     writeButton.style.backgroundColor = '#bcec30';
    //   }
    // });
    document.querySelector(".add-form-text").addEventListener("input", () => {
        if (document.querySelector(".add-form-text").value.trim() !== "") {
            writeButton.disabled = false;
            writeButton.style.backgroundColor = "#bcec30";
        }
    });
}
//document.querySelector('.add-form-name').value.trim() !== '' &&

export const renderFormModule = ({
    isLoading,
    nameElementError,
    commentElementError,
    text,
}) => {
    const formAdd = document.querySelector(".add-form");
    if (isLoading === true) {
        // console.log(isLoading);
        return (formAdd.innerHTML = ` <div>Комментарий добавляется </div>
        `);
    } else {
        // console.log(isLoading);
        formAdd.innerHTML = ` <input
        type="text"
        class="add-form-name"
        readonly value = '${userName}'
      />
      <textarea
        type="textarea"
        class="add-form-text"
        placeholder="Введите ваш коментарий"
        rows="4"
      >${commentElementError}</textarea>
      <div class="add-form-row">
        <button class="add-form-button">Написать</button>
      </div>
    </div>`;
        document
            .querySelector(".add-form-button")
            .addEventListener("click", text);
        isActive();
    }
};

export const renderLinkAuthorization = () => {
    const form = document.querySelector(".add-form");

    const linkHtml = `
  <p>Чтобы добавить комментарий, <button id='auth_btn'>авторизуйтесь</button></p>
  `;
    form.innerHTML = linkHtml;

    const authBtnElement = document.getElementById("auth_btn");

    authBtnElement.addEventListener("click", () => {
        const commentsElement = document.querySelector(".comments");
        commentsElement.style.display = "none";
        const deleteButtonElement = document.querySelector(".add-form-row");
        deleteButtonElement.style.display = "none";
        const loginHtml = `
    <div class="wrapper">
    <h1>Авторизация</h1>
    <div class="auth__container">
    <input type="text" name="" id="login-input" placeholder="Логин">
    <input type="password" name="" id="password-input" placeholder="Пароль">
    <button type="button" id = "login-btn">Войти</button>
    <button type="button" id = "registration-btn">Регистрация</button>
    </div>
    </div>
    `;
        form.innerHTML = loginHtml;

        const loginBtn = document.getElementById("login-btn");
        const registrationBtn = document.getElementById("registration-btn");

        loginBtn.addEventListener("click", () => {
            const loginInputElement = document.getElementById("login-input");
            const passwordInputElement =
                document.getElementById("password-input");
            login({
                login: loginInputElement.value,
                password: passwordInputElement.value,
            })
                .then((responseData) => {
                    setToken(responseData.user.token);
                    userName = responseData.user.name;
                })
                .then(() => {
                    renderFormModule({
                        isLoading,
                        nameElementError,
                        commentElementError,
                        text: addComments,
                    });
                    commentsElement.style.display = "flex";
                    deleteButtonElement.style.display = "flex";
                })
                .catch((error) => {
                    if (error.message === "Неверный логин или пароль") {
                        alert("Неверный логин или пароль");
                        console.log("Неверный логин или пароль");
                        passwordInputElement.value = "";
                    }
                });
        });

        registrationBtn.addEventListener("click", () => {
            const wrappAuth = document.querySelector(".wrapper");
            wrappAuth.style.display = "none";
            const formElement = document.querySelector(".add-form");
            formElement.innerHTML = `
            <h2>Регистрация</h2>
            <div class="reg_container">
            <input type="text" name="" id="nameReg-input" placeholder="Имя">
            <input type="text" name="" id="loginReg-input" placeholder="Логин">
            <input type="password" name="" id="passwordReg-input" placeholder="Пароль">
            <button type="button" id = "reg-btn">Зарегистрироваться</button>
            </div>
            `;
            const regBtn = document.getElementById("reg-btn");

            regBtn.addEventListener("click", () => {
                const nameRegElement = document.getElementById("nameReg-input");
                const loginRegElement =
                    document.getElementById("loginReg-input");
                const passRegElement =
                    document.getElementById("passwordReg-input");
                console.log(loginRegElement.value);
                registration({
                    name: nameRegElement.value,
                    login: loginRegElement.value,
                    password: passRegElement.value,
                })
                    .then((responseData) => {
                        setToken(responseData.user.token);
                        userName = responseData.user.name;
                    })
                    .then(() => {
                        renderFormModule({
                            isLoading,
                            nameElementError,
                            commentElementError,
                            text: addComments,
                        });
                        commentsElement.style.display = "flex";
                        deleteButtonElement.style.display = "flex";
                    })
                    .catch((error) => {
                        if (error.message === "Пользователь с таким логином уже существует") {
                            alert("Пользователь с таким логином уже существует");
                        }
                    })
                    ;
            });
        });
    });
};
