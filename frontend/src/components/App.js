import React, {useState, useEffect} from 'react';
import {Switch, Route, useHistory, useLocation} from 'react-router-dom';
import {withRouter} from 'react-router';

import {CurrentUserContext, CardContext} from '../contexts/CurrentUserContext';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ConfirmPopup from './ConfirmPopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
import InfoToolTip from './InfoToolTip';
import ProtectedRoute from './ProtectedRoute';

import {api} from '../utils/api';
import { apiReg } from '../utils/apiReg';

function App() {
  const history = useHistory();
  const location = useLocation();
  
  const [userEmail, setUserEmail] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [cards, setCards] = useState([]);
  const [isEditProfilePopupOpen, setisEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setisAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(false);
  const [isInfoToolTip, setIsInfoToolTip] = useState(false);  
  const [errorInfoToolTip, setErrorInfoToolTip] = useState(false);
  const [targetCard, setTargetCard] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      
      apiReg.usersme(token).then((res) => {
        if (res) {
          setCurrentUser(res);
          setUserEmail(res.email);
          setLoggedIn(true);          
          history.push('/');
        }
      })
      .catch((err) =>
          console.log("Упс... что-то пошло не так")); 
    }

      

    api.getInitialCards().then((item) => {
        setCards(item);
        }).catch((err) =>
        {console.log("Упс... что-то пошло не так");
      });  
  },[loggedIn])

//Удаление карты
  const handleCardDelete = () => {
    api.delInitialCards(targetCard._id, currentUser._id).then(() => {
      const newCards = cards.filter(item => item._id !== targetCard._id);
      setCards(newCards);
      }).catch((err) =>
      console.log("Упс... что-то пошло не так"));
    }
//Добавление/удаление лайка
  const handleCardLike = (card) => {
      const isLiked = card.likes.some(item => item === currentUser._id);
      
      if (!isLiked) {api.addLikeCard(card._id).then((newCard) => {
          const newCards = cards.map((c) => c._id === card._id ? newCard : c);
          setCards(newCards);
        }).catch((err) =>
        console.log("Упс... что-то пошло не так"));
      } else {
        api.remLikeCard(card._id, currentUser._id).then((newCard) => {
          const newCards = cards.map((c) => c._id === card._id ? newCard : c);
          setCards(newCards)
        }).catch((err) =>
        console.log("Упс... что-то пошло не так"));
      }
    } 

//Обновление пользователя на сервере  
  const handleUpdateUser = (infoUser) => {
    api.setUserInfo(infoUser.name, infoUser.about).then((name, about)=> {
      setCurrentUser(name, about);
    }).catch((err) =>
    console.log("Упс... что-то пошло не так"));
  }

//Смена аватара на сервере
  const handleUpdateAvatar = (avatar) => {
    api.setUserAvatar(avatar.avatar).then((res) => {
      setCurrentUser(res);
    }).catch((err) =>
    console.log("Упс... что-то пошло не так"));
  }

//Добавление картинки на сервере
  const handleAddPlaceSubmit = (image) => {
    api.setInitialCard(image.name, image.link).then((newCard) => {
      setCards([newCard, ...cards])
    }).catch((err) =>
    console.log("Упс... что-то пошло не так"));
  }

//Регистрация
const onRegister = (dataUser) => {
  apiReg.signup(dataUser.password, dataUser.email)
    .then((res) => {
          if (res) {            
              history.push('/signin');
              openInfoToolTip();
            }            
          } 
    )
    .catch(err => console.log(err));
}

//Авторизация
const onLogin = (dataUser) => {
  apiReg.signin(dataUser.password, dataUser.email)
    .then((data) => {
        if (data.token) {
                handleLogin(dataUser.email);
                setLoggedIn(true);
                openInfoToolTip();
                history.push('/');
            }
        } )
    .catch((err) => {            
      openInfoToolTip(err);
    });
}

  //Проверка авторизации
const handleLogin = (email) => {
  setLoggedIn(true);
  setUserEmail(email);
}

  const signOut = () => {

    if (location.pathname === "/") {
      localStorage.removeItem('token');
        history.push('/signin');      
    }

    if (location.pathname === "/signin") {
        history.push('/signup');      
    }

      if (location.pathname === "/signup") {
        history.push('/signin');    
    }
  }

  const handleCardClick = (card) => {
    setSelectedCard(card); 
  } 
  
  const openPopupEditor = () => {
    setisEditProfilePopupOpen(true);
  }
  const openPopupNewForm = () => {
    setisAddPlacePopupOpen(true);
  }
  const openPopupAvatar = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const openPopupConfirm = (card) => {
    setIsConfirmPopupOpen(true);
    setTargetCard(card);
  }

  const openInfoToolTip = (err) => {
    setIsInfoToolTip(true);
    setErrorInfoToolTip(err);
  }

  const closeAllPopups = () => {
    setisAddPlacePopupOpen(false);
    setisEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(false);
    setIsInfoToolTip(false);
  }  

        return (
            <CurrentUserContext.Provider value={currentUser}>
              <CardContext.Provider value={cards}>
                
                <div className="App">                
                  <div className="content">
                        <Header location={location.pathname} email={userEmail} onSign={signOut}/>  
                        <main>
                          <Switch>

                            <ProtectedRoute exact path="/" loggedIn={loggedIn} component={Main} cards={cards} onConfirmPopup={openPopupConfirm} onEditProfile={openPopupEditor} onAddPlace={openPopupNewForm} onEditAvatar={openPopupAvatar} onCardClick={handleCardClick} onCardLike={handleCardLike}/>

                            <Route exact path="/signin">
                              <Login onLogin={onLogin}/>
                            </Route>

                            <Route exact path="/signup" >
                              <Register onRegister={onRegister}/>
                            </Route>

                          </Switch>
                        </main>
                        <Footer/>

                  </div>
        
                    <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
              
                    <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
                          
                    <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
                    
                    <ConfirmPopup onClose={closeAllPopups} isOpen={isConfirmPopupOpen} onCardDelete={handleCardDelete}/>             
        
                    <ImagePopup onClose={closeAllPopups} isOpen={selectedCard}/>

                    <InfoToolTip isOpen={isInfoToolTip} onClose={closeAllPopups} onError={errorInfoToolTip}/>
                      
              </div>

              </CardContext.Provider>
            </CurrentUserContext.Provider>
        );
}

export default withRouter(App);


