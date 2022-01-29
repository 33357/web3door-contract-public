// import '@nomiclabs/hardhat-ethers';
// import {task} from 'hardhat/config';
// import {HardhatRuntimeEnvironment} from 'hardhat/types';
// import {getImplementationAddress} from '@openzeppelin/upgrades-core';
// import {PayableOverrides} from 'ethers';
// import {
//   EthersExecutionManager,
//   getDeployment,
//   setDeployment,
//   LOCK_DIR,
//   RETRY_NUMBER,
//   log,
// } from '../utils';
// import {Web3NFTConfig} from '../../config';

// const taskName = 'Web3NFT:deploy';

// task(taskName, 'Deploy Web3NFT')
//   .addOptionalParam('waitNum', 'The waitNum to transaction')
//   .addOptionalParam('gasPrice', 'The gasPrice to transaction')
//   .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
//     const txConfig: PayableOverrides = {};
//     txConfig.gasPrice = args['gasPrice']
//       ? hre.ethers.utils.parseUnits(args['gasPrice'], 'gwei')
//       : undefined;
//     const waitNum = args['waitNum'] ? parseInt(args['waitNum']) : 1;
//     const ethersExecutionManager = new EthersExecutionManager(
//       `${LOCK_DIR}/${taskName}.lock`,
//       RETRY_NUMBER,
//       waitNum
//     );
//     await ethersExecutionManager.load();
//     const operator = (await hre.ethers.getSigners())[0];

//     log.info('deploy Web3NFT');
//     const Web3DoorNFT = await hre.ethers.getContractFactory('Web3NFT');
//     const deployWeb3NFTResult = await ethersExecutionManager.transaction(
//       (<any>hre).upgrades.deployProxy,
//       [
//         Web3DoorNFT,
//         [
//           Web3NFTConfig.fund,
//           Web3NFTConfig.dev,
//           Web3NFTConfig.pool,
//           Web3NFTConfig.baseURI,
//           Web3NFTConfig.lockBlock,
//         ],
//         {kind: 'uups'},
//       ],
//       ['contractAddress', 'blockNumber'],
//       'deploy Web3NFT',
//       txConfig
//     );
//     const web3NFTProxyAddress = deployWeb3NFTResult.contractAddress;
//     const web3NFTImplAddress = await getImplementationAddress(
//       hre.ethers.provider,
//       web3NFTProxyAddress
//     );
//     const web3NFTFromBlock = deployWeb3NFTResult.blockNumber;
//     const web3NFT = Web3DoorNFT.attach(web3NFTProxyAddress);
//     const web3NFTVersion = await ethersExecutionManager.call(
//       web3NFT.implementationVersion,
//       [],
//       'Web3NFT implementationVersion'
//     );
//     log.info(
//       `Web3NFT deployed proxy at ${web3NFTProxyAddress},impl at ${web3NFTImplAddress},version ${web3NFTVersion},fromBlock ${web3NFTFromBlock}`
//     );

//     const deployment = await getDeployment(hre.network.name);

//     deployment.Web3NFT = {
//       proxyAddress: web3NFTProxyAddress,
//       implAddress: web3NFTImplAddress,
//       version: web3NFTVersion,
//       contract: 'Web3NFT',
//       operator: operator.address,
//       fromBlock: web3NFTFromBlock,
//     };

//     await setDeployment(hre.network.name, deployment);

//     ethersExecutionManager.printGas();
//     ethersExecutionManager.deleteLock();
//   });
