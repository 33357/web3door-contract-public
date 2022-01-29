// import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
// import { Provider } from '@ethersproject/providers';

// export interface ERC721Client {
//   connect(
//     provider: Provider | Signer,
//     address: string,
//     waitConfirmations?: number
//   ): Promise<void>;

//   address(): string;

//   /* ================ VIEW FUNCTIONS ================ */

//   balanceOf(owner: string, config?: CallOverrides): Promise<BigNumber>;

//   ownerOf(tokenId: BigNumber, config?: CallOverrides): Promise<string>;

//   name(config?: CallOverrides): Promise<string>;

//   symbol(config?: CallOverrides): Promise<string>;

//   tokenURI(tokenId: BigNumber, config?: CallOverrides): Promise<string>;

//   getApproved(tokenId: BigNumber, config?: CallOverrides): Promise<string>;

//   isApprovedForAll(
//     owner: string,
//     operator: string,
//     config?: CallOverrides
//   ): Promise<boolean>;

//   /* ================ TRANSACTION FUNCTIONS ================ */

//   setApprovalForAll(
//     operator: string,
//     approved: boolean,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void>;

//   transferFrom(
//     from: string,
//     to: string,
//     tokenId: BigNumber,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void>;

//   approve(
//     to: string,
//     tokenId: BigNumber,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void>;
// }
