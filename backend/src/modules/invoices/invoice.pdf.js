import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Generates a PDF buffer from an invoice object using Puppeteer.
 * Note for production deployment (e.g. Render / Heroku):
 * Puppeteer requires Chromium binaries. If running in a Docker container or Render Free Tier,
 * PUPPETEER_EXECUTABLE_PATH environment variable may need to be set or buildpacks added.
 */
export const generateInvoicePdf = async (invoice) => {
  let browser = null;
  try {
    const templatePath = path.join(__dirname, '../../templates/invoice.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Build item rows HTML
    const itemsRowsHtml = (invoice.items || [])
      .map(
        (item) => `
        <tr>
          <td>${escapeHtml(item.description)}</td>
          <td class="qty">${item.quantity}</td>
          <td class="rate">$${Number(item.rate).toFixed(2)}</td>
          <td class="amount">$${Number(item.amount).toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const formattedIssueDate = new Date(invoice.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const formattedDueDate = new Date(invoice.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const companyName = invoice.user?.companyName || 'InvoiceFlow Services';
    const clientName = invoice.client?.name || 'Valued Client';
    const clientCompany = invoice.client?.company || '';
    const clientEmail = invoice.client?.email || '';
    const clientAddress = invoice.client?.address || '';
    const clientGstin = invoice.client?.gstin || '';
    const notes = invoice.notes || 'Payment is due within the terms specified above.';

    // Replace tokens
    htmlTemplate = htmlTemplate
      .replace(/{{companyName}}/g, escapeHtml(companyName))
      .replace(/{{invoiceNumber}}/g, escapeHtml(invoice.invoiceNumber))
      .replace(/{{issueDate}}/g, escapeHtml(formattedIssueDate))
      .replace(/{{dueDate}}/g, escapeHtml(formattedDueDate))
      .replace(/{{clientName}}/g, escapeHtml(clientName))
      .replace(/{{clientCompany}}/g, clientCompany ? escapeHtml(clientCompany) : '')
      .replace(/{{clientEmail}}/g, escapeHtml(clientEmail))
      .replace(/{{clientAddress}}/g, clientAddress ? escapeHtml(clientAddress) : '')
      .replace(/{{clientGstin}}/g, clientGstin ? escapeHtml(clientGstin) : '')
      .replace(/{{itemsRows}}/g, itemsRowsHtml)
      .replace(/{{subtotal}}/g, Number(invoice.subtotal).toFixed(2))
      .replace(/{{taxPercent}}/g, invoice.taxPercent || 0)
      .replace(/{{taxAmount}}/g, Number(invoice.taxAmount).toFixed(2))
      .replace(/{{total}}/g, Number(invoice.total).toFixed(2))
      .replace(/{{notes}}/g, escapeHtml(notes));

    // Handle optional template conditionals simple replace
    htmlTemplate = htmlTemplate
      .replace(/{{#if clientCompany}}([\s\S]*?){{\/if}}/g, clientCompany ? '$1' : '')
      .replace(/{{#if clientAddress}}([\s\S]*?){{\/if}}/g, clientAddress ? '$1' : '')
      .replace(/{{#if clientGstin}}([\s\S]*?){{\/if}}/g, clientGstin ? '$1' : '');

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px',
      },
    });

    return pdfBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
