import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { z } from 'zod';
import express from 'express';
import app from '../src/app.js';
import { validate } from '../src/middlewares/validate.middleware.js';
import { errorHandler } from '../src/middlewares/errorHandler.middleware.js';

describe('Base Application Endpoints & Middleware', () => {
  it('GET /health should return 200 with standard health check payload', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      status: 'OK',
      message: 'Server is running',
    });
  });

  it('GET non-existent route should trigger 404 Not Found with standard error format', async () => {
    const response = await request(app).get('/api/v1/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      success: false,
      message: expect.stringContaining('Cannot GET /api/v1/non-existent-route'),
      errors: [],
    });
  });

  it('validate middleware should reject invalid payload with standard error format', async () => {
    const testApp = express();
    testApp.use(express.json());

    const schema = {
      body: z.object({
        email: z.string().email('Invalid email address'),
      }),
    };

    testApp.post('/test-validate', validate(schema), (req, res) => {
      res.json({ success: true });
    });
    testApp.use(errorHandler);

    const res = await request(testApp)
      .post('/test-validate')
      .send({ email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(res.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email', message: 'Invalid email address' }),
      ])
    );
  });
});
