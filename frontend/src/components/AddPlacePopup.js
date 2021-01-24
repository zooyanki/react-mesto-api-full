import PopupWithForm from './PopupWithForm';
import {useRef} from 'react';

function AddPlacePopup (props) {

    const cardNameRef = useRef();
    const cardLinkRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        props.onAddPlace({
            name: cardNameRef.current.value,
            link: cardLinkRef.current.value
        })
    }

return (
    <PopupWithForm isOpen={props.isOpen} onClose={props.onClose} onSubmit={handleSubmit} name="newform" title="Новое место" buttonText="Сохранить">
        <>            
            <label className="modal__label">
                <input className="modal__field modal__field_newform-name" ref={cardNameRef} id="input-newform-name" name="name"  placeholder="Название" minLength="2" maxLength="30" type="text" required/>
                <span className="modal__input-error" id="input-newform-name-error"></span>
            </label>
            <label className="modal__label">
                <input className="modal__field modal__field_newform-link" ref={cardLinkRef} id="input-newform-url" name="link" placeholder="Ссылка на картинку" type="url" required/>
                <span className="modal__input-error" id="input-newform-url-error"></span>
            </label>
        </>
    </PopupWithForm>
    )
}

export default AddPlacePopup;