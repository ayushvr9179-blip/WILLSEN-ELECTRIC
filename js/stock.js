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

const thresholdInput = document.getElementById("lowStockThreshold");
const alertPhoneInput = document.getElementById("alertPhone");
const alertModeInput = document.getElementById("alertMode");
const alertSettings = window.WillsenLowStock ? WillsenLowStock.getSettings() : { threshold: 10, phone: "", mode: "whatsapp" };
thresholdInput.value = alertSettings.threshold;
alertPhoneInput.value = alertSettings.phone;
alertModeInput.value = alertSettings.mode;

document.getElementById("saveAlertSettings").addEventListener("click", () => {
    const threshold = Number(thresholdInput.value);
    if (!Number.isFinite(threshold) || threshold < 0) { alert("Enter a valid stock threshold (0 or more)."); return; }
    const phone = alertPhoneInput.value.trim().replace(/[\s()+-]/g, "");
    localStorage.setItem("lowStockAlertSettings", JSON.stringify({ threshold, phone, mode: alertModeInput.value }));
    displayStock(searchInput.value);
    alert("Low-stock alert settings saved.");
});

document.getElementById("sendLowStockAlert").addEventListener("click", () => {
    if (alertModeInput.value === "browser") {
        if (!("Notification" in window)) { alert("Browser notifications are not supported here. Choose WhatsApp instead."); return; }
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                const items = WillsenLowStock.getLowStockItems();
                if (!items.length) { alert("No products are below the threshold."); return; }
                new Notification("WILLSEN: Low stock", { body: items.slice(0, 5).map(i => `${i.name}: ${i.quantity} left`).join("\n") });
            } else alert("Allow notifications in your browser settings to use this option.");
        });
    } else WillsenLowStock.openWhatsApp();
});

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

} else if (qty < Number((WillsenLowStock && WillsenLowStock.getSettings().threshold) || 10)) {

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
    if (window.WillsenLowStock) WillsenLowStock.notifyIfNeeded();

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
if (window.WillsenLowStock) WillsenLowStock.notifyIfNeeded();

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