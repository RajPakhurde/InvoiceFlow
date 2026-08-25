import bcrypt from 'bcrypt';
import { prisma } from '../src/config/db.js';

async function main() {
  console.log('🌱 Starting portfolio demo data seed script...');

  const demoEmail = 'demo@invoiceflow.app';
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Upsert Demo User
  let user = await prisma.user.findFirst({
    where: { email: demoEmail },
  });

  if (user) {
    console.log(`ℹ️ Demo user ${demoEmail} already exists. Cleaning up existing demo records...`);
    // Clean existing user's invoices & expenses
    await prisma.invoiceItem.deleteMany({ where: { invoice: { userId: user.id } } });
    await prisma.invoice.deleteMany({ where: { userId: user.id } });
    await prisma.expense.deleteMany({ where: { userId: user.id } });
    await prisma.client.deleteMany({ where: { userId: user.id } });

    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: 'Alex Morgan',
        passwordHash: hashedPassword,
        companyName: 'Apex Digital Studio',
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        email: demoEmail,
        name: 'Alex Morgan',
        passwordHash: hashedPassword,
        companyName: 'Apex Digital Studio',
      },
    });
  }

  console.log(`✓ Demo User initialized: ${user.email} (${user.id})`);

  // 2. Create 4 Realistic Clients
  const clientsData = [
    {
      name: 'Pixel & Byte Labs',
      email: 'billing@pixelandbyte.io',
      company: 'Pixel & Byte LLC',
      address: '100 Technology Plaza, Suite 400\nSan Francisco, CA 94107',
      gstin: '07BCCPN5678K1Z9',
    },
    {
      name: 'Summit Commerce Group',
      email: 'accounts@summitcommerce.co',
      company: 'Summit Commerce Inc.',
      address: '450 Market Street, Suite 1200\nAustin, TX 78701',
      gstin: '29AAACS9012M1Z3',
    },
    {
      name: 'Horizon Tech Systems',
      email: 'invoices@horizontech.com',
      company: 'Horizon Systems Corp.',
      address: '88 Pine Avenue, Floor 8\nSeattle, WA 98101',
      gstin: '33AAEEC3456P1Z7',
    },
    {
      name: 'Aura Creative Co.',
      email: 'hello@auracreative.studio',
      company: 'Aura Creative Agency',
      address: '742 Michigan Avenue\nChicago, IL 60601',
      gstin: '19AABCV7890R1Z2',
    },
  ];

  const createdClients = [];
  for (const clientData of clientsData) {
    const client = await prisma.client.create({
      data: {
        userId: user.id,
        ...clientData,
      },
    });
    createdClients.push(client);
    console.log(`  ✓ Client created: ${client.name}`);
  }

  const [pixelByte, summit, horizon, aura] = createdClients;

  // 3. Create 10 Realistic Invoices across the last 12 months
  const now = new Date();
  const getMonthDate = (monthsAgo, day = 15) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    return d;
  };

  const invoicesData = [
    // Paid Invoices (Historical Revenue)
    {
      client: pixelByte,
      invoiceNumber: 'INV-0001',
      status: 'paid',
      issueDate: getMonthDate(11, 1),
      dueDate: getMonthDate(11, 15),
      paidAt: getMonthDate(11, 10),
      sentAt: getMonthDate(11, 2),
      taxPercent: 10,
      notes: 'Payment received with thanks. Sprint 1 & 2 UI redesign completed.',
      items: [
        { description: 'UX Audit & Wireframing', quantity: 1, rate: 2500 },
        { description: 'Design System & Tailwind Component Library', quantity: 1, rate: 4500 },
      ],
    },
    {
      client: summit,
      invoiceNumber: 'INV-0002',
      status: 'paid',
      issueDate: getMonthDate(9, 5),
      dueDate: getMonthDate(9, 20),
      paidAt: getMonthDate(9, 18),
      sentAt: getMonthDate(9, 6),
      taxPercent: 10,
      notes: 'E-commerce platform migration milestone 1.',
      items: [
        { description: 'Custom Shopify Theme Development', quantity: 1, rate: 6000 },
        { description: 'Data Migration & Product Catalog Sync', quantity: 12, rate: 150 },
      ],
    },
    {
      client: horizon,
      invoiceNumber: 'INV-0003',
      status: 'paid',
      issueDate: getMonthDate(7, 10),
      dueDate: getMonthDate(7, 25),
      paidAt: getMonthDate(7, 22),
      sentAt: getMonthDate(7, 11),
      taxPercent: 10,
      notes: 'Cloud architecture & microservices consultation.',
      items: [
        { description: 'AWS Infrastructure Automation (Terraform)', quantity: 25, rate: 160 },
        { description: 'CI/CD Pipeline Setup (GitHub Actions)', quantity: 1, rate: 2000 },
      ],
    },
    {
      client: aura,
      invoiceNumber: 'INV-0004',
      status: 'paid',
      issueDate: getMonthDate(5, 1),
      dueDate: getMonthDate(5, 15),
      paidAt: getMonthDate(5, 12),
      sentAt: getMonthDate(5, 2),
      taxPercent: 10,
      notes: 'Brand identity & web app MVP build.',
      items: [
        { description: 'React Dashboard Frontend Development', quantity: 1, rate: 5500 },
        { description: 'Node.js REST API & Database Setup', quantity: 1, rate: 4000 },
      ],
    },
    {
      client: pixelByte,
      invoiceNumber: 'INV-0005',
      status: 'paid',
      issueDate: getMonthDate(3, 10),
      dueDate: getMonthDate(3, 25),
      paidAt: getMonthDate(3, 20),
      sentAt: getMonthDate(3, 11),
      taxPercent: 10,
      notes: 'Mobile app webview integration.',
      items: [
        { description: 'React Native WebView Wrapper', quantity: 1, rate: 3200 },
        { description: 'Push Notification Integration', quantity: 1, rate: 1800 },
      ],
    },
    {
      client: summit,
      invoiceNumber: 'INV-0006',
      status: 'paid',
      issueDate: getMonthDate(1, 5),
      dueDate: getMonthDate(1, 20),
      paidAt: getMonthDate(1, 15),
      sentAt: getMonthDate(1, 6),
      taxPercent: 10,
      notes: 'Quarterly optimization & maintenance retainer.',
      items: [
        { description: 'Performance & Core Web Vitals Optimization', quantity: 1, rate: 3500 },
        { description: 'Security Hardening & Dependency Audits', quantity: 1, rate: 1500 },
      ],
    },

    // Sent / Outstanding Invoices
    {
      client: horizon,
      invoiceNumber: 'INV-0007',
      status: 'sent',
      issueDate: getMonthDate(0, 5),
      dueDate: getMonthDate(0, 25),
      sentAt: getMonthDate(0, 6),
      paidAt: null,
      taxPercent: 10,
      notes: 'Payment due within 20 days per contract agreement.',
      items: [
        { description: 'Full Stack Feature Development - Sprint 4', quantity: 40, rate: 125 },
        { description: 'Automated E2E Testing Suite (Playwright)', quantity: 1, rate: 2500 },
      ],
    },

    // Overdue Invoices
    {
      client: aura,
      invoiceNumber: 'INV-0008',
      status: 'overdue',
      issueDate: getMonthDate(2, 1),
      dueDate: getMonthDate(1, 1),
      sentAt: getMonthDate(2, 2),
      paidAt: null,
      taxPercent: 10,
      notes: 'OVERDUE: Reminder sent on 1st of last month.',
      items: [
        { description: 'Custom CMS Plugin Development', quantity: 1, rate: 2800 },
        { description: 'SEO & Analytics Integration', quantity: 1, rate: 1200 },
      ],
    },

    // Draft Invoices
    {
      client: pixelByte,
      invoiceNumber: 'INV-0009',
      status: 'draft',
      issueDate: getMonthDate(0, 20),
      dueDate: getMonthDate(-1, 5),
      sentAt: null,
      paidAt: null,
      taxPercent: 10,
      notes: 'Draft scope for upcoming Q4 retainer.',
      items: [
        { description: 'Q4 Product Roadmap & Architecture Planning', quantity: 20, rate: 150 },
      ],
    },
    {
      client: summit,
      invoiceNumber: 'INV-0010',
      status: 'draft',
      issueDate: getMonthDate(0, 22),
      dueDate: getMonthDate(-1, 10),
      sentAt: null,
      paidAt: null,
      taxPercent: 10,
      notes: 'Draft estimate for payment gateway integration.',
      items: [
        { description: 'Stripe & Razorpay Payment Integration', quantity: 1, rate: 4200 },
      ],
    },
  ];

  console.log('📄 Creating demo invoices and line items...');
  for (const inv of invoicesData) {
    const itemsWithAmount = inv.items.map((i) => ({
      description: i.description,
      quantity: i.quantity,
      rate: i.rate,
      amount: i.quantity * i.rate,
    }));

    const subtotal = itemsWithAmount.reduce((sum, i) => sum + i.amount, 0);
    const taxAmount = subtotal * (inv.taxPercent / 100);
    const total = subtotal + taxAmount;

    await prisma.invoice.create({
      data: {
        userId: user.id,
        clientId: inv.client.id,
        invoiceNumber: inv.invoiceNumber,
        status: inv.status,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        sentAt: inv.sentAt,
        paidAt: inv.paidAt,
        taxPercent: inv.taxPercent,
        subtotal,
        taxAmount,
        total,
        notes: inv.notes,
        items: {
          create: itemsWithAmount,
        },
      },
    });
    console.log(`  ✓ Invoice created: ${inv.invoiceNumber} (${inv.status}) - $${total.toFixed(2)}`);
  }

  // 4. Create 14 Realistic Expenses across categories & last 12 months
  const expensesData = [
    { category: 'Software', amount: 299, date: getMonthDate(11, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Subscriptions', amount: 49, date: getMonthDate(11, 15), note: 'ChatGPT Plus & Figma Pro' },
    { category: 'Equipment', amount: 1499, date: getMonthDate(10, 5), note: 'Apple MacBook Pro M3 Dock & Accessories' },
    { category: 'Software', amount: 299, date: getMonthDate(9, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Travel', amount: 350, date: getMonthDate(9, 14), note: 'Flight to Austin Tech Summit' },
    { category: 'Software', amount: 299, date: getMonthDate(7, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Marketing', amount: 650, date: getMonthDate(7, 20), note: 'Google Ads & LinkedIn Sponsored Posts' },
    { category: 'Subscriptions', amount: 49, date: getMonthDate(6, 15), note: 'ChatGPT Plus & Figma Pro' },
    { category: 'Office', amount: 420, date: getMonthDate(5, 10), note: 'Ergonomic Chair & Standing Desk Converter' },
    { category: 'Software', amount: 299, date: getMonthDate(4, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Travel', amount: 180, date: getMonthDate(3, 12), note: 'Client Lunch & Rideshare Reimbursements' },
    { category: 'Software', amount: 299, date: getMonthDate(2, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Marketing', amount: 800, date: getMonthDate(1, 10), note: 'Portfolio Site Redesign & SEO Campaign' },
    { category: 'Software', amount: 299, date: getMonthDate(0, 2), note: 'GitHub Enterprise & Vercel Pro' },
  ];

  console.log('💳 Creating demo expenses...');
  for (const exp of expensesData) {
    await prisma.expense.create({
      data: {
        userId: user.id,
        ...exp,
      },
    });
  }
  console.log(`  ✓ Created ${expensesData.length} expense entries`);

  console.log('\n🎉 Portfolio Demo Data Seeding Complete!');
  console.log('--------------------------------------------------');
  console.log(`Demo Account Login Credentials:`);
  console.log(`Email:    ${demoEmail}`);
  console.log(`Password: password123`);
  console.log('--------------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
