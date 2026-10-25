
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');

test('Express app returns the expected response', async (t) => {
  const app = spawn(process.execPath, ['app.js'], {
    env: { ...process.env, PORT: '3100' },
    stdio: 'ignore'
  });

  t.after(() => {
    app.kill();
  });

  try {
    const response = await new Promise((resolve, reject) => {
      const request = http.get(
        'http://127.0.0.1:3100/',
        (res) => {
          let body = '';

          res.setEncoding('utf8');
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => resolve({
            statusCode: res.statusCode,
            body
          }));
        }
      );

      request.setTimeout(5000, () => {
        request.destroy(new Error('Request timed out'));
      });

      request.on('error', reject);
    });

    assert.equal(response.statusCode, 200);
    assert.match(
      response.body,
      /Hello World! CI\/CD with Jenkins, Docker, Kubernetes/
    );
  } finally {
    app.kill();
  }
});
