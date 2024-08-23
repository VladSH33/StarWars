window.addEventListener('DOMContentLoaded', () => {

    const contentCategories = ['people', 'planets', 'starships', 'films', 'species', 'vehicles'];

    const initialConfig = {
        people: ['https://swapi.dev/api/people/1', 'https://swapi.dev/api/people/2', 'https://swapi.dev/api/people/3', 'https://swapi.dev/api/people/4', 'https://swapi.dev/api/people/5', 'https://swapi.dev/api/people/6', 'https://swapi.dev/api/people/7', 'https://swapi.dev/api/people/8', 'https://swapi.dev/api/people/9', 'https://swapi.dev/api/people/10'], 

        planets: ['https://swapi.dev/api/planets/1', 'https://swapi.dev/api/planets/2', 'https://swapi.dev/api/planets/3', 'https://swapi.dev/api/planets/4', 'https://swapi.dev/api/planets/5', 'https://swapi.dev/api/planets/6', 'https://swapi.dev/api/planets/7', 'https://swapi.dev/api/planets/8', 'https://swapi.dev/api/planets/9', 'https://swapi.dev/api/planets/10'],

        starships: ['https://swapi.dev/api/starships/1', 'https://swapi.dev/api/starships/3', 'https://swapi.dev/api/starships/5', 'https://swapi.dev/api/starships/9', 'https://swapi.dev/api/starships/10', 'https://swapi.dev/api/starships/11', 'https://swapi.dev/api/starships/12', 'https://swapi.dev/api/starships/13', 'https://swapi.dev/api/starships/15', 'https://swapi.dev/api/starships/17'],
        
        films: ['https://swapi.dev/api/films/1', 'https://swapi.dev/api/films/2', 'https://swapi.dev/api/films/3', 'https://swapi.dev/api/films/4', 'https://swapi.dev/api/films/5', 'https://swapi.dev/api/films/6'],

        species: ['https://swapi.dev/api/species/1', 'https://swapi.dev/api/species/2', 'https://swapi.dev/api/species/3', 'https://swapi.dev/api/species/4', 'https://swapi.dev/api/species/5', 'https://swapi.dev/api/species/6', 'https://swapi.dev/api/species/7', 'https://swapi.dev/api/species/8', 'https://swapi.dev/api/species/9', 'https://swapi.dev/api/species/10'],

        vehicles: ['https://swapi.dev/api/vehicles/4', 'https://swapi.dev/api/vehicles/6', 'https://swapi.dev/api/vehicles/7', 'https://swapi.dev/api/vehicles/8', 'https://swapi.dev/api/vehicles/14', 'https://swapi.dev/api/vehicles/16', 'https://swapi.dev/api/vehicles/18', 'https://swapi.dev/api/vehicles/19', 'https://swapi.dev/api/vehicles/20', 'https://swapi.dev/api/vehicles/24'],
    };

    const typesFields = {
            people: ['people', 'pilots', 'characters', 'residents'],
            planets: ['planets'],
            starships: ['starships'],
            films: ['films'],
            species: ['species'],
            vehicles: ['vehicles'],
        };

// Переименовать tags на tagGroups везде!!!

    const usefullFields = {
        people: {
            specifications: [
                'name',
                'height',
                'mass',
                'hair_color',
                'skin_color',
                'eye_color',
                'birth_year',
                'gender',
            ],
            tagGroups: [
                'homeworld', 
                'films', 
                'species',
                'starships',
                'vehicles',
                'starships'
            ]
        },

        planets: {
            specifications: [
                'name',
                'rotation_period',
                'orbital_period',
                'diameter',
                'climate',
                'gravity',
                'surface_water',
                'population',
            ],

            tagGroups: [
                'residents', 
                'films', 
            ]
        },

        starships: {
            specifications: [
                'name',
                'model',
                'manufacturer',
                'cost_in_credits',
                'length',
                'max_atmosphering_speed',
                'crew',
                'passengers',
                'cargo_capacity',
                'consumables',
                'hyperdrive_rating',
                'MGLT',
                'starship_class',
            ],

            tagGroups: [
                'pilots',
                'films',
            ]
        },

        films: {
            specifications: [
                'title',
                'episode_id',
                'opening_crawl',
                'director',
                'producer',
                'release_date',
            ],
            tagGroups: [
                'characters',
                'planets',
                'starships',
                'vehicles',
                'species',
            ]
        },
        vehicles: {
            specifications: [
                'name',
                'model',
                'manufacturer',
                'cost_in_credits',
                'length',
                'max_atmosphering_speed',
                'crew',
                'passengers',
                'cargo_capacity',
                'consumables',
                'vehicle_class',
            ],

            tagGroups: [
                'pilots',
                'films',
            ]
        },
        species: {
            specifications: [
                'name',
                'model',
                'manufacturer',
                'cost_in_credits',
                'length',
                'max_atmosphering_speed',
                'crew',
                'passengers',
                'cargo_capacity',
                'consumables',
                'vehicle_class',
            ],

            tagGroups: [
                'pilots',
                'films',
            ]
        }

    };

    const cache = new Map();

    const normalizeData = (url, json) => {
        
        const currentType = contentCategories.find(type => url.includes(type));
        // console.log(url, currentType, usefullFields)
        const { specifications, tagGroups } = usefullFields[currentType];
        
        const resultJson = {
            specifications: [],
            tagGroups: []
        };
        
        specifications.forEach(specField => {
            resultJson.specifications.push({
                name: specField,
                value: json[specField]
            });
        });


        tagGroups.forEach(tagField => {
            if (tagField == 'homeworld') {
                resultJson.tagGroups.push({
                    name: tagField,
                    value: [json[tagField]] // obj in array
                });
            } else if (tagField !== 'homeworld') {
                // console.log(json[tagField])
                // console.log(tagField)
                resultJson.tagGroups.push({
                    name: tagField,
                    value: json[tagField] // Array
                });
            }
        });

        return resultJson;
    }

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
            responseJson = normalizeData(url, responseJson);
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

        responseJson = normalizeData(url, responseJson);

        cache.set(url, responseJson);

        return responseJson;
    };
 
    class Page {
        constructor (activeTab, config) {
            this.activeTab = activeTab;
            this.config = config;
            this.cards = [];
            this.datasets = [];
            this.cardsContainer = document.querySelector('.swiper-wrapper');

            this.createCards(this.config[this.activeTab]);
        }

        async createCards(urls) {
            for (const url of urls) {
                const dataset = await getResource(url);
                this.datasets.push(dataset)
            }

            this.datasets.forEach((dataset) => {
                this.cards.push(
                    new Card(dataset, this.cardsContainer, {
                        updateData: (data) => {
                            const tagData = data.tagGroups.find(tagGroup => typesFields[this.activeTab].includes(tagGroup.name))
                            if (tagData) {
                                this.removeCards();
                                this.createCards(tagData.value);
                            }
                        }
                    })    
                )
            })
        }

        renderTabs() {
            // ...
        }


        setTab(newTab) {
            this.activeTab = newTab;

            this.removeCards();
            this.createCards(this.config[this.activeTab]);
        }


        removeCards() {
            this.cards.forEach(card => card.removeCard());
        }
    }

    class Card {
        constructor (card, parentElement, actions) {
            this.card = card;
            this.parent = parentElement;
            this.containerCard = null;
            this.actions = actions;
            this.render();
        }
        
        render() {
            this.containerCard = document.createElement('div');
            const titleCard = document.createElement('div');
            const specificationsCard = document.createElement('div');
            const elementArrContainerCard = document.createElement('div');

            this.containerCard.classList.add('swiper-slide');
            titleCard.classList.add('card__title');
            specificationsCard.classList.add('card__specifications');
            elementArrContainerCard.classList.add('elementArr__container');

            this.card.specifications.forEach(({ name, value }) => {
                specificationsCard.innerHTML += `<div class="elemetArr__title">${ name }: ${ value }</div>`;
            });

            this.card.tagGroups.forEach(({ name, value }) => {

                const containerTag = document.createElement('div');
                containerTag.classList.add(`container__tags`);
                containerTag.innerHTML = name;
                elementArrContainerCard.append(containerTag);

                value.forEach(tag => {
                    const tagEl = document.createElement('div');
                    tagEl.classList.add('tag');
                    tagEl.innerHTML = tag.specifications[0].value;
                    containerTag.append(tagEl);

                    containerTag.addEventListener('click', () => {
                        tagEl.classList.toggle('open');
                    });

                    tagEl.addEventListener('click', () => this.actions.updateData(tag));
                })

                containerTag.addEventListener('click', () => {
                    containerTag.classList.toggle('color-gray');

                });

            });

            const tagsButton = document.createElement('div');
            tagsButton.classList.add('card__tags');
            tagsButton.textContent = 'open tags';

            tagsButton.addEventListener('click', () => {
                elementArrContainerCard.classList.toggle('open');
                if (elementArrContainerCard.classList.contains('open')) {
                    tagsButton.textContent = 'close tags';
                } else {
                    tagsButton.textContent = 'open tags';
                }
            });

            specificationsCard.append(elementArrContainerCard)
            // titleCard.append(title)
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

    new Page('people', initialConfig)

    const swiper = new Swiper('.swiper', {slidesPerView: 3, spaceBetween: 30, 
        navigation: {
            nextEl: '.btn-next',
            prevEl: '.btn-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
});