const blockComments = document.querySelector('.comments');

import { formatDate } from "./date.js";

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

  document.querySelector('.add-form-name').addEventListener('input', () => {
    if (document.querySelector('.add-form-name').value.trim() !== '' && document.querySelector('.add-form-text').value.trim() !== '') {
      writeButton.disabled = false;
      writeButton.style.backgroundColor = '#bcec30';
    }
  });
  document.querySelector('.add-form-text').addEventListener('input', () => {
    if (document.querySelector('.add-form-name').value.trim() !== '' && document.querySelector('.add-form-text').value.trim() !== '') {
      writeButton.disabled = false;
      writeButton.style.backgroundColor = '#bcec30';
    }
  });
}

export const renderFormModule = ({ formAddComm, isLoading, text, nameElementError, commentElementError }) => {
  if (isLoading === true) {
    // console.log(isLoading);
    return formAddComm.innerHTML =
      ` <div>Комментарий добавляется </div>
        `
  } else {
    // console.log(isLoading);
    formAddComm.innerHTML = ` <input
        type="text"
        class="add-form-name"
        placeholder="Введите ваше имя" value = '${nameElementError}'
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