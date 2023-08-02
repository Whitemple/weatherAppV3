import { buildMarkUpCard } from "../buildMarkUpCard.js";

describe("Test buildMarkUpCard function: ", () => {
  const arr = {
    name: "Moscow",
    main: {
      temp: 21,
    },
    weather: [
      {
        icon: 320,
      },
    ],
  };
  beforeEach(() => {
    buildMarkUpCard(arr);
  });
  test("buildMarkUpCard contains basic markup: ", () => {
    const markup = `
      <div class="main__card-info">
        <h3 class="main__card-city">Moscow</h3>
        <p class="main__card-temp">Температура: 21</p>
        <img class="main__card-img" src="http://openweathermap.org/img/w/320.png" alt="weather-icon" />
      </div>
    `;
    expect(buildMarkUpCard(arr)).toBe(markup);
  });
  test("buildMarkUpCard contains has a mistake basic markup: ", () => {
    const markup = `
      <div class="main__card-info">
        <h3 class="main__card-city">Sochi</h3>
        <p class="main__card-temp">Температура: 22</p>
        <img class="main__card-img" src="http://openweathermap.org/img/w/322.png" alt="weather-icon" />
      </div>
    `;
    expect(buildMarkUpCard(arr)).not.toBe(markup);
  });
});
