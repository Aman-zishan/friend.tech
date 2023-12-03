/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Cl } from '@stacks/transactions';
import { describe, expect, it } from 'vitest';
import { initSimnet } from '@hirosystems/clarinet-sdk';
const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const protocolFessDestination = accounts.get('wallet_1')!;
const subject1 = accounts.get('wallet_2')!;
const subject2 = accounts.get('wallet_3')!;
const follower = accounts.get('wallet_4')!;

describe('Should initialise keys contract', () => {
  it('only contract owner can set protocol fee destination', () => {
    const setProtocolFeeDestination = simnet.callPublicFn(
      'keys',
      'set-protocol-fee-destination',
      [Cl.standardPrincipal(protocolFessDestination)],
      subject1
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
      subject1
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
      subject1
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
      subject1
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
      subject1
    );

    console.log(Cl.prettyPrint(getPriceResponse.result));
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(312500);
  });

  it('should get price for supply 2 and amount 6', () => {
    const getPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-price',
      [Cl.uint(2), Cl.uint(6)],
      subject1
    );

    console.log(Cl.prettyPrint(getPriceResponse.result));
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(8687500);
  });

  it('should get price for supply 0 and amount 1', () => {
    const getPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-price',
      [Cl.uint(0), Cl.uint(1)],
      subject1
    );

    console.log(Cl.prettyPrint(getPriceResponse.result));
    //@ts-ignore
    expect(getPriceResponse.result).toBeUint(0);
  });

  it('should not allow non subject to buy first share', () => {
    const buyNonSubjectShareResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(subject2), Cl.uint(1)],
      subject1
    );
    //@ts-ignore
    expect(buyNonSubjectShareResponse.result).toBeErr(Cl.uint(500));
  });

  it('buy & sell flow', () => {
    const setProtocolFeeDestination = simnet.callPublicFn(
      'keys',
      'set-protocol-fee-destination',
      [Cl.standardPrincipal(protocolFessDestination)],
      deployer
    );

    //@ts-ignore
    expect(setProtocolFeeDestination.result).toBeOk(Cl.bool(true));

    const buySubjectShareResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(subject1), Cl.uint(1)],
      subject1
    );
    console.log(Cl.prettyPrint(buySubjectShareResponse.result));
    //@ts-ignore
    expect(buySubjectShareResponse.result).toBeOk(Cl.bool(true));

    const getSupplyResponse = simnet.callReadOnlyFn(
      'keys',
      'get-keys-supply',
      [Cl.standardPrincipal(subject1)],
      subject1
    );

    //@ts-ignore
    expect(getSupplyResponse.result).toBeUint(1);

    const buySubjectTwoShareResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(subject2), Cl.uint(1)],
      subject2
    );
    console.log(Cl.prettyPrint(buySubjectTwoShareResponse.result));
    //@ts-ignore
    expect(buySubjectTwoShareResponse.result).toBeOk(Cl.bool(true));

    const buySubjectShareForFollowerResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(subject1), Cl.uint(2)],
      follower
    );
    console.log(Cl.prettyPrint(buySubjectShareForFollowerResponse.result));
    //@ts-ignore
    expect(buySubjectShareForFollowerResponse.result).toBeOk(Cl.bool(true));

    const buySubjectTwoShareForFollowerResponse = simnet.callPublicFn(
      'keys',
      'buy-keys',
      [Cl.standardPrincipal(subject2), Cl.uint(5)],
      follower
    );
    console.log(Cl.prettyPrint(buySubjectTwoShareForFollowerResponse.result));
    //@ts-ignore
    expect(buySubjectTwoShareForFollowerResponse.result).toBeOk(Cl.bool(true));

    const getFollowerSubject1KeyBalanceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-keys-balance',
      [Cl.standardPrincipal(subject1), Cl.standardPrincipal(follower)],
      follower
    );

    //@ts-ignore
    expect(getFollowerSubject1KeyBalanceResponse.result).toBeUint(2);

    const getFollowerSubject2KeyBalanceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-keys-balance',
      [Cl.standardPrincipal(subject2), Cl.standardPrincipal(follower)],
      follower
    );

    //@ts-ignore
    expect(getFollowerSubject2KeyBalanceResponse.result).toBeUint(5);

    console.log(simnet.getAssetsMap());

    const getSellPriceResponse = simnet.callReadOnlyFn(
      'keys',
      'get-sell-price',
      [Cl.standardPrincipal(subject2), Cl.uint(3)],
      follower
    );

    console.log('TEST 1', Cl.prettyPrint(getSellPriceResponse.result));

    const getSellPriceAfterFeeResponse = simnet.callReadOnlyFn(
      'keys',
      'get-sell-price-after-fee',
      [Cl.standardPrincipal(subject2), Cl.uint(3)],
      follower
    );

    console.log(Cl.prettyPrint(getSellPriceAfterFeeResponse.result));

    const sellSubjectShareResponse = simnet.callPublicFn(
      'keys',
      'sell-keys',
      [Cl.standardPrincipal(subject2), Cl.uint(3)],
      follower
    );

    console.log(Cl.prettyPrint(sellSubjectShareResponse.result));

    console.log(simnet.getAssetsMap());

    //@ts-ignore
    expect(sellSubjectShareResponse.result).toBeOk(Cl.bool(true));

    const sellSubjectShareAgainResponse = simnet.callPublicFn(
      'keys',
      'sell-keys',
      [Cl.standardPrincipal(subject2), Cl.uint(2)],
      follower
    );

    console.log(Cl.prettyPrint(sellSubjectShareAgainResponse.result));

    console.log(simnet.getAssetsMap());

    //@ts-ignore
    expect(sellSubjectShareAgainResponse.result).toBeOk(Cl.bool(true));

    const getFollowerSubject2KeyBalanceAgainResponse = simnet.callReadOnlyFn(
      'keys',
      'get-keys-balance',
      [Cl.standardPrincipal(subject2), Cl.standardPrincipal(follower)],
      follower
    );

    //@ts-ignore
    expect(getFollowerSubject2KeyBalanceAgainResponse.result).toBeUint(0);
  });
});
