import test from 'node:test';
import assert from 'node:assert/strict';
import { validateRequest } from '../src/middlewares/validation.middleware.js';
import { authenticate, authorizeRoles } from '../src/middlewares/auth.middleware.js';

function createMockRes() {
  return {
    statusCode: 200,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
    cookie() {
      return this;
    },
    clearCookie() {
      return this;
    },
  };
}

test('register validation rejects weak input', async () => {
  const req = { body: { username: 'ab', email: 'bad-email', password: '123' } };
  const res = createMockRes();

  await validateRequest('register')(req, res, (err) => {
    assert.ok(err);
    assert.equal(err.statusCode, 422);
  });
});

test('authenticate rejects missing token', async () => {
  const req = { headers: {} };
  const res = createMockRes();
  let err = null;

  await authenticate(req, res, (error) => {
    err = error;
  });

  assert.ok(err);
  assert.equal(err.statusCode, 401);
});

test('authorizeRoles blocks insufficient permission', async () => {
  const req = { user: { role: 'user' } };
  const res = createMockRes();
  let err = null;

  authorizeRoles('admin')(req, res, (error) => {
    err = error;
  });

  assert.ok(err);
  assert.equal(err.statusCode, 403);
});
