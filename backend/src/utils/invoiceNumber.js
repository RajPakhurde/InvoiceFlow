export const generateInvoiceNumber = async (userId, prismaInstance) => {
  const lastInvoice = await prismaInstance.invoice.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { invoiceNumber: true },
  });

  if (!lastInvoice || !lastInvoice.invoiceNumber) {
    return 'INV-0001';
  }

  // Format expected: INV-XXXX
  const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
  if (!match) {
    return 'INV-0001';
  }

  const currentNumber = parseInt(match[1], 10);
  const nextNumber = currentNumber + 1;
  const paddedNumber = String(nextNumber).padStart(4, '0');

  return `INV-${paddedNumber}`;
};
