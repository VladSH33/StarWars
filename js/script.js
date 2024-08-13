window.addEventListener('DOMContentLoaded', () => {

const config = {
    people: ['https://swapi.dev/api/people/1', 'https://swapi.dev/api/people/2', 'https://swapi.dev/api/people/3', 'https://swapi.dev/api/people/4', 'https://swapi.dev/api/people/5', 'https://swapi.dev/api/people/6', 'https://swapi.dev/api/people/7', 'https://swapi.dev/api/people/8', 'https://swapi.dev/api/people/9', 'https://swapi.dev/api/people/10']
}
const cache = new Map();

async function getResource(url, deep = true) {

        let responseJson = {};

        if (cache.has(url)) {
            return cache.get(url)
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Какая-то херня с фетчом ${url}, status: ${response.status}`);
            }

            responseJson = await response.json();

        } catch (error) {
            console.error('Fetch error:', error);
        }

        if (deep === false) {
            // console.log(responseJson.name || responseJson.title)
            // return responseJson.name || responseJson.title;
            return responseJson
        }
        
        const isSwapiUrl = value => value.startsWith('https://swapi.dev/api/')

        for (const key in responseJson) {
            const value = responseJson[key];
            if (typeof value === 'string' && isSwapiUrl(value)) {
                responseJson[key] = await getResource(value, false)
            } else if (Array.isArray(value) && value.every(item => typeof item === 'string' && isSwapiUrl(item))){
                array = value.map(item => getResource(item, false))
                responseJson[key] = await Promise.all(array);
            }
        }
        cache.set(url, responseJson)
        return responseJson
};

class Page {
    constructor (activeTab, config) {
        this.activeTab = activeTab;
        this.config = config;
        this.cards = [];
        this.cardsContainer = document.querySelector('.cards');
        this.createCards();
    }

    createCards() {
        this.config[this.activeTab].forEach(async (url) => {
            const data = await getResource(url);
            const card = new Card(data, this.cardsContainer);
            this.cards.push(card);
        })
    }

    removeCards() {
        this.cards.forEach(card => {
            card.removeCard()
        });
    }
}   

class Card {
    constructor (card, parentElement) {
        this.card = card;
        this.parent = parentElement;
        this.containerCard = null;
        this.render();
    }



    render() {
        this.containerCard = document.createElement('div');
        const titleCard = document.createElement('div');
        const specificationsCard = document.createElement('div');
        const elementArrContainerCard = document.createElement('div');

        this.containerCard.classList.add('card');
        titleCard.classList.add('card__title');
        specificationsCard.classList.add('card__specifications');
        elementArrContainerCard.classList.add('elementArr__container');

        const title = this.card['name'];

        delete this.card['name'];
        delete this.card['url'];
        delete this.card['created'];
        delete this.card['edited'];

        const specifications = Object.entries(this.card)
        // console.log(specifications)
        specifications.forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                elementArrContainerCard.innerHTML += `<button class="elemetArr__title">${value.name}</button>`

                // const elements = document.querySelectorAll('.elemetArr__title')
                // // console.log(elements)
                // elements.forEach(element => {
                //     element.addEventListener('click', () => {
                //         console.log('hi')
                //     })
                // })

                // elementArrContainerCard.addEventListener('click', (event) => {
                //     if(event.target.classList.contains('elemetArr__title')) {
                //         console.log(value.url)
                //     }
                // })
        

            } else if (Array.isArray(value) && value.length !== 0) {
                
                value.forEach(element => {
                    // console.log(element)
                    elementArrContainerCard.innerHTML += `<button class="elemetArr__title">${element.title || element.name}</button>`
                    elementArrContainerCard.addEventListener('click', (event) => {
                        if(event.target.classList.contains('elemetArr__title')) {
                            const objectPeople = {
                                people: element.characters,
                            };
                            console.log(element.title)
                            new Page('people', objectPeople).removeCards()
                            event.stopPropagation();
                        }
                    })

                })
            } else if (typeof(value) === 'string'){
                specificationsCard.innerHTML += `<div class="${key}">${key}: ${value}</div>`
            }
        })

        const tagsButton = document.createElement('div');
        tagsButton.classList.add('card__tags');
        tagsButton.textContent = 'open tags'

        tagsButton.addEventListener('click', () => {
            elementArrContainerCard.classList.toggle('open');
        })

        specificationsCard.append(elementArrContainerCard)
        titleCard.append(title)
        this.containerCard.append(titleCard)
        this.containerCard.append(specificationsCard)
        this.containerCard.append(tagsButton)
        this.parent.append(this.containerCard);
    }

    removeCard() {
        if (this.containerCard) {
            this.containerCard.remove()
        }
    }

}

new Page('people', config)


// пришлось колхозить с глобальными переменными так как используются в нескольких функциях
// let cardsContainer;
// let cardList;
// let slideWidth;
// let slideIndex = 0;


// Далее работа со слайдером

    //         cardsContainer = document.querySelector('.cards');
    //         cardList = document.querySelectorAll('.card'); // Теперь, когда карточки добавлены, можно получить их коллекцию

    //         const stylesCardsContainer = window.getComputedStyle(cardsContainer)
            
    //         const numGap = parseInt(stylesCardsContainer.gap.slice(0, -2))

    //         slideWidth = cardList[0].clientWidth + numGap // считаю растояние на которое будет перемещение слайдера

    //         updateSlider(); // Пример вызова функции для обновления слайдера после загрузки данных
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });

    // function updateSlider() {
    //     const translateValue = -slideIndex * slideWidth 
    //     cardsContainer.style.transform = `translateX(${translateValue}px)`; // прокрутка слайдера
    // }

    // function moveSlide(direction) {
    //     const numSlides = cardList.length - 3; 
    //     slideIndex = (slideIndex + direction + numSlides) % numSlides;
    //     updateSlider();
    // }

    // window.moveSlide = moveSlide; // Делаем функцию доступной глобально


});