export default class Api {
    constructor(options) {
      this.headers = options.headers;
      this.baseUrl = options.baseUrl;
    }

    _fetch(url, opt={}) {      
      return fetch(this.baseUrl+url,{headers: this.headers, ...opt})
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Хьюстон, у нас проблемы: ${res.status}`);
      })
    }
  
    getInitialCards() {
      return this._fetch(`/cards`)
    }

    getUserInfo() {
      return this._fetch(`/users/me`)
    }

    setUserInfo(name, about) {
      return this._fetch(`/users/me`, {
        method: `PATCH`,
        body: JSON.stringify({
          name: name,
          about: about,
        })
      });
    }

    setUserAvatar(avatar) {
      return this._fetch(`/users/me/avatar`, {
        method: `PATCH`,
        body: JSON.stringify({
          avatar: avatar
        })
      });
    }

    setInitialCard(name, link) {
      return this._fetch(`/cards`, {
        method: `POST`,
        body: JSON.stringify({
          name: name,
          link: link
        })
      });
    }

    delInitialCards(cardId, owner) {
      return this._fetch(`/cards/${cardId}`, {
        method: `DELETE`,
        body: JSON.stringify({
          _id: cardId,
          owner: owner
        })
      });
    }

    addLikeCard(addlike) {
      return this._fetch(`/cards/likes/${addlike}`, {
        method: `PUT`,
        body: JSON.stringify({
          _id: addlike 
        })
      });
    }

    remLikeCard(remlike) {
      return this._fetch(`/cards/likes/${remlike}`, {
        method: `DELETE`,
        body: JSON.stringify({
          _id: remlike 
        })
      });
    }
}

console.log(document.cookie);
export const api = new Api({ 
  baseUrl: 'http://api.zooyanki.students.nomoredomains.rocks',  
  headers: {    
    'Content-Type': 'application/json',
    'authorization': 'Bearer '+ window.localStorage.getItem('token')
  } 
});


  
