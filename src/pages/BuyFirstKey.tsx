import useConnect from '@/lib/hooks/useConnect';
import { useOpenContractCall } from '@micro-stacks/react';
import { standardPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BuyFirstKey: React.FC = () => {
  const navigate = useNavigate();
  const { userSession, contractAddress, contractName } = useConnect();
  const { openContractCall, isRequestPending } = useOpenContractCall();

  const [response, setResponse] = useState(null);

  const functionArgs = [
    standardPrincipalCV(
      userSession?.loadUserData().profile?.stxAddress.testnet
    ),
    uintCV(1)
  ];

  const handleOpenContractCall = async () => {
    await openContractCall({
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: 'buy-keys',
      functionArgs,
      postConditions: [],

      onFinish: async (data: any) => {
        console.log('finished contract call!', data);
        setResponse(data);
        navigate('/home');
      },
      onCancel: () => {
        console.log('popup closed!');
      }
    });
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white w-screen">
      <div className="text-center">
        <div className="mb-0">
          <div className="px-4 py-4 text-center flex flex-row items-center justify-center gap-2">
            <img src="assets/key.png" alt="" width={200} />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-6">Buy your first key</h1>

        <p className="text-gray-600 text-lg mb-8 w-[700px]">
          Everyone of sFriend.tech has a chat unlocked by their keys.These keys
          can be bought and sold on a person's profile and their price goes up
          and down based on how many are circulating.
        </p>

        <p className="text-gray-600 text-lg mb-8 w-[700px]">
          You'll earn trading fee everytime your keys are bought and sold by
          anyone
        </p>

        <p className="text-gray-600 text-lg mb-8 w-[700px]">
          To create your profile, buy the first key to buy your own room for
          free!
        </p>
        <button
          onClick={() => {
            if (userSession?.isUserSignedIn()) {
              handleOpenContractCall();
            }
          }}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full mb-4 hover:bg-blue-600"
        >
          {isRequestPending ? 'request pending...' : 'Buy Key for $0'}
        </button>
      </div>
    </div>
  );
};

export default BuyFirstKey;
