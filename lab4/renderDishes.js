import { dishes } from './array.js';

let order = {
    soup: null,
    main: null,
    drink: null,
};

function renderDishes(arr) {
    const sections = {
        soup: document.getElementById("soup"),
        main: document.getElementById("main"),
        drink: document.getElementById("drink"),
    };

    arr.forEach((dish) => {
        const section = sections[dish.category];
        if (!section) return;

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
            addToOrder(dish, item);
        });

        item.addEventListener('click', () => addToOrder(dish, item));

        section.appendChild(item);
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
                <p><strong>${category === 'soup' ? 'Суп' : category === 'main' ? 'Основное блюдо' : 'Напиток'}:</strong> ${dish.name} - ${dish.price}₽</p>
            `;
            totalPrice += dish.price;
            orderDetails += `${category === 'soup' ? 'Суп' : category === 'main' ? 'Основное блюдо' : 'Напиток'}: ${dish.name} - ${dish.price}₽\n`;
        } else {
            categoryElement.innerHTML = `
                <p><strong>${category === 'soup' ? 'Суп' : category === 'main' ? 'Основное блюдо' : 'Напиток'}:</strong> Ничего не выбрано</p>
            `;
            orderDetails += `${category === 'soup' ? 'Суп' : category === 'main' ? 'Основное блюдо' : 'Напиток'}: Ничего не выбрано\n`;
        }

        orderElement.appendChild(categoryElement);
    });

    const totalElement = document.createElement("div");
    totalElement.classList.add("total-price");
    totalElement.innerHTML = `
        <p><strong>Итого: ${totalPrice}₽</strong></p>
    `;
    orderElement.appendChild(totalElement);

    updateForm(orderDetails, totalPrice);
}

function updateForm(orderDetails, totalPrice) {
    const orderTextField = document.getElementById("orderDetails");
    const totalPriceField = document.getElementById("totalPrice");

    orderTextField.value = orderDetails;
    totalPriceField.value = totalPrice;
}

document.addEventListener("DOMContentLoaded", () => renderDishes(dishes));
