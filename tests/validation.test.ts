import {
  validateCategory,
  validateDescription,
  validateEquipmentForm,
  validateImageUrl,
  validateName,
  validatePrice,
  validateQuantity,
} from '../src/utils/validation';

describe('validateName / validateDescription', () => {
  test('rejects blank and whitespace-only text', () => {
    expect(validateName('').ok).toBe(false);
    expect(validateName('    ').ok).toBe(false);
    expect(validateDescription('  ').ok).toBe(false);
  });
  test('trims accepted text', () => {
    expect(validateName('  Treadmill  ')).toEqual({ ok: true, value: 'Treadmill' });
  });
  test('rejects text over the maximum length', () => {
    expect(validateName('a'.repeat(61)).ok).toBe(false);
    expect(validateDescription('a'.repeat(301)).ok).toBe(false);
  });
});

describe('validateCategory', () => {
  test('accepts the three allowed categories', () => {
    expect(validateCategory('Cardio').ok).toBe(true);
    expect(validateCategory('Strength').ok).toBe(true);
    expect(validateCategory('Accessories').ok).toBe(true);
  });
  test('rejects empty and unknown values', () => {
    expect(validateCategory('').ok).toBe(false);
    expect(validateCategory('Yoga').ok).toBe(false);
  });
});

describe('validateQuantity', () => {
  test.each([['0', 0], ['5', 5], [' 12 ', 12], ['9999', 9999]])('accepts %j', (input, expected) => {
    expect(validateQuantity(input)).toEqual({ ok: true, value: expected });
  });
  test.each([['', 'required'], ['   ', 'required'], ['-1', 'negative'], ['2.5', 'whole'], ['2,5', 'whole'], ['3abc', 'digits'], ['abc', 'digits'], ['1e3', 'digits'], ['10000', 'more than']])(
    'rejects %j',
    (input, messagePart) => {
      const result = validateQuantity(input);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.toLowerCase()).toContain(messagePart);
    },
  );
});

describe('validatePrice', () => {
  test.each([['0', 0], ['1250', 1250], ['1250.5', 1250.5], ['1250.50', 1250.5], ['1250,50', 1250.5], [' 199.99 ', 199.99]])(
    'accepts %j',
    (input, expected) => {
      expect(validatePrice(input)).toEqual({ ok: true, value: expected });
    },
  );
  test.each([['', 'required'], ['-5', 'negative'], ['12.345', '2 decimal'], ['abc', 'valid amount'], ['R100', 'valid amount'], ['1,000.00', 'valid amount'], ['1000001', 'more than']])(
    'rejects %j',
    (input, messagePart) => {
      const result = validatePrice(input);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.error.toLowerCase()).toContain(messagePart);
    },
  );
});

describe('validateImageUrl', () => {
  test('empty is valid and means no image', () => {
    expect(validateImageUrl('')).toEqual({ ok: true, value: '' });
    expect(validateImageUrl('   ')).toEqual({ ok: true, value: '' });
  });
  test('accepts http and https addresses', () => {
    expect(validateImageUrl('https://images.example.com/a.jpg?w=100').ok).toBe(true);
    expect(validateImageUrl('http://example.com').ok).toBe(true);
  });
  test('rejects other schemes, spaces and plain text', () => {
    expect(validateImageUrl('ftp://example.com/a.jpg').ok).toBe(false);
    expect(validateImageUrl('example.com/a.jpg').ok).toBe(false);
    expect(validateImageUrl('https://exa mple.com').ok).toBe(false);
    expect(validateImageUrl('javascript:alert(1)').ok).toBe(false);
  });
});

describe('validateEquipmentForm', () => {
  const valid = {
    name: ' Kettlebell ',
    description: 'Cast iron',
    category: 'Strength' as const,
    quantity: '10',
    unitPrice: '650,00',
    imageUrl: '',
  };

  test('returns clean typed input when everything is valid', () => {
    expect(validateEquipmentForm(valid)).toEqual({
      ok: true,
      input: {
        name: 'Kettlebell',
        description: 'Cast iron',
        category: 'Strength',
        quantityAvailable: 10,
        unitPrice: 650,
        imageUrl: '',
      },
    });
  });

  test('reports an error for every invalid field at once', () => {
    const result = validateEquipmentForm({
      name: '',
      description: '',
      category: '',
      quantity: '-1',
      unitPrice: 'x',
      imageUrl: 'nope',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(Object.keys(result.errors).sort()).toEqual(
        ['category', 'description', 'imageUrl', 'name', 'quantity', 'unitPrice'],
      );
    }
  });
});
