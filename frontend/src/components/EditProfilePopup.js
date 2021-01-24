import React from "react";
import {useState, useEffect, useContext} from 'react';
import PopupWithForm from './PopupWithForm';
import {CurrentUserContext} from '../contexts/CurrentUserContext';


function EditProfilePopup(props) {
    const [name, setName] = useState();
    const [description, setDescription] = useState();

    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        setName(currentUser && currentUser.name);
        setDescription(currentUser && currentUser.about);
      }, [currentUser]); 

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeDescription = (e) => {
        setDescription(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        props.onUpdateUser({
            name: name,
            about: description
          });
    }

    return (
        <PopupWithForm isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} name="editor" title="Редактировать профиль" buttonText="Сохранить">
                        <label className="modal__label">
                            <input className="modal__field modal__field_editor-name" value={name || ' '} onChange={handleChangeName} id="input-editor-name" name="name" type="text" placeholder="Введите ваше имя" minLength="2" maxLength="40" required/>
                            <span className="modal__input-error" id="input-editor-name-error"></span>
                        </label>
                        <label className="modal__label">
                            <input className="modal__field modal__field_editor-status" value={description || ' '} onChange={handleChangeDescription} id="input-editor-status" name="about" type="text" placeholder="Введите вашу профессию" minLength="2" maxLength="200" required/>
                            <span className="modal__input-error" id="input-editor-status-error"></span>
                        </label>          
        </PopupWithForm>) 
}

export default EditProfilePopup;