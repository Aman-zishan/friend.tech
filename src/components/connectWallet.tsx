import React, { ReactElement, useState } from 'react';
import { StacksMainnet, StacksDevnet, StacksTestnet } from '@stacks/network';
import {
  callReadOnlyFunction,
  getAddressFromPublicKey,
  uintCV,
  cvToValue
} from '@stacks/transactions';
import {
  AppConfig,
  FinishedAuthData,
  showConnect,
  UserSession,
  openSignatureRequestPopup
} from '@stacks/connect';
import { verifyMessageSignatureRsv } from '@stacks/encryption';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from '../external-link';
import { ArrowRight } from 'lucide-react';
import { truncateAddress, fetchSTXBalance } from '../lib/utils';
import { SVGComponent } from './stacksSvg';
import useConnect from '@/lib/hooks/useConnect';

function ConnectWallet(): ReactElement {
  const {
    user,
    connectWallet,
    disconnectWallet,
    network,
    userSession,
    balance
  } = useConnect();
  const [address, setAddress] = useState('');

  const [isSignatureVerified, setIsSignatureVerified] = useState(false);
  const [hasFetchedReadOnly, setHasFetchedReadOnly] = useState(false);

  const message = 'Hello, Hiro Hacks!';

  const fetchReadOnly = async (senderAddress: string) => {
    // Define your contract details here
    const contractAddress = 'ST000000000000000000002AMW42H';
    const contractName = 'pox-3';
    const functionName = 'is-pox-active';

    const functionArgs = [uintCV(10)];

    try {
      const result = await callReadOnlyFunction({
        network,
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        senderAddress
      });
      setHasFetchedReadOnly(true);
      console.log(cvToValue(result));
    } catch (error) {
      console.error('Error fetching read-only function:', error);
    }
  };

  const signMessage = () => {
    if (userSession.isUserSignedIn()) {
      openSignatureRequestPopup({
        message,
        network,
        onFinish: async ({ publicKey, signature }) => {
          // Verify the message signature using the verifyMessageSignatureRsv function
          const verified = verifyMessageSignatureRsv({
            message,
            publicKey,
            signature
          });
          if (verified) {
            // The signature is verified, so now we can check if the user is a keyholder
            setIsSignatureVerified(true);
            console.log(
              'Address derived from public key',
              getAddressFromPublicKey(publicKey, network.version)
            );
          }
        }
      });
    }
  };

  return (
    <div className="mt-4 flex flex-col items-center space-y-2">
      {userSession.isUserSignedIn() ? (
        <>
          <div>
            {balance && (
              <span className="flex flex-row items-center gap-2 font-bold">
                Balance: {balance} <SVGComponent />
              </span>
            )}
          </div>
          <div className="flex flex justify-center w-full">
            <Button
              onClick={disconnectWallet}
              variant="link"
              className="h-auto p-0 text-base"
            >
              logout
              <ArrowRight size={15} className="ml-1" />
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={connectWallet}
          variant="link"
          className="h-auto p-0 text-base"
        >
          Connect your wallet
          <ArrowRight size={15} className="ml-1" />
        </Button>
      )}
    </div>
  );

  // return (
  //   <div className="text-center">
  //     <h1 className="text-xl">Friend.tech</h1>
  //     <div>
  //       <button onClick={disconnectWallet}>Disconnect Wallet</button>
  //     </div>
  //     <div>
  //       <p>
  //         {address} is {isKeyHolder ? '' : 'not'} a key holder
  //       </p>
  //       <div>
  //         <input
  //           type="text"
  //           id="address"
  //           name="address"
  //           placeholder="Enter address"
  //         />
  //         <button onClick={() => checkIsKeyHolder(address)}>
  //           Check Key Holder
  //         </button>
  //         <div>
  //           <p>Key Holder Check Result: {isKeyHolder ? 'Yes' : 'No'}</p>
  //         </div>
  //       </div>
  //     </div>
  //     <div>
  //       Sign this message: <button onClick={signMessage}>Sign</button>
  //     </div>
  //   </div>
  // );
}

export default ConnectWallet;
