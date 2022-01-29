// import { Provider } from '@ethersproject/providers';
// import { BigNumber, CallOverrides, PayableOverrides, Signer } from 'ethers';
// import {
//   Web3NFTClient,
//   Web3NFT,
//   Web3NFT__factory,
//   DeploymentInfo,
//   NETWORK
// } from '..';
// import { EtherERC721Client } from './EtherERC721Client';

// export class EtherWeb3NFTClient extends EtherERC721Client
//   implements Web3NFTClient {
//   private _web3NFT: Web3NFT | undefined;

//   public async connect(
//     provider: Provider | Signer,
//     address?: string,
//     waitConfirmations?: number
//   ) {
//     this._errorTitle = 'EtherWeb3NFTClient';
//     if (!address) {
//       let network;
//       if (provider instanceof Signer) {
//         if(provider.provider){
//           network = await provider.provider.getNetwork();
//         }
//       } else {
//         network = await provider.getNetwork();
//       }
//       if (
//         network&&
//         network.chainId &&
//         NETWORK[network.chainId] &&
//         DeploymentInfo[NETWORK[network.chainId]].Web3NFT
//       ) {
//         address =
//           DeploymentInfo[NETWORK[network.chainId]].Web3NFT.proxyAddress;
//       } else {
//         throw new Error(`${this._errorTitle}: no network`);
//       }
//     }
//     this._web3NFT = Web3NFT__factory.connect(address, provider);
//     super.connect(provider, address, waitConfirmations);
//   }

//   public address(): string {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.address;
//   }

//   /* ================ VIEW FUNCTIONS ================ */

//   public async tokenURI(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<string> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.tokenURI(tokenId, { ...config });
//   }

//   public async implementationVersion(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.implementationVersion({ ...config });
//   }

//   public async price(config?: CallOverrides): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.price({ ...config });
//   }

//   public async fund(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.fund({ ...config });
//   }

//   public async fundShare(config?: CallOverrides): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.fundShare({ ...config });
//   }

//   public async dev(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.dev({ ...config });
//   }

//   public async devShare(config?: CallOverrides): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.devShare({ ...config });
//   }

//   public async pool(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.pool({ ...config });
//   }

//   public async baseURI(config?: CallOverrides): Promise<string> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.baseURI({ ...config });
//   }

//   public async basePrice(config?: CallOverrides): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.basePrice({ ...config });
//   }

//   public async addPrice(config?: CallOverrides): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.addPrice({ ...config });
//   }

//   public async lockBlock(config?: CallOverrides): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.lockBlock({ ...config });
//   }

//   public async accountLockToken(
//     account: string,
//     config?: CallOverrides
//   ): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.accountLockToken(account, { ...config });
//   }

//   public async tokenLockBlock(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.tokenLockBlock(tokenId, { ...config });
//   }

//   public async tokenLockTime(
//     tokenId: BigNumber,
//     config?: CallOverrides
//   ): Promise<BigNumber> {
//     if (!this._provider || !this._web3NFT) {
//       throw new Error(`${this._errorTitle}: no provider`);
//     }
//     return this._web3NFT.tokenLockTime(tokenId, { ...config });
//   }

//   /* ================ TRANSACTION FUNCTIONS ================ */

//   async buy(config?: PayableOverrides, callback?: Function): Promise<void> {
//     if (
//       !this._provider ||
//       !this._web3NFT ||
//       this._provider instanceof Provider
//     ) {
//       throw new Error(`${this._errorTitle}: no singer`);
//     }
//     const gas = await this._web3NFT
//       .connect(this._provider)
//       .estimateGas.buy({
//         ...config
//       });
//     const tx = await this._web3NFT.connect(this._provider).buy({
//       gasLimit: gas.mul(13).div(10),
//       ...config
//     });
//     if (callback) {
//       callback(tx);
//     }
//     const rx = await tx.wait(this._waitConfirmations);
//     if (callback) {
//       callback(rx);
//     }
//   }

//   async lock(
//     tokenId: BigNumber,
//     config?: PayableOverrides,
//     callback?: Function
//   ): Promise<void> {
//     if (
//       !this._provider ||
//       !this._web3NFT ||
//       this._provider instanceof Provider
//     ) {
//       throw new Error(`${this._errorTitle}: no singer`);
//     }
//     const gas = await this._web3NFT
//       .connect(this._provider)
//       .estimateGas.lock(tokenId, {
//         ...config
//       });
//     const tx = await this._web3NFT.connect(this._provider).lock(tokenId, {
//       gasLimit: gas.mul(13).div(10),
//       ...config
//     });
//     if (callback) {
//       callback(tx);
//     }
//     const rx = await tx.wait(this._waitConfirmations);
//     if (callback) {
//       callback(rx);
//     }
//   }

//   async unlock(config?: PayableOverrides, callback?: Function): Promise<void> {
//     if (
//       !this._provider ||
//       !this._web3NFT ||
//       this._provider instanceof Provider
//     ) {
//       throw new Error(`${this._errorTitle}: no singer`);
//     }
//     const gas = await this._web3NFT
//       .connect(this._provider)
//       .estimateGas.unlock({
//         ...config
//       });
//     const tx = await this._web3NFT.connect(this._provider).unlock({
//       gasLimit: gas.mul(13).div(10),
//       ...config
//     });
//     if (callback) {
//       callback(tx);
//     }
//     const rx = await tx.wait(this._waitConfirmations);
//     if (callback) {
//       callback(rx);
//     }
//   }
// }
