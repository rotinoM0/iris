// Migração one-shot: copia as collections do banco `test` para o banco `irisdb`,
// remove o índice órfão `email_1`, faz backfill de `imagem.public_id` e promove admin.
// Uso: node scripts/migrate-to-irisdb.js (a partir da pasta backend, com .env carregado)
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const COLLECTIONS = ["users", "items", "categories", "historico", "cores"];

const publicIdFromUrl = (url) => {
    try {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
        if (!match) return null;
        return match[1].replace(/\.[a-zA-Z0-9]+$/, "");
    } catch {
        return null;
    }
};

async function main() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI não definida em .env");

    const source = await mongoose.createConnection(uri, { dbName: "test" }).asPromise();
    const dest = await mongoose.createConnection(uri, { dbName: "irisdb" }).asPromise();

    console.log("origem:", source.name, "| destino:", dest.name);

    for (const name of COLLECTIONS) {
        const docs = await source.collection(name).find({}).toArray();
        const col = dest.collection(name);
        await col.deleteMany({});
        for (let i = 0; i < docs.length; i += 500) {
            await col.insertMany(docs.slice(i, i + 500));
        }
        console.log(`copiado ${name}: ${docs.length}`);
    }

    const users = dest.collection("users");
    try {
        await users.dropIndex("email_1");
        console.log("dropIndex email_1 ok");
    } catch (e) {
        console.log(`dropIndex email_1: ${e.message}`);
    }

    const adminRes = await users.updateOne({ nome: "Matheus" }, { $set: { cargo: "admin" } });
    console.log(`promoção admin (Matheus): matched=${adminRes.matchedCount} modified=${adminRes.modifiedCount}`);

    const items = dest.collection("items");
    const toFix = await items.find({ "imagem.url": { $exists: true, $ne: "" } }).toArray();
    for (const it of toFix) {
        const publicId = it.imagem?.public_id || publicIdFromUrl(it.imagem?.url);
        if (!publicId) {
            console.warn(`item ${it._id}: sem public_id (url: ${it.imagem?.url})`);
            continue;
        }
        await items.updateOne(
            { _id: it._id },
            { $set: { "imagem.public_id": publicId }, $unset: { "imagem._id": "" } }
        );
        console.log(`backfill public_id item ${it._id}: ${publicId}`);
    }

    let ok = true;
    for (const name of COLLECTIONS) {
        const sc = await source.collection(name).countDocuments();
        const dc = await dest.collection(name).countDocuments();
        if (sc !== dc) {
            ok = false;
            console.warn(`DIVERGÊNCIA ${name}: ${sc} -> ${dc}`);
        } else {
            console.log(`ok ${name}: ${dc}`);
        }
    }

    await source.close();
    await dest.close();
    console.log(ok ? "Migração concluída com sucesso." : "Migração concluída COM AVISOS.");
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});