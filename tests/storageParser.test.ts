import { parseStoredState, serialiseState } from '../src/services/storageParser';
import { makeEquipment } from './helpers';

describe('parseStoredState', () => {
  test('null means nothing saved yet', () => {
    expect(parseStoredState(null)).toEqual({ status: 'empty' });
  });

  test('round trip keeps every record', () => {
    const state = { equipment: [makeEquipment({ id: '1', isFavourite: true }), makeEquipment({ id: '2' })], lowStockThreshold: 3 };
    const result = parseStoredState(serialiseState(state));
    expect(result).toEqual({ status: 'ok', state, droppedCount: 0 });
  });

  test('text that is not JSON is corrupt', () => {
    expect(parseStoredState('{not json')).toEqual({ status: 'corrupt' });
  });

  test('valid JSON with the wrong shape is corrupt', () => {
    expect(parseStoredState('[]')).toEqual({ status: 'corrupt' });
    expect(parseStoredState('{"equipment":"nope"}')).toEqual({ status: 'corrupt' });
  });

  test('damaged and duplicate records are dropped, good ones kept', () => {
    const good = makeEquipment({ id: 'good' });
    const raw = JSON.stringify({
      version: 1,
      lowStockThreshold: 2,
      equipment: [
        good,
        { ...good, id: 'neg', quantityAvailable: -4 },
        { ...good, id: 'nan', unitPrice: null },
        { ...good, id: 'cat', category: 'Yoga' },
        { ...good, id: 'frac', quantityAvailable: 1.5 },
        good,
        'not an object',
      ],
    });
    const result = parseStoredState(raw);
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.state.equipment.map((i) => i.id)).toEqual(['good']);
      expect(result.droppedCount).toBe(6);
    }
  });

  test('missing optional fields get safe defaults and a bad threshold falls back', () => {
    const { imageUrl, isFavourite, ...rest } = makeEquipment({ id: '1' });
    void imageUrl;
    void isFavourite;
    const result = parseStoredState(JSON.stringify({ equipment: [rest], lowStockThreshold: 'lots' }));
    expect(result.status).toBe('ok');
    if (result.status === 'ok') {
      expect(result.state.equipment[0]).toMatchObject({ imageUrl: '', isFavourite: false });
      expect(result.state.lowStockThreshold).toBe(2);
    }
  });
});
