import EtherscanService from '../src/etherscan/etherscan.service';
import { ContractABI, parseABI } from '../src/utils/abi'
import { getConfig } from '../src/config';

const { baseUrl: BASE_URL, apiKey: API_KEY } = getConfig('bsc');

(async function () {
  const etherscanService = new EtherscanService(BASE_URL, API_KEY);
  const contractSourceCode = await etherscanService.getContractSourceCode('0x5c8D727b265DBAfaba67E050f2f739cAeEB4A6F9'); // MasterApe

  const parsedAbi = parseABI(contractSourceCode.ABI);
  console.dir({functions: parsedAbi.functions}, {depth:5});

  await Promise.resolve(console.log('🎉'));
  process.exit(0);
})();
