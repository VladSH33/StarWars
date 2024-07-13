window.addEventListener('DOMContentLoaded', () => {
    

// Класс страницы

    // class Page {
    //     constructor(){

    //     }
    // }

// Класс карточки
    class Card {
        constructor(card, parentSelector) {
            this.card = card;
            this.parent = document.querySelector(parentSelector);
        }
//создание карточки
        render() {
            // создаю элементы
            const cardContainer = document.createElement('div');
            const specificationsCard = document.createElement('div');
            const titleCard = document.createElement('div');
            //Присваиваю классы
            cardContainer.classList.add('card');
            specificationsCard.classList.add('card__specifications');
            titleCard.classList.add('card__title')
                //Преобразую массив с обьектами в Массив с подмассивами, и получаю подмассив с name
                const specifications = Object.entries(this.card)
                const specificationsTitle = specifications.find(title => title[0] == 'name')
                const getTitle = specificationsTitle ? specificationsTitle[1] : undefined;
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
            titleCard.append(getTitle)
            cardContainer.append(titleCard)
            cardContainer.append(specificationsCard)
            this.parent.append(cardContainer)
        }
    }


// Получаю данные через fetch
    const getResource = async (url) => {
        const res = await fetch(url);
        
        if (!res.ok) {
            throw new Error(`Какая-то херня с фетчом ${url}, status: ${res.status}`); // получаем ошибку
        }

        return res.json(); // JSON в обычный формат JS перевожу
    }

// пришлось колхозить с глобальными переменными так как используются в нескольких функциях
    let cardsContainer;
    let cardList;
    let slideWidth;
    let slideIndex = 0;

//Передаю данные в класс
    getResource('https://swapi.dev/api/people/')
    // getResource('https://swapi.dev/api/planets/')
        .then(data => {
            this.cards = data.results.map((card) => {
                const instance = new Card(card, '.cards');
                instance.render();
                return instance;
            });

// Далее работа со слайдером.

            cardsContainer = document.querySelector('.cards');
            cardList = document.querySelectorAll('.card'); // Теперь, когда карточки добавлены, можно получить их коллекцию

            const stylesCardsContainer = window.getComputedStyle(cardsContainer)
            
            const numGap = parseInt(stylesCardsContainer.gap.slice(0, -2))

            slideWidth = cardList[0].clientWidth + numGap // считаю растояние на которое будет перемещение слайдера

            updateSlider(); // Пример вызова функции для обновления слайдера после загрузки данных
        })
        .catch(error => {
            console.error(error);
        });

    function updateSlider() {
        const translateValue = -slideIndex * slideWidth 
        cardsContainer.style.transform = `translateX(${translateValue}px)`; // прокрутка слайдера
    }

    function moveSlide(direction) {
        const numSlides = cardList.length - 3; 
        slideIndex = (slideIndex + direction + numSlides) % numSlides;
        updateSlider();
    }

    window.moveSlide = moveSlide; // Делаем функцию доступной глобально
});