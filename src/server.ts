import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";



const PORT = config.port;
async function main() {
    try {
        await prisma.$connect();
        console.log("Database connected");
        app.listen(PORT , ()=> {
            console.log(`Server is listening on port ${PORT}`);
        })
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
    
}

main();