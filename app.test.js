
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { spawn } = require('node:child_process');

test('Express app returns the expected response', async (t) => {
  const port = 3100;

  const app = spawn(process.execPath, ['app.js'], {
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let output = '';
  app.stdout.on('data', (chunk) => {
    output += chunk.toString();
  });
  app.stderr.on('data', (chunk) => {
    output += chunk.toString();
  });

  t.after(() => {
    if (!app.killed) app.kill();
  });

  // Wait until the server is ready.
  const deadline = Date.now() + 5000;
  let response;

  while (Date.now() < deadline) {
    if (app.exitCode !== null) {
      throw new Error(`App exited early. Output: ${output}`);
    }

    try {
      response = await new Promise((resolve, reject) => {
        const request = http.get(
          `http://127.0.0.1:${port}/`,
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

        request.setTimeout(500, () => {
          request.destroy(new Error('Request timed out'));
        });
        request.on('error', reject);
      });

      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  assert.ok(response, `App did not become ready. Output: ${output}`);
  assert.equal(response.statusCode, 200);
  assert.equal(
    response.body,
    'Hello World! CI/CD with Jenkins, Docker, Kubernetes'
  );
});
