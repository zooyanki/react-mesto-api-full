export default class Api {
    constructor(options) {
      this.headers = options.headers;
      this.baseUrl = options.baseUrl;
    }

    _getHeaders(){
	return { 
            ...this.headers,
            authorization: 'Bearer '+ window.localStorage.getItem('token'),
	}
    }

    _fetch(url, opt={}) {      
      return fetch(this.baseUrl+url,{headers: this._getHeaders(), ...opt})
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

    addLikeCard(cardId) {
      return this._fetch(`/cards/${cardId}/likes`, {
        method: `PUT`,
        body: JSON.stringify({
          _id: cardId 
        })
      });
    }

    remLikeCard(cardId, likeOwnerId) {
      return this._fetch(`/cards/${cardId}/likes/`, {
        method: `DELETE`,
        body: JSON.stringify({
          _id: cardId,
          likeOwnerId: likeOwnerId 
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


  
