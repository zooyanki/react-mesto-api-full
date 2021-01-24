import React from "react";
import {useRef} from 'react';
import PopupWithForm from './PopupWithForm';


function EditAvatarPopup(props) {
      
    const editAvatarRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        props.onUpdateAvatar({
            avatar: editAvatarRef.current.value
        })
    }

    return (
        <PopupWithForm onSubmit={handleSubmit} isOpen={props.isOpen} onClose={props.onClose} name="updateavatar" title="Обновите аватар" buttonText="Сохранить">             
            <label className="modal__label">
                <input ref={editAvatarRef} className="modal__field modal__field_updateavatar" id="input-updateavatar-url" name="avatar" placeholder="Ссылка на аватар" type="url" required/>
                <span className="modal__input-error" id="input-updateavatar-url-error"></span>
            </label>            
        </PopupWithForm>
    )
}

export default EditAvatarPopup;