import { prisma } from '../src/config/db.js';

async function seedClients() {
  const user = await prisma.user.findFirst({
    where: { email: 'raj@example.com' },
  });

  if (!user) {
    console.error('User raj@example.com not found!');
    process.exit(1);
  }

  const clientsData = [
    {
      userId: user.id,
      name: 'Acme Corporation',
      email: 'billing@acmecorp.com',
      company: 'Acme Corporation',
      address: '742 Evergreen Terrace, Springfield, OR 97477',
      gstin: '27AACCA1234F1Z5',
    },
    {
      userId: user.id,
      name: 'Nexus Creative Studio',
      email: 'hello@nexuscreative.io',
      company: 'Nexus Creative LLC',
      address: '100 Tech Plaza, Suite 300, San Francisco, CA 94107',
      gstin: '07BCCPN5678K1Z9',
    },
    {
      userId: user.id,
      name: 'Starlight Digital',
      email: 'finance@starlightdigital.com',
      company: 'Starlight Digital Media',
      address: '45 Market Street, Floor 12, Austin, TX 78701',
      gstin: '29AAACS9012M1Z3',
    },
    {
      userId: user.id,
      name: 'Elevate Commerce',
      email: 'accounts@elevatecommerce.co',
      company: 'Elevate Commerce Solutions',
      address: '88 Pine Avenue, Seattle, WA 98101',
      gstin: '33AAEEC3456P1Z7',
    },
    {
      userId: user.id,
      name: 'Vanguard Innovations',
      email: 'invoices@vanguardinnovations.com',
      company: 'Vanguard Innovations Inc.',
      address: '500 Financial Way, Chicago, IL 60601',
      gstin: '19AABCV7890R1Z2',
    },
  ];

  console.log(`Seeding 5 clients for user: ${user.email} (${user.id})...`);

  for (const data of clientsData) {
    const created = await prisma.client.create({ data });
    console.log(`✓ Created client: ${created.name} (${created.id})`);
  }

  console.log('🎉 Successfully seeded 5 clients!');
  process.exit(0);
}

seedClients().catch((err) => {
  console.error('Error seeding clients:', err);
  process.exit(1);
});
