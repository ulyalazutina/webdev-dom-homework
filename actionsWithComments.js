function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

//лайк 
export const initLikeButtonsListener = ({ comments, text }) => {
    //Нашла кнопку лайка
    const likeButtons = document.querySelectorAll('.like-button');
    //Перебираю все кнопки 
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            //функция для проверки на состояние загрузки и присваивание класса с анимацией
            const loadingLike = () => {
                if (isLikeLoading) {
                    return likeButton.classList.add('-loading-like');
                } else {
                    return likeButton.classList.remove('-loading-like');
                }
            }
            //состояние загрузки
            let isLikeLoading = true;
            loadingLike();
            //Присвоила индексу весь элемент массива
            const index = likeButton.dataset.index;
            delay(2000).then(() => {
                if (comments[index].isLike) {
                    comments[index].isLike = false;
                    comments[index].likes -= 1;
                } else {
                    comments[index].isLike = true;
                    comments[index].likes += 1;
                }
            })
                .then(() => {
                    isLikeLoading = false;
                    return loadingLike();
                })
                .then(() => {
                    return text();
                });
        }
        )
    }
}
//ответ на комментарий
export const initUpdateCommentListener = ({ comments }) => {
    const formComments = document.querySelectorAll('.comment');
    for (const formComment of formComments) {
        formComment.addEventListener('click', () => {
            const index = formComment.dataset.index;
            document.querySelector('.add-form-name').value = '';
            document.querySelector('.add-form-text').value = `%BEGIN_QUOTE ${comments[index].author.name}: 
        ${comments[index].text}END_QUOTE%`;
        })
    }
}
//Изменение комментария
export const initUpdateButtonsListener = ({ comments, text }) => {
    const updateButtons = document.querySelectorAll('.update-btn');
    for (const updateButton of updateButtons) {
        updateButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = updateButton.dataset.index;
            comments[index].isEdit = true;
            text();
        })
    }
}
//Сохранение измененного комментария
export const initSaveButtonsListeners = ({ comments, text }) => {
    const saveButtons = document.querySelectorAll('.save-btn');
    const updateInputValue = document.querySelector('.update-input');
    for (const saveButton of saveButtons) {
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const index = saveButton.dataset.index;
            comments[index].textComment = updateInputValue.value;
            comments[index].isEdit = false;
            text();
        })
    }
}
//удаление последнего комментария
export const deleteLastComment = ({comments, text}) => {
    //Нашла кнопку удаления
    const deleteButton = document.querySelector('.remove-button');
    deleteButton.addEventListener('click', () => {
        comments.splice(-1);
        text();
    })
}
