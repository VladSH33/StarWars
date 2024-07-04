window.addEventListener('DOMContentLoaded', () => {
    
    class MenuCard {
        constructor(name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, parentSelector) {
            this.name = name;
            this.height = height;
            this.mass = mass;
            this.hair_color = hair_color;
            this.skin_color = skin_color;
            this.eye_color = eye_color;
            this.birth_year = birth_year;
            this.gender = gender;
            this.parent = document.querySelector(parentSelector);
        }

        render() {
            const element = document.createElement('div');
            element.classList.add('card');

            element.innerHTML = `
                    <h3 class="card__title">${this.name}</h3>
                    <div class="card__body">
                        <div class="card__height">height: ${this.height}</div>
                        <div class="card__mass">hair_color: ${this.mass}</div>
                        <div class="card__hair-color">skin_color: ${this.hair_color}</div>
                        <div class="card__skin-color">eye_color: ${this.skin_color}</div>
                        <div class="card__eye-color">birth_year: ${this.eye_color}</div>
                        <div class="card__birth-year">gender: ${this.birth_year}</div>
                        <div class="card__gender">homeworld: ${this.gender}</div>
                    </div>
            `;
            this.parent.append(element);
        }
    }

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

    getResource('https://swapi.dev/api/people/')
        .then(data => {
            data.results.forEach(({name, height, mass, hair_color, skin_color, eye_color, birth_year, gender}) => {
                new MenuCard(name, height, mass, hair_color, skin_color, eye_color, birth_year, gender, '.cards').render();
            });

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

class createPage {
    constructor() {
        
    }

    render() {
        
    }
}