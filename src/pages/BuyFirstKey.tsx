import useConnect from '@/lib/hooks/useConnect';
import { useOpenContractCall } from '@micro-stacks/react';
import { createClient } from '@supabase/supabase-js';
import { standardPrincipalCV, uintCV } from 'micro-stacks/clarity';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const BuyFirstKey: React.FC = () => {
  const navigate = useNavigate();

  // Create a single supabase client for interacting with your database

  const { contractAddress, contractName, stxAddress, isSignedIn, supabase } =
    useConnect();
  const { openContractCall, isRequestPending } = useOpenContractCall();

  const [response, setResponse] = useState(null);

  const saveSubjectToDB = async () => {
    const { error } = await supabase
      .from('subjects')
      .insert({ roomId: stxAddress });
  };
  const handleOpenContractCall = async () => {
    if (!isSignedIn) return;
    const functionArgs = [standardPrincipalCV(stxAddress!), uintCV(1)];
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
          onClick={async () => {
            if (isSignedIn) {
              saveSubjectToDB();
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
