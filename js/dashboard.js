// Load Dispatch Data
const dispatchHistory = JSON.parse(localStorage.getItem("dispatchHistory")) || [];

const sales = JSON.parse(localStorage.getItem("sales")) || [];

const shopStock = JSON.parse(localStorage.getItem("shopStock")) || {};

// Dashboard Elements
const todaySales = document.getElementById("todaySales");
const todayDispatch = document.getElementById("todayDispatch");
const totalQuantity = document.getElementById("totalQuantity");
const totalProducts = document.getElementById("totalProducts");
const recentActivity = document.getElementById("recentActivity");

// Format Date
function formatDate(dateString) {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;
}

// Dashboard Data
function loadDashboard() {

    const today = new Date().toISOString().split("T")[0];

    // Today's Sales

    let salesTotal = 0;

    sales.forEach(sale => {

        if (sale.date === today) {

            salesTotal += sale.grandTotal || sale.total;

        }

    });

    todaySales.textContent = "₹ " + salesTotal;

    // Today's Dispatch

    let dispatchQty = 0;

    dispatchHistory.forEach(dispatch => {

        if (dispatch.date === today) {

            dispatch.items.forEach(item => {

                dispatchQty += item.qty;

            });

        }

    });

    todayDispatch.textContent = dispatchQty;

    // Shop Stock

    let stockQty = 0;

    Object.values(shopStock).forEach(product => {

        stockQty += product.quantity;

    });

    totalQuantity.textContent = stockQty;

    // Low Stock

    let low = 0;

    Object.values(shopStock).forEach(product => {

        if (product.quantity <= 10) {

            low++;

        }

    });

    totalProducts.textContent = low;

}

function loadRecentActivity() {

    recentActivity.innerHTML = "";

    let activity = [];

    // Sales
    sales.forEach(sale => {

        activity.push({
            date: sale.date,
            product: sale.customer,
            type: "Sale",
            quantity: "₹ " + (sale.grandTotal || sale.total)
        });

    });

    // Dispatch
    dispatchHistory.forEach(dispatch => {

        dispatch.items.forEach(item => {

            activity.push({
                date: dispatch.date,
                product: item.product,
                type: "Dispatch",
                quantity: item.qty
            });

        });

    });

    // Newest First
    activity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Last 5 Records
    activity.slice(0, 5).forEach(item => {

        recentActivity.innerHTML += `
        <tr>
            <td>${formatDate(item.date)}</td>
            <td>${item.product}</td>
            <td>${item.type}</td>
            <td>${item.quantity}</td>
        </tr>
        `;

    });

}


function loadTodaySales() {

    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    const today = new Date().toISOString().split("T")[0];

    const todaySales = sales.filter(sale => sale.date === today);

    let total = 0;

    todaySales.forEach(sale => {

        total += sale.grandTotal || sale.total;

    });

    document.getElementById("todaySales").textContent = "₹ " + total;

}

function loadTodayDispatch() {

    const history = JSON.parse(localStorage.getItem("dispatchHistory")) || [];

    const today = new Date().toISOString().split("T")[0];

    const todayDispatch = history.filter(item => item.date === today);

    let qty = 0;

    todayDispatch.forEach(dispatch => {

        dispatch.items.forEach(product => {

            qty += product.qty;

        });

    });

    document.getElementById("todayDispatch").textContent = qty;

}

function loadTotalStock() {

    const stock = JSON.parse(localStorage.getItem("shopStock")) || {};

    let total = 0;

    Object.values(stock).forEach(product => {

        total += product.quantity;

    });

    document.getElementById("totalQuantity").textContent = total;

}

function loadLowStock() {

    const stock = JSON.parse(localStorage.getItem("shopStock")) || {};

    let low = 0;

    Object.values(stock).forEach(product => {

        if (product.quantity <= 10) {

            low++;

        }

    });

    document.getElementById("totalProducts").textContent = low;

}

function loadLowStockList() {

    const container = document.getElementById("lowStockList");

    container.innerHTML = "";

    let found = false;

    Object.values(shopStock).forEach(product => {

        if (product.quantity <= 10) {

            found = true;

            container.innerHTML += `

            <div class="low-stock-item">

                <span>${product.name}</span>

                <span>${product.quantity} Left</span>

            </div>

            `;

        }

    });

    if (!found) {

        container.innerHTML = "<p>No Low Stock 🎉</p>";

    }

}

loadTodaySales();
loadTodayDispatch();
loadTotalStock();
loadLowStock();
loadDashboard();
loadRecentActivity();
loadLowStockList();