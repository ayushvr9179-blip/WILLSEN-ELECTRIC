// ===============================
// LOAD DATA
// ===============================

const sales = JSON.parse(localStorage.getItem("sales")) || [];
const dispatch = JSON.parse(localStorage.getItem("dispatchHistory")) || [];

// ===============================
// ELEMENTS
// ===============================

const reportDate = document.getElementById("reportDate");
const searchBtn = document.getElementById("searchReport");
const downloadBtn = document.getElementById("downloadPDF");
const salesReport = document.getElementById("salesReport");
const dispatchReport = document.getElementById("dispatchReport");
const summaryReport = document.getElementById("summaryReport");

searchBtn.addEventListener("click", () => {

    const selectedDate = reportDate.value;

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    loadReport(selectedDate);

});

function loadReport(selectedDate){

    const filteredSales = sales.filter(
        sale => sale.date === selectedDate
    );

    const filteredDispatch = dispatch.filter(
        item => item.date === selectedDate
    );

    loadSalesReport(filteredSales);

    loadDispatchReport(filteredDispatch);

    loadSummary(filteredSales, filteredDispatch);

}

function loadSalesReport(filteredSales){

    salesReport.innerHTML = "";

    if(filteredSales.length===0){

        salesReport.innerHTML="<p>No Sales Found</p>";

        return;

    }

    filteredSales.forEach(sale=>{

        console.log("SALE =", sale);
        console.log("ITEMS =", sale.items);

        let rows="";

        sale.items.forEach(item=>{

            rows+=`
            <tr>

                <td>${item.product}</td>

                <td>${item.qty}</td>

                <td>₹${item.rate}</td>

                <td>₹${item.total}</td>

            </tr>
            `;

        });

        salesReport.innerHTML+=`

        <div class="sales-card">

            <h3>${sale.customer}</h3>

            <p><strong>Mobile :</strong> ${sale.mobile}</p>

            <p><strong>Date :</strong> ${sale.date}</p>

            <table class="sales-table">

                <thead>

                    <tr>

                        <th>Product</th>

                        <th>Qty</th>

                        <th>Rate</th>

                        <th>Amount</th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

        `;

    });

}

function loadDispatchReport(filteredDispatch){

    dispatchReport.innerHTML = "";

    if(filteredDispatch.length === 0){

        dispatchReport.innerHTML = "<p>No Dispatch Found</p>";

        return;

    }

    filteredDispatch.forEach(record=>{

        console.log("DISPATCH =", record);
        console.log("ITEMS =", record.items);

        let rows = "";

        record.items.forEach(item=>{

            rows += `
                <tr>

                    <td>${item.product}</td>

                    <td>${item.qty}</td>

                </tr>
            `;

        });

        dispatchReport.innerHTML += `

        <div class="dispatch-card">

            <p><strong>Date :</strong> ${record.date}</p>

            <table class="dispatch-table">

                <thead>

                    <tr>

                        <th>Product</th>

                        <th>Dispatch Qty</th>

                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>

        </div>

        `;

    });

}

function loadSummary(filteredSales, filteredDispatch){

    let totalSales = 0;

    filteredSales.forEach(sale=>{

        totalSales += Number(sale.grandTotal);

    });

    let totalDispatchQty = 0;

    filteredDispatch.forEach(record=>{

        record.items.forEach(item=>{

            totalDispatchQty += Number(item.qty);

        });

    });

    summaryReport.innerHTML = `

    <div class="summary-grid">

        <div class="summary-card">

            <h3>${filteredSales.length}</h3>

            <p>Sales Records</p>

        </div>

        <div class="summary-card">

            <h3>${filteredDispatch.length}</h3>

            <p>Dispatch Records</p>

        </div>

        <div class="summary-card">

            <h3>₹${totalSales.toLocaleString("en-IN")}</h3>

            <p>Total Sales</p>

        </div>

        <div class="summary-card">

            <h3>${totalDispatchQty}</h3>

            <p>Dispatch Qty</p>

        </div>

    </div>

    `;

}

updateGeneratedDateTime();

function updateGeneratedDateTime() {

    const now = new Date();

    document.getElementById("generatedDate").textContent =
        now.toLocaleDateString("en-GB");

    document.getElementById("generatedTime").textContent =
        now.toLocaleTimeString("en-IN");
}

downloadBtn.addEventListener("click", generatePDF);

