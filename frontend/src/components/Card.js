import React, { useContext } from 'react';
import {CurrentUserContext} from '../contexts/CurrentUserContext';


function Card(props) {
    const currentUser = useContext(CurrentUserContext);
    const isOwn = props.image.owner === currentUser._id;
    const isLiked = props.image.likes.some(i => i === currentUser._id);
    function handleClick() {
        props.onCardClick(props.image);
    }
    function handleLikeClick() {
        props.onCardLike(props.image);
    }

    function openConfirmPopup() {
        props.onConfirmPopup(props.image);
        
    }
  
    return (
        <div className="element">
            <div className="element__image-block">
                <img className="element__image" src={props.image.link} alt={props.image.name} onClick={handleClick}/>
            </div>
            <button className={`element__trash ${isOwn ? "element__trash" : "element__trash_invisible"}`} aria-label="remove" type="button" onClick={openConfirmPopup}></button>
            <div className="element__name">
                <p className="element__text">{props.image.name}</p>
                <div className="element__group-container">
                    <button className={`${isLiked ? "element__group element__group_visible" : "element__group element__group_invisible"}`} type="button" aria-label="like" onClick={handleLikeClick}></button>
                    <p className="element__group-number">{props.image.likes.length}</p>
                </div>
            </div>
        </div>    
    );
}

export default Card;