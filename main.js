import { getCommentsApi, addCommentApi } from './api.js';
import { renderCommentsModule, renderFormModule } from './render.js';
import { initUpdateCommentListener, initUpdateButtonsListener, initSaveButtonsListeners, initLikeButtonsListener, deleteLastComment } from "./actionsWithComments.js";
let isLoading = false;
let commentElementError = '';
let nameElementError = '';

document.querySelector('.add-form').style.display = "none";

//Нашла форму добавления комментариев
const formAddComm = document.querySelector('.add-form');
renderFormModule({ formAddComm, isLoading, text: addComments, nameElementError, commentElementError })

//массив с комментариями
let comments = [];

//Рендерит комментарии
const renderComments = () => {
  renderCommentsModule({ comments });
  initLikeButtonsListener({ comments, text: renderComments });
  initUpdateButtonsListener({ comments, text: renderComments });
  initSaveButtonsListeners({ comments, text: renderComments });
  initUpdateCommentListener({ comments });
  deleteLastComment({ comments, text: renderComments });
}
renderComments();

//Получение комментариев из Апи
const getComments = () => {
  getCommentsApi().then((responseData) => {
    comments = responseData.comments;
    return renderComments();
  })
}
getComments();

//Функция добавления комментария
function addComments() {
  //Нашла два инпута
  const nameInputElement = document.querySelector('.add-form-name');
  const commentInputElement = document.querySelector('.add-form-text');
  isLoading = true;
  renderFormModule({ formAddComm, isLoading, text: addComments, nameElementError, commentElementError })
  getComments();

  //Добавление в массив новые комменатарии
  addCommentApi({ text: commentInputElement.value, name: nameInputElement.value }).then((responseData) => {
    comments = responseData.comments;
    return getComments();
  })
    .then((data) => {
      nameInputElement.value = '';
      commentInputElement.value = '';
      nameElementError = nameInputElement.value;
      commentElementError = commentInputElement.value;
      isLoading = false;
      renderFormModule({ formAddComm, isLoading, text: addComments, nameElementError, commentElementError })
      console.log('data');
    })
    .catch((error) => {
      if (error.message === "Сервер сломался") {
        console.log(error.message);
        nameElementError = nameInputElement.value;
        commentElementError = commentInputElement.value;
        // alert("Сервер сломался. Повторите позже.");
        isLoading = false;
        renderFormModule({ formAddComm, isLoading, text: addComments, nameElementError, commentElementError })
        addComments();
        return;
      }
      if (error.message === "Плохой запрос") {
        console.log(error.message);
        nameElementError = nameInputElement.value;
        commentElementError = commentInputElement.value;
        alert('Имя и комментарий должны быть не короче 3 символов')
        isLoading = false;
        renderFormModule({ formAddComm, isLoading, text: addComments, nameElementError, commentElementError })
        return;
      }
      alert('Кажется, у вас сломался интернет, попробуйте позже');
      isLoading = false;
      return renderFormModule({ formAddComm, isLoading, text: addComments, nameElementError, commentElementError })
    })
}

//При нажатии на энтер добавляется новый комментарий
formAddComm.addEventListener('keyup', (elem) => {
  if (elem.keyCode === 13) {
    addComments();
  }
})