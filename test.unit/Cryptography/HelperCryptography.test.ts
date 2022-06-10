import {
  HelperCryptography,
  HashAlgorithm,
  CryptographyDirection,
  HelperObject,
  Json,
  NotImplementedError
} from '../../ts';

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
  describe('propriedades estática', () => {
    test('defaultSymmetricAlgorithm', () => {
      // Arrange, Given

      const expectedValue = 'aes-256-cbc';

      // Act, When

      const receivedValue = HelperCryptography.defaultSymmetricAlgorithm;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('defaultSymmetricAlgorithmKeyLengthInBytes', () => {
      // Arrange, Given

      const expectedValue = 32;

      // Act, When

      const receivedValue =
        HelperCryptography.defaultSymmetricAlgorithmKeyLengthInBytes;

      // Assert, Then

      expect(receivedValue).toBe(expectedValue);
    });
    test('defaultInitializationVector', () => {
      // Arrange, Given

      const expectedValue = Buffer.alloc(16, 0);

      // Act, When

      const receivedValue = HelperCryptography.defaultInitializationVector;

      // Assert, Then

      expect(receivedValue).toStrictEqual(expectedValue);
    });
  });
  describe('HelperCryptography.json', () => {
    test('mode diferente de Encrypt ou Decrypt deve falhar', () => {
      // Arrange, Given

      const invalidMode = Math.random().toString() as CryptographyDirection;

      // Act, When

      const action = () =>
        HelperCryptography.json(
          invalidMode,
          {
            anyProperty: null
          },
          ''
        );

      // Assert, Then

      expect(action).toThrow(NotImplementedError);
    });
    describe('Decrypt', () => {
      test('o resultado de saída não deve ser a mesma referência da entrada', () => {
        // Arrange, Given

        const inputJson = {
          property: Math.random()
        };

        // Act, When

        const outputJson = HelperCryptography.json(
          CryptographyDirection.Decrypt,
          inputJson,
          ''
        );

        // Assert, Then

        expect(outputJson).not.toBe(inputJson);
        expect(JSON.stringify(outputJson)).toBe(JSON.stringify(inputJson));
      });
      test('Retorna o valor corrente de uma propriedade que não foi criptografada', () => {
        // Arrange, Given

        const inputJson = {
          property: Math.random()
        };

        // Act, When

        const outputJson = HelperCryptography.json(
          CryptographyDirection.Decrypt,
          inputJson,
          ''
        ) as Record<string, unknown>;

        // Assert, Then

        expect(outputJson['property']).toBe(inputJson['property']);
      });
      test('Tentar descriptografar um valor não criptografado não deve falhar', () => {
        // Arrange, Given

        const nonCriptographed = [Math.random().toString()];

        // Act, When

        const decrypt = () =>
          HelperCryptography.json(
            CryptographyDirection.Decrypt,
            nonCriptographed,
            ''
          ) as Record<string, unknown>;

        // Assert, Then

        expect(decrypt).not.toThrow();
      });
      test('deve descriptografar quando a senha estiver correta', () => {
        // Arrange, Given

        const rightPassword = Math.random().toString();
        const myValue = Math.random();
        const originalJson = { myValue };
        const criptographedJson = HelperCryptography.json(
          CryptographyDirection.Encrypt,
          originalJson,
          rightPassword
        );

        // Act, When

        const descriptographedJson = HelperCryptography.json(
          CryptographyDirection.Decrypt,
          criptographedJson,
          rightPassword
        ) as Record<string, unknown>;

        // Assert, Then

        expect(descriptographedJson['myValue']).toBe(myValue);
      });
      test('não deve descriptografar se a senha estiver errada', () => {
        // Arrange, Given

        const rightPassword = Math.random().toString();
        const wrongPassword = Math.random().toString();
        const myValue = Math.random();
        const originalJson = { myValue };
        const criptographedJson = HelperCryptography.json(
          CryptographyDirection.Encrypt,
          originalJson,
          rightPassword
        );

        // Act, When

        const descriptographedJson = HelperCryptography.json(
          CryptographyDirection.Decrypt,
          criptographedJson as Json,
          wrongPassword
        ) as Record<string, unknown>;

        // Assert, Then

        expect(descriptographedJson['myValue']).not.toBe(myValue);
      });
    });
  });
});
