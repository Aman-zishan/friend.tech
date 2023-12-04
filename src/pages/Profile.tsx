import LeftMenu from '@/components/leftMenu';
import useConnect from '@/lib/hooks/useConnect';

import { truncateAddress } from '@/lib/utils';
import { useOpenContractCall } from '@micro-stacks/react';
import { StacksDevnet } from '@stacks/network';
import {
  FungibleConditionCode,
  callReadOnlyFunction,
  cvToJSON,
  cvToValue,
  makeContractSTXPostCondition,
  makeStandardSTXPostCondition,
  standardPrincipalCV,
  uintCV
} from '@stacks/transactions';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
  const { slug } = useParams();

  const navigate = useNavigate();
  const { stxAddress, isSignedIn, contractAddress, contractName, balance } =
    useConnect();
  const [inputAmount, setInputAmount] = useState('');
  const [shareBuyPrice, setShareBuyPrice] = useState(0);
  const { openContractCall, isRequestPending } = useOpenContractCall();

  useEffect(() => {
    fetchSharePrice();
  }, []);

  const fetchSharePrice = async () => {
    if (!isSignedIn) return;
    const functionName = 'get-buy-price-after-fee';
    const functionArgs = [standardPrincipalCV(slug as string), uintCV(1)];
    const network = new StacksDevnet();
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderAddress: stxAddress as string
    });

    console.log('Result:', cvToJSON(result));
    setShareBuyPrice(cvToJSON(result).value);
  };

  const fetchBuySharePriceByAmount = async (
    amount: number
  ): Promise<string> => {
    if (!isSignedIn) return 'not signed in';
    const functionName = 'get-buy-price-after-fee';
    const functionArgs = [standardPrincipalCV(slug as string), uintCV(amount)];
    const network = new StacksDevnet();
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderAddress: stxAddress as string
    });

    return cvToValue(result);
  };

  const fetchSellSharePriceByAmount = async (
    amount: number
  ): Promise<string> => {
    if (!isSignedIn) return 'not signed in';
    const functionName = 'get-sell-price-after-fee';
    const functionArgs = [standardPrincipalCV(slug as string), uintCV(amount)];
    const network = new StacksDevnet();
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderAddress: stxAddress as string
    });
    console.log('Result:', cvToJSON(result));

    return cvToValue(result);
  };
  const handleBuyContractCall = async (amount: number) => {
    if (!isSignedIn) return;

    const maxSTX = await fetchBuySharePriceByAmount(amount);
    const postConditions = [
      makeStandardSTXPostCondition(
        stxAddress!,
        FungibleConditionCode.LessEqual,
        maxSTX + 5000000n
      )
    ];

    console.log(slug, stxAddress, amount);
    const functionArgs = [standardPrincipalCV(slug as string), uintCV(amount)];
    await openContractCall({
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'buy-keys',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      postConditions: postConditions,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  const handleSellContractCall = async (amount: number) => {
    if (!isSignedIn) return;
    const maxSTX = await fetchSellSharePriceByAmount(amount);
    const postConditions = [
      makeContractSTXPostCondition(
        contractAddress,
        contractName,
        FungibleConditionCode.GreaterEqual,
        1n
      )
    ];

    console.log(slug, stxAddress, amount);
    const functionArgs = [standardPrincipalCV(slug as string), uintCV(amount)];
    await openContractCall({
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'sell-keys',

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      functionArgs,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      postConditions: postConditions,

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };

  return (
    <body className="relative bg-blue-50 overflow-hidden h-screen w-screen">
      <LeftMenu />

      <main className="ml-60 pt-16 max-h-screen overflow-auto">
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 mb-5">
              <h1 className="text-3xl font-bold mb-10">Profile</h1>
              <div className="flex items-center justify-between">
                <div className="flex items-stretch">
                  <div className="text-gray-400 text-xs">
                    Holders
                    <br />
                  </div>
                  <div className="h-100 border-l mx-4"></div>
                  <div className="flex flex-nowrap -space-x-3">
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-stretch">
                  <div className="text-gray-400 text-xs">
                    Holdings
                    <br />
                  </div>
                  <div className="h-100 border-l mx-4"></div>
                  <div className="flex flex-nowrap -space-x-3">
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                    <div className="h-9 w-9">
                      <img
                        className="object-cover w-full h-full rounded-full"
                        src="https://ui-avatars.com/api/?background=random"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-5 rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                  >
                    buy price for 1 share: {shareBuyPrice / 1000000} STX (inc.
                    all Fees)
                  </button>
                </div>
              </div>

              <hr className="my-10" />

              <div className="grid grid-cols-2 gap-x-20">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Info</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <div className="p-4 bg-green-100 rounded-xl">
                        <div className="font-bold text-xl text-gray-800 leading-none">
                          hello!
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="p-4 bg-green-100 rounded-xl">
                        <div className=" flex flex-row font-bold text-xl text-gray-800 leading-none gap-10">
                          <h2>stx address: </h2>

                          <span className="text-md">
                            {truncateAddress(stxAddress!)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">Trade</h2>

                  <form className="flex flex-col justify-between " action="">
                    <div className="mb-6">
                      <label
                        htmlFor="large-input"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Enter Amount of Shares
                      </label>
                      <input
                        type="text"
                        id="large-input"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <button
                        type="button"
                        onClick={async () =>
                          await handleBuyContractCall(parseInt(inputAmount))
                        }
                        className="inline-flex items-center justify-center h-9 px-[50px] rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                      >
                        BUY SHARE
                      </button>

                      <button
                        type="button"
                        onClick={async () =>
                          await handleSellContractCall(parseInt(inputAmount))
                        }
                        className="inline-flex items-center justify-center h-9 px-[50px] rounded-xl bg-gray-900 text-gray-300 hover:text-white text-sm font-semibold transition"
                      >
                        SELL SHARE
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </body>
  );
};

export default Profile;
