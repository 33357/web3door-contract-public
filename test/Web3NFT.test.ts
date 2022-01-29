// import {expect} from 'chai';
// import {ethers, getNamedAccounts, upgrades} from 'hardhat';
// import {BigNumber, Signer} from 'ethers';
// import {EtherWeb3DoorNFTClient, Web3DoorNFT} from '../sdk';
// import pino from 'pino';
// import {ERC20TEST} from '../sdk/src/typechain';
// import {Web3DoorNFTConfig} from '../config';

// const Logger = pino();

// describe('test Web3DoorNFT', function () {
//   let deployer: Signer;
//   let accountA: Signer;
//   let accountB: Signer;
//   let accountC: Signer;

//   before('setup accounts', async () => {
//     const NamedAccounts = await getNamedAccounts();
//     deployer = await ethers.getSigner(NamedAccounts.deployer);
//     accountA = await ethers.getSigner(NamedAccounts.accountA);
//     accountB = await ethers.getSigner(NamedAccounts.accountB);
//     accountC = await ethers.getSigner(NamedAccounts.accountC);
//   });

//   describe('test Web3DoorNFT sdk', function () {
//     const web3DoorNFT = new EtherWeb3DoorNFTClient();

//     beforeEach('deploy and init contract', async () => {
//       const Web3DoorNFT = await ethers.getContractFactory('Web3DoorNFT');
//       const web3DoorNFTResult = await upgrades.deployProxy(
//         Web3DoorNFT.connect(deployer),
//         [
//           await accountA.getAddress(),
//           await accountB.getAddress(),
//           await accountC.getAddress(),
//           Web3DoorNFTConfig.baseURI,
//           2,
//         ],
//         {
//           kind: 'uups',
//         }
//       );
//       await web3DoorNFT.connect(deployer, web3DoorNFTResult.address, 1);
//       Logger.info(`deployed Web3DoorNFT contract`);
//     });

//     it('check init data', async function () {
//       expect(await web3DoorNFT.implementationVersion()).equal('1.0.0');
//       expect(await web3DoorNFT.name()).equal('Web3DoorNFT');
//       expect(await web3DoorNFT.symbol()).equal('W3D-NFT');

//       expect(await web3DoorNFT.fund()).equal(await accountA.getAddress());
//       expect(await web3DoorNFT.fundShare()).equal(BigNumber.from(30));
//       expect(await web3DoorNFT.dev()).equal(await accountB.getAddress());
//       expect(await web3DoorNFT.devShare()).equal(BigNumber.from(10));
//       expect(await web3DoorNFT.pool()).equal(await accountC.getAddress());

//       expect(await web3DoorNFT.baseMul()).equal(BigNumber.from(5));
//       expect(await web3DoorNFT.tokenMul()).equal(BigNumber.from(50));
//       expect(await web3DoorNFT.baseURI()).equal(Web3DoorNFTConfig.baseURI);
//       expect(await web3DoorNFT.basePrice()).equal(
//         BigNumber.from((10 ** 17).toString())
//       );
//       expect(await web3DoorNFT.addPrice()).equal(
//         BigNumber.from((10 ** 17).toString()).div(100)
//       );
//       expect(await web3DoorNFT.lockBlock()).equal(BigNumber.from(2));
//       expect(await web3DoorNFT.price()).equal(await web3DoorNFT.basePrice());
//       expect(await web3DoorNFT.accountMul(await accountA.getAddress())).equal(
//         await web3DoorNFT.baseMul()
//       );
//     });

//     it('check buy', async function () {
//       const balanceA = await accountA.getBalance();
//       const balanceB = await accountB.getBalance();
//       const balanceC = await accountC.getBalance();
//       const value = await web3DoorNFT.price();
//       await expect(web3DoorNFT.buy()).revertedWith('Web3DoorNFT: low value');
//       await web3DoorNFT.buy({value});
//       expect(await accountA.getBalance()).equal(
//         balanceA.add(value.mul(await web3DoorNFT.fundShare()).div(100))
//       );
//       expect(await accountB.getBalance()).equal(
//         balanceB.add(value.mul(await web3DoorNFT.devShare()).div(100))
//       );
//       expect(await accountC.getBalance()).equal(
//         balanceC.add(
//           value
//             .sub(value.mul(await web3DoorNFT.fundShare()).div(100))
//             .sub(value.mul(await web3DoorNFT.devShare()).div(100))
//         )
//       );
//       expect(await web3DoorNFT.price()).equal(
//         (await web3DoorNFT.basePrice()).add(await web3DoorNFT.addPrice())
//       );
//       expect(await web3DoorNFT.tokenURI(BigNumber.from(1))).equal(
//         `${await web3DoorNFT.baseURI()}1`
//       );
//     });

