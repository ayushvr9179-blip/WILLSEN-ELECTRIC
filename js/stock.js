// ===============================
// WILLSEN ELECTRICS
// Shop Stock
// ===============================

const stockTable = document.getElementById("stockTable");
const searchInput = document.getElementById("stockSearch");

const editStockModal =
document.getElementById("editStockModal");

const editProductName =
document.getElementById("editProductName");

const currentStockInput =
document.getElementById("currentStock");

const newStockInput =
document.getElementById("newStock");

const saveStockBtn =
document.getElementById("saveStockBtn");

const cancelStockBtn =
document.getElementById("cancelStockBtn");

let selectedCode = "";

// Products List
const productsList = products;

// Dispatch Records
const dispatchData = JSON.parse(localStorage.getItem("dispatchData")) || [];

// Stock Object
let stock =
JSON.parse(localStorage.getItem("shopStock")) || {};

// Sab products ka stock 0 se start hoga
productsList.forEach(product => {

    if (!stock[product.code]) {

        stock[product.code] = {

            name: product.name,

            quantity: 0

        };

    }

});

// Dispatch ke hisaab se quantity add karo
dispatchData.forEach(item => {

    if (stock[item.code]) {

        stock[item.code].quantity += Number(item.quantity);

    }

});

// Table Show Function
function displayStock(search = "") {

    stockTable.innerHTML = "";

    const keyword = search.trim().toLowerCase();

    productsList.forEach(product => {

        const code = product.code.toLowerCase();
        const name = product.name.toLowerCase();

        if (
            code.includes(keyword) ||
            name.includes(keyword)
        ) {

            const qty = stock[product.code].quantity;

            let status = "Normal";

if (qty === 0) {

    status = "Out of Stock";

} else if (qty < 10) {

    status = "Low";

} else if (qty < 50) {

    status = "Medium";

}

let badgeClass = "stock-good";

if (qty === 0) {

    badgeClass = "stock-zero";

} else if (qty < 50) {

    badgeClass = "stock-low";

}

stockTable.innerHTML += `

<tr>

    <td>${product.code}</td>

    <td>${product.name}</td>

    <td>

        <span class="${badgeClass}">
            ${qty}
        </span>

    </td>

    <td>${status}</td>

    <td>

        <button
            class="edit-stock-btn"
            data-code="${product.code}">

            Edit

        </button>

    </td>

</tr>

`;

        }

    });

}

saveStockBtn.addEventListener("click", function () {

    const newQty = Number(newStockInput.value);

    if (isNaN(newQty) || newQty < 0) {

        alert("Please enter a valid stock quantity.");

        return;

    }

    
    stock[selectedCode].quantity = newQty;

    localStorage.setItem(
    "shopStock",
    JSON.stringify(stock)
);

    editStockModal.style.display = "none";

    displayStock(searchInput.value);

});

cancelStockBtn.addEventListener("click", function () {

    editStockModal.style.display = "none";

});

window.addEventListener("click", function (e) {

    if (e.target === editStockModal) {

        editStockModal.style.display = "none";

    }

});

          
// First Load
displayStock();

document.addEventListener("click", function (e) {

    if (e.target.classList.contains("edit-stock-btn")) {

        const code = e.target.dataset.code;

        selectedCode = code;

        const product = productsList.find(p => p.code === code);

        editProductName.textContent =
            product.name;

        currentStockInput.value =
            stock[code].quantity;

        newStockInput.value =
            stock[code].quantity;

        editStockModal.style.display = "flex";

    }

});

// Search
searchInput.addEventListener("input", function () {

    displayStock(this.value);

});