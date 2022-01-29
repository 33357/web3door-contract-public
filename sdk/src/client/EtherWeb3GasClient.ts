import { Provider } from '@ethersproject/providers';
import {
  BigNumber,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signer,
  utils,
  Signature
} from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { Web3GasClient, Web3Gas, Web3Gas__factory, DeploymentInfo } from '..';
import { EtherERC20Client } from './EtherERC20Client';

export class EtherWeb3GasClient extends EtherERC20Client
  implements Web3GasClient {
  private _web3Gas: Web3Gas | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherWeb3GasClient';
    if (!address) {
      let network;
      if (provider instanceof Signer) {
        if (provider.provider) {
          network = await provider.provider.getNetwork();
        }
      } else {
        network = await provider.getNetwork();
      }
      if (!network) {
        throw new Error(`${this._errorTitle}: no provider`);
      }
      if (!DeploymentInfo[network.chainId]) {
        throw new Error(`${this._errorTitle}: error chain`);
      }
      address = DeploymentInfo[network.chainId].Web3Gas.proxyAddress;
    }
    this._web3Gas = Web3Gas__factory.connect(address, provider);
    super.connect(provider, address, waitConfirmations);
  }

  public address(): string {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  public async implementationVersion(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.implementationVersion({ ...config });
  }

  public async lastEndBlock(
    address: string,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.lastEndBlock(address, { ...config });
  }

  public async effectBlock(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.effectBlock({ ...config });
  }

  public async claimStartBlock(
    address: string,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.claimStartBlock(address, { ...config });
  }

  public async claimSigner(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.claimSigner({ ...config });
  }

  public async predictToken(
    gasAmount: BigNumber,
    config?: CallOverrides
  ): Promise<BigNumber> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.predictToken(gasAmount, { ...config });
  }

  public async gasMul(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._web3Gas) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3Gas.gasMul({ ...config });
  }

  /* ================ TRANSACTION FUNCTIONS ================ */

  public async claim(
    account: string,
    gasAmount: BigNumber,
    startBlock: BigNumber,
    endBlock: BigNumber,
    v: number,
    r: BytesLike,
    s: BytesLike,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void> {
    if (
      !this._provider ||
      !this._web3Gas ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    const gas = await this._web3Gas
      .connect(this._provider)
      .estimateGas.claim(account, gasAmount, startBlock, endBlock, v, r, s, {
        ...config
      });
    const tx = await this._web3Gas
      .connect(this._provider)
      .claim(account, gasAmount, startBlock, endBlock, v, r, s, {
        gasLimit: gas.mul(13).div(10),
        ...config
      });
    if (callback) {
      callback(tx);
    }
    const rx = await tx.wait(this._waitConfirmations);
    if (callback) {
      callback(rx);
    }
  }

  /* ================ UTIL FUNCTIONS ================ */

  public async signClaim(
    signer: Signer,
    account: string,
    gasAmount: BigNumber,
    startBlock: BigNumber,
    endBlock: BigNumber
  ): Promise<Signature> {
    if (!this._web3Gas) {
      throw new Error(`${this._errorTitle}: no web3Gas`);
    }
    const domain = {
      name: await this._web3Gas.name(),
      version: await this._web3Gas.implementationVersion(),
      chainId: await signer.getChainId(),
      verifyingContract: this._web3Gas.address
    };
    const types = {
      claim: [
        { name: 'account', type: 'address' },
        { name: 'gasAmount', type: 'uint256' },
        { name: 'startBlock', type: 'uint256' },
        { name: 'endBlock', type: 'uint256' }
      ]
    };
    const value = {
      account,
      gasAmount,
      startBlock,
      endBlock
    };
    const signature = await (signer as SignerWithAddress)._signTypedData(
      domain,
      types,
      value
    );
    // console.log(domain,
    //   types,
    //   value)
    const vrs = utils.splitSignature(signature);
    return vrs;
  }
}
