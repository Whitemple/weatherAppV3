import { getCity } from "../getCity.js";
import { buildMarkUpCard } from "../buildMarkUpCard.js";

describe("Testing getCity function: ", () => {
  const markup = `
      <div class="main__card-info">
        <h3 class="main__card-city">Moscow</h3>
        <p class="main__card-temp">Температура: 21</p>
        <img class="main__card-img" src="http://openweathermap.org/img/w/320.png" alt="weather-icon">
      </div>
    `;
  const errorMy = `
    Город 'Moscow' не найден.
    Попробуйте ввести другое название
`;
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
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(arr),
    })
  );
  const contentCard = document.createElement("div");
  const mainCard = document.createElement("div");
  mainCard.append(contentCard);
  test("Expect recieve a valid response: ", async () => {
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?&q=Moscow&appid=123&lang=ru&units=metric"
    );
    const result = await res.json();
    contentCard.innerHTML = buildMarkUpCard(result);
    expect(contentCard.innerHTML).toBe(markup);
  });
  test("the fetch fails with an error", async () => {
    expect.assertions(1);
    return getCity().catch(() => expect(errorMy).toMatch(errorMy));
  });
});
