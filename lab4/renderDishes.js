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

    const sortedArr = arr.sort((a, b) => a.name.localeCompare(b.name));
    sortedArr.forEach((dish) => {
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

function getCategoryName(category) {
    const names = {
        soup: 'Суп',
        main: 'Основное блюдо',
        drink: 'Напиток',
    };
    return names[category] || category;
}


function updateOrder() {
    const orderElement = document.getElementById("zakaz");
    orderElement.innerHTML='';

    let totalPrice = 0;
    let orderSoup, orderMain, orderDrink;

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
                    orderElement.appendChild(categoryElement);
                    break;
                case 'main':
                    orderMain=dish.keyword;
                    orderElement.appendChild(categoryElement);
                    break;
                case 'drink':
                    orderDrink=dish.keyword;
                    orderElement.appendChild(categoryElement);
                    break;
                default:
                    break;
            }
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

    updateForm(orderSoup, orderMain, orderDrink, totalPrice);
}

function updateForm(orderSoup, orderMain, orderDrink, totalPrice) {
    const orderSoupField = document.getElementById("zakazSoup");
    const orderMainField = document.getElementById("zakazMain");
    const orderDrinkField = document.getElementById("zakazDrink");
    const totalPriceField = document.getElementById("totalPrice");

    orderSoupField.value = orderSoup === "" ? null : orderSoup;
    orderMainField.value = orderMain === "" ? null : orderMain;
    orderDrinkField.value = orderDrink === "" ? null : orderDrink;
    totalPriceField.value = totalPrice;
}

document.getElementById("formmm").addEventListener("submit", (e) => {
    e.preventDefault();

    // Проверяем значения полей
    const soup = document.getElementById("zakazSoup").value.trim();
    const main = document.getElementById("zakazMain").value.trim();
    const drink = document.getElementById("zakazDrink").value.trim();

    if (!soup || !main || !drink) {
        alert(`Пожалуйста, выберите ${soup==='' ? "Суп" : main==='' ? "Главное Блюдо" : drink === '' ? "Напиток" : ""}.`);
        return;
    }

    e.target.submit();
});

document.addEventListener("DOMContentLoaded", () => renderDishes(dishes));