window.addEventListener('DOMContentLoaded', () => {
    

// Класс страницы

    class Page {

        constructor (API, bodyContainer) {
            this.API = API;
            this.bodyContainer = bodyContainer;
        }

        static Card = class  {

            constructor (card, parentSelector) {
                this.card = card;
                this.parent = document.querySelector(parentSelector);
            }

            //создание карточки

            removeCards() {
                console.log(this.card)
            }

            render() {

                // создаю элементы

                const cardContainer = document.createElement('div');
                const specificationsCard = document.createElement('div');
                const titleCard = document.createElement('div');
                const homeworldBtn = document.createElement('button');

                //Присваиваю классы

                cardContainer.classList.add('card');
                specificationsCard.classList.add('card__specifications');
                titleCard.classList.add('card__title');
                homeworldBtn.classList.add('homeworld');

                homeworldBtn.textContent = 'homeworld';

                //Преобразую массив с обьектами в Массив с подмассивами, и получаю подмассив с name

                const specifications = Object.entries(this.card)
                const specificationsTitle = specifications.find(title => title[0] == 'name')
                const foundTitle = specificationsTitle ? specificationsTitle[1] : undefined;

                //обрезаю лишине данные

                const specificationsSlice = specifications.slice(1, 8);

                specificationsSlice.forEach(([key, value]) => {
                    //заменяю _ в названии характеристик на пробел
                    const specificationName = key.replace('_',' ');
                    //формирую элементы с классами, названием характеристики и значением
                    specificationsCard.innerHTML += 
                    `
                        <div class="${key}">${specificationName}: ${value}</div>
                    `
                })

                //Передаю переменные в элементы на странице

                specificationsCard.append(homeworldBtn)
                titleCard.append(foundTitle)
                cardContainer.append(titleCard)
                cardContainer.append(specificationsCard)
                this.parent.append(cardContainer)


                // homeworldBtn.addEventListener('click', () => {
                //     removeCards()
                //     getResource('https://swapi.dev/api/planets/')
                // })

            }
        }
    }


// Получаю данные через fetch
    // const getResource = async (url) => {
    //     const res = await fetch(url);
        
    //     if (!res.ok) {
    //         throw new Error(`Какая-то херня с фетчом ${url}, status: ${res.status}`); // получаем ошибку
    //     }

    //     return res.json(); // JSON в обычный формат JS перевожу
    // }

    // console.log(getResource('https://swapi.dev/api/people/'))

//Передаю данные в класс

    // getResource('https://swapi.dev/api/people/')
    // // getResource('https://swapi.dev/api/planets/')
    //     .then(data => {
    //         this.cards = data.results.map((card) => {

    //             const instanceCards = new Page.Card(card, '.cards');
    //             instanceCards.render();
    //             return instanceCards;
    //         });
    //     });

    const cache = new Map();

    async function getResource(url) {
        if (cache.has(url)) {
            return cache.get(url)
        } 

        async function fetchData(url) {
            try {
                // Ожидаем завершения запроса fetch
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Какая-то херня с фетчом ${url}, status: ${res.status}`);
                }
                // Ожидаем получения данных в формате JSON
                const responseJson = await response.json();
                return responseJson?.results ?? responseJson;
                // return responseJson.results
            } catch (error) {
                console.error('Fetch error:', error);
            }
        }
        
        // Используем асинхронную функцию
        const JSON = await fetchData(url)
        // console.log(JSON)
        
        function isSwapiUrl(value) {
            const prefix = 'https://swapi.dev/api/';
            return value.startsWith(prefix);
        }
        
        async function filterObjectWithSwapiUrls(obj) {
            for (const key in obj) {
                const value = obj[key];

                if (typeof value === 'string' && isSwapiUrl(value)) {
                    obj[key] = await fetchData(value)
                    console.log(obj[key])
                } else if (Array.isArray(value) && value.every(item => typeof item === 'string' && isSwapiUrl(item))){
                    console.log(obj[key])

                    value.forEach(async (urlItem) => {
                        obj[key] = await fetchData(urlItem)
                        // console.log(obj[key])
                    })
                }
            }
        
            return obj;
        }
        
        const filteredObject = await filterObjectWithSwapiUrls(JSON);
        // console.log(filteredObject);


        return cache.set(url, JSON)


    };

getResource('https://swapi.dev/api/people/1')


// setTimeout(() => {
//     console.log(cache.has('https://swapi.dev/api/people/1'))
//     console.log(cache.get('https://swapi.dev/api/people/1'))
// }, 1000);

// пришлось колхозить с глобальными переменными так как используются в нескольких функциях
let cardsContainer;
let cardList;
let slideWidth;
let slideIndex = 0;










// Далее работа со слайдером

//             cardsContainer = document.querySelector('.cards');
//             cardList = document.querySelectorAll('.card'); // Теперь, когда карточки добавлены, можно получить их коллекцию

//             const stylesCardsContainer = window.getComputedStyle(cardsContainer)
            
//             const numGap = parseInt(stylesCardsContainer.gap.slice(0, -2))

//             slideWidth = cardList[0].clientWidth + numGap // считаю растояние на которое будет перемещение слайдера

//             updateSlider(); // Пример вызова функции для обновления слайдера после загрузки данных
//         // })
//         // .catch(error => {
//         //     console.error(error);
//         // });

//     function updateSlider() {
//         const translateValue = -slideIndex * slideWidth 
//         cardsContainer.style.transform = `translateX(${translateValue}px)`; // прокрутка слайдера
//     }

//     function moveSlide(direction) {
//         const numSlides = cardList.length - 3; 
//         slideIndex = (slideIndex + direction + numSlides) % numSlides;
//         updateSlider();
//     }

//     window.moveSlide = moveSlide; // Делаем функцию доступной глобально


});