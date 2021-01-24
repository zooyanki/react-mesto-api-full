import React from 'react';
import regOk from '../images/reg_ok.svg';
import regNotOk from '../images/reg_not_ok.svg';

function InfoToolTip(props) {
    return (            
        <div className={`modal modal_${props.name} ${props.isOpen ? 'modal_opened':''}`}>
            <div className="modal__overlay" onClick={props.onClose}></div>          
            <form className="modal__form" name={`modal-${props.name}`} action="#">
                <button className="modal__button-close" type="button" aria-label="close" onClick={props.onClose}></button>
                <div className="modal__frame">
                    <img className="modal__infotooltip-image" src={props.onError ? regNotOk : regOk} alt="Регистрация прошла успешно"/>
                    <p className="modal__infotooltip-text">{props.onError ? `Что-то пошло не так! Попробуйте еще раз` : `Вы успешно зарегистрировались`}</p>
                </div>        
            </form>  
        </div>  

    )
}

export default InfoToolTip;