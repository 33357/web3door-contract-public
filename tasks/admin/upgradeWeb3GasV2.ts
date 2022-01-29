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
import {Web3GasV2} from '../../sdk/dist';
import {Web3GasConfig} from '../../config';

const taskName = `Web3GasV2:upgrade`;

task(taskName, `Upgrade Web3GasV2`)
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

    log.info(`upgrade Web3GasV2`);
    const Web3GasV2 = await hre.ethers.getContractFactory('Web3GasV2');
    const chainId = Number(await hre.getChainId());
    const deployment = await getDeployment(chainId);
    const web3GasProxyAddress = deployment.Web3Gas.proxyAddress;
    await ethersExecutionManager.transaction(
      (<any>hre).upgrades.upgradeProxy,
      [web3GasProxyAddress, Web3GasV2],
      [],
      `upgrade Web3GasV2`,
      txConfig
    );
    const web3GasImplAddress = await getImplementationAddress(
      hre.ethers.provider,
      web3GasProxyAddress
    );
    const web3GasV2 = Web3GasV2.connect(operator).attach(
      web3GasProxyAddress
    ) as Web3GasV2;
    const web3GasVersion = await ethersExecutionManager.call(
      web3GasV2.implementationVersion,
      [],
      `Web3GasV2 implementationVersion`
    );

    log.info(
      `Web3GasV2 upgrade proxy at ${web3GasProxyAddress},impl at ${web3GasImplAddress},version ${web3GasVersion}`
    );

    await ethersExecutionManager.transaction(
      web3GasV2.setFunder,
      [Web3GasConfig.funder],
      [],
      `web3GasV2 setFunder`,
      txConfig
    );

    log.info(`Web3GasV2 setFunder ${Web3GasConfig.funder}`);

    await ethersExecutionManager.transaction(
      web3GasV2.setShare,
      [
        Web3GasConfig.referShare,
        Web3GasConfig.funderShare,
        Web3GasConfig.shareBase,
      ],
      [],
      `web3GasV2 setShare`,
      txConfig
    );

    log.info(
      `Web3GasV2 setShare ${Web3GasConfig.referShare} ${Web3GasConfig.funderShare} ${Web3GasConfig.shareBase}`
    );

    deployment.Web3Gas = {
      proxyAddress: deployment.Web3Gas.proxyAddress,
      implAddress: web3GasImplAddress,
      version: web3GasVersion,
      contract: 'Web3GasV2',
      operator: operator.address,
      fromBlock: deployment.Web3Gas.fromBlock,
    };

    await setDeployment(chainId, deployment);

    ethersExecutionManager.printGas();
    ethersExecutionManager.deleteLock();
  });
