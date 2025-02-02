import type { BasicTracerProvider } from '@opentelemetry/sdk-trace-base';
import { makeMain } from '@sentry/core';

import { OpenTelemetryHub } from '../../src/custom/hub';
import { setupEventContextTrace } from '../../src/setupEventContextTrace';
import type { TestClientInterface } from '../helpers/TestClient';
import { TestClient, getDefaultTestClientOptions } from '../helpers/TestClient';
import { setupOtel } from '../helpers/initOtel';
import { cleanupOtel } from '../helpers/mockSdkInit';

const PUBLIC_DSN = 'https://username@domain/123';

describe('setupEventContextTrace', () => {
  const beforeSend = jest.fn(() => null);
  let client: TestClientInterface;
  let hub: OpenTelemetryHub;
  let provider: BasicTracerProvider | undefined;

  beforeEach(() => {
    client = new TestClient(
      getDefaultTestClientOptions({
        sampleRate: 1,
        enableTracing: true,
        beforeSend,
        debug: true,
        dsn: PUBLIC_DSN,
      }),
    );

    hub = new OpenTelemetryHub(client);
    // eslint-disable-next-line deprecation/deprecation
    makeMain(hub);

    setupEventContextTrace(client);
    provider = setupOtel(client);
  });

  afterEach(() => {
    beforeSend.mockReset();
    cleanupOtel(provider);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('works with no active span', async () => {
    const error = new Error('test');
    // eslint-disable-next-line deprecation/deprecation
    hub.captureException(error);
    await client.flush();

    expect(beforeSend).toHaveBeenCalledTimes(1);
    expect(beforeSend).toHaveBeenCalledWith(
      expect.objectContaining({
        contexts: expect.objectContaining({
          trace: {
            span_id: expect.any(String),
            trace_id: expect.any(String),
          },
        }),
      }),
      expect.objectContaining({
        event_id: expect.any(String),
        originalException: error,
        syntheticException: expect.any(Error),
      }),
    );
  });

  it('works with active span', async () => {
    const error = new Error('test');

    let outerId: string | undefined;
    let innerId: string | undefined;
    let traceId: string | undefined;

    client.tracer.startActiveSpan('outer', outerSpan => {
      outerId = outerSpan?.spanContext().spanId;
      traceId = outerSpan?.spanContext().traceId;

      client.tracer.startActiveSpan('inner', innerSpan => {
        innerId = innerSpan?.spanContext().spanId;
        // eslint-disable-next-line deprecation/deprecation
        hub.captureException(error);
      });
    });

    await client.flush();

    expect(outerId).toBeDefined();
    expect(innerId).toBeDefined();
    expect(traceId).toBeDefined();

    expect(beforeSend).toHaveBeenCalledTimes(1);
    expect(beforeSend).toHaveBeenCalledWith(
      expect.objectContaining({
        contexts: expect.objectContaining({
          trace: {
            span_id: innerId,
            parent_span_id: outerId,
            trace_id: traceId,
          },
        }),
      }),
      expect.objectContaining({
        event_id: expect.any(String),
        originalException: error,
        syntheticException: expect.any(Error),
      }),
    );
  });
});
