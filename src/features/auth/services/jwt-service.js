const TOKEN_SECRET = 'admincrud-local-secret';

function encodeBase64Url(value) {
  const encoded =
    typeof btoa === 'function'
      ? btoa(value)
      : value
          .split('')
          .map((character) => character.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');

  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');

  if (typeof atob === 'function') {
    return atob(normalized);
  }

  return normalized
    .match(/.{1,2}/g)
    .map((hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .join('');
}

export function createJwt(user) {
  const header = encodeBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encodeBase64Url(
    JSON.stringify({
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      iat: Date.now(),
    })
  );
  const signature = encodeBase64Url(`${header}.${payload}.${TOKEN_SECRET}`);

  return `${header}.${payload}.${signature}`;
}

export function readJwtPayload(token) {
  try {
    const [, payload] = token.split('.');

    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}
