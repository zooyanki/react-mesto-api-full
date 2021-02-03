import React from "react";

function PopupWithForm(props) {
    const submit = (...args) => {
        const event = args[0];
        event.preventDefault();
        props.onSubmit(...args);
    }
    return (
        <div className={`modal modal_${props.name} ${props.isOpen ? 'modal_opened':''}`}>
            <div className="modal__overlay" onClick={props.onClose}></div>          
            <form className="modal__form" name={`modal-${props.name}`} onSubmit={submit} action="#">
                <button className="modal__button-close" type="button" aria-label="close" onClick={props.onClose}></button>
                <div className="modal__frame">
                    <h3 className="modal__heading">{`${props.title}`}</h3>
                        <>{props.children}</>
                    <button className="modal__submit-button" type="submit" aria-label="save" onClick={props.onClose}>{props.buttonText}</button>
                </div>        
            </form>  
        </div>  
    );
}

export default PopupWithForm;
