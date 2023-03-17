import { connectToLocalStorage } from "../connectToLocalStorage.js";

describe("Check setToLocalStorage function: ", () => {
  test("Check is dataBase exist ", () => {
    const dataBase = '{"dataBase": ["Moscow", "Paris", "Tokyo"]}';
    const newDataBase = ["Moscow", "Paris", "Tokyo"];
    if (dataBase) {
      const dataBaseJson = JSON.parse(dataBase);
      if (dataBaseJson.dataBase.length > 0) {
        expect(newDataBase).toEqual(dataBaseJson.dataBase);
      }
    }
  });
  test("Check for adding one more city", () => {
    const dataBase = ["Moscow", "Paris"];
    if (dataBase.length <= 2) {
      dataBase.push("Sochi");
      expect(dataBase).toEqual(["Moscow", "Paris", "Sochi"]);
      expect(dataBase.length).toBe(3);
    }
  });
  test("Replace city ", () => {
    const dataBase = ["Moscow", "Paris", "Sochi"];
    dataBase.shift();
    dataBase.push("Tokyo");
    expect(dataBase).toEqual(["Paris", "Sochi", "Tokyo"]);
    expect(dataBase.length).toBe(3);
  });
});

describe("Check connectToLocalStorage: ", () => {
  test("Check if connect is OK: ", () => {
    const dataBase = { dataBase: ["Moscow", "Paris", "Tokyo"] };
    Storage.prototype.getItem = jest.fn(
      () => '{"dataBase": ["Moscow", "Paris", "Tokyo"]}'
    );
    expect(connectToLocalStorage()).toEqual(dataBase);
  });

  test("Check if connect is NOT OK: ", () => {
    const dataBase = { dataBase: ["Moscow", "Paris"] };
    Storage.prototype.getItem = jest.fn(
      () => '{"dataBase": ["Moscow", "Paris", "Tokyo"]}'
    );
    expect(connectToLocalStorage()).not.toEqual(dataBase);
  });
});

// describe('createCitiesList function: ', () => {
//     test('fsgfg', () => {
//         let citiesList = document.createElement('div');
//         createCitiesList('Tokyo');
//         expect(citiesList.innerHTML).toEqual('Tokyo');
//     })
// })
