// Объявлем переменные
// const app = document.querySelector('.app');
const mainCard = document.querySelector(".main__card");
const inputSearch = document.querySelector(".header__search");
const btnSearch = document.querySelector(".header__btn");
const btnGeolocation = document.querySelector(".header__geolocation");
const citiesList = document.querySelector(".main__history-title");
const citiesListTitle = document.createElement("h3");
citiesListTitle.innerText = "История поиска";
// const mapCont = document.querySelector('#map-container');
const apiKey = "1289f3b71732cf788b8ea917a6299964";
// const apiKeyMap = 'fdea7c49-7871-40ad-990d-1b2a3f15755d';
const contentCard = document.createElement("div");
contentCard.classList.add("main__card-block");
let dataBase = [];

// Ниже пишем функцию по добавлению в Local Storage данных
// Записываем значение в виде массива, куда передаем ранее введенные города
// При этом сначала проверяем наличие ключа в localStorage и если есть присваеиваем его переменной databse
// чтобы после перезагрузки страницы переменная не обнулялась

async function setToLocalStorage(city) {
  const getFromDataBase = localStorage.getItem("dataBase");
  if (getFromDataBase) {
    const dataBaseJson = JSON.parse(getFromDataBase);
    if (dataBaseJson.length > 0) {
      dataBase = dataBaseJson;
    }
  }
  if (dataBase.length <= 2) {
    dataBase.push(city);
  } else {
    dataBase.shift();
    dataBase.push(city);
  }
  const str = JSON.stringify(dataBase);
  localStorage.setItem("dataBase", str);
}

// Пишем функцию по выводу информации из LocalStorage на страницу браузера

const connectToLocalStorage = () => {
  const getFromDataBase = localStorage.getItem("dataBase");
  const dataBaseJson = JSON.parse(getFromDataBase);
  return dataBaseJson;
};

function createCitiesList(resultCOfConnection) {
  citiesList.innerHTML = "";
  citiesList.append(citiesListTitle);
  for (let i = 0; i < resultCOfConnection.length; i += 1) {
    const savedCities = document.createElement("p");
    savedCities.classList.add(".main__savedCities");
    savedCities.innerText = resultCOfConnection[i];
    citiesList.append(savedCities);
  }
}

async function getFromLocalStorage() {
  connectToLocalStorage();
  createCitiesList(connectToLocalStorage());
}

// Пишем ассинхронную функцию для отправки и полчения данных по API

async function getCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?&q=${city}&appid=${apiKey}&lang=ru&units=metric`
  );
  try {
    const data = await response.json();
    // console.log(data);
    contentCard.innerHTML = `
            <div class="main__card-info">
                <h3 class="main__card-city">${data.name}</h3>
                <p class="main__card-temp">Температура: ${Math.round(
                  data.main.temp
                )}</p>
                <img class="main__card-img" src="http://openweathermap.org/img/w/${
                  data.weather[0].icon
                }.png" alt="weather-icon" />
            </div>
            <div class="main__map">Map</div>
        `;
    await setToLocalStorage(`${data.name}`);
    await getFromLocalStorage();
  } catch (error) {
    contentCard.innerHTML = `
        Город '${city}' не найден.
        Попробуйте ввести другое название
    `;
  }
  mainCard.append(contentCard);
}

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
    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=5ea9c7db826548f89523c51287d5685b`
    )
      .then((response) => response.json())
      .then((data) => {
        getCity(data.features[0].properties.city);
      });
  });
});

// Ниже самовызывающаяся функция по выводу дефолтного города при старте экрана

(function () {
  navigator.geolocation.getCurrentPosition((location) => {
    const lat = location.coords.latitude;
    const lon = location.coords.longitude;
    fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=5ea9c7db826548f89523c51287d5685b`
    )
      .then((response) => response.json())
      .then((data) => {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?&q=${data.features[0].properties.city}&appid=${apiKey}&lang=ru&units=metric`
        )
          .then((response) => response.json())
          .then((dataCity) => {
            contentCard.innerHTML = `
                    <div class="main__card-info">
                        <h3 class="main__card-city">${dataCity.name}</h3>
                        <p class="main__card-temp">Температура: ${Math.round(
                          dataCity.main.temp
                        )}</p>
                        <img class="main__card-img" src="http://openweathermap.org/img/w/${
                          dataCity.weather[0].icon
                        }.png" alt="weather-icon" />
                    </div>
                    <div class="main__map">Map</div>
                `;
          });
      })
      .catch(() => {
        contentCard.innerHTML = `
            Ошибка соединения с сервером, попробуйте позже.
        `;
      });
    mainCard.append(contentCard);
  });
})();

// src=`https://api-maps.yandex.ru/3.0/?apikey=<${apiKeyMap}>&lang=ru_RU`
