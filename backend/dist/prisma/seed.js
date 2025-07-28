"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const staffPassword = await bcrypt.hash('staff123', 10);
    await prisma.user.upsert({
        where: { email: 'admin@gopichandsalon.com' },
        update: {},
        create: {
            email: 'admin@gopichandsalon.com',
            password: adminPassword,
            name: 'Admin User',
            role: client_1.Role.ADMIN,
        },
    });
    await prisma.user.upsert({
        where: { email: 'staff@gopichandsalon.com' },
        update: {},
        create: {
            email: 'staff@gopichandsalon.com',
            password: staffPassword,
            name: 'Staff User',
            role: client_1.Role.STAFF,
        },
    });
    const services = [
        { name: 'Hair Cut', price: 100, duration: 30, description: 'Professional hair cutting service' },
        { name: 'Hair Wash', price: 50, duration: 15, description: 'Hair washing with premium shampoo' },
        { name: 'Shave', price: 80, duration: 20, description: 'Clean shave with quality products' },
        { name: 'Beard Trim', price: 60, duration: 15, description: 'Professional beard trimming' },
        { name: 'Hair Color', price: 300, duration: 60, description: 'Hair coloring service' },
        { name: 'Face Massage', price: 120, duration: 25, description: 'Relaxing face massage' },
        { name: 'Hair Styling', price: 150, duration: 45, description: 'Professional hair styling' },
        { name: 'Mustache Trim', price: 40, duration: 10, description: 'Mustache trimming service' },
    ];
    for (const service of services) {
        await prisma.service.upsert({
            where: { name: service.name },
            update: {},
            create: service,
        });
    }
    console.log('\n✅ Seed completed successfully.');
    console.log('🔐 Admin Login: admin@gopichandsalon.com / admin123');
    console.log('👨‍🔧 Staff Login: staff@gopichandsalon.com / staff123\n');
}
main()
    .catch((error) => {
    console.error('❌ Seed Error:', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map