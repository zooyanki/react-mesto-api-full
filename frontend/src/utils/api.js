export default class Api {
    constructor(options) {
      this.headers = options.headers;
      this.baseUrl = options.baseUrl;
      this.credentials = options.credentials;
    }

    _fetch(url, opt={}) {      
      return fetch(this.baseUrl+url,{headers: this.headers, credentials: this.credentials, ...opt})
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Хьюстон, у нас проблемы: ${res.status}`);
      })
    }
  
    getInitialCards() {
      return this._fetch(`/cards`);
    }

    getUserInfo() {
      return this._fetch(`/users/me`);
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

    delInitialCards(del) {
      return this._fetch(`/cards/${del}`, {
        method: `DELETE`,
        body: JSON.stringify({
          _id: del 
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

export const api = new Api({ 
  baseUrl: 'http://api.zooyanki.students.nomoredomains.rocks',
  credentials: 'include', 
  headers: {    
    'Content-Type': 'application/json' 
  } 
});


  
