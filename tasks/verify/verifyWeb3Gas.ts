import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import * as utils from '../utils';

const contract = 'Web3Gas';
const taskName = `${contract}:verify`;

task(taskName, 'verify contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment) => {
    // parse deployment configuration
    const deployment = await utils.getDeployment(
      Number(await hre.getChainId())
    );
    utils.log.info(
      `verify ${contract},implAddress: ${deployment.Web3Gas.implAddress}`
    );
    await hre.run('verify:verify', {
      address: deployment.Web3Gas.implAddress,
      constructorArguments: [],
    });
  }
);
