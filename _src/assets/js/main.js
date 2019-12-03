/* eslint-disable no-console */
'use strict';

//CONSTANTES

const inputSearch = document.querySelector('.js-input');
const listContainer = document.querySelector('.js-list-container-info');
const button = document.querySelector('.js-button');
const favContainer = document.querySelector('.js-fav-container-info');
const resetButton = document.querySelector('.js-reset-button');
let series = [];
let favSeries = [];

//LOCAL STORAGE

function setLocalStorage() {
  localStorage.setItem('favSeries', JSON.stringify(favSeries));
}

function getLocalStorage() {
  const localStorageFavs = JSON.parse(localStorage.getItem('favSeries'));
  if (localStorageFavs !== null) {
    favSeries = localStorageFavs;
    paintFavs();
    listenFavs();
    listenerRemoveFav();
  } else {
    getServerData();
  }
}

//FETCH

function getServerData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${inputSearch.value}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      series = data;
      paintSeries();
      listenFavs();
      paintFavs();
    })
    .catch(function(err) {
      console.log('Error al traer los datos del servidor', err);
    });
}

//PINTAR SERIES

function paintSeries() {
  listContainer.innerHTML = '';
  for (let i = 0; i < series.length; i++) {
    const serieContainer = document.createElement('li');
    serieContainer.setAttribute('id', `${series[i].show.id}`);
    const index = favSeries.findIndex(function(show) {
      return show.id === series[i].show.id;
    });
    const isFav = index !== -1;
    if (isFav === true) {
      serieContainer.setAttribute(
        'class',
        'js-serie-container fav__serie__colors'
      );
    } else {
      serieContainer.setAttribute('class', 'js-serie-container');
    }
    listContainer.appendChild(serieContainer);

    const title = document.createElement('h3');
    const titleText = document.createTextNode(`${series[i].show.name}`);
    title.appendChild(titleText);
    serieContainer.appendChild(title);

    const img = document.createElement('img');
    if (series[i].show.image === null) {
      img.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/ffffff/666666/?'
      );
    } else {
      img.setAttribute('src', `${series[i].show.image.medium}`);
    }
    serieContainer.appendChild(img);
  }
  listenFavs();
  listenerRemoveFav();
}

//FAVORITOS

//señalar favs

function addFavs(ev) {
  const clickedId = parseInt(ev.currentTarget.id);
  const index = favSeries.findIndex(function(show) {
    return show.id === clickedId;
  });
  const isFav = index !== -1;
  if (isFav === true) {
    favSeries.splice(index, 1);
  } else {
    for (let i = 0; i < series.length; i++) {
      if (series[i].show.id === clickedId) {
        favSeries.push(series[i].show);
      }
    }
  }
  setLocalStorage();
  paintFavs();
  listenFavs();
  paintSeries();
  listenerRemoveFav();
}

//pintar favs

function paintFavs() {
  favContainer.innerHTML = '';
  for (let i = 0; i < favSeries.length; i++) {
    // debugger;
    const serieContainer = document.createElement('li');
    serieContainer.setAttribute('id', `${favSeries[i].id}`);
    serieContainer.setAttribute(
      'class',
      'js-serie-container fav__serie__colors icon'
    );
    favContainer.appendChild(serieContainer);

    const title = document.createElement('h3');
    title.setAttribute('class', 'fav__title');
    const titleText = document.createTextNode(`${favSeries[i].name}`);
    title.appendChild(titleText);
    serieContainer.appendChild(title);

    const img = document.createElement('img');
    img.setAttribute('class', 'fav__img');
    if (favSeries[i].image === null) {
      img.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/ffffff/666666/?'
      );
    } else {
      img.setAttribute('src', `${favSeries[i].image.medium}`);
    }
    serieContainer.appendChild(img);
    resetButton.classList.remove('hidden');
  }
}

//función listener favs

function listenFavs() {
  const serieItems = document.querySelectorAll('.js-serie-container');
  for (const serieItem of serieItems) {
    serieItem.addEventListener('click', addFavs);
  }
}

//BOTÓN RESET

function resetFav(ev) {
  ev.preventDefault();
  favSeries.splice(0, favSeries.length);
  resetButton.classList.add('hidden');
  localStorage.removeItem('favSeries');
  paintFavs();
  paintSeries();
}

resetButton.addEventListener('click', resetFav);

//REMOVE FAV

function listenerRemoveFav() {
  const favItems = document.querySelectorAll('.fav__serie__colors');
  for (const favItem of favItems) {
    favItem.addEventListener('click', removeFav);
  }
}

function removeFav(ev) {
  const clickedId = parseInt(ev.currentTarget.id);
  const index = favSeries.findIndex(function(show) {
    return show.id === clickedId;
  });
  const isFav = index !== -1;
  if (isFav === true) {
    favSeries.splice(index, 1);
  }
  setLocalStorage();
}

// HANDLER
function handler(ev) {
  ev.preventDefault();
  getServerData();
}

button.addEventListener('click', handler);
getLocalStorage();
