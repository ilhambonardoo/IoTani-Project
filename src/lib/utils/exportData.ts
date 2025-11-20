// Export data ke PDF dan CSV

export interface ExportData {
  date: string;
  suhu: number;
  kelembapan: number;
  pH: number;
}

// Generate CSV content
export const generateCSV = (data: ExportData[], dataType: string): string => {
  const headers = ["Tanggal", "Suhu (°C)", "Kelembapan (%)", "pH"];

  let csvContent = `Data ${dataType}\n\n`;
  csvContent += headers.join(",") + "\n";

  data.forEach((row) => {
    csvContent += `${row.date},${row.suhu.toFixed(2)},${row.kelembapan.toFixed(
      2
    )},${row.pH.toFixed(2)}\n`;
  });

  return csvContent;
};

// Generate PDF content using HTML
export const generatePDFContent = (
  data: ExportData[],
  dataType: string
): string => {
  const today = new Date().toLocaleDateString("id-ID");

  let tableHTML = `
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
          }
          .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #22c55e;
            text-align: center;
            margin-bottom: 10px;
          }
          .info {
            text-align: center;
            color: #666;
            margin-bottom: 20px;
            font-size: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #22c55e;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #16a34a;
          }
          td {
            padding: 10px 12px;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
          tr:hover {
            background-color: #f0fdf4;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 11px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌱 IoTani - Laporan Data Sensor</h1>
          <div class="info">
            <p><strong>Tipe Data:</strong> ${dataType}</p>
            <p><strong>Tanggal Cetak:</strong> ${today}</p>
            <p><strong>Total Baris:</strong> ${data.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Suhu (°C)</th>
                <th>Kelembapan (%)</th>
                <th>pH</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) =>
                    `<tr>
                    <td>${row.date}</td>
                    <td>${row.suhu.toFixed(2)}</td>
                    <td>${row.kelembapan.toFixed(2)}</td>
                    <td>${row.pH.toFixed(2)}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="footer">
            <p>Dokumen ini dihasilkan otomatis oleh Sistem IoTani</p>
            <p>&copy; 2024 IoTani Project. Semua hak dilindungi.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return tableHTML;
};

// Download CSV
export const downloadCSV = (data: ExportData[], dataType: string) => {
  const csvContent = generateCSV(data, dataType);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `iotani-data-${dataType}-${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Download PDF using html2pdf library
export const downloadPDF = async (data: ExportData[], dataType: string) => {
  try {
    // Dynamic import html2pdf
    const html2pdf = (await import("html2pdf.js" as any)).default as any;

    const element = document.createElement("div");
    element.innerHTML = generatePDFContent(data, dataType);

    const opt = {
      margin: 10,
      filename: `iotani-data-${dataType}-${
        new Date().toISOString().split("T")[0]
      }.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
    };

    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Fallback: buka di window baru
    const pdfContent = generatePDFContent(data, dataType);
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
};
