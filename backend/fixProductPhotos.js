const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Product = require('./models/Product');
const manifest = require('./productPhotoManifest.json');

async function main() {
  try {
    if (!process.env.MONGO_URI) throw new Error('Missing MONGO_URI');
    for (const item of manifest) {
      const localFile = path.join(__dirname, '..', 'frontend', 'public', 'products', item.file);
      if (!fs.existsSync(localFile)) throw new Error(`Missing photo: ${item.file}`);
    }
    // Reuse one connection for this maintenance operation.
    await mongoose.connect(process.env.MONGO_URI);
    const products = await Product.find({ name: { $in: manifest.map(item => item.name) } })
      .select('_id name image').lean();
    const backupFile = path.join(__dirname, `product-photo-backup-${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(products, null, 2), { flag: 'wx' });
    console.log(`Saved previous image paths: ${path.basename(backupFile)}`);
    let matched = 0;
    for (const item of manifest) {
      const result = await Product.updateMany(
        { name: item.name },
        { $set: { image: `/products/${item.file}` } },
        { runValidators: true }
      );
      matched += result.matchedCount;
      console.log(`${result.matchedCount ? 'OK' : 'NOT FOUND'}: ${item.name}`);
    }
    console.log(`Done. ${matched} products matched. Refresh the frontend.`);
  } catch (error) {
    console.error('Photo update failed. Check that photos were copied, backend/.env is configured, and MongoDB is reachable.');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
