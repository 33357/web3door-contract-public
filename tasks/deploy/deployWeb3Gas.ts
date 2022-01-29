import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {getImplementationAddress} from '@openzeppelin/upgrades-core';
import {PayableOverrides} from 'ethers';
import {
  EthersExecutionManager,
  getDeployment,
  setDeployment,
  LOCK_DIR,
  RETRY_NUMBER,
  log,
} from '../utils';
import {Web3GasConfig} from '../../config';

const contract = 'Web3Gas';
const taskName = `${contract}:deploy`;

task(taskName, `Deploy ${contract}`)
  .addOptionalParam('waitNum', 'The waitNum to transaction')
  .addOptionalParam('gasPrice', 'The gasPrice to transaction')
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    const txConfig: PayableOverrides = {};
    txConfig.gasPrice = args['gasPrice']
      ? hre.ethers.utils.parseUnits(args['gasPrice'], 'gwei')
      : undefined;
    const waitNum = args['waitNum'] ? parseInt(args['waitNum']) : 1;
    const ethersExecutionManager = new EthersExecutionManager(
      `${LOCK_DIR}/${taskName}.lock`,
      RETRY_NUMBER,
      waitNum
    );
    await ethersExecutionManager.load();
    const operator = (await hre.ethers.getSigners())[0];

    log.info(`deploy ${contract}`);
    const Web3Gas = await hre.ethers.getContractFactory(contract);
    const chainId = Number(await hre.getChainId());
    const deployWeb3GasResult = await ethersExecutionManager.transaction(
      (<any>hre).upgrades.deployProxy,
      [Web3Gas, [Web3GasConfig.signer[chainId]], {kind: 'uups'}],
      ['contractAddress', 'blockNumber'],
      `deploy ${contract}`,
      txConfig
    );
    const web3GasProxyAddress = deployWeb3GasResult.contractAddress;
    const web3GasImplAddress = await getImplementationAddress(
      hre.ethers.provider,
      web3GasProxyAddress
    );
    const web3GasFromBlock = deployWeb3GasResult.blockNumber;
    const web3Gas = Web3Gas.attach(web3GasProxyAddress);
    const web3GasVersion = await ethersExecutionManager.call(
      web3Gas.implementationVersion,
      [],
      `${contract} implementationVersion`
    );
    log.info(
      `${contract} deployed proxy at ${web3GasProxyAddress},impl at ${web3GasImplAddress},version ${web3GasVersion},fromBlock ${web3GasFromBlock}`
    );

    const deployment = await getDeployment(chainId);

    deployment.Web3Gas = {
      proxyAddress: web3GasProxyAddress,
      implAddress: web3GasImplAddress,
      version: web3GasVersion,
      contract: contract,
      operator: operator.address,
      fromBlock: web3GasFromBlock,
    };

    await setDeployment(chainId, deployment);

    ethersExecutionManager.printGas();
    ethersExecutionManager.deleteLock();
  });
