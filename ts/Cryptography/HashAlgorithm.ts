/**
 * Lista de algoritmos de hash.
 */
export type HashAlgorithm =
  //| 'md4'
  //| 'mdc2'
  //| 'ripemd160'
  //| 'whirlpool'
  | 'blake2b512'
  | 'blake2s256'
  | 'md5'
  | 'md5-sha1'
  | 'rsa-sha1'
  | 'sha1'
  | 'sha224'
  | 'sha256'
  | 'sha3-224'
  | 'sha3-256'
  | 'sha3-384'
  | 'sha3-512'
  | 'sha384'
  | 'sha512'
  | 'sha512-224'
  | 'sha512-256'
  | 'shake128'
  | 'shake256'
  | 'sm3';
