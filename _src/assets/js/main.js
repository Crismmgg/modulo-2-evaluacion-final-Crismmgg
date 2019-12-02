'use strict';

const inputSearch = document.querySelector('.js-input');
const listContainer = document.querySelector('.js-list-container');
const button = document.querySelector('.js-button');
const favContainer = document.querySelector('.js-fav-container');
let series = [];

//fetch

function getServerData() {
  debugger;
  fetch(`http://api.tvmaze.com/search/shows?q=${inputSearch.value}`)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      series = data;
      paintSeries();
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
    const serieContainer = document.createElement('div');
    serieContainer.setAttribute('class', 'js-serie-container');
    listContainer.appendChild(serieContainer);
    const title = document.createElement('h3');
    const titleText = document.createTextNode(`${serie.show.name}`);
    title.appendChild(titleText);
    serieContainer.appendChild(title);
    const img = document.createElement('img');
    if (serie.show.image.medium === null) {
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

button.addEventListener('click', getServerData);
