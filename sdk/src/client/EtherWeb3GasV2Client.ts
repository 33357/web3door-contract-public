import { Provider } from '@ethersproject/providers';
import {
  BigNumber,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signer
} from 'ethers';
import { Web3GasV2Client, Web3GasV2, Web3GasV2__factory, DeploymentInfo } from '..';
import { EtherWeb3GasClient } from './EtherWeb3GasClient';

export class EtherWeb3GasV2Client extends EtherWeb3GasClient
  implements Web3GasV2Client {
  private _web3GasV2: Web3GasV2 | undefined;

  public async connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ) {
    this._errorTitle = 'EtherWeb3GasV2Client';
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
    this._web3GasV2 = Web3GasV2__factory.connect(address, provider);
    super.connect(provider, address, waitConfirmations);
  }

  public address(): string {
    if (!this._provider || !this._web3GasV2) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3GasV2.address;
  }

  /* ================ VIEW FUNCTIONS ================ */

  public async funder(config?: CallOverrides): Promise<string> {
    if (!this._provider || !this._web3GasV2) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3GasV2.funder({ ...config });
  }

  public async referShare(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._web3GasV2) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3GasV2.referShare({ ...config });
  }

  public async shareBase(config?: CallOverrides): Promise<BigNumber> {
    if (!this._provider || !this._web3GasV2) {
      throw new Error(`${this._errorTitle}: no provider`);
    }
    return this._web3GasV2.shareBase({ ...config });
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
    callback?: Function,
    refer?: string
  ): Promise<void> {
    if (
      !this._provider ||
      !this._web3GasV2 ||
      this._provider instanceof Provider
    ) {
      throw new Error(`${this._errorTitle}: no singer`);
    }
    if(!refer){
      refer = await this._web3GasV2.funder();
    }
    const gas = await this._web3GasV2
      .connect(this._provider)
      .estimateGas.claim(account, gasAmount, startBlock, endBlock,refer, v, r, s, {
        ...config
      });
    const tx = await this._web3GasV2
      .connect(this._provider)
      .claim(account, gasAmount, startBlock, endBlock,refer, v, r, s, {
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
}
