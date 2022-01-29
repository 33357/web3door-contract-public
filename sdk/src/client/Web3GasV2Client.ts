import {
    BigNumber,
    BytesLike,
    CallOverrides,
    PayableOverrides,
    Signature,
    Signer
} from 'ethers';
import { Provider } from '@ethersproject/providers';
import { Web3GasClient } from '.';

export interface Web3GasV2Client extends Web3GasClient {
    connect(
        provider: Provider | Signer,
        address?: string,
        waitConfirmations?: number
    ): Promise<void>;

    address(): string;

    /* ================ VIEW FUNCTIONS ================ */

    funder(config?: CallOverrides): Promise<string>;

    referShare(config?: CallOverrides): Promise<BigNumber>;

    shareBase(config?: CallOverrides): Promise<BigNumber>;

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
        callback?: Function,
        refer?: string
    ): Promise<void>;
}
