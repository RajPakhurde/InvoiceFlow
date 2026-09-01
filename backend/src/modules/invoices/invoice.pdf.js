import PDFDocument from 'pdfkit';

/**
 * Generates a clean, professional PDF buffer for an invoice using PDFKit.
 * Pure JavaScript - 0 external binary or Chrome dependencies.
 */
export const generateInvoicePdf = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', (err) => reject(err));

      const primaryColor = '#2563eb';
      const darkColor = '#0f172a';
      const grayColor = '#64748b';
      const lightBg = '#f8fafc';

      // --- HEADER ---
      doc.fillColor(primaryColor).fontSize(22).font('Helvetica-Bold').text('InvoiceFlow', 40, 40);
      doc.fillColor(darkColor).fontSize(16).text(`INVOICE ${invoice.invoiceNumber || ''}`, 300, 40, { align: 'right' });

      // Status Badge
      const statusUpper = (invoice.status || 'DRAFT').toUpperCase();
      doc.fillColor(grayColor).fontSize(9).font('Helvetica-Bold').text(`STATUS: ${statusUpper}`, 300, 62, { align: 'right' });

      // Line divider
      doc.moveTo(40, 80).lineTo(555, 80).strokeColor('#e2e8f0').lineWidth(1).stroke();

      // --- DETAILS GRID ---
      let y = 95;

      // Left: Billed From
      doc.fillColor(grayColor).fontSize(9).font('Helvetica-Bold').text('BILLED FROM', 40, y);
      doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text(invoice.user?.companyName || 'InvoiceFlow Business', 40, y + 14);
      doc.fillColor(grayColor).fontSize(9).font('Helvetica').text(invoice.user?.name || '', 40, y + 27);
      doc.fillColor(grayColor).fontSize(9).text(invoice.user?.email || '', 40, y + 39);

      // Center: Billed To
      doc.fillColor(grayColor).fontSize(9).font('Helvetica-Bold').text('BILLED TO', 210, y);
      doc.fillColor(darkColor).fontSize(10).font('Helvetica-Bold').text(invoice.client?.name || 'Valued Client', 210, y + 14);
      doc.fillColor(grayColor).fontSize(9).font('Helvetica').text(invoice.client?.company || '', 210, y + 27);
      doc.fillColor(grayColor).fontSize(9).text(invoice.client?.email || '', 210, y + 39);

      // Right: Dates
      doc.fillColor(grayColor).fontSize(9).font('Helvetica-Bold').text('INVOICE DETAILS', 400, y);
      const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
      doc.fillColor(darkColor).fontSize(9).font('Helvetica').text(`Issue Date: ${formatDate(invoice.issueDate)}`, 400, y + 14);
      doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 400, y + 27);

      // --- ITEMS TABLE ---
      y = 160;

      // Table Header Background
      doc.rect(40, y, 515, 22).fill('#2563eb');
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold');
      doc.text('Description', 50, y + 6);
      doc.text('Qty', 330, y + 6, { width: 30, align: 'center' });
      doc.text('Rate', 380, y + 6, { width: 70, align: 'right' });
      doc.text('Amount', 470, y + 6, { width: 75, align: 'right' });

      y += 22;

      // Table Rows
      const items = invoice.items || [];
      items.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.rect(40, y, 515, 20).fill(lightBg);
        }

        doc.fillColor(darkColor).fontSize(9).font('Helvetica');
        doc.text(item.description || 'Service', 50, y + 5, { width: 270 });
        doc.text(String(item.quantity || 1), 330, y + 5, { width: 30, align: 'center' });
        doc.text(`$${Number(item.rate || 0).toFixed(2)}`, 380, y + 5, { width: 70, align: 'right' });
        doc.text(`$${Number(item.amount || 0).toFixed(2)}`, 470, y + 5, { width: 75, align: 'right' });

        y += 20;
      });

      // Line divider
      doc.moveTo(40, y + 5).lineTo(555, y + 5).strokeColor('#e2e8f0').lineWidth(1).stroke();
      y += 15;

      // --- SUMMARY TOTALS ---
      const summaryX = 350;
      doc.fillColor(grayColor).fontSize(9).font('Helvetica').text('Subtotal:', summaryX, y);
      doc.fillColor(darkColor).text(`$${Number(invoice.subtotal || 0).toFixed(2)}`, 470, y, { width: 75, align: 'right' });
      y += 15;

      if (Number(invoice.taxAmount) > 0 || Number(invoice.taxPercent) > 0) {
        doc.fillColor(grayColor).text(`Tax (${invoice.taxPercent || 0}%):`, summaryX, y);
        doc.fillColor(darkColor).text(`$${Number(invoice.taxAmount || 0).toFixed(2)}`, 470, y, { width: 75, align: 'right' });
        y += 15;
      }

      // Total Box Background
      doc.rect(summaryX - 10, y - 4, 215, 26).fill('#f8fafc');
      doc.fillColor(primaryColor).fontSize(11).font('Helvetica-Bold').text('Total Due:', summaryX, y + 3);
      doc.text(`$${Number(invoice.total || 0).toFixed(2)}`, 470, y + 3, { width: 75, align: 'right' });

      y += 35;

      // --- NOTES ---
      if (invoice.notes) {
        doc.fillColor(grayColor).fontSize(9).font('Helvetica-Bold').text('NOTES & PAYMENT TERMS', 40, y);
        doc.fillColor(darkColor).fontSize(8.5).font('Helvetica').text(invoice.notes, 40, y + 12, { width: 515 });
      }

      // --- FOOTER ---
      doc.fillColor(grayColor).fontSize(8).font('Helvetica').text('Thank you for your business! Powered by InvoiceFlow.', 40, 780, { align: 'center', width: 515 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
