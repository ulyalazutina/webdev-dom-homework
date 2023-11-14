const blockComments = document.querySelector('.comments');

import { login, setToken } from "./api.js";
import { formatDate } from "./date.js";
import { isLoading, nameElementError, commentElementError, addComments } from "./main.js";
let userName;
// isLoading
export const renderCommentsModule = ({ comments }) => {
  blockComments.innerHTML = comments.map((comment, index) => {
    return `
            <li class="comment" data-index='${index}'>
            <div class="comment-header">
              <div>${comment.author.name}</div>
              <div>${formatDate(comment.date)}</div>
            </div>
            <div class="comment-body">
            ${comment.isEdit ? `<textarea class="update-input">${comment.text}</textarea>` : `<div>${comment.text}</div>`}
            </div>
            <div class="comment-footer">
              <div class="likes">
                <span class="likes-counter">${comment.likes}</span>
                <button data-index='${index}' class="${comment.isLike ? 'like-button -active-like' : 'like-button'}"></button> 
              </div>
            </div>
            <button data-index='${index}' type="button" class= ${comment.isEdit ? '"save-btn"> Сохранить </button>' : '"update-btn">Редактировать</button>'}
          </li>
            `
  }).join('');

}



function isActive() {
  const writeButton = document.querySelector('.add-form-button');
  writeButton.disabled = true;
  writeButton.style.backgroundColor = 'grey';

  // document.querySelector('.add-form-name').addEventListener('input', () => {
  //   if (document.querySelector('.add-form-name').value.trim() !== '' && document.querySelector('.add-form-text').value.trim() !== '') {
  //     writeButton.disabled = false;
  //     writeButton.style.backgroundColor = '#bcec30';
  //   }
  // });
  document.querySelector('.add-form-text').addEventListener('input', () => {
    if ( document.querySelector('.add-form-text').value.trim() !== '') {
      writeButton.disabled = false;
      writeButton.style.backgroundColor = '#bcec30';
    }
  });
}
//document.querySelector('.add-form-name').value.trim() !== '' &&


export const renderFormModule = ({isLoading, nameElementError, commentElementError, text}) => {
  const formAdd = document.querySelector('.add-form');
  if (isLoading === true) {
    // console.log(isLoading);
    return formAdd.innerHTML =
      ` <div>Комментарий добавляется </div>
        `
  } else {
    // console.log(isLoading);
    formAdd.innerHTML = ` <input
        type="text"
        class="add-form-name"
        placeholder="${userName}" readonly value = '${nameElementError}'
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
    document.querySelector('.add-form-button')
      .addEventListener('click', text);
    isActive();
  }
}

export const renderLinkAuthorization = () => {
  ///////////////////////////////////////////////////////////////////
  const form = document.querySelector('.add-form');

  const linkHtml = `
    <button type = "button" id = "auth_btn">Авторизоваться</button>
  `;
  form.innerHTML = linkHtml;
  ///////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////
  const authBtnElement = document.getElementById('auth_btn');

  authBtnElement.addEventListener('click', () => {
    const loginHtml = `
    <h1>Авторизация</h1>
    <input type="text" name="" id="login-input" placeholder="Логин">
    <input type="text" name="" id="password-input" placeholder="Пароль">
    <button type="button" id = "login-btn">Войти</button>
    `;
    form.innerHTML = loginHtml;
    ///////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////
    const loginBtn = document.getElementById('login-btn');

    loginBtn.addEventListener('click', () => {
      const loginInputElement = document.getElementById('login-input');
      const passwordInputElement = document.getElementById('password-input');
      login({
        login: loginInputElement.value,
        password: passwordInputElement.value,
      })
        .then((responseData) => {
          setToken(responseData.user.token)
          userName = responseData.user.name;
          // console.log(responseData);
        })
        .then(() => {
          renderFormModule({isLoading, nameElementError, commentElementError , text: addComments});
        })
    })

    ///////////////////////////////////////////////////////////////////
  })

}