/* eslint no-undef: "error" */
/* eslint-env browser */

// Функция получения карты по геоданным по АПИ

export function getMap(lat, lon) {
  const divMap = document.querySelector("#map");
  divMap.innerHTML = "";
  ymaps.ready(() => {
    const map = new ymaps.Map("map", {
      center: [lat, lon],
      zoom: 10,
    });
    return map;

    // if (map) {
    //   ymaps.modules.require(
    //     ["Placemark", "Circle"],
    //     (Placemark, Circle) => {
    //       const placemark = new Placemark([55.37, 35.45]);
    //     }
    //   );
    // }
  });
}
