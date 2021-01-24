import React from 'react';

function ImagePopup(props) {

    return (
        <>
            <div className={`modal modal_render ${props.isOpen ? 'modal_opened':''}` }>
                <div className="modal__overlay modal__overlay_render" onClick={props.onClose}></div>          
                <div className="modal__form modal__form_render">
                    <button className="modal__button-close" type="button" aria-label="close" onClick={props.onClose}></button>
                    <img className="modal__render" src={props.isOpen.link} alt={props.isOpen.name}/> 
                    <h2 className="modal__render-text">{props.isOpen.name}</h2>      
                </div>        
            </div>
        </>
    )
}

export default ImagePopup;