//     it('check lock', async function () {
//       await web3DoorNFT.buy({value: await web3DoorNFT.price()});
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(1))).equal(
//         BigNumber.from(3)
//       );
//       expect(await web3DoorNFT.tokenLockBlock(BigNumber.from(1))).equal(
//         BigNumber.from(0)
//       );
//       expect(
//         await web3DoorNFT.accountLockToken(await deployer.getAddress())
//       ).equal(BigNumber.from(0));

//       await web3DoorNFT.connect(accountA, web3DoorNFT.address(), 1);
//       await expect(web3DoorNFT.lock(BigNumber.from(1))).revertedWith(
//         'Web3DoorNFT: not owner'
//       );

//       await web3DoorNFT.connect(deployer, web3DoorNFT.address(), 1);
//       await web3DoorNFT.lock(BigNumber.from(1));
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(1))).equal(
//         BigNumber.from(2)
//       );
//       expect(await web3DoorNFT.tokenLockBlock(BigNumber.from(1))).equal(
//         await ethers.provider.getBlockNumber()
//       );
//       expect(
//         await web3DoorNFT.accountLockToken(await deployer.getAddress())
//       ).equal(BigNumber.from(1));
//       expect(await web3DoorNFT.accountMul(await deployer.getAddress())).equal(
//         await web3DoorNFT.tokenMul()
//       );
//       await expect(
//         web3DoorNFT.transferFrom(
//           await deployer.getAddress(),
//           await accountA.getAddress(),
//           BigNumber.from(1)
//         )
//       ).revertedWith('Web3DoorNFT: locked token');

//       await web3DoorNFT.buy({value: await web3DoorNFT.price()});
//       await web3DoorNFT.lock(BigNumber.from(2));
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(2))).equal(
//         BigNumber.from(2)
//       );
//       expect(await web3DoorNFT.tokenLockBlock(BigNumber.from(2))).equal(
//         await ethers.provider.getBlockNumber()
//       );
//       expect(
//         await web3DoorNFT.accountLockToken(await deployer.getAddress())
//       ).equal(BigNumber.from(2));
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(1))).equal(
//         BigNumber.from(2)
//       );
//       expect(await web3DoorNFT.tokenLockBlock(BigNumber.from(1))).equal(
//         BigNumber.from(0)
//       );
//     });

//     it('check unlock', async function () {
//       await web3DoorNFT.buy({value: await web3DoorNFT.price()});
//       await expect(web3DoorNFT.unlock()).revertedWith(
//         'Web3DoorNFT: no locked token'
//       );
//       await web3DoorNFT.lock(BigNumber.from(1));
//       await expect(web3DoorNFT.unlock()).revertedWith(
//         'Web3DoorNFT: not over lock time'
//       );
//       await web3DoorNFT.buy({value: await web3DoorNFT.price()});
//       await web3DoorNFT.unlock();
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(1))).equal(
//         BigNumber.from(2)
//       );
//       expect(await web3DoorNFT.tokenLockBlock(BigNumber.from(1))).equal(
//         BigNumber.from(0)
//       );
//       expect(
//         await web3DoorNFT.accountLockToken(await deployer.getAddress())
//       ).equal(BigNumber.from(0));

//       await web3DoorNFT.lock(BigNumber.from(1));
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(1))).equal(
//         BigNumber.from(1)
//       );
//       await web3DoorNFT.buy({value: await web3DoorNFT.price()});
//       await web3DoorNFT.unlock();
//       await web3DoorNFT.lock(BigNumber.from(1));
//       expect(await web3DoorNFT.tokenLockTime(BigNumber.from(1))).equal(
//         BigNumber.from(0)
//       );
//       await web3DoorNFT.buy({value: await web3DoorNFT.price()});
//       await web3DoorNFT.unlock();
//       await expect(web3DoorNFT.tokenURI(BigNumber.from(1))).revertedWith(
//         'ERC721Metadata: URI query for nonexistent token'
//       );
//     });
//   });

//   describe('test Web3DoorNFT contract', function () {
//     let web3DoorNFT: Web3DoorNFT;
//     let erc20: ERC20TEST;

//     beforeEach('deploy and init contract', async () => {
//       const ERC20 = await ethers.getContractFactory('ERC20_TEST');
//       erc20 = (await ERC20.connect(deployer).deploy()) as ERC20TEST;
//       Logger.info(`deployed ERC20 contract`);

//       const Web3DoorNFT = await ethers.getContractFactory('Web3DoorNFT');
//       web3DoorNFT = (await upgrades.deployProxy(
//         Web3DoorNFT.connect(deployer),
//         [
//           await accountA.getAddress(),
//           await accountB.getAddress(),
//           await accountC.getAddress(),
//           Web3DoorNFTConfig.baseURI,
//           2,
//         ],
//         {
//           kind: 'uups',
//         }
//       )) as Web3DoorNFT;
//       Logger.info(`deployed Web3DoorNFT contract`);
//     });

//     it('check admin', async function () {
//       const Web3DoorNFT = await ethers.getContractFactory('Web3DoorNFT');
//       await expect(
//         upgrades.upgradeProxy(
//           web3DoorNFT.address,
//           Web3DoorNFT.connect(accountA),
//           {
//             kind: 'uups',
//           }
//         )
//       ).revertedWith('Web3DoorNFT: require admin permission');
//       await upgrades.upgradeProxy(
//         web3DoorNFT.address,
//         Web3DoorNFT.connect(deployer),
//         {
//           kind: 'uups',
//         }
//       );

//       await expect(web3DoorNFT.connect(accountA).pause()).revertedWith(
//         'Web3DoorNFT: require admin permission'
//       );
//       await web3DoorNFT.connect(deployer).pause();
//       expect(await web3DoorNFT.paused()).equal(true);

//       await expect(web3DoorNFT.connect(accountA).unpause()).revertedWith(
//         'Web3DoorNFT: require admin permission'
//       );
//       await web3DoorNFT.connect(deployer).unpause();
//       expect(await web3DoorNFT.paused()).equal(false);

//       await expect(web3DoorNFT.connect(accountA).setBaseURI('/')).revertedWith(
//         'Web3DoorNFT: require admin permission'
//       );
//       await web3DoorNFT.connect(deployer).setBaseURI('/');
//       expect(await web3DoorNFT.baseURI()).equal('/');

//       await expect(web3DoorNFT.connect(accountA).setMul(3, 30)).revertedWith(
//         'Web3DoorNFT: require admin permission'
//       );
//       await web3DoorNFT.connect(deployer).setMul(3, 30);
//       expect(await web3DoorNFT.baseMul()).equal(BigNumber.from(3));
//       expect(await web3DoorNFT.tokenMul()).equal(BigNumber.from(30));

//       await expect(
//         web3DoorNFT.connect(accountA).setPrice(
//           BigNumber.from((10 ** 17).toString()).mul(2),
//           BigNumber.from((10 ** 17).toString())
//             .div(100)
//             .mul(2)
//         )
//       ).revertedWith('Web3DoorNFT: require admin permission');
//       await web3DoorNFT.connect(deployer).setPrice(
//         BigNumber.from((10 ** 17).toString()).mul(2),
//         BigNumber.from((10 ** 17).toString())
//           .div(100)
//           .mul(2)
//       );
//       expect(await web3DoorNFT.basePrice()).equal(
//         BigNumber.from((10 ** 17).toString()).mul(2)
//       );
//       expect(await web3DoorNFT.addPrice()).equal(
//         BigNumber.from((10 ** 17).toString())
//           .div(100)
//           .mul(2)
//       );

//       await expect(
//         web3DoorNFT
//           .connect(accountA)
//           .setLockBlock(BigNumber.from((100 * 24 * 60 * 60) / 3).mul(2))
//       ).revertedWith('Web3DoorNFT: require admin permission');
//       await web3DoorNFT
//         .connect(deployer)
//         .setLockBlock(BigNumber.from((100 * 24 * 60 * 60) / 3).mul(2));
//       expect(await web3DoorNFT.lockBlock()).equal(
//         BigNumber.from((100 * 24 * 60 * 60) / 3).mul(2)
//       );

//       await expect(
//         web3DoorNFT
//           .connect(accountA)
//           .setLockBlock(BigNumber.from((100 * 24 * 60 * 60) / 3).mul(2))
//       ).revertedWith('Web3DoorNFT: require admin permission');
//       await web3DoorNFT
//         .connect(deployer)
//         .setLockBlock(BigNumber.from((100 * 24 * 60 * 60) / 3).mul(2));
//       expect(await web3DoorNFT.lockBlock()).equal(
//         BigNumber.from((100 * 24 * 60 * 60) / 3).mul(2)
//       );

//       await expect(web3DoorNFT.connect(accountA).setShare(20, 20)).revertedWith(
//         'Web3DoorNFT: require admin permission'
//       );
//       await web3DoorNFT.connect(deployer).setShare(20, 20);
//       expect(await web3DoorNFT.fundShare()).equal(BigNumber.from(20));
//       expect(await web3DoorNFT.devShare()).equal(BigNumber.from(20));

//       await expect(
//         web3DoorNFT
//           .connect(accountA)
//           .setShareAddress(
//             await accountA.getAddress(),
//             await accountA.getAddress(),
//             await accountA.getAddress()
//           )
//       ).revertedWith('Web3DoorNFT: require admin permission');
//       await web3DoorNFT
//         .connect(deployer)
//         .setShareAddress(
//           await accountA.getAddress(),
//           await accountA.getAddress(),
//           await accountA.getAddress()
//         );
//       expect(await web3DoorNFT.fund()).equal(await accountA.getAddress());
//       expect(await web3DoorNFT.dev()).equal(await accountA.getAddress());
//       expect(await web3DoorNFT.pool()).equal(await accountA.getAddress());

//       await erc20.transfer(web3DoorNFT.address, BigNumber.from(100));
//       await expect(
//         web3DoorNFT
//           .connect(accountA)
//           .transferAnyERC20Token(
//             erc20.address,
//             await accountA.getAddress(),
//             BigNumber.from(100)
//           )
//       ).revertedWith('Web3DoorNFT: require admin permission');
//       await web3DoorNFT
//         .connect(deployer)
//         .transferAnyERC20Token(
//           erc20.address,
//           await accountA.getAddress(),
//           BigNumber.from(100)
//         );
//       expect(await erc20.balanceOf(await accountA.getAddress())).equal(
//         BigNumber.from(100)
//       );
//     });
//   });
// });
