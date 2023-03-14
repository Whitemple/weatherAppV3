// Функция-конструктуор карточки погоды

export function buildMarkUpCard(getData) {
  return `
      <div class="main__card-info">
        <h3 class="main__card-city">${getData.name}</h3>
        <p class="main__card-temp">Температура: ${Math.round(
          getData.main.temp
        )}</p>
        <img class="main__card-img" src="http://openweathermap.org/img/w/${
          getData.weather[0].icon
        }.png" alt="weather-icon" />
      </div>
    `;
}
