const host = 'https://wedev-api.sky.pro/api/v2/ulyana-lazutina/comments';
const userUrl = 'https://wedev-api.sky.pro/api/user/login';
export let token;
export const setToken = (newToken) => {
    token = newToken;
}

export const getCommentsApi = () => {
    return fetch(host, {
        method: 'GET',
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер сломался')
            }
            document.querySelector('.loader').style.display = "none";
            document.querySelector('.add-form').style.display = "flex";
            return response.json()
        })
}


export const addCommentApi = ({ text }) => {
    return fetch(host, {
        method: 'POST',
        body: JSON.stringify({
            "text": text
                .replaceAll('<', '&lt;').replaceAll('>', '&gt;')
                .replaceAll("%BEGIN_QUOTE", "<div class='quote'>")
                .replaceAll("END_QUOTE%", "</div>")
                .replaceAll("<div class='quote'>", "")
                .replaceAll("</div>", ""),
        }),
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (response.status === 500) {
                throw new Error('Сервер сломался')
            };
            if (response.status === 400) {
                throw new Error('Плохой запрос');
            };
            return response.json();
        })
}

export const login = ({ login, password }) => {
    return fetch(userUrl, {
        method: 'POST',
        body: JSON.stringify({
            login,
            password,
        })
    })
        .then((response) => {
            return response.json();
        })
}
