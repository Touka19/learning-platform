const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Комп'ютерні науки" },
        { name: "Музика" },
        { name: "Фітнесс" },
        { name: "Фотографія" },
        { name: "Фінанси" },
        { name: "Інженерія" },
        { name: "Кінематографія" },
      ]
    });

    console.log("Success");
  } catch (error) {
    console.log("Error seeding the database categories", error);
  } finally {
    await database.$disconnect();
  }
}

main();