import type { Integration } from '@sentry/types';
import { consoleSandbox } from '@sentry/utils';

/**
 * This is a shim for the BrowserTracing integration.
 * It is needed in order for the CDN bundles to continue working when users add/remove tracing
 * from it, without changing their config. This is necessary for the loader mechanism.
 *
 * @deprecated Use `browserTracingIntegration()` instead.
 */
class BrowserTracingShim implements Integration {
  /**
   * @inheritDoc
   */
  public static id: string = 'BrowserTracing';

  /**
   * @inheritDoc
   */
  public name: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(_options: any) {
    // eslint-disable-next-line deprecation/deprecation
    this.name = BrowserTracingShim.id;

    consoleSandbox(() => {
      // eslint-disable-next-line no-console
      console.warn('You are using new BrowserTracing() even though this bundle does not include tracing.');
    });
  }

  /** jsdoc */
  public setupOnce(): void {
    // noop
  }
}

/**
 * This is a shim for the BrowserTracing integration.
 * It is needed in order for the CDN bundles to continue working when users add/remove tracing
 * from it, without changing their config. This is necessary for the loader mechanism.
 */
function browserTracingIntegrationShim(_options: unknown): Integration {
  // eslint-disable-next-line deprecation/deprecation
  return new BrowserTracingShim({});
}

export {
  // eslint-disable-next-line deprecation/deprecation
  BrowserTracingShim as BrowserTracing,
  browserTracingIntegrationShim as browserTracingIntegration,
};

/** Shim function */
export function addTracingExtensions(): void {
  // noop
}
