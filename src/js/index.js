import {
  connectToLocalStorage,
  createCitiesList,
  citiesList,
} from "./connectToLocalStorage.js";
import { buildMarkUpCard } from "./buildMarkUpCard.js";
import { getMap } from "./getMap.js";
import { getCity, apiKey, contentCard, mainCard } from "./getCity.js";

// Объявлем переменные

const inputSearch = document.querySelector(".header__search");
const btnSearch = document.querySelector(".header__btn");
const btnGeolocation = document.querySelector(".header__geolocation");

// Пишем функцию с прослушиванием событий по клику

btnSearch.addEventListener("click", async (e) => {
  e.preventDefault();
  const city = inputSearch.value.trim();
  inputSearch.value = "";
  await getCity(city);
});
connectToLocalStorage();
createCitiesList(connectToLocalStorage());

// Пишем функцию по клику на кнопку определния геопозиции и чтобы он выводил текущю геопозицию

btnGeolocation.addEventListener("click", (e) => {
  e.preventDefault();
  navigator.geolocation.getCurrentPosition((location) => {
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    setTimeout(() => {
      mainCard.innerHTML = "";
      fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=5ea9c7db826548f89523c51287d5685b`
      )
        .then((response) => response.json())
        .then((data) => {
          getCity(data.features[0].properties.city);
        })
        .catch(() => {
          mainCard.innerHTML = `Ошибка запроса, повторите попытку позже`;
        });
    }, 2000);
    mainCard.innerHTML = `Загрузка данных...`;
  });
});

// Ниже самовызывающаяся функция по выводу дефолтного города при старте экрана. Значение берется из геопозиции

(function () {
  navigator.geolocation.getCurrentPosition((location) => {
    const { latitude } = location.coords;
    const { longitude } = location.coords;
    function showStartPage(lat, lon) {
      getMap(lat, lon);
      fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=5ea9c7db826548f89523c51287d5685b`
      )
        .then((response) => response.json())
        .then((data) => {
          fetch(
            // Вот тут поработать чтобы если геопозиция не разрешена, то выводить город по дефолту Москва. Пока не работает
            `https://api.openweathermap.org/data/2.5/weather?&q=${
              data ? data.features[0].properties.city : "Москва"
            }&appid=${apiKey}&lang=ru&units=metric`
          )
            .then((response) => response.json())
            .then((dataCity) => {
              contentCard.innerHTML = buildMarkUpCard(dataCity);
            });
        })
        .catch(() => {
          contentCard.innerHTML = `
            Ошибка соединения с сервером, попробуйте позже.
        `;
        });

      return contentCard;
    }
    // через setTimeout имитируем загрузку данных на странице
    setTimeout(() => {
      mainCard.innerHTML = "";
      mainCard.append(showStartPage(latitude, longitude));
    }, 2000);
    mainCard.innerHTML = `Загрузка данных...`;
  });
})();

// Ниже функция показа погоды при клике на город из списка ранее посещенных

citiesList.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.className === "main__savedCities") {
    const city = e.target.innerText;
    getCity(city);
  }
});
