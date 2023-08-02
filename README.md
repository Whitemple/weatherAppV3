![Static Badge](https://img.shields.io/badge/JavaScript-orange)
![Static Badge](https://img.shields.io/badge/webpack-blue)
![Static Badge](https://img.shields.io/badge/jestCoverage-55%25-gray?style=plactic&labelColor=gray&color=red)
![Static Badge](https://img.shields.io/badge/YandexAPI-white)

# Приложение "Прогноз погоды"

WEB-приложение написано на vanillaJS без использования фреймворков. На стартовой странице есть форма ввода названия города (можно вводить как на английской расскладке, так и на русской).
В проекте использовался:

<ul>
    <li>Webpack</li>
    <li>JEST</li>
    <li>Husky и линтеры</li>
</ul>

Для работы с внешним API и динамической подгрузки карты выбранного города выбрал [API Яндекс Карт](https://yandex.ru/dev/jsapi-v2-1/doc/ru/).

---

Для хранилища истории ранее запрашиваемых городов используется LocalStorage. В коде настроено сохраренение последних 10 найденных городов и вывод их в бокове меню. При повторном запросе города, который уже есть в списке, запись не производится. На город можно кликнуть и приложение подгрузит данные с [API Яндекс Карт](https://yandex.ru/dev/jsapi-v2-1/doc/ru/).
