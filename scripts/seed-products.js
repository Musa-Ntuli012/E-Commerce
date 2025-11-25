/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const { FieldValue } = require('firebase-admin/firestore');

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error(
    `⚠️  Service account file not found at ${serviceAccountPath}. \n` +
      'Create a Firebase service account key and either store it at the project root as serviceAccountKey.json\n' +
      'or pass FIREBASE_SERVICE_ACCOUNT_PATH=/path/to/key.json when running the seed command.'
  );
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const productsPath = path.resolve(__dirname, 'sample-products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

async function seedProducts() {
  console.log(`📦 Seeding ${products.length} products to Firestore...`);

  let batch = db.batch();
  let writes = 0;

  for (const product of products) {
    const docRef = db.collection('products').doc(product.id || slugify(product.name));
    const keywords = [
      ...new Set(
        `${product.name} ${product.category} ${product.brand || ''}`
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean)
      ),
    ];

    batch.set(docRef, {
      ...product,
      keywords,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    writes++;

    if (writes % 400 === 0) {
      await batch.commit();
      batch = db.batch();
      console.log(`✔️  Seeded ${writes} products...`);
    }
  }

  await batch.commit();
  console.log('🎉 All products seeded successfully!');
  process.exit(0);
}

seedProducts().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

