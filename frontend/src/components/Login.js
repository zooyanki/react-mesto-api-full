import React, {useState} from 'react';
import {withRouter} from 'react-router-dom';

    function Login (props) {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleChange = (event) => {
            if (event.target.name === 'email') {
                setEmail(event.target.value);
            }
            if (event.target.name === 'password') {
                setPassword(event.target.value);
            }
        }

        const handleSubmit = (event) => {
            event.preventDefault();
            if (!email || !password) {
                return;
            }

            props.onLogin({
                email: email,
                password: password
            })
        }
   
        return (
            <div className="sign">
                <h2 className="sign__header">Вход</h2>
                <input className="sign__input" name="email" value={email} type="email" placeholder="E-mail" onChange={handleChange}/>
                <input className="sign__input" name="password" value={password} type="password" placeholder="Пароль" onChange={handleChange}/>
                <button className="sign__buttonSubmit" type="submit" onClick={handleSubmit}>Войти</button>
            </div>
        )
    }

export default withRouter(Login);




