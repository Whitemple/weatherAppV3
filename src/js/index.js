// Объявлем переменные
// const app = document.querySelector('.app');
const mainCard = document.querySelector(".main__card");
const inputSearch = document.querySelector(".header__search");
const btnSearch = document.querySelector(".header__btn");
const btnGeolocation = document.querySelector(".header__geolocation");
const citiesList = document.querySelector(".main__cities-list");
const apiKey = "1289f3b71732cf788b8ea917a6299964";
// const apiKeyMap = 'fdea7c49-7871-40ad-990d-1b2a3f15755d';

const contentCard = document.createElement("div");
contentCard.classList.add("main__card-block");

// Ниже переменная нужна для записи ранее посещенных города в массив и передачу в LocalStorage
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

// Функция проверки ключа в LocalStorage и его преобразования в json в случае наличия

const connectToLocalStorage = () => {
  const getFromDataBase = localStorage.getItem("dataBase");
  const dataBaseJson = JSON.parse(getFromDataBase);
  return dataBaseJson;
};

// Функция перерисовки страницы и вывода списка ранее посещенных городов

function createCitiesList(resultCOfConnection) {
  citiesList.innerHTML = "";
  // citiesList.append(citiesListTitle);
  if (resultCOfConnection) {
    for (let i = 0; i < resultCOfConnection.length; i += 1) {
      const savedCities = document.createElement("li");
      savedCities.classList.add("main__savedCities");
      savedCities.innerText = resultCOfConnection[i];
      citiesList.append(savedCities);
    }
  }
}

// Пишем функцию по выводу информации из LocalStorage на страницу браузера (состоит из двух предыдущих)
// Т.к. эти функции не ассинхронные, то можем ииспользовать их в любом другом месте

async function getFromLocalStorage() {
  connectToLocalStorage();
  createCitiesList(connectToLocalStorage());
}

// Функция-конструктуор карточки погоды

function buildMarkUpCard(getData) {
  const markup = `
    <div class="main__card-info">
      <h3 class="main__card-city">${getData.name}</h3>
      <p class="main__card-temp">Температура: ${Math.round(
        getData.main.temp
      )}</p>
      <img class="main__card-img" src="http://openweathermap.org/img/w/${
        getData.weather[0].icon
      }.png" alt="weather-icon" />
    </div>
    <div id="YMapsID" style="width: 450px; height: 350px;"></div>
  `;
  return markup;
}

// Пишем ассинхронную функцию для отправки и полчения данных по API

async function getCity(city) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?&q=${city}&appid=${apiKey}&lang=ru&units=metric`
  );
  try {
    const data = await response.json();
    contentCard.innerHTML = buildMarkUpCard(data);
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
    setTimeout(() => {
      mainCard.innerHTML = "";
      fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&lang=ru&apiKey=5ea9c7db826548f89523c51287d5685b`
      )
        .then((response) => response.json())
        .then((data) => {
          getCity(data.features[0].properties.city);
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
