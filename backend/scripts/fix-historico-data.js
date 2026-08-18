// Migração one-shot: converte `historico.data` (String "YYYY-MM-DDTHH:mm:ss")
// para Date válido, conforme o schema novo do modelo history.js.
// Uso: node scripts/fix-historico-data.js (a partir da pasta backend, com .env carregado)
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI não definida em .env");

    const conn = await mongoose.createConnection(uri).asPromise();
    const col = conn.collection("historico");

    const docs = await col.find({}).toArray();
    let updated = 0;
    let invalid = 0;

    for (const doc of docs) {
        const raw = doc.data;
        if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
            continue;
        }
        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) {
            console.warn(`historico ${doc._id}: data inválida "${raw}" — ignorado`);
            invalid++;
            continue;
        }
        await col.updateOne({ _id: doc._id }, { $set: { data: date } });
        updated++;
        console.log(`atualizado ${doc._id}: "${raw}" -> ${date.toISOString()}`);
    }

    // Verificação: tipo dos valores atuais
    const after = await col.find({}, { projection: { data: 1 } }).limit(5).toArray();
    console.log("amostra pós-migração:", after.map((d) => d.data));

    await conn.close();
    console.log(`Backfill concluído: ${updated} atualizados, ${invalid} inválidos.`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});