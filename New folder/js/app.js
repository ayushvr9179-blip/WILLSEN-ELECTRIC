
let editingIndex = -1;
let deleteIndex = -1;
const saveBtn = document.getElementById("saveBtn");
const table = document.getElementById("dispatchTable");

// Load data when page opens
let dispatchData = JSON.parse(localStorage.getItem("dispatchData")) || [];

// Show existing data
displayData();

saveBtn.addEventListener("click", function () {

    const product = document.getElementById("product").value;
    const quantity = document.getElementById("quantity").value;
    const date = document.getElementById("Date").value;
    const remarks = document.getElementById("remarks").value;

    if (product === "" || quantity === "" || date === "") {
        alert("Please fill all required fields.");
        return;
    }

    const selectedProduct = products.find(
    p => p.code === product
);

    const newEntry = {
    code: selectedProduct.code,
    product: selectedProduct.name,
    quantity: quantity,
    date: date,
    remarks: remarks
};

    // Save in array
    
    dispatchData.push(newEntry);

    let shopStock =
JSON.parse(localStorage.getItem("shopStock")) || {};

if (shopStock[selectedProduct.code]) {

    shopStock[selectedProduct.code].quantity += Number(quantity);

    if (shopStock[selectedProduct.code].quantity < 0) {

        shopStock[selectedProduct.code].quantity = 0;

    }

    localStorage.setItem(
        "shopStock",
        JSON.stringify(shopStock)
    );

}

    // Save in Local Storage
    localStorage.setItem("dispatchData", JSON.stringify(dispatchData));

    // Refresh table
    displayData();

    // Clear form
    document.getElementById("product").selectedIndex = 0;
    document.getElementById("quantity").value = "";
    document.getElementById("date").value = "";
    document.getElementById("remarks").value = "";

});

function displayData() {

    table.innerHTML = "";

    dispatchData.forEach((item, index) => {

        table.innerHTML += `
<tr>

    <td>${formatDate(item.date)}</td>

    <td>${item.code}</td>

    <td>${item.product}</td>

    <td>${item.quantity}</td>

    <td class="action-cell">

        <button class="action-btn" data-index="${index}">
            ⋮
        </button>

        <div id="menu-${index}" class="action-menu">

            <button class="edit-btn" data-index="${index}">
                ✏ Edit
            </button>

            <button class="delete-btn" data-index="${index}">
                🗑 Delete
            </button>

        </div>

    </td>

</tr>
`;

    });

}

function formatDate(dateString) {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;

}

function deleteEntry(index){

    if(confirm("Delete this dispatch?")){

        dispatchData.splice(index,1);

        localStorage.setItem(
            "dispatchData",
            JSON.stringify(dispatchData)
        );

        displayData();

    }

}

function editEntry(index){

    editingIndex = index;

    const item = dispatchData[index];

    document.getElementById("editProduct").value = item.code;

    document.getElementById("editQuantity").value = item.quantity;

    document.getElementById("editDate").value = item.date;

    document.getElementById("editRemarks").value = item.remarks;

    document.getElementById("editModal").style.display="flex";

}

function closeModal(){

    document.getElementById("editModal").style.display="none";

}

document.getElementById("updateBtn").addEventListener("click",function(){

    const code = document.getElementById("editProduct").value;

    const product = products.find(p=>p.code===code);

    dispatchData[editingIndex]={

        code:product.code,

        product:product.name,

        quantity:document.getElementById("editQuantity").value,

        date:document.getElementById("editDate").value,

        remarks:document.getElementById("editRemarks").value

    };

    localStorage.setItem(
        "dispatchData",
        JSON.stringify(dispatchData)
    );

   

    displayData();

    closeModal();

});

function toggleMenu(index) {

    const currentMenu = document.getElementById(`menu-${index}`);

    // Pehle saare menus band karo
    document.querySelectorAll(".action-menu").forEach(menu => {

        if (menu !== currentMenu) {
            menu.style.display = "none";
        }

    });

    // Current menu toggle karo
    if (currentMenu.style.display === "block") {

        currentMenu.style.display = "none";

    } else {

        currentMenu.style.display = "block";

    }

}

   

document.addEventListener("click", function (e) {

    if (!e.target.closest(".action-cell")) {

        document.querySelectorAll(".action-menu").forEach(menu => {

            menu.style.display = "none";

        });

    }

});

const editProductSelect = document.getElementById("editProduct");

products.forEach(product => {

    const option = document.createElement("option");

    option.value = product.code;

    option.textContent = `${product.code} - ${product.name}`;

    editProductSelect.appendChild(option);

});

table.addEventListener("click", function (e) {

    // Three Dot
    if (e.target.closest(".action-btn")) {

        const index = e.target.closest(".action-btn").dataset.index;

        toggleMenu(index);

        return;
    }

    // Edit
    if (e.target.closest(".edit-btn")) {

        const index = e.target.closest(".edit-btn").dataset.index;

        editEntry(Number(index));

        return;
    }

    // Delete
    if (e.target.closest(".delete-btn")) {

        const index = e.target.closest(".delete-btn").dataset.index;

        deleteEntry(Number(index));

        return;
    }

});