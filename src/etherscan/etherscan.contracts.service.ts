import { getConfig } from '../config';
import axios from 'axios';
import { ContractABI, parseABI } from '../utils/abi'

// FIXME: provide a better way to handle this?
const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig('bsc');

/**
 *
 * Get verified contract ABI
 * 
 * @param address contract address
 * @returns ABI of contract
 */
export async function getContractABI(
  address: string,
): Promise<ContractABI> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        module: 'contract',
        action: 'getabi',
        address: address.toString(), // Turn array into comma separated string
        apikey: API_KEY, // TODO: add API key from hook?
      },
    });

    const parsedAbi = JSON.parse(response.data.result);    
    return parsedAbi;
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}

interface ContractSouceCode {
      SourceCode: string;
      ABI: string;
      ContractName: string;
      CompilerVersion: string;
      OptimizationUsed: string;
      Runs: string;
      ConstructorArguments: string;
      EVMVersion: string;
      Library: string;
      LicenseType: string;
      Proxy: string;
      Implementation: string;
      SwarmSource: string;
}

/**
 *
 * Get verified contract source code
 * 
 * @param address contract address
 * @returns Source code object
 */
export async function getContractSourceCode(
  address: string,
): Promise<ContractSouceCode> {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: address.toString(), // Turn array into comma separated string
        apikey: API_KEY, // TODO: add API key from hook?
      },
    });

    return response.data.result[0] as ContractSouceCode;
  } catch (error) {
    console.error(error);
    throw new Error(error as any);
  }
}
