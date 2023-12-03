import {
  AppConfig,
  FinishedAuthData,
  UserData,
  UserSession,
  openSignatureRequestPopup,
  showConnect
} from '@stacks/connect';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import { StacksDevnet } from '@stacks/network';
import {
  callReadOnlyFunction,
  cvToValue,
  getAddressFromPublicKey,
  standardPrincipalCV
} from '@stacks/transactions';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSTXBalance } from '../utils';
import { useAccount, useAuth } from '@micro-stacks/react';

const initialValue = {
  email: '',
  decentralizedID: '',
  identityAddress: '',
  appPrivateKey: '',
  hubUrl: '',
  coreNode: '',
  authResponseToken: '',
  coreSessionToken: '',
  gaiaAssociationToken: '',
  profile: '',
  gaiaHubConfig: '',
  appPrivateKeyFromWalletSalt: ''
};
const userWalletAtom = atomWithStorage<UserData>('userWallet', initialValue);

// Initialize your app configuration and user session here
const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const message = 'Check if i am a keyholder ;)';
const network = new StacksDevnet();

// Define your authentication options here

function useConnect() {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userWalletAtom);
  const [balance, setBalance] = useState(0);

  const { openAuthRequest, isRequestPending, signOut, isSignedIn } = useAuth();
  const { stxAddress } = useAccount();

  const senderAddress = userSession.loadUserData().profile.stxAddress.testnet;
  const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
  const contractName = 'keys';
  const functionName = 'is-keyholder';

  async function checkIsKeyHolder(principal: string) {
    const functionArgs = [
      standardPrincipalCV(principal),
      standardPrincipalCV(principal)
    ];
    const result = await callReadOnlyFunction({
      network,
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderAddress
    });

    console.log('Result:', cvToValue(result));

    return cvToValue(result);
  }

  async function handleInitialLogin() {
    if (isSignedIn) {
      await openSignatureRequestPopup({
        message,
        network,
        onFinish: async ({ publicKey, signature }) => {
          const verified = verifyMessageSignatureRsv({
            message,
            publicKey,
            signature
          });
          if (verified) {
            // The signature is verified, so now we can check if the user is a keyholder

            const address = getAddressFromPublicKey(publicKey, network.version);
            const isKeyHolder = await checkIsKeyHolder(address);
            if (isKeyHolder) {
              console.log('The user is a keyholder');
              navigate('/home');
              // The user is a keyholder, so they are authorized to access the chatroom
            } else {
              console.log('The user is not a keyholder');
              navigate('/buy-first-key');
              // The user is not a keyholder, so they are not authorized to access the chatroom
            }
          }
        }
      });
    }
  }

  const fetchBalance = async () => {
    if (isSignedIn) {
      try {
        const fetchedSTXBalance = await fetchSTXBalance(stxAddress!);
        setBalance(fetchedSTXBalance.balance / 1000000);
        console.log('Fetched balance:', fetchedSTXBalance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    }
  };

  React.useEffect(() => {
    fetchBalance();
  }, []); // The empty array causes this effect to only run on mount

  const connectWallet = async () => {
    await openAuthRequest().then(async (authResponse: any) => {
      console.log('Auth response:', authResponse);
      await handleInitialLogin();
    });
  };

  const disconnectWallet = async () => {
    await signOut();
  };

  return {
    connectWallet,
    disconnectWallet,
    user,
    balance,
    network,
    userSession,
    contractAddress,
    contractName
  };
}

export default useConnect;
