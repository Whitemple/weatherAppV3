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
  });
}
