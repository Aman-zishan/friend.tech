/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import { initSimnet } from '@hirosystems/clarinet-sdk';
const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const protocolFessDestination = accounts.get('wallet_1')!;
const address2 = accounts.get('wallet_2')!;
const address3 = accounts.get('wallet_3')!;

describe('Should initialise keys contract', () => {
  it('only contract owner can set protocol fee destination', () => {
    const setProtocolFeeDestination = simnet.callPublicFn(
      'keys',
      'set-protocol-fee-destination',
      [Cl.standardPrincipal(protocolFessDestination)],
      address2
    );

    //@ts-ignore
    expect(setProtocolFeeDestination.result).toBeErr(Cl.uint(401));
  });

  it('should set protocol fee destination', () => {
    const setProtocolFeeDestination = simnet.callPublicFn(
      'keys',
      'set-protocol-fee-destination',
      [Cl.standardPrincipal(protocolFessDestination)],
      deployer
    );

    //@ts-ignore
    expect(setProtocolFeeDestination.result).toBeOk(Cl.bool(true));

    const getProtocolDestinationResponse = simnet.callReadOnlyFn(
      'keys',
      'get-protocol-fee-destination',
      [],
      address2
    );

    //@ts-ignore
    expect(getProtocolDestinationResponse.result).toBeOk(
      Cl.standardPrincipal(protocolFessDestination)
    );
  });

  it('should set protocol fee percent', () => {
    const setProtocolFeePercent = simnet.callPublicFn(
      'keys',
      'set-protocol-fee-percent',
      [Cl.uint(10)],
      deployer
    );

    //@ts-ignore
    expect(setProtocolFeePercent.result).toBeOk(Cl.bool(true));

    const getProtocolFeePercentResponse = simnet.callReadOnlyFn(
      'keys',
      'get-protocol-fee-percent',
      [],
      address2
    );

    //@ts-ignore
    expect(getProtocolFeePercentResponse.result).toBeOk(Cl.uint(10));
  });

  it('should set subject fee percent', () => {
    const setSubjectFeePercent = simnet.callPublicFn(
      'keys',
      'set-subject-fee-percent',
      [Cl.uint(10)],
      deployer
    );

    //@ts-ignore
    expect(setSubjectFeePercent.result).toBeOk(Cl.bool(true));

    const getSubjectFeeResponse = simnet.callReadOnlyFn(
      'keys',
      'get-subject-fee-percent',
      [],
      address2
    );

    //@ts-ignore
    expect(getSubjectFeeResponse.result).toBeOk(Cl.uint(10));
  });
});

describe('Core trade functionality', () => {
  it('should get price for supply 1 and amount 2', () => {
    const getPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-price',
      [Cl.uint(1), Cl.uint(2)],
      address2
    );

    console.log(Cl.prettyPrint(getPriceResponse.result));
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(312500000000000);
  });

  it('should get price for supply 2 and amount 6', () => {
    const getPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-price',
      [Cl.uint(2), Cl.uint(6)],
      address2
    );

    console.log(Cl.prettyPrint(getPriceResponse.result));
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(8687500000000000);
  });

  it('should get price for supply 0 and amount 1', () => {
    const getPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-price',
      [Cl.uint(0), Cl.uint(1)],
      address2
    );

    console.log(Cl.prettyPrint(getPriceResponse.result));
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(0);
  });

  it('test Tx', () => {
    const txResponse = simnet.callPublicFn(
      'hello-world',
      'pay',
      [Cl.standardPrincipal(address3)],
      address2
    );

    console.log(Cl.prettyPrint(txResponse.result));
    // //@ts-ignore
    // expect(txResponse.result).toBeOk(Cl.bool(true));
  });

  it('should not allow non subject to buy first share', () => {
    const buyNonSubjectShareResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(address3), Cl.uint(1)],
      address2
    );
    //@ts-ignore
    expect(buyNonSubjectShareResponse.result).toBeErr(Cl.uint(500));
  });

  it('should allow subject to buy first share', () => {
    const buySubjectShareResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(address2), Cl.uint(1)],
      address2
    );
    console.log(Cl.prettyPrint(buySubjectShareResponse.result));
    //@ts-ignore
    expect(buySubjectShareResponse.result).toBeOk(Cl.bool(true));
  });
});
