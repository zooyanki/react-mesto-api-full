import React, {useContext} from 'react';
import editAvatarButtom from '../images/update_avatar.svg';
import Card from './Card';
import {CurrentUserContext} from '../contexts/CurrentUserContext';

function Main(props) {
    const currentUser = useContext(CurrentUserContext); 
    
    return (
          <main>
            <section className="profile block-width">
                <div className="profile__avatar-container">
                  <img src={currentUser && currentUser.avatar} className="profile__avatar" alt="Аватар_пользователя" />
                  <div className="profile__overlay">
                    <div className="profile__overlay-background"></div>
                    <img src={editAvatarButtom} alt="Изменение аватара" className="profile__updateavatar" onClick={props.onEditAvatar}/>
                  </div>
                </div>
                <div className="profile__info">
                  <h1 className="profile__name">{currentUser && currentUser.name}</h1>
                  <button className="profile__edit-button" type="button" aria-label="Edit_profile" onClick={props.onEditProfile}></button>
                  <h2 className="profile__status">{currentUser && currentUser.about}</h2>
                </div>
                <button className="profile__add-button" type="button" aria-label="Add_profile" onClick={props.onAddPlace}></button>
            </section>
            <section className="elements block-width">
              {props.cards.map((card) => (<Card image={card} key={card._id} onCardClick={props.onCardClick} onCardDelete={props.onCardDelete} onCardLike={props.onCardLike} onConfirmPopup={props.onConfirmPopup}/>))}          
            </section>             
          </main>
    );

  }

export default Main;