import {
  setToLocalStorage,
  getFromLocalStorage,
} from "./connectToLocalStorage.js";
import { buildMarkUpCard } from "./buildMarkUpCard.js";
import { getMap } from "./getMap.js";

export const apiKey = "1289f3b71732cf788b8ea917a6299964";
export const contentCard = document.createElement("div");
contentCard.classList.add("main__card-block");
export const mainCard = document.querySelector(".main__card");

// Пишем ассинхронную функцию для отправки и полчения данных по API

export async function getCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?&q=${city}&appid=${apiKey}&lang=ru&units=metric`
    );
    const data = await response.json();
    contentCard.innerHTML = buildMarkUpCard(data);
    getMap(data.coord.lat, data.coord.lon);
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
