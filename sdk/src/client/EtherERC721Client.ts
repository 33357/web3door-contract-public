// import { Provider } from '@ethersproject/providers';
// import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
// import { ERC721Client } from '..';
// import { ERC721Upgradeable, ERC721Upgradeable__factory } from '../typechain';

// export class EtherERC721Client implements ERC721Client {
//   private _erc721: ERC721Upgradeable | undefined;
//   protected _provider: Provider | Signer | undefined;
//   protected _waitConfirmations = 5;
//   protected _errorTitle = 'EtherERC721Client';

//   public async connect(
//     provider: Provider | Signer,
//     address: string,
//     waitConfirmations?: number
//   ) {
//     this._erc721 = ERC721Upgradeable__factory.connect(address, provider);
//     if (waitConfirmations) {
//       this._waitConfirmations = waitConfirmations;
//     }
//     this._provider = provider;
//   }

//   public address(): string {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._erc721.address;
//   }

//   /* ================ VIEW FUNCTIONS ================ */

//   public async balanceOf(
//     owner: string,
//     config?: CallOverrides
//   ): Promise<BigNumber> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.balanceOf(owner, { ...config });
//   }

//   public async ownerOf(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<string> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.ownerOf(tokenId, { ...config });
//   }

//   public async name(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.name({ ...config });
//   }

//   public async symbol(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.symbol({ ...config });
//   }

//   public async tokenURI(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<string> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.tokenURI(tokenId, { ...config });
//   }

//   public async getApproved(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<string> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.getApproved(tokenId, { ...config });
//   }

//   public async isApprovedForAll(
//     owner: string,
//     operator: string,
//     config?: CallOverrides
//   ): Promise<boolean> {
//     if (!this._provider || !this._erc721) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return await this._erc721.isApprovedForAll(owner, operator, { ...config });
//   }

//   /* ================ TRANSACTION FUNCTIONS ================ */

//   public async transferFrom(
//     from: string,
//     to: string,
//     tokenId: BigNumber,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void> {
//     if (
//       !this._provider ||
//       !this._erc721 ||
//       this._provider instanceof Provider
//     ) {
//       throw new Error(`${this._errorTitle}: no singer`);
//     }
//     const gas = await this._erc721
//       .connect(this._provider)
//       .estimateGas.transferFrom(from, to, tokenId, { ...config });
//     const transaction = await this._erc721
//       .connect(this._provider)
//       .transferFrom(from, to, tokenId, {
//         gasLimit: gas.mul(13).div(10),
//         ...config
//       });
//     if (callback) {
//       callback(transaction);
//     }
//     const receipt = await transaction.wait(this._waitConfirmations);
//     if (callback) {
//       callback(receipt);
//     }
//   }

//   public async setApprovalForAll(
//     operator: string,
//     approved: boolean,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void> {
//     if (
//       !this._provider ||
//       !this._erc721 ||
//       this._provider instanceof Provider
//     ) {
//       throw new Error(`${this._errorTitle}: no singer`);
//     }
//     const gas = await this._erc721
//       .connect(this._provider)
//       .estimateGas.setApprovalForAll(operator, approved, { ...config });
//     const transaction = await this._erc721
//       .connect(this._provider)
//       .setApprovalForAll(operator, approved, {
//         gasLimit: gas.mul(13).div(10),
//         ...config
//       });
//     if (callback) {
//       callback(transaction);
//     }
//     const receipt = await transaction.wait(this._waitConfirmations);
//     if (callback) {
//       callback(receipt);
//     }
//   }

//   public async approve(
//     to: string,
//     tokenId: BigNumber,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void> {
//     if (
//       !this._provider ||
//       !this._erc721 ||
//       this._provider instanceof Provider
//     ) {
//       throw new Error(`${this._errorTitle}: no singer`);
//     }
//     const gas = await this._erc721
//       .connect(this._provider)
//       .estimateGas.approve(to, tokenId, { ...config });
//     const transaction = await this._erc721
//       .connect(this._provider)
//       .approve(to, tokenId, { gasLimit: gas.mul(13).div(10), ...config });
//     if (callback) {
//       callback(transaction);
//     }
//     const receipt = await transaction.wait(this._waitConfirmations);
//     if (callback) {
//       callback(receipt);
//     }
//   }
// }
