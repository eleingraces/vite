// coinInventorySchema.js - for schema validation

export default {
    type: 'object',
    properties: {
      coins: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            price: { type: 'number' },
          },
          required: ['id', 'name', 'price'],
          additionalProperties: false,
        },
      },
      inventory: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            coinId: { type: 'number' },
            amountOwned: { type: 'number' },
          },
          required: ['coinId', 'amountOwned'],
          additionalProperties: false,
        },
      },
      time: { type: 'number' },
    },
    required: ['coins', 'inventory', 'time'],
    additionalProperties: false,
  };

  