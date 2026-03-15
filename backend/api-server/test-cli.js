require('dotenv').config();
const prisma = require('./src/config/database');
const crypto = require('crypto');

async function setup() {
  const user = await prisma.user.create({
    data: { id: crypto.randomUUID(), email: `cli-test-${Date.now()}@example.com`, password: 'hash' }
  });
  const org = await prisma.organization.create({
    data: { id: crypto.randomUUID(), name: 'CLI Test Org', solanaPubkey: `PUB_${Date.now()}`, ownerId: user.id }
  });
  const apiKey = await prisma.apiKey.create({
    data: { id: crypto.randomUUID(), key: 'sk_test_' + Date.now(), name: 'Test Key', organizationId: org.id }
  });
  console.log(apiKey.key);
}
setup().catch(console.error).finally(() => prisma.$disconnect());
