const OPENAI_RESPONSES_URL = 'https://api.openai.com/v1/responses';

function normalize(text) {
  return text.toLowerCase().trim();
}

function productLine(product) {
  return `${product.name} - ${product.category}/${product.subCategory} - $${product.price}`;
}

function pickProducts(message, products) {
  const text = normalize(message);
  let matches = products;

  if (text.includes('makeup') || text.includes('lip') || text.includes('powder') || text.includes('blush')) {
    matches = matches.filter((product) => product.category === 'Makeup');
  }

  if (text.includes('skin') || text.includes('serum') || text.includes('cleanser') || text.includes('moistur')) {
    matches = matches.filter((product) => product.category === 'Skincare');
  }

  if (text.includes('cheap') || text.includes('budget') || text.includes('low price')) {
    matches = [...matches].sort((a, b) => a.price - b.price);
  }

  if (text.includes('serum') || text.includes('glow') || text.includes('vitamin')) {
    matches = matches.filter((product) => product.subCategory === 'Serums');
  }

  if (text.includes('lip') || text.includes('lipstick')) {
    matches = matches.filter((product) => product.subCategory === 'Lips');
  }

  if (text.includes('face') || text.includes('powder') || text.includes('compact') || text.includes('blush')) {
    matches = matches.filter((product) => product.subCategory === 'Face');
  }

  if (text.includes('spf') || text.includes('sun') || text.includes('sunscreen')) {
    matches = matches.filter((product) => product.subCategory === 'SPF');
  }

  if (text.includes('cleanser') || text.includes('clean')) {
    matches = matches.filter((product) => product.subCategory === 'Cleansers');
  }

  if (text.includes('moisturizer') || text.includes('hydrate') || text.includes('hydrating')) {
    matches = matches.filter((product) => product.subCategory === 'Moisturizers');
  }

  return matches.slice(0, 4);
}

function fallbackReply(message, products) {
  const picks = pickProducts(message, products);

  if (picks.length === 0) {
    return 'I cannot find a matching beauty product right now. Try asking for makeup, skincare, lips, face, serum, SPF, cleanser, moisturizer, or a budget pick.';
  }

  const lines = picks.map((product) => `- ${productLine(product)}`).join('\n');

  return `Closest beauty picks:\n${lines}\n\nTell me your preferred shade, skin goal, or budget and I can narrow it down.`;
}

function buildInventory(products) {
  return products.slice(0, 30).map((product) => ({
    id: product._id,
    name: product.name,
    category: product.category,
    subCategory: product.subCategory,
    price: product.price,
    options: product.sizes,
    bestseller: product.bestseller,
  }));
}

function extractOpenAIText(data) {
  if (data.output_text) {
    return data.output_text;
  }

  return (data.output || [])
    .flatMap((item) => item.content || [])
    .map((content) => content.text || content.output_text || '')
    .filter(Boolean)
    .join('\n')
    .trim();
}

export async function answerAssistant({ message, history = [], products }) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackReply(message, products);
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5-mini',
        instructions:
          'You are a friendly beauty ecommerce shopping assistant. Reply in the same language as the customer. Recommend only products from the provided inventory, help with shades, skincare goals, and gifts, keep answers concise, and ask one useful follow-up when needed.',
        input: JSON.stringify({
          customerMessage: message,
          recentConversation: history.slice(-6),
          inventory: buildInventory(products),
        }),
        max_output_tokens: 450,
        store: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = await response.json();
    const reply = extractOpenAIText(data);

    return reply || fallbackReply(message, products);
  } catch (error) {
    console.error(error);
    return fallbackReply(message, products);
  }
}
