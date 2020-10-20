import { timer, throwError, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export type ShouldRetryFn = ({ status: number, error: { error_description: string } }) => boolean;

export interface RetryParams {
  maxAttempts?: number;
  scalingDuration?: number;
  shouldRetry?: ShouldRetryFn;
}

const defaultParams: RetryParams = {
  maxAttempts: 3,
  scalingDuration: 1000,
  shouldRetry: ({ status }) => status >= 400
}

export const genericRetryStrategy = (params: RetryParams = {}) => (attempts: Observable<any>) => attempts.pipe( // qui da qualche parte dovrei refreshare il token in caso
  mergeMap(async (error, i) => {
    const { maxAttempts, scalingDuration, shouldRetry } = { ...defaultParams, ...params }
    const retryAttempt = i + 1;
    // if maximum number of retries have been met
    // or response is a status code we don't wish to retry, throw error
    if (retryAttempt > maxAttempts || !shouldRetry(error)) {
      return throwError(error);
    }
    console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
    // retry after 1s, 2s, etc...
    return timer(retryAttempt * scalingDuration);
  })
);