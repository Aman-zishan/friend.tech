import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import { initSimnet } from '@hirosystems/clarinet-sdk';
const simnet = await initSimnet();

const accounts = simnet.getAccounts();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const address1 = accounts.get('wallet_1')!;

describe('test `get-price` public function', () => {
  it('should get price of key', () => {
    const getPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-price',
      [Cl.uint(0), Cl.uint(100)],
      address1
    );
    console.log(Cl.prettyPrint(getPriceResponse.result)); // u10010
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(10010);
  });
});
