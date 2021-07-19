import { helloWord } from '../ts/index';

test('teste', () => {
    const result = helloWord();
    expect(result).toBe('Hello World, but not implemented');
});