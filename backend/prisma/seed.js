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

  // 2. Create 8 Realistic Clients
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
    {
      name: 'Vanguard Innovations',
      email: 'invoices@vanguardinnovations.com',
      company: 'Vanguard Innovations Inc.',
      address: '500 Financial Way, Floor 14\nNew York, NY 10005',
      gstin: '36AABCV1234K1Z5',
    },
    {
      name: 'Apex Cloud Solutions',
      email: 'billing@apexcloud.io',
      company: 'Apex Cloud Systems LLC',
      address: '1200 17th Street, Suite 800\nDenver, CO 80202',
      gstin: '08AAAPA9876C1Z1',
    },
    {
      name: 'Starlight Media Agency',
      email: 'finance@starlightmedia.com',
      company: 'Starlight Media Group',
      address: '9000 Sunset Blvd, Suite 300\nLos Angeles, CA 90069',
      gstin: '06BCCPS4321D1Z8',
    },
    {
      name: 'Nexus Growth Partners',
      email: 'accounts@nexusgrowth.co',
      company: 'Nexus Growth Ventures',
      address: '200 S Biscayne Blvd, Suite 1500\nMiami, FL 33131',
      gstin: '12AAACN6543M1Z9',
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

  const [pixelByte, summit, horizon, aura, vanguard, apexCloud, starlight, nexus] = createdClients;

  const now = new Date();
  const getMonthDate = (monthsAgo, day = 15) => {
    const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    return d;
  };
  const getDaysAgoDate = (daysAgo) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
    return d;
  };

  // 3. Create 18 Realistic Invoices spanning 2025-2026 across all 4 statuses
  const invoicesData = [
    // Paid Invoices (Historical Revenue 2025 & 2026)
    {
      client: pixelByte,
      invoiceNumber: 'INV-0001',
      status: 'paid',
      issueDate: getMonthDate(14, 1),
      dueDate: getMonthDate(14, 15),
      paidAt: getMonthDate(14, 10),
      sentAt: getMonthDate(14, 2),
      taxPercent: 10,
      notes: 'Payment received with thanks. UX Audit & Design System.',
      items: [
        { description: 'UX Audit & Wireframing', quantity: 1, rate: 2500 },
        { description: 'Design System & Tailwind Component Library', quantity: 1, rate: 4500 },
      ],
    },
    {
      client: summit,
      invoiceNumber: 'INV-0002',
      status: 'paid',
      issueDate: getMonthDate(12, 5),
      dueDate: getMonthDate(12, 20),
      paidAt: getMonthDate(12, 18),
      sentAt: getMonthDate(12, 6),
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
      issueDate: getMonthDate(10, 10),
      dueDate: getMonthDate(10, 25),
      paidAt: getMonthDate(10, 22),
      sentAt: getMonthDate(10, 11),
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
      issueDate: getMonthDate(8, 1),
      dueDate: getMonthDate(8, 15),
      paidAt: getMonthDate(8, 12),
      sentAt: getMonthDate(8, 2),
      taxPercent: 10,
      notes: 'Brand identity & web app MVP build.',
      items: [
        { description: 'React Dashboard Frontend Development', quantity: 1, rate: 5500 },
        { description: 'Node.js REST API & Database Setup', quantity: 1, rate: 4000 },
      ],
    },
    {
      client: vanguard,
      invoiceNumber: 'INV-0005',
      status: 'paid',
      issueDate: getMonthDate(6, 10),
      dueDate: getMonthDate(6, 25),
      paidAt: getMonthDate(6, 20),
      sentAt: getMonthDate(6, 11),
      taxPercent: 10,
      notes: 'Fintech portal analytics dashboard build.',
      items: [
        { description: 'Interactive Financial Charting Components', quantity: 1, rate: 4800 },
        { description: 'Security Compliance Audit & Penetration Fixes', quantity: 1, rate: 2200 },
      ],
    },
    {
      client: apexCloud,
      invoiceNumber: 'INV-0006',
      status: 'paid',
      issueDate: getMonthDate(5, 5),
      dueDate: getMonthDate(5, 20),
      paidAt: getMonthDate(5, 15),
      sentAt: getMonthDate(5, 6),
      taxPercent: 10,
      notes: 'DevOps & Docker containerization.',
      items: [
        { description: 'Kubernetes Cluster Provisioning', quantity: 1, rate: 5200 },
        { description: 'Prometheus & Grafana Monitoring Setup', quantity: 1, rate: 1800 },
      ],
    },
    {
      client: starlight,
      invoiceNumber: 'INV-0007',
      status: 'paid',
      issueDate: getMonthDate(4, 1),
      dueDate: getMonthDate(4, 15),
      paidAt: getMonthDate(4, 10),
      sentAt: getMonthDate(4, 2),
      taxPercent: 10,
      notes: 'Media streaming web application.',
      items: [
        { description: 'HLS Video Player Customization', quantity: 1, rate: 3600 },
        { description: 'Subscription Billing Portal', quantity: 1, rate: 2900 },
      ],
    },
    {
      client: nexus,
      invoiceNumber: 'INV-0008',
      status: 'paid',
      issueDate: getMonthDate(3, 12),
      dueDate: getMonthDate(3, 27),
      paidAt: getMonthDate(3, 24),
      sentAt: getMonthDate(3, 13),
      taxPercent: 10,
      notes: 'Venture portfolio site & CMS integration.',
      items: [
        { description: 'Next.js 14 SSG Website Development', quantity: 1, rate: 6500 },
        { description: 'Sanity.io Headless CMS Configuration', quantity: 1, rate: 2100 },
      ],
    },
    {
      client: pixelByte,
      invoiceNumber: 'INV-0009',
      status: 'paid',
      issueDate: getMonthDate(2, 5),
      dueDate: getMonthDate(2, 20),
      paidAt: getMonthDate(2, 18),
      sentAt: getMonthDate(2, 6),
      taxPercent: 10,
      notes: 'Mobile app webview integration.',
      items: [
        { description: 'React Native WebView Wrapper', quantity: 1, rate: 3200 },
        { description: 'Push Notification Integration', quantity: 1, rate: 1800 },
      ],
    },
    {
      client: summit,
      invoiceNumber: 'INV-0010',
      status: 'paid',
      issueDate: getMonthDate(1, 10),
      dueDate: getMonthDate(1, 25),
      paidAt: getMonthDate(1, 22),
      sentAt: getMonthDate(1, 11),
      taxPercent: 10,
      notes: 'Quarterly optimization & maintenance retainer.',
      items: [
        { description: 'Performance & Core Web Vitals Optimization', quantity: 1, rate: 3500 },
        { description: 'Security Hardening & Dependency Audits', quantity: 1, rate: 1500 },
      ],
    },
    {
      client: vanguard,
      invoiceNumber: 'INV-0011',
      status: 'paid',
      issueDate: getDaysAgoDate(12),
      dueDate: getDaysAgoDate(2),
      paidAt: getDaysAgoDate(5),
      sentAt: getDaysAgoDate(11),
      taxPercent: 10,
      notes: 'Recent sprint completion - Payment confirmed.',
      items: [
        { description: 'Payment Webhook Handler & Automated Reconciliation', quantity: 1, rate: 3800 },
      ],
    },

    // Sent / Outstanding Invoices (Active Cash Flow)
    {
      client: horizon,
      invoiceNumber: 'INV-0012',
      status: 'sent',
      issueDate: getDaysAgoDate(15),
      dueDate: getDaysAgoDate(-10),
      sentAt: getDaysAgoDate(14),
      paidAt: null,
      taxPercent: 10,
      notes: 'Payment due within 25 days per contract agreement.',
      items: [
        { description: 'Full Stack Feature Development - Sprint 4', quantity: 40, rate: 125 },
        { description: 'Automated E2E Testing Suite (Playwright)', quantity: 1, rate: 2500 },
      ],
    },
    {
      client: apexCloud,
      invoiceNumber: 'INV-0013',
      status: 'sent',
      issueDate: getDaysAgoDate(8),
      dueDate: getDaysAgoDate(-12),
      sentAt: getDaysAgoDate(7),
      paidAt: null,
      taxPercent: 10,
      notes: 'Cloud infrastructure expansion phase 2.',
      items: [
        { description: 'Multi-region Database Replication Setup', quantity: 1, rate: 4500 },
      ],
    },

    // Overdue Invoices (Collection Risk Alerts)
    {
      client: aura,
      invoiceNumber: 'INV-0014',
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
    {
      client: starlight,
      invoiceNumber: 'INV-0015',
      status: 'overdue',
      issueDate: getMonthDate(3, 15),
      dueDate: getMonthDate(2, 15),
      sentAt: getMonthDate(3, 16),
      paidAt: null,
      taxPercent: 10,
      notes: 'OVERDUE: Second follow-up sent to accounts department.',
      items: [
        { description: 'Video Asset CDN CDN Edge Caching Configuration', quantity: 1, rate: 3100 },
      ],
    },

    // Draft Invoices (Upcoming Work Pipelines)
    {
      client: nexus,
      invoiceNumber: 'INV-0016',
      status: 'draft',
      issueDate: getDaysAgoDate(2),
      dueDate: getDaysAgoDate(-20),
      sentAt: null,
      paidAt: null,
      taxPercent: 10,
      notes: 'Draft estimate for Q4 mobile app rebuild.',
      items: [
        { description: 'Flutter Cross-platform Mobile App Discovery Phase', quantity: 1, rate: 4200 },
      ],
    },
    {
      client: pixelByte,
      invoiceNumber: 'INV-0017',
      status: 'draft',
      issueDate: getDaysAgoDate(1),
      dueDate: getDaysAgoDate(-25),
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
      invoiceNumber: 'INV-0018',
      status: 'draft',
      issueDate: getDaysAgoDate(0),
      dueDate: getDaysAgoDate(-30),
      sentAt: null,
      paidAt: null,
      taxPercent: 10,
      notes: 'Draft proposal for payment link integration.',
      items: [
        { description: 'Stripe & Razorpay Payment Integration', quantity: 1, rate: 4800 },
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

  // 4. Create 22 Realistic Expenses across categories & 2025-2026
  const expensesData = [
    { category: 'Software', amount: 299, date: getMonthDate(14, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Subscriptions', amount: 49, date: getMonthDate(14, 15), note: 'ChatGPT Plus & Figma Pro' },
    { category: 'Equipment', amount: 1499, date: getMonthDate(13, 5), note: 'Apple MacBook Pro M3 Dock & Accessories' },
    { category: 'Software', amount: 299, date: getMonthDate(12, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Travel', amount: 450, date: getMonthDate(12, 14), note: 'Flight to Austin Tech Summit' },
    { category: 'Software', amount: 299, date: getMonthDate(10, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Marketing', amount: 650, date: getMonthDate(10, 20), note: 'Google Ads & LinkedIn Sponsored Posts' },
    { category: 'Subscriptions', amount: 49, date: getMonthDate(9, 15), note: 'ChatGPT Plus & Figma Pro' },
    { category: 'Office', amount: 420, date: getMonthDate(8, 10), note: 'Ergonomic Chair & Standing Desk Converter' },
    { category: 'Software', amount: 299, date: getMonthDate(7, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Travel', amount: 280, date: getMonthDate(6, 12), note: 'Client Dinner & Rideshare Reimbursements' },
    { category: 'Software', amount: 299, date: getMonthDate(5, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Marketing', amount: 850, date: getMonthDate(4, 10), note: 'Portfolio Site Redesign & SEO Campaign' },
    { category: 'Equipment', amount: 680, date: getMonthDate(3, 18), note: 'Dell UltraSharp 27" 4K Monitor' },
    { category: 'Software', amount: 299, date: getMonthDate(2, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Subscriptions', amount: 49, date: getMonthDate(2, 15), note: 'ChatGPT Plus & Figma Pro' },
    { category: 'Software', amount: 299, date: getMonthDate(1, 2), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Travel', amount: 320, date: getMonthDate(1, 20), note: 'Travel to Client Site in Chicago' },
    { category: 'Software', amount: 299, date: getDaysAgoDate(24), note: 'GitHub Enterprise & Vercel Pro' },
    { category: 'Subscriptions', amount: 49, date: getDaysAgoDate(15), note: 'ChatGPT Plus & Figma Pro' },
    { category: 'Office', amount: 180, date: getDaysAgoDate(8), note: 'High-speed Fiber Broadband & Supplies' },
    { category: 'Marketing', amount: 450, date: getDaysAgoDate(3), note: 'Digital Portfolio Promotion & Newsletter' },
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
