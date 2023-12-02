import { defineConfig } from 'vitest/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getClarinetVitestsArgv } from '@hirosystems/clarinet-sdk/vitest';

const vitestSetupFilePath =
  './node_modules/@hirosystems/clarinet-sdk/vitest-helpers/src/vitest.setup.ts';

console.log(vitestSetupFilePath);
export default defineConfig({
  test: {
    environment: 'clarinet',
    singleThread: true,
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: getClarinetVitestsArgv()
    }
  }
});
