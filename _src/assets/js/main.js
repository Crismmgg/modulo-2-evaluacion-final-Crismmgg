/* eslint-disable no-console */
'use strict';

const inputSearch = document.querySelector('.js-input');
const listContainer = document.querySelector('.js-list-container-info');
const button = document.querySelector('.js-button');
const favContainer = document.querySelector('.js-fav-container-info');
let series = [];
let favSeries = [];

//fetch

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
      console.log('traigo datos');
    })
    .catch(function(err) {
      console.log('Error al traer los datos del servidor', err);
    });
}

//pintar series html

function paintSeries() {
  listContainer.innerHTML = '';
  for (const serie of series) {
    const serieContainer = document.createElement('li');
    serieContainer.setAttribute('id', `${serie.show.id}`);
    // debugger;
    const index = favSeries.findIndex(function(show, index) {
      return show.id === clickedId;
    });
    const isFav = index !== -1;

    if (isFav) {
      serieContainer.setAttribute(
        'class',
        'js-serie-container fav__serie__colors'
      );
    } else {
      serieContainer.setAttribute('class', 'js-serie-container');
    }
    listContainer.appendChild(serieContainer);
    const title = document.createElement('h3');
    title.setAttribute('class', 'show__title');
    const titleText = document.createTextNode(`${serie.show.name}`);
    title.appendChild(titleText);
    serieContainer.appendChild(title);
    const img = document.createElement('img');
    if (serie.show.image === null) {
      img.setAttribute(
        'src',
        'https://via.placeholder.com/210x295/ffffff/666666/?'
      );
    } else {
      img.setAttribute('src', `${serie.show.image.medium}`);
    }
    serieContainer.appendChild(img);
  }
}
//señalar favoritas

function addFavs(ev) {
  debugger;
  const clickedId = parseInt(ev.currentTarget.id);
  const index = favSeries.findIndex(function(show, index) {
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
  console.log(index);
  console.log(favSeries);
  listenFavs();
}

function paintFavs() {
  favContainer.innerHTML = '';
  for (let i = 0; i < favSeries.length; i++) {
    for (const serie of series) {
      const serieContainer = document.createElement('li');
      serieContainer.setAttribute('id', `${serie.show.id}`);
      serieContainer.setAttribute('class', 'js-serie-container');
      listContainer.appendChild(serieContainer);
      const title = document.createElement('h3');
      title.setAttribute('class', 'show__title');
      const titleText = document.createTextNode(`${serie.show.name}`);
      title.appendChild(titleText);
      serieContainer.appendChild(title);
      const img = document.createElement('img');
      if (serie.show.image === null) {
        img.setAttribute(
          'src',
          'https://via.placeholder.com/210x295/ffffff/666666/?'
        );
      } else {
        img.setAttribute('src', `${serie.show.image.medium}`);
      }
      serieContainer.appendChild(img);
    }
  }
}
function listenFavs() {
  const serieItems = document.querySelectorAll('.js-serie-container');
  for (const serieItem of serieItems) {
    serieItem.addEventListener('click', addFavs);
  }
}

button.addEventListener('click', getServerData);
