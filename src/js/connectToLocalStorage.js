// Ниже переменная нужна для записи ранее посещенных города в массив и передачу в LocalStorage
let dataBase = [];
export const citiesList = document.querySelector(".main__cities-list");

// Ниже пишем функцию по добавлению в Local Storage данных
// Записываем значение в виде массива, куда передаем ранее введенные города
// При этом сначала проверяем наличие ключа в localStorage и если есть присваеиваем его переменной databse
// чтобы после перезагрузки страницы переменная не обнулялась

export async function setToLocalStorage(city) {
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

export const connectToLocalStorage = () => {
  const getFromDataBase = localStorage.getItem("dataBase");
  const dataBaseJson = JSON.parse(getFromDataBase);
  return dataBaseJson;
};

// Функция перерисовки страницы и вывода списка ранее посещенных городов

export function createCitiesList(resultOfConnection) {
  citiesList.innerHTML = "";
  if (resultOfConnection) {
    resultOfConnection.forEach((elem) => {
      const savedCities = document.createElement("li");
      savedCities.classList.add("main__savedCities");
      savedCities.innerText = elem;
      citiesList.append(savedCities);
    });
  }
}

// Пишем функцию по выводу информации из LocalStorage на страницу браузера (состоит из двух предыдущих)
// Т.к. эти функции не ассинхронные, то можем ииспользовать их в любом другом месте

export async function getFromLocalStorage() {
  await connectToLocalStorage();
  createCitiesList(connectToLocalStorage());
}
