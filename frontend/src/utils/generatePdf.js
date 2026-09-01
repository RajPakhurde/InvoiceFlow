import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates and downloads a clean, professional PDF invoice directly in the browser
 * @param {Object} invoice - The invoice data object
 */
export const generateAndDownloadInvoicePdf = (invoice) => {
  if (!invoice) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let yPos = margin;

  // Colors
  const primaryColor = [37, 99, 235]; // #2563eb Blue
  const darkTextColor = [15, 23, 42]; // #0f172a Slate 900
  const grayTextColor = [100, 116, 139]; // #64748b Slate 500
  const borderColor = [226, 232, 240]; // #e2e8f0 Slate 200
  const bgLightColor = [248, 250, 252]; // #f8fafc Slate 50

  // Status Badge Colors
  const statusUpper = (invoice.status || 'DRAFT').toUpperCase();
  let statusBg = [241, 245, 249];
  let statusText = [71, 85, 105];

  if (statusUpper === 'PAID') {
    statusBg = [209, 250, 229]; // emerald-100
    statusText = [6, 95, 70]; // emerald-800
  } else if (statusUpper === 'PENDING') {
    statusBg = [254, 243, 199]; // amber-100
    statusText = [146, 64, 14]; // amber-800
  } else if (statusUpper === 'OVERDUE') {
    statusBg = [254, 226, 226]; // rose-100
    statusText = [153, 27, 27]; // rose-800
  }

  // --- HEADER SECTION ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...primaryColor);
  doc.text('InvoiceFlow', margin, yPos + 6);

  // Invoice Title & Status Right Aligned
  doc.setFontSize(16);
  doc.setTextColor(...darkTextColor);
  doc.text(`INVOICE ${invoice.invoiceNumber || ''}`, pageWidth - margin, yPos + 5, { align: 'right' });

  // Status Badge Box
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(...statusBg);
  doc.setTextColor(...statusText);
  const badgeWidth = 24;
  const badgeHeight = 7;
  doc.roundedRect(pageWidth - margin - badgeWidth, yPos + 8, badgeWidth, badgeHeight, 2, 2, 'F');
  doc.text(statusUpper, pageWidth - margin - (badgeWidth / 2), yPos + 12.8, { align: 'center' });

  yPos += 22;

  // Divider Line
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.4);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  yPos += 8;

  // --- ADDRESSES & DATES GRID ---
  const colWidth = (pageWidth - margin * 2) / 3;

  // FROM (User / Company)
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayTextColor);
  doc.text('BILLED FROM', margin, yPos);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(invoice.user?.companyName || 'InvoiceFlow Business', margin, yPos + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayTextColor);
  doc.text(invoice.user?.name || '', margin, yPos + 10);
  doc.text(invoice.user?.email || '', margin, yPos + 15);

  // TO (Client)
  const col2X = margin + colWidth;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...grayTextColor);
  doc.text('BILLED TO', col2X, yPos);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkTextColor);
  doc.text(invoice.client?.name || 'Valued Client', col2X, yPos + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayTextColor);

  let clientLineOffset = 10;
  if (invoice.client?.company) {
    doc.text(invoice.client.company, col2X, yPos + clientLineOffset);
    clientLineOffset += 4.5;
  }
  if (invoice.client?.email) {
    doc.text(invoice.client.email, col2X, yPos + clientLineOffset);
    clientLineOffset += 4.5;
  }
  if (invoice.client?.address) {
    const splitAddress = doc.splitTextToSize(invoice.client.address, colWidth - 5);
    doc.text(splitAddress, col2X, yPos + clientLineOffset);
    clientLineOffset += splitAddress.length * 4.5;
  }
  if (invoice.client?.gstin) {
    doc.text(`Tax ID: ${invoice.client.gstin}`, col2X, yPos + clientLineOffset);
  }

  // DATES & DETAILS
  const col3X = margin + colWidth * 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...grayTextColor);
  doc.text('INVOICE DETAILS', col3X, yPos);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, col3X, yPos + 5);
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, col3X, yPos + 10);

  yPos += Math.max(25, clientLineOffset + 5);

  // --- LINE ITEMS TABLE ---
  const tableData = (invoice.items || []).map((item) => [
    item.description || 'Service',
    item.quantity || 1,
    `$${Number(item.rate || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    `$${Number(item.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Qty', 'Rate', 'Amount']],
    body: tableData,
    margin: { left: margin, right: margin },
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: 3.5,
      textColor: darkTextColor,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { halign: 'center', width: 20 },
      2: { halign: 'right', width: 35 },
      3: { halign: 'right', width: 35 },
    },
    alternateRowStyles: {
      fillColor: bgLightColor,
    },
  });

  // Get position after table
  yPos = doc.lastAutoTable.finalY + 8;

  // --- TOTALS SUMMARY BOX ---
  const summaryWidth = 75;
  const summaryX = pageWidth - margin - summaryWidth;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayTextColor);

  // Subtotal
  doc.text('Subtotal:', summaryX, yPos);
  doc.text(`$${Number(invoice.subtotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - margin, yPos, { align: 'right' });
  yPos += 5;

  // Tax
  if (Number(invoice.taxAmount) > 0 || Number(invoice.taxPercent) > 0) {
    doc.text(`Tax (${invoice.taxPercent || 0}%):`, summaryX, yPos);
    doc.text(`$${Number(invoice.taxAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - margin, yPos, { align: 'right' });
    yPos += 5;
  }

  // Divider Line in Summary
  doc.setDrawColor(...borderColor);
  doc.line(summaryX, yPos, pageWidth - margin, yPos);
  yPos += 6;

  // Grand Total Box
  doc.setFillColor(...bgLightColor);
  doc.roundedRect(summaryX - 3, yPos - 4, summaryWidth + 3, 10, 2, 2, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Total Due:', summaryX, yPos + 2);
  doc.text(`$${Number(invoice.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - margin - 2, yPos + 2, { align: 'right' });

  yPos += 18;

  // --- NOTES & TERMS ---
  if (invoice.notes) {
    if (yPos > pageHeight - 35) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayTextColor);
    doc.text('NOTES & PAYMENT TERMS', margin, yPos);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkTextColor);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - margin * 2);
    doc.text(splitNotes, margin, yPos + 4.5);
  }

  // --- FOOTER ---
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayTextColor);
  doc.text('Thank you for your business! Powered by InvoiceFlow.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Trigger Download
  const filename = `${invoice.invoiceNumber || 'invoice'}.pdf`;
  doc.save(filename);
};
