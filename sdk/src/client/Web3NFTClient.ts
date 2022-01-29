// import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
// import { Provider } from '@ethersproject/providers';
// import { ERC721Client } from '.';

// export interface Web3NFTClient extends ERC721Client {
//   connect(
//     provider: Provider | Signer,
//     address?: string,
//     waitConfirmations?: number
//   ): Promise<void>;

//   address(): string;

//   /* ================ VIEW FUNCTIONS ================ */

//   tokenURI(tokenId: BigNumber, config?: CallOverrides): Promise<string>;

//   implementationVersion(config?: CallOverrides): Promise<string>;

//   price(config?: CallOverrides): Promise<BigNumber>;

//   fund(config?: CallOverrides): Promise<string>;

//   fundShare(config?: CallOverrides): Promise<BigNumber>;

//   dev(config?: CallOverrides): Promise<string>;

//   devShare(config?: CallOverrides): Promise<BigNumber>;

//   pool(config?: CallOverrides): Promise<string>;

//   baseURI(config?: CallOverrides): Promise<string>;

//   basePrice(config?: CallOverrides): Promise<BigNumber>;

//   addPrice(config?: CallOverrides): Promise<BigNumber>;

//   lockBlock(config?: CallOverrides): Promise<BigNumber>;

//   accountLockToken(account: string, config?: CallOverrides): Promise<BigNumber>;

//   tokenLockBlock(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<BigNumber>;

//   tokenLockTime(tokenId: BigNumber, config?: CallOverrides): Promise<BigNumber>;

//   /* ================ TRANSACTION FUNCTIONS ================ */

//   buy(config?: PayableOverrides, callback?: Function): Promise<void>;

//   lock(
//     tokenId: BigNumber,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void>;

//   unlock(config?: PayableOverrides, callback?: Function): Promise<void>;
// }
