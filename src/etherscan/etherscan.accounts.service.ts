import { getConfig } from '../config';
import axios from 'axios';
import { utils } from 'ethers';
const { formatUnits } = utils;

// FIXME: provide a better way to handle this?
const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig('bsc');

/**
 *
 * Account Balance
 *
 */
interface AccountBalance {
  account: string;
  balance: string;
  decimalBalance: string;
}

export async function getBalance(
  address: string | string[],
  block: number | string = 'latest',
): Promise<AccountBalance[]> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        module: 'account',
        action: 'balancemulti',
        address: address.toString(), // Turn array into comma separated string
        tag: block,
        apikey: API_KEY, // TODO: add API key from hook?
      },
    });

    const result = [];

    for (const balance of response.data.result) {
      result.push({ ...balance, decimalBalance: formatUnits(balance.balance) });
    }

    console.dir(result);
    return result as AccountBalance[];
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}

/**
 *
 * Account Transactions
 *
 */
interface AccountTXConfig {
  startBlock?: number | string;
  endBlock?: number | string;
  // FIXME: txlistinternal has a different return shape
  action?: 'txlist' | 'txlistinternal';
  sort?: 'asc' | 'dsc';
  page?: number;
  offset?: number;
}

interface AccountTX {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
}

/**
 * Pass config.action: 'txlist' or 'txlistinternal' for standard/internal txs
 * respectivelly.
 *
 * @param address
 * @returns Array of tx objects
 */
export async function getAccountTxs(
  address: string,
  {
    startBlock = '0',
    endBlock = 'latest',
    action = 'txlist',
    sort = 'asc',
    page,
    offset,
  }: AccountTXConfig,
): Promise<AccountTX[]> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        module: 'account',
        action,
        address: address.toString(), // Turn array into comma separated string
        startBlock,
        endBlock,
        sort,
        ...(page && { page }),
        ...(offset && { offset }),
        apikey: API_KEY, // TODO: add API key from hook?
      },
    });

    return response.data.result as AccountTX[];
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}

/**
 *
 * ERC20 Transfers
 *
 */
interface AccountTokenTransferConfig {
  startBlock?: number | string;
  endBlock?: number | string;
  action?: 'tokentx' | 'tokennfttx';
  sort?: 'asc' | 'dsc';
  page?: number;
  offset?: number;
}

interface AccountTokenTransfer {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    from: string;
    contractAddress: string;
    to: string;
    tokenID: string;
    tokenName: string;
    tokenSymbol: string;
    tokenDecimal: string;
    transactionIndex: string;
    gas: string;
    gasPrice: string;
    gasUsed: string;
    cumulativeGasUsed: string;
    input: string;
    confirmations: string;
}

/**
 * Pass config.action: 'txlist' or 'txlistinternal' for standard/internal txs
 * respectivelly.
 *
 * @param address
 * @returns Array of tx objects
 */
export async function getAccountTokenTransfers(
  address: string,
  {
    startBlock = '0',
    endBlock = 'latest',
    action = 'tokentx',
    sort = 'asc',
    page,
    offset,
  }: AccountTokenTransferConfig,
): Promise<AccountTokenTransfer[]> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        module: 'account',
        action,
        address: address.toString(), // Turn array into comma separated string
        startBlock,
        endBlock,
        sort,
        ...(page && { page }),
        ...(offset && { offset }),
        apikey: API_KEY, // TODO: add API key from hook?
      },
    });

    return response.data.result as AccountTokenTransfer[];
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}
