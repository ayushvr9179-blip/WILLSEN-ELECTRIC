// =====================================
// WILLSEN Dispatch Management System
// =====================================

let dispatchItems = [];

const productSelect = document.getElementById("product");
const quantityInput = document.getElementById("quantity");
const dateInput = document.getElementById("date");

const productTable = document.getElementById("dispatchItems");
const todayTable = document.getElementById("dispatchTable");
const totalItems = document.getElementById("dispatchTotal");

dateInput.value = new Date().toISOString().split("T")[0];

// Load Products
products.forEach(product => {

    const option = document.createElement("option");

    option.value = product.code;

    option.textContent = `${product.code} - ${product.name}`;

    productSelect.appendChild(option);

});

// ==============================
// Add Product
// ==============================

document.getElementById("addDispatchProductBtn").addEventListener("click", () => {

    const code = productSelect.value;
    const qty = Number(quantityInput.value);

    if (!code) {
        alert("Please select a product.");
        return;
    }

    if (qty <= 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    const product = products.find(p => p.code === code);

    dispatchItems.push({
        code: product.code,
        product: product.name,
        qty: qty
    });

    updateDispatchTable();

    productSelect.value = "";
    quantityInput.value = "";

});

// ==============================
// Update Product Table
// ==============================

function updateDispatchTable() {

    productTable.innerHTML = "";

    let total = 0;

    dispatchItems.forEach((item, index) => {

        total += item.qty;

        productTable.innerHTML += `
        <tr>
            <td>${item.product}</td>
            <td>${item.qty}</td>
            <td>
                <button onclick="removeProduct(${index})">
                    Delete
                </button>
            </td>
        </tr>
        `;
    });

    totalItems.textContent = total;
}

// ==============================
// Remove Product
// ==============================

function removeProduct(index) {

    dispatchItems.splice(index, 1);

    updateDispatchTable();

}

// ==============================
// Save Dispatch
// ==============================

document.getElementById("saveBtn").addEventListener("click", saveDispatch);

function saveDispatch() {

    if (dispatchItems.length === 0) {

        alert("Please add at least one product!");

        return;

    }

    let shopStock = JSON.parse(localStorage.getItem("shopStock")) || {};

    dispatchItems.forEach(item => {

        if (!shopStock[item.code]) {

            shopStock[item.code] = {
                name: item.product,
                quantity: 0
            };

        }

        shopStock[item.code].quantity += item.qty;

    });

    localStorage.setItem("shopStock", JSON.stringify(shopStock));
    if (window.WillsenLowStock) WillsenLowStock.notifyIfNeeded();

    let dispatchHistory = JSON.parse(localStorage.getItem("dispatchHistory")) || [];

    dispatchHistory.unshift({

        id: Date.now(),

        date: dateInput.value,

        items: [...dispatchItems],

        totalItems: dispatchItems.reduce((sum, item) => sum + item.qty, 0)

    });

    localStorage.setItem("dispatchHistory", JSON.stringify(dispatchHistory));

    dispatchItems = [];

    updateDispatchTable();

    loadDispatch();

    alert("Dispatch Saved Successfully!");

}

// ==============================
// Load Today's Dispatch
// ==============================

function loadDispatch() {

    const history = JSON.parse(localStorage.getItem("dispatchHistory")) || [];

    const today = new Date().toISOString().split("T")[0];

    const todayDispatch = history.filter(item => item.date === today);

    todayTable.innerHTML = "";

    if (todayDispatch.length === 0) {

        todayTable.innerHTML = `
        <tr>
            <td colspan="5">No Dispatch Found</td>
        </tr>
        `;

        return;

    }

    todayDispatch.forEach(dispatch => {

        const productNames = dispatch.items.map(item => item.product).join("<br>");

        const quantities = dispatch.items.map(item => item.qty).join("<br>");

        todayTable.innerHTML += `
        <tr>
            <td>${dispatch.date}</td>
            <td>--</td>
            <td>${productNames}</td>
            <td>${quantities}</td>
            <td>

                <button onclick="deleteDispatch(${dispatch.id})">
                    Delete
                </button>
            </td>
        </tr>
        `;

    });

}

function deleteDispatch(id) {

    let history = JSON.parse(localStorage.getItem("dispatchHistory")) || [];

    const dispatch = history.find(item => item.id === id);

    if (!dispatch) {
        alert("Dispatch not found!");
        return;
    }

    let shopStock = JSON.parse(localStorage.getItem("shopStock")) || {};

    dispatch.items.forEach(item => {

        if (shopStock[item.code]) {

            shopStock[item.code].quantity -= item.qty;

            if (shopStock[item.code].quantity < 0) {
                shopStock[item.code].quantity = 0;
            }

        }

    });

    history = history.filter(item => item.id !== id);

    localStorage.setItem("shopStock", JSON.stringify(shopStock));
    localStorage.setItem("dispatchHistory", JSON.stringify(history));

    loadDispatch();

    alert("Dispatch Deleted Successfully!");

}

window.addEventListener("DOMContentLoaded", () => {

    loadDispatch();

});