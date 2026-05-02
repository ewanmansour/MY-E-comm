export function normalizeProductPayload(body) {
  const price = Number(body.price);
  const imageUrls = Array.isArray(body.imageUrls)
    ? body.imageUrls
    : String(body.imageUrls || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
  const sizes = Array.isArray(body.sizes)
    ? body.sizes
    : String(body.sizes || '')
        .split(',')
        .map((item) => item.trim().toUpperCase())
        .filter(Boolean);
  const stock = Number(body.stock ?? 20);

  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    price,
    imageUrls,
    category: String(body.category || '').trim(),
    subCategory: String(body.subCategory || body.sub_category || '').trim(),
    sizes,
    stock,
    bestseller: Boolean(body.bestseller),
    active: body.active === undefined ? true : Boolean(body.active),
  };
}

export function validateProduct(product) {
  const errors = [];

  if (!product.name) errors.push('Product name is required.');
  if (!product.description) errors.push('Description is required.');
  if (!Number.isFinite(product.price) || product.price < 0) errors.push('Price must be a positive number.');
  if (!Number.isInteger(product.stock) || product.stock < 0) errors.push('Stock must be a positive whole number.');
  if (product.imageUrls.length === 0) errors.push('At least one image URL is required.');
  if (!product.category) errors.push('Category is required.');
  if (!product.subCategory) errors.push('Sub category is required.');
  if (product.sizes.length === 0) errors.push('At least one shade or option is required.');

  return errors;
}
