import { dishes } from "./array.js";

function handleOrder() {
    const order = {
        soup: null,
        main: null,
        drink: null,
    };

    function updateSummary() {
        document.getElementById("order-soup").textContent = order.soup ? `${order.soup.name} - ${order.soup.price}₽` : "Ничего не выбрано";
        document.getElementById("order-main").textContent = order.main ? `${order.main.name} - ${order.main.price}₽` : "Ничего не выбрано";
        document.getElementById("order-drink").textContent = order.drink ? `${order.drink.name} - ${order.drink.price}₽` : "Ничего не выбрано";

        const totalPrice = Object.values(order).reduce((sum, dish) => sum + (dish ? dish.price : 0), 0);
        const totalPriceElement = document.getElementById("total-price");
        totalPriceElement.style.display = totalPrice > 0 ? "block" : "none";
        totalPriceElement.textContent = `Итоговая стоимость: ${totalPrice} ₽`;
    }

    document.querySelectorAll(".items .item button").forEach((button) => {
        button.addEventListener("click", (e) => {
            const card = e.target.closest(".item");
            const keyword = card.getAttribute("data-dish");
            const dish = dishes.find((d) => d.keyword === keyword);
            if (dish) {
                order[dish.category] = dish;
                updateSummary();
            }
        });
    });

    updateSummary();
}

document.addEventListener("DOMContentLoaded", handleOrder);
