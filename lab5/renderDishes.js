import { dishes } from './array.js';

let order = {
    soup: null,
    main: null,
    drink: null,
    saladorstarter: null,
    dessert: null,
};

function renderDishes(arr, filter = {}) {
    const sections = {
        soup: document.getElementById("soup"),
        main: document.getElementById("main"),
        drink: document.getElementById("drink"),
        saladorstarter: document.getElementById("saladorstarter"),
        dessert: document.getElementById("dessert"),
    };

    Object.keys(sections).forEach(category => {
        sections[category].innerHTML = '';

        const sortedArr = arr.sort((a, b) => a.name.localeCompare(b.name))
        const filteredDishes = sortedArr.filter(dish =>
            dish.category === category &&
            (!filter[category] || dish.kind === filter[category])
        );

        filteredDishes.forEach((dish) => {
            const item = document.createElement("div");
            item.classList.add("item");
            item.setAttribute("data-dish", dish.keyword);

            item.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <p class="lprice">${dish.price}₽</p>
                <p class="lnazv">${dish.name}</p>
                <p class="lamount">${dish.count}</p>
                <button>Добавить</button>
            `;

            const button = item.querySelector('button');
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                addToOrder(dish);
            });

            item.addEventListener('click', () => addToOrder(dish));
            sections[category].appendChild(item);
        });
    });
}

function addToOrder(dish) {
    const category = dish.category;
    order[category] = dish;
    updateOrder();
}

function updateOrder() {
    const orderElement = document.getElementById("zakaz");
    orderElement.innerHTML='';

    let totalPrice = 0;
    let orderSoup, orderMain, orderDrink, orderSalad, orderDessert;

    Object.keys(order).forEach(category => {
        const dish = order[category];
        //const categoryElement = document.createElement("div");
        const categoryElement = document.createElement("div");

        categoryElement.classList.add("category-item")

        if (dish) {
            categoryElement.innerHTML = `
                <p><strong>${getCategoryName(category)}:</strong> ${dish.name} - ${dish.price}₽</p>
            `;
            totalPrice += dish.price;
            switch(category) {
                case 'soup':
                    orderSoup=dish.keyword;
                    break;
                case 'main':
                    orderMain=dish.keyword;
                    break;
                case 'drink':
                    orderDrink=dish.keyword;
                    break;
                case 'saladorstarter':
                    orderSalad=dish.keyword;
                    break;
                case 'dessert':
                    orderDessert=dish.keyword;
                    break;
                default:
                    break;
            }
            orderElement.appendChild(categoryElement);
            //orderDetails += `${category === 'soup' ? 'Суп' : category === 'main' ? 'Основное блюдо' : 'Напиток'}: ${dish.name} - ${dish.price}₽\n`;
        } else {
            categoryElement.innerHTML = `
                <p><strong>${getCategoryName(category)}:</strong> Ничего не выбрано</p>
            `;
            switch(category) {
                case 'soup':
                    orderSoup=null;
                case 'main':
                    orderMain=null;
                    break;
                case 'drink':
                    orderDrink=null;
                    break;
                case 'saladorstarter':
                    orderSalad=null;
                case 'dessert':
                    orderDessert=null;
                default:
                    break;
            }
        }

        orderElement.appendChild(categoryElement);
    });

    const totalElement = document.createElement("div");
    totalElement.classList.add("total-price");
    totalElement.innerHTML = `
        <p><strong>Итого: ${totalPrice}₽</strong></p>
    `;
    orderElement.appendChild(totalElement);

    updateForm(orderSoup, orderMain, orderDrink, orderSalad, orderDessert, totalPrice);
}

function updateForm(orderSoup, orderMain, orderDrink, orderSalad, orderDessert, totalPrice) {
    const orderSoupField = document.getElementById("zakazSoup");
    const orderMainField = document.getElementById("zakazMain");
    const orderDrinkField = document.getElementById("zakazDrink");
    const orderSaladField = document.getElementById("zakazSalad");
    const orderDessertField = document.getElementById("zakazDessert");
    const totalPriceField = document.getElementById("totalPrice");

    orderSoupField.value = orderSoup === "" ? null : orderSoup;
    orderMainField.value = orderMain === "" ? null : orderMain;
    orderDrinkField.value = orderDrink === "" ? null : orderDrink;
    orderSaladField.value = orderSalad === "" ? null : orderSalad;
    orderDessertField.value = orderDessert === "" ? null : orderDessert;
    totalPriceField.value = totalPrice;
}

function getCategoryName(category) {
    const names = {
        soup: 'Суп',
        main: 'Основное блюдо',
        drink: 'Напиток',
        saladorstarter: 'Салат или стартер',
        dessert: 'Десерт',
    };
    return names[category] || category;
}

let filters = {};

function handleFilterClick(event) {
    const button = event.target;
    if (!button.dataset.kind) return;

    const category = button.closest('.filters').id.replace('-filters', '');
    if (button.classList.contains('active')) {
        button.classList.remove('active');
        delete filters[category];
    } else {
        document.querySelectorAll(`#${category}-filters button`).forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        filters[category] = button.dataset.kind;
    }

    renderDishes(dishes, filters);
}

document.getElementById("formmm").addEventListener("submit", (e) => {
    e.preventDefault();

    const soup = document.getElementById("zakazSoup").value.trim();
    const main = document.getElementById("zakazMain").value.trim();
    const drink = document.getElementById("zakazDrink").value.trim();
    const saladorstarter = document.getElementById("zakazSalad").value.trim();
    const dessert = document.getElementById("zakazDessert").value.trim();

    if (!soup || !main || !drink || !saladorstarter || !dessert) {
        alert(`Пожалуйста, выберите ${soup==='' ? "Суп" : main==='' ? "Главное Блюдо" : drink === '' ? "Напиток" : saladorstarter==='' ? "Салат или Стартер" : dessert ==='' ? "Десерт" : ""}.`);
        return;
    }

    e.target.submit();
});

document.addEventListener("DOMContentLoaded", () => {
    renderDishes(dishes);

    document.querySelectorAll('.filters').forEach(filterGroup => {
        filterGroup.addEventListener('click', handleFilterClick);
    });
});
