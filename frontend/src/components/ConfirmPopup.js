import React from "react";
import PopupWithForm from './PopupWithForm';


function ConfirmPopup(props) {

    return (
        <PopupWithForm onClose={props.onClose} isOpen={props.isOpen} onSubmit={props.onCardDelete} name="confirmpopup" title="Вы уверены?" buttonText="Да"/>
    )
}

export default ConfirmPopup;