function generatePDF(){

    const selectedDate = reportDate.value;

const filteredSales = sales.filter(
    sale => sale.date === selectedDate
);

const filteredDispatch = dispatch.filter(
    item => item.date === selectedDate
);

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF("p","mm","a4");

    const logo = new Image();

    logo.src = "images/logo.png";

    logo.onload = function(){

        // Logo
       doc.addImage(logo,"PNG",55,6,100,55);

        // Heading
        doc.setFont("helvetica","bold");
        doc.setFontSize(14);
        doc.setTextColor(0,0,0);

      doc.text("REPORT",105,62,{
            align:"center"
        });

        // Green Line
        doc.setDrawColor(181,228,248);
        doc.setLineWidth(0.2);
        doc.line(20,65,190,65);

        const reportDate = new Date(document.getElementById("reportDate").value);

        const formattedDate = reportDate.toLocaleDateString("en-GB");

        doc.text(`Report Date : ${formattedDate}`,20,75);

        // Sales Heading

        const salesBody = [];

filteredSales.forEach(sale => {

    sale.items.forEach(item => {

        salesBody.push([
            sale.customer,
            item.product,
            item.qty,
            `Rs.${item.rate}`,
            `Rs.${item.total}`
        ]);

    });

});

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.setTextColor(21, 88, 96);
doc.text("SALES DETAILS", 20, 88);
  

doc.autoTable({

    startY: 90,

    head: [[
        "Customer",
        "Product",
        "Qty",
        "Rate",
        "Amount"
    ]],

     

    body: salesBody,

    theme: "grid",


    headStyles: {

        fillColor: [181,228,248],
        textColor: [21, 88, 96],
        fontStyle: "bold"

    },

    styles:{

        fontSize:10,
        halign:"center",
        valign:"middle"

    }

});

let currentY = doc.lastAutoTable.finalY + 15;

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.setTextColor(25,109,95);

doc.text("DISPATCH DETAILS",20,150);

currentY += 10;

const dispatchBody = [];

filteredDispatch.forEach(record=>{

    record.items.forEach(item=>{

        dispatchBody.push([
             record.date,
            item.product,
            item.qty
        ]);

    });

});

doc.autoTable({

    startY: currentY,

    head:[[
        "Date",
        "Product",
        "Dispatch Qty"
    ]],

    body:dispatchBody,

    theme:"grid",

    headStyles:{
        fillColor:[185, 250, 237],
        textColor:[25,109,95],
        halign:"center"
    },

    styles:{
        fontSize:10,
        halign:"center",
        textColor:[0,0,0]
    }

});

doc.autoTable({

    startY: currentY,

    head:[[
        "Date",
        "Product",
        "Dispatch Qty"
    ]],

    body: dispatchBody,

    theme: "grid",

    headStyles:{
        fillColor:[185, 250, 237],
        textColor:[25,109,95],
        halign:"center"
    },

    styles:{
        fontSize:10,
        halign:"center",
        textColor:[0,0,0]
    }

});

currentY = doc.lastAutoTable.finalY + 15;

doc.setFont("helvetica", "bold");
doc.setFontSize(14);
doc.setTextColor(78, 102, 30);

doc.text("SUMMARY DETAILS",20,200);

currentY += 10;

let totalSales = 0;

filteredSales.forEach(sale=>{
    totalSales += Number(sale.grandTotal);
});

let totalDispatchQty = 0;

filteredDispatch.forEach(record=>{
    record.items.forEach(item=>{
        totalDispatchQty += Number(item.qty);
    });
});

doc.autoTable({

    startY: currentY,

    head:[[
        "Description",
        "Value"
    ]],

    body:[

        ["Sales Records", filteredSales.length],

        ["Dispatch Records", filteredDispatch.length],

        ["Total Sales", `Rs.${totalSales.toLocaleString("en-IN")}`],

        ["Dispatch Quantity", totalDispatchQty]

    ],

    theme:"grid",

    headStyles:{
        fillColor:[239, 250, 217],
        textColor:[78, 102, 30]
    },

    styles:{
        halign:"center",
        textColor:[0,0,0]
    }

});

// ================= FOOTER =================

let footerY = doc.internal.pageSize.getHeight() - 18;

// Top Line
doc.setDrawColor(24,179,148);
doc.line(20, footerY - 8, 190, footerY - 8);

// Font
doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(0,0,0);

// Date (Left)
doc.text(
    `Generated Date : ${new Date().toLocaleDateString("en-GB")}`,
    20,
    footerY
);

// Time (Right)
doc.text(
    `Generated Time : ${new Date().toLocaleTimeString("en-IN")}`,
    190,
    footerY,
    { align: "right" }
);

// Second Line (Center)
doc.setFontSize(9);
doc.setTextColor(120);

doc.text(
    "This is a computer-generated report.",
    105,
    footerY + 8,
    { align: "center" }
);

doc.save("Report.pdf");

    };

}