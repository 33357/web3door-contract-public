import {
  BigNumber,
  BytesLike,
  CallOverrides,
  PayableOverrides,
  Signature,
  Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import { ERC20Client } from '.';

export interface Web3GasClient extends ERC20Client {
  connect(
    provider: Provider | Signer,
    address?: string,
    waitConfirmations?: number
  ): Promise<void>;

  address(): string;

  /* ================ VIEW FUNCTIONS ================ */

  implementationVersion(config?: CallOverrides): Promise<string>;

  effectBlock(config?: CallOverrides): Promise<BigNumber>;

  lastEndBlock(address: string, config?: CallOverrides): Promise<BigNumber>;

  claimStartBlock(address: string, config?: CallOverrides): Promise<BigNumber>;

  claimSigner(config?: CallOverrides): Promise<string>;

  predictToken(
    gasAmount: BigNumber,
    config?: CallOverrides
  ): Promise<BigNumber>;

  gasMul(config?: CallOverrides): Promise<BigNumber>;

  /* ================ TRANSACTION FUNCTIONS ================ */

  claim(
    account: string,
    gasAmount: BigNumber,
    startBlock: BigNumber,
    endBlock: BigNumber,
    v: number,
    r: BytesLike,
    s: BytesLike,
    config?: PayableOverrides,
    callback?: Function
  ): Promise<void>;

  /* ================ UTIL FUNCTIONS ================ */

  signClaim(
    signer: Signer,
    account: string,
    amount: BigNumber,
    startBlock: BigNumber,
    endBlock: BigNumber
  ): Promise<Signature>;
}
