const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Generate a valid base58 pubkey string (32 bytes)
    const mockPubkey = '22222222222222222222222222222222';

    const user = await prisma.user.create({
        data: {
            email: 'demo2@sipheron.io',
            password: 'hashed_password_demo',
            organizations: {
                create: {
                    name: "SipHeron Open Source V2",
                    solanaPubkey: mockPubkey
                }
            }
        },
        include: { organizations: true }
    });

    await prisma.apiKey.create({
        data: {
            key: 'sipheron_dev_key_456',
            name: 'Demo Key 2',
            userId: user.id,
            organizationId: user.organizations[0].id
        }
    });

    console.log('Created User, Org, and DB-linked API Key: sipheron_dev_key_456');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
