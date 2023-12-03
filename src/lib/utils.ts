import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchSTXBalance(principal: string): Promise<any> {
  console.log('principal', principal);
  const url = `https://api.testnet.hiro.so/extended/v1/address/${principal}/stx`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('data', data);
    return data;
  } catch (error) {
    console.error('Error fetching data: ', error);
    return null;
  }
}

export function truncateAddress(address: string): string {
  if (address.length <= 8) {
    return address;
  }
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
