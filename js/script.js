window.addEventListener('DOMContentLoaded', () => {
    

// Класс страницы
    class createPage {
        constructor(card, parentSelector) {
            this.card = card;
            this.parent = document.querySelector(parentSelector);
        }

        

        render() {
            console.log(this.card)
            const element = document.createElement('div');
            element.classList.add('card');

            for(let key in this.card) {
                element.innerHTML = `
                     <div class="${key}">${this.card[key]}</div>
                `
            }

            this.parent.append(element)
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

    // console.log(getResource('https://swapi.dev/api/people/'))
    // пришлось колхозить с глобальными переменными так как используются в нескольких функциях
    let cardsContainer;
    let cardList;
    let slideWidth;
    let slideIndex = 0;
//Передаю данные в класс
    getResource('https://swapi.dev/api/people/')
        .then(data => {
            data.results.forEach((card) => {
                // console.log(card)
                new createPage(card, '.cards').render();
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
        slideIndex += direction; // +1 или -1 получаю при клике на кнопку
        if (slideIndex < 0) {
            slideIndex = cardList.length - 3; // Последние 3 слайда
        } else if (slideIndex > cardList.length - 3) {
            slideIndex = 0; // Первые 3 слайда
        }
        updateSlider();
    }

    window.moveSlide = moveSlide; // Делаем функцию доступной глобально
});