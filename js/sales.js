// ===========================
// BILL ITEMS
// ===========================

let billItems = [];

const productSelect = document.getElementById("productCode");

console.log("Sales JS Loaded");
console.log(products);

products.forEach(product => {

    productSelect.innerHTML += `
        <option value="${product.code}">
            ${product.code} - ${product.name}
        </option>
    `;

});



productSelect.addEventListener("change", function () {

    const selectedCode = this.value;

    const product = products.find(item => item.code === selectedCode);

    if (product) {

        document.getElementById("productName").value = product.name;

        // 👇 Rate bhi auto-fill hoga
        document.getElementById("saleRate").value = product.price;

        // 👇 Total bhi update hoga
        calculateTotal();

    } else {

        document.getElementById("productName").value = "";
        document.getElementById("saleRate").value = "";
        document.getElementById("totalAmount").value = "₹ 0.00";

    }

});

// Calculate Total
function calculateTotal() {

    const quantity = Number(document.getElementById("saleQuantity").value);
    const rate = Number(document.getElementById("saleRate").value);

    const total = quantity * rate;

    document.getElementById("totalAmount").value = "₹ " + total.toFixed(2);

}

document.getElementById("saleQuantity").addEventListener("input", calculateTotal);

document.getElementById("saleRate").addEventListener("input", calculateTotal);  

document.getElementById("saveSaleBtn").addEventListener("click", saveSale);

function addProduct() {

    const code = document.getElementById("productCode").value;
    const product = document.getElementById("productName").value;
    const qty = Number(document.getElementById("saleQuantity").value);
    const rate = Number(document.getElementById("saleRate").value);

    if (!code || qty <= 0) {

        alert("Select Product and Enter Quantity!");

        return;

    }

    const item = {

        code,
        product,
        qty,
        rate,
        total: qty * rate

    };

    billItems.push(item);

    console.log(billItems);

    renderBill();

}

function renderBill() {

    const tbody = document.getElementById("billItems");

    tbody.innerHTML = "";

    let grandTotal = 0;

    billItems.forEach((item, index) => {

        grandTotal += item.total;

        tbody.innerHTML += `
            <tr>

                <td>${item.product}</td>

                <td>${item.qty}</td>

                <td>₹ ${item.rate}</td>

                <td>₹ ${item.total}</td>

                <td>
                    <button onclick="removeProduct(${index})">
                        ❌
                    </button>
                </td>

            </tr>
        `;

    });

    document.getElementById("grandTotal").textContent =
        `₹ ${grandTotal}`;

}

function removeProduct(index) {

    billItems.splice(index, 1);

    renderBill();

}

function saveSale() {

    console.log("Sale Date:", document.getElementById("saleDate").value);

    const sale = {

    id: Date.now(),

    date: document.getElementById("saleDate").value,

    customer: document.getElementById("customerName").value,

    mobile: document.getElementById("customerMobile").value,

    items: billItems,

    grandTotal: billItems.reduce((sum, item) => sum + item.total, 0)

};

    console.log(sale);

let sales = JSON.parse(localStorage.getItem("sales")) || [];



let shopStock = JSON.parse(localStorage.getItem("shopStock")) || {};

for (const item of billItems) {

    if (!shopStock[item.code]) {

        alert(`${item.product} not found in Shop Stock!`);

        return;

    }

    if (shopStock[item.code].quantity < item.qty) {

        alert(
            `Only ${shopStock[item.code].quantity} ${item.product} available!`
        );

        return;

    }

}

for (const item of billItems) {

    shopStock[item.code].quantity -= item.qty;

}

sales.unshift(sale);

localStorage.setItem("shopStock", JSON.stringify(shopStock));

localStorage.setItem("sales", JSON.stringify(sales));

loadSales();

alert("Sale Saved Successfully!");

// Clear Current Bill
billItems = [];

renderBill();

// Clear Form
document.getElementById("customerName").value = "";
document.getElementById("customerMobile").value = "";
document.getElementById("productCode").value = "";
document.getElementById("productName").value = "";
document.getElementById("saleQuantity").value = "";
document.getElementById("saleRate").value = "";
document.getElementById("totalAmount").value = "₹ 0.00";

}

function loadSales() {

    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    const today = new Date().toISOString().split("T")[0];

const todaySales = sales.filter(sale => sale.date === today);

console.log("Today's Date:", today);
console.log("All Sales:", sales);
console.log("Today's Sales:", todaySales);

    console.log(sales);

    const tableBody = document.getElementById("salesTable");

    tableBody.innerHTML = "";

   if (todaySales.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-row">
                    No Sales Found
                </td>
            </tr>
        `;

        return;
    } 

  todaySales.forEach((sale, index) => {

        console.log(sale);

       const productNames = sale.items
    .map(item => item.product)
    .join("<br>");

const quantities = sale.items
    .map(item => item.qty)
    .join("<br>");

const rates = sale.items
    .map(item => `₹${item.rate}`)
    .join("<br>");

        const totalQty = sale.items.reduce((sum, item) => sum + item.qty, 0);

        tableBody.innerHTML += `
<tr>
    <td>${sale.date}</td>
    <td>${sale.customer}</td>
    <td>${productNames}</td>
    <td>${quantities}</td>
    <td>${rates}</td>
    <td>₹ ${sale.grandTotal}</td>
    <td>
        <button class="delete-btn" onclick="deleteSale(${sale.id})">
            Delete
        </button>
    </td>
</tr>
`;

    });

}

function deleteSale(id) {

    let sales = JSON.parse(localStorage.getItem("sales")) || [];

    const deletedSale = sales.find(sale => sale.id === id);

    if (!deletedSale) {
        alert("Sale not found!");
        return;
    }

    let shopStock = JSON.parse(localStorage.getItem("shopStock")) || {};

    deletedSale.items.forEach(item => {

    if (shopStock[item.code]) {

        shopStock[item.code].quantity += item.qty;

    }

});

    localStorage.setItem("shopStock", JSON.stringify(shopStock));

    sales = sales.filter(sale => sale.id !== id);

    localStorage.setItem("sales", JSON.stringify(sales));

    loadSales();

    alert("Sale Deleted Successfully!");
}

// ===========================
// PAGE LOAD
// ===========================

document.addEventListener("DOMContentLoaded", function () {

    // Today's Date Automatically
    document.getElementById("saleDate").value =
        new Date().toISOString().split("T")[0];

    // Load Today's Sales
    loadSales();

});

document.getElementById("addProductBtn").addEventListener("click", addProduct);