import { options } from "../../../backend/routes/user";

export default class ApiReg {
    constructor(options) {
        this.headers = options.headers;
        this.baseUrl = options.baseUrl;
        this.credentials = options.credentials;
    }

    _fetch(url, opt={}) {      
        return fetch(this.baseUrl+url,{headers: this.headers, credentials: this.credentials, ...opt})
        .then((res) => {
            try {
                if (res.ok) {
                    return res.json();
                }
            } 
            catch(error) {
                return (error)
            }
          return Promise.reject(`Хьюстон, у нас проблемы: ${res.status}`);
        })
      }

    signup(password, email) {
        return this._fetch(`/signup`, {
            method: 'POST',
            headers: {
              'Content-Type' : 'application/json'},
            body: JSON.stringify({
                password,
                email
            })
        })
    }

    signin(password, email) {
        return this._fetch(`/signin`, { 
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },      
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            })
        })
        .then((data) => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                return data;   
            }            
        })
    }

    usersme(token) {
        return this._fetch(`/users/me`, {
            method: 'GET',
            headers: {
              'Content-Type' : 'application/json',
              'Authorization' : `Bearer ${token}`
            }
        })
    } 

}

export const apiReg = new ApiReg ({
    baseUrl: 'http://api.zooyanki.students.nomoredomains.rocks',
    credentials: 'include',
})