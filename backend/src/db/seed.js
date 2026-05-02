import { pool } from './pool.js';

const descriptions = {
  serum:
    'A lightweight treatment designed to layer easily, leave skin feeling fresh, and support a polished everyday glow.',
  makeup:
    'A smooth color essential with buildable payoff, comfortable wear, and shades made for quick daily looks.',
  skin:
    'A gentle skincare staple made for daily routines, soft texture, and a clean finish under makeup.',
};

const products = [
  {
    name: 'Dewdrop Glow Serum',
    description: descriptions.serum,
    price: 32,
    imageUrls: ['/products/beauty_01.png'],
    category: 'Skincare',
    subCategory: 'Serums',
    sizes: ['30ML', '50ML'],
    bestseller: true,
  },
  {
    name: 'Velvet Rose Lipstick',
    description: descriptions.makeup,
    price: 24,
    imageUrls: ['/products/beauty_02.png'],
    category: 'Makeup',
    subCategory: 'Lips',
    sizes: ['Rose', 'Berry', 'Nude'],
    bestseller: true,
  },
  {
    name: 'Soft Veil Powder Compact',
    description: descriptions.makeup,
    price: 29,
    imageUrls: ['/products/beauty_03.png'],
    category: 'Makeup',
    subCategory: 'Face',
    sizes: ['Light', 'Medium', 'Tan'],
    bestseller: true,
  },
  {
    name: 'Daily Shield SPF Cream',
    description: descriptions.skin,
    price: 27,
    imageUrls: ['/products/beauty_04.png'],
    category: 'Skincare',
    subCategory: 'SPF',
    sizes: ['50ML', '100ML'],
    bestseller: true,
  },
  {
    name: 'Citrus Bright Vitamin C',
    description: descriptions.serum,
    price: 36,
    imageUrls: ['/products/beauty_05.png'],
    category: 'Skincare',
    subCategory: 'Serums',
    sizes: ['30ML', '50ML'],
    bestseller: true,
  },
  {
    name: 'Rose Muse Lip Color',
    description: descriptions.makeup,
    price: 22,
    imageUrls: ['/products/beauty_06.png'],
    category: 'Makeup',
    subCategory: 'Lips',
    sizes: ['Rose', 'Plum', 'Coral'],
    bestseller: false,
  },
  {
    name: 'Calm Clean Gel Cleanser',
    description: descriptions.skin,
    price: 21,
    imageUrls: ['/products/beauty_07.png'],
    category: 'Skincare',
    subCategory: 'Cleansers',
    sizes: ['100ML', '150ML'],
    bestseller: false,
  },
  {
    name: 'Air Tint Finishing Powder',
    description: descriptions.makeup,
    price: 31,
    imageUrls: ['/products/beauty_08.png'],
    category: 'Makeup',
    subCategory: 'Face',
    sizes: ['Fair', 'Neutral', 'Deep'],
    bestseller: false,
  },
  {
    name: 'Night Repair Oil Drops',
    description: descriptions.serum,
    price: 38,
    imageUrls: ['/products/beauty_09.png'],
    category: 'Skincare',
    subCategory: 'Serums',
    sizes: ['30ML', '50ML'],
    bestseller: false,
  },
  {
    name: 'Silk Matte Lipstick',
    description: descriptions.makeup,
    price: 25,
    imageUrls: ['/products/beauty_10.png'],
    category: 'Makeup',
    subCategory: 'Lips',
    sizes: ['Mauve', 'Red', 'Nude'],
    bestseller: false,
  },
  {
    name: 'Hydra Cloud Moisturizer',
    description: descriptions.skin,
    price: 34,
    imageUrls: ['/products/beauty_11.png'],
    category: 'Skincare',
    subCategory: 'Moisturizers',
    sizes: ['50ML', '75ML'],
    bestseller: false,
  },
  {
    name: 'Petal Flush Blush Compact',
    description: descriptions.makeup,
    price: 28,
    imageUrls: ['/products/beauty_12.png'],
    category: 'Makeup',
    subCategory: 'Face',
    sizes: ['Peach', 'Pink', 'Berry'],
    bestseller: false,
  },
];

async function seed() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM products');

  if (rows[0].count > 0) {
    const legacy = await pool.query(
      "SELECT COUNT(*)::int AS count FROM products WHERE category = ANY($1::text[])",
      [['Men', 'Women', 'Kids']],
    );

    if (legacy.rows[0].count !== rows[0].count) {
      console.log('Products table already has custom data. Seed skipped.');
      return;
    }

    await pool.query("DELETE FROM products WHERE category = ANY($1::text[])", [['Men', 'Women', 'Kids']]);
    console.log('Removed legacy fashion demo products.');
  }

  for (const product of products) {
    await pool.query(
      `INSERT INTO products
        (name, description, price, image_urls, category, sub_category, sizes, bestseller)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        product.name,
        product.description,
        product.price,
        product.imageUrls,
        product.category,
        product.subCategory,
        product.sizes,
        product.bestseller,
      ],
    );
  }

  console.log(`Seeded ${products.length} beauty products.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
