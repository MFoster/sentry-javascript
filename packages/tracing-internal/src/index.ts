export * from './exports';

export {
  Apollo,
  Express,
  GraphQL,
  Mongo,
  Mysql,
  Postgres,
  Prisma,
  lazyLoadedNodePerformanceMonitoringIntegrations,
} from './node';
export type { LazyLoadedIntegration } from './node';

export {
  // eslint-disable-next-line deprecation/deprecation
  BrowserTracing,
  browserTracingIntegration,
  startBrowserTracingNavigationSpan,
  startBrowserTracingPageLoadSpan,
  BROWSER_TRACING_INTEGRATION_ID,
  instrumentOutgoingRequests,
  defaultRequestInstrumentationOptions,
  addPerformanceInstrumentationHandler,
  addClsInstrumentationHandler,
  addFidInstrumentationHandler,
  addLcpInstrumentationHandler,
} from './browser';

export { addTracingHeadersToFetchRequest, instrumentFetchRequest } from './common/fetch';

export type { RequestInstrumentationOptions } from './browser';

export { addExtensionMethods } from './extensions';

export { DEFAULT_TRACE_PROPAGATION_TARGETS } from './browser/request';
