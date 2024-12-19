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

        const filteredDishes = arr.filter(dish =>
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
    orderElement.innerHTML = '';

    let totalPrice = 0;
    let orderDetails = '';

    Object.keys(order).forEach(category => {
        const dish = order[category];
        const categoryElement = document.createElement("div");
        categoryElement.classList.add("category-item");

        if (dish) {
            categoryElement.innerHTML = `
                <p><strong>${getCategoryName(category)}:</strong> ${dish.name} - ${dish.price}₽</p>
            `;
            totalPrice += dish.price;
            orderDetails += `${getCategoryName(category)}: ${dish.name} - ${dish.price}₽\n`;
        } else {
            categoryElement.innerHTML = `
                <p><strong>${getCategoryName(category)}:</strong> Ничего не выбрано</p>
            `;
            orderDetails += `${getCategoryName(category)}: Ничего не выбрано\n`;
        }

        orderElement.appendChild(categoryElement);
    });

    const totalElement = document.createElement("div");
    totalElement.classList.add("total-price");
    totalElement.innerHTML = `<p><strong>Итого: ${totalPrice}₽</strong></p>`;
    orderElement.appendChild(totalElement);

    updateForm(orderDetails, totalPrice);
}

function updateForm(orderDetails, totalPrice) {
    const orderTextField = document.getElementById("orderDetails");
    const totalPriceField = document.getElementById("totalPrice");

    orderTextField.value = orderDetails;
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

document.addEventListener("DOMContentLoaded", () => {
    renderDishes(dishes);

    document.querySelectorAll('.filters').forEach(filterGroup => {
        filterGroup.addEventListener('click', handleFilterClick);
    });
});
