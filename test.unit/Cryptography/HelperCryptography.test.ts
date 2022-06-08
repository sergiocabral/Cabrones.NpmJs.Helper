import { HelperCryptography, HelperObject } from '../../ts';
import { HashAlgorithm } from '../../ts/Cryptography/HashAlgorithm';

describe('Classe HelperCryptography', () => {
  const originals: Record<string, any> = {};

  beforeEach(() => {
    originals['HelperCryptography.toBuffer'] = HelperCryptography.toBuffer;
  });

  afterEach(() => {
    HelperCryptography.toBuffer = originals['HelperCryptography.toBuffer'];
  });

  describe('hash', () => {
    test('valida resultado', () => {
      // Arrange, Given

      const wellKnownSha256 = {
        'valor de entrada com hash de saida conhecido para o proposito deste teste':
          'eede78d21e995cd1cd5a77fe8309e62b31664ee86470777ee1e2d6a473a5c856'
      };

      for (const valueHash of Object.entries(wellKnownSha256)) {
        // Act, When

        const calculatedHash = HelperCryptography.hash(valueHash[0]);

        // Assert, Then

        expect(calculatedHash).toBe(valueHash[1]);
      }
    });
    test('deve usar HelperCryptography.toBuffer para montar um input', () => {
      // Arrange, Given

      const mockToBuffer = jest.fn(input => Buffer.from(String(input)));
      HelperCryptography.toBuffer = mockToBuffer;

      const input = { property: Math.random() };

      // Act, When

      HelperCryptography.hash(input);

      // Assert, Then

      expect(mockToBuffer).toBeCalledTimes(1);
      expect(mockToBuffer.mock.calls[0][0]).toBe(input);
    });
    test('lista de algoritmos', () => {
      // Arrange, Given

      const algorithms = [
        'blake2b512',
        'blake2s256',
        //'md4',
        'md5',
        'md5-sha1',
        //'mdc2',
        //'ripemd160',
        'rsa-sha1',
        'sha1',
        'sha224',
        'sha256',
        'sha3-224',
        'sha3-256',
        'sha3-384',
        'sha3-512',
        'sha384',
        'sha512',
        'sha512-224',
        'sha512-256',
        'shake128',
        'shake256',
        'sm3'
        //'whirlpool'
      ];

      const results: string[] = [];
      for (const algorithm of algorithms) {
        const input = Math.random();

        // Act, When

        const result = HelperCryptography.hash(
          input,
          algorithm as HashAlgorithm
        );

        // Assert, Then

        expect(result.length).toBeGreaterThan(0);
        expect(results.includes(result)).toBe(false);

        // Tear Down

        results.push(result);
      }
    });
  });
  describe('toBuffer', () => {
    test('se entrada é Buffer retorna ele mesmo', () => {
      // Arrange, Given

      const inputBuffer = Buffer.from(Math.random().toString());

      // Act, When

      const output = HelperCryptography.toBuffer(inputBuffer);

      // Assert, Then

      expect(output).toBe(inputBuffer);
    });
    test('entrada como number deve ser tratado como string', () => {
      // Arrange, Given

      const inputNumber = Math.random();
      const expectedOutput = Buffer.from(String(inputNumber));

      // Act, When

      const output = HelperCryptography.toBuffer(inputNumber);

      // Assert, Then

      expect(output).toStrictEqual(expectedOutput);
    });
    test('entrada como boolean deve ser tratado como string', () => {
      // Arrange, Given

      const inputBoolean = Math.floor(Math.random() * 1000 + 1000) % 2 === 0;
      const expectedOutput = Buffer.from(String(inputBoolean));

      // Act, When

      const output = HelperCryptography.toBuffer(inputBoolean);

      // Assert, Then

      expect(output).toStrictEqual(expectedOutput);
    });
    test('entrada como null deve ser tratado como string', () => {
      // Arrange, Given

      const inputNull = null;
      const expectedOutput = Buffer.from(String(inputNull));

      // Act, When

      const output = HelperCryptography.toBuffer(inputNull);

      // Assert, Then

      expect(output).toStrictEqual(expectedOutput);
    });
    test('entrada como null deve ser tratado como string', () => {
      // Arrange, Given

      const inputUndefined = undefined;
      const expectedOutput = Buffer.from(String(inputUndefined));

      // Act, When

      const ouput = HelperCryptography.toBuffer(inputUndefined);

      // Assert, Then

      expect(ouput).toStrictEqual(expectedOutput);
    });
    test('entrada como Date deve ser tratado como string ISO', () => {
      // Arrange, Given

      const inputDate = new Date();
      const expectedOutput = Buffer.from(inputDate.toISOString());

      // Act, When

      const ouput = HelperCryptography.toBuffer(inputDate);

      // Assert, Then

      expect(ouput).toStrictEqual(expectedOutput);
    });
    test('entrada como object deve ser tratado como JSON.stringify', () => {
      // Arrange, Given

      const inputObject = { property: Math.random() };
      const expectedOutput = Buffer.from(HelperObject.toText(inputObject, 0));

      // Act, When

      const ouput = HelperCryptography.toBuffer(inputObject);

      // Assert, Then

      expect(ouput).toStrictEqual(expectedOutput);
    });
  });
});
