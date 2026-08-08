const dispatchData =
JSON.parse(localStorage.getItem("dispatchHistory")) || [];

const historyTable =
document.getElementById("historyTable");

const recordCount =
document.getElementById("recordCount");

function formatDate(dateString){

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2,"0");
    const month = String(date.getMonth()+1).padStart(2,"0");
    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;

}

function displayHistory(data){

    historyTable.innerHTML = "";

    recordCount.textContent = data.length;

    data.forEach(record=>{

        record.items.forEach(item=>{

            historyTable.innerHTML += `

            <tr>

                <td>${formatDate(record.date)}</td>

                <td>${item.code}</td>

                <td>${item.product}</td>

                <td>${item.qty}</td>

                <td>${record.remarks || "-"}</td>

            </tr>

            `;

        });

    });

}

function applyFilters() {

    const code = document
        .getElementById("searchCode")
        .value
        .toLowerCase()
        .trim();

    const product = document
        .getElementById("searchProduct")
        .value
        .toLowerCase()
        .trim();

    const selectedDate = filterDate.value;

    let filtered = dispatchData.filter(record => {

        const matchDate =
            !selectedDate || record.date === selectedDate;

        const matchItems = record.items.some(item => {

            const matchCode =
                item.code.toLowerCase().includes(code);

            const matchProduct =
                item.product.toLowerCase().includes(product);

            return matchCode && matchProduct;

        });

        return matchDate && matchItems;

    });

    switch (sortSelect.value) {

        case "latest":
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;

        case "oldest":
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;

    }

    displayHistory(filtered);

}

displayHistory(dispatchData);

const searchProduct = document.getElementById("searchProduct");
const searchCode = document.getElementById("searchCode");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const sortSelect = document.getElementById("sortSelect");

searchProduct.addEventListener("keyup", applyFilters);

searchCode.addEventListener("change", applyFilters);

filterDate.addEventListener("change", applyFilters);

sortSelect.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", () => {

    searchCode.value = "";
    searchProduct.value = "";
    fromDate.value = "";
    toDate.value = "";

    applyFilters();

});

function loadProductCodes(){

    const codeDropdown = document.getElementById("searchCode");

    const uniqueCodes = [];

    dispatchData.forEach(record=>{

        record.items.forEach(item=>{

            if(!uniqueCodes.some(p=>p.code===item.code)){

                uniqueCodes.push({

                    code:item.code,

                    product:item.product

                });

            }

        });

    });

    uniqueCodes.sort((a,b)=>a.code.localeCompare(b.code));

    uniqueCodes.forEach(item=>{

        codeDropdown.innerHTML += `
            <option value="${item.code}">
                ${item.code}
            </option>
        `;

    });

}

searchCode.addEventListener("change",()=>{

    const selected = searchCode.value;

    let productName = "";

    dispatchData.forEach(record=>{

        record.items.forEach(item=>{

            if(item.code===selected){

                productName = item.product;

            }

        });

    });

    searchProduct.value = productName;

    applyFilters();

});

loadProductCodes();