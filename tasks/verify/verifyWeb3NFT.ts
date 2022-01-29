// import '@nomiclabs/hardhat-ethers';
// import { task } from 'hardhat/config';
// import { HardhatRuntimeEnvironment } from 'hardhat/types';
// import * as utils from '../utils';

// const taskName = 'Web3NFT:verify';

// task(taskName, 'verify contract').setAction(
//     async (_, hre: HardhatRuntimeEnvironment) => {
//         // parse deployment configuration
//         const deployment = await utils.getDeployment(hre.network.name);
//         utils.log.info(
//             `verify Web3NFT,Web3NFTAddress: ${deployment.Web3NFT.implAddress}`
//         );
//         await hre.run('verify:verify', {
//             address: deployment.Web3NFT.implAddress,
//             constructorArguments: [],
//         });
//     }
// );
