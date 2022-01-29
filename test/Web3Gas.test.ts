import {expect} from 'chai';
import {ethers, getNamedAccounts, upgrades} from 'hardhat';
import {BigNumber, Signer} from 'ethers';
import {EtherWeb3GasClient, Web3Gas} from '../sdk/dist';
import pino from 'pino';
import {ERC20TEST} from '../sdk/src/typechain';

const Logger = pino();

describe('test Web3Gas', function () {
  let deployer: Signer;
  let accountA: Signer;

  before('setup accounts', async () => {
    const NamedAccounts = await getNamedAccounts();
    deployer = await ethers.getSigner(NamedAccounts.deployer);
    accountA = await ethers.getSigner(NamedAccounts.accountA);
  });

  describe('test Web3Gas sdk', function () {
    const web3Gas = new EtherWeb3GasClient();

    beforeEach('deploy and init contract', async () => {
      const Web3Gas = await ethers.getContractFactory('Web3Gas');
      const web3GasResult = await upgrades.deployProxy(
        Web3Gas.connect(deployer),
        [await accountA.getAddress()],
        {
          kind: 'uups',
        }
      );
      await web3Gas.connect(deployer, web3GasResult.address, 1);
      Logger.info(`deployed Web3Gas contract`);
    });

    it('check init data', async function () {
      expect(await web3Gas.implementationVersion()).equal('1.0.0');
      expect(await web3Gas.name()).equal('Web3Gas');
      expect(await web3Gas.symbol()).equal('W3G');
      expect(await web3Gas.claimSigner()).equal(await accountA.getAddress());
      expect(await web3Gas.effectBlock()).equal(
        BigNumber.from((7 * 24 * 60 * 60) / 3)
      );
      expect(await web3Gas.gasMul()).equal(BigNumber.from(10000));
    });

    it('check claim', async function () {
      const signData = {
        account: await deployer.getAddress(),
        amount: BigNumber.from((10 ** 18).toString()),
        startBlock: BigNumber.from(1),
        endBlock: BigNumber.from(3),
      };
      const signature = await web3Gas.signClaim(
        accountA,
        signData.account,
        signData.amount,
        signData.startBlock,
        signData.endBlock
      );
      await web3Gas.claim(
        signData.account,
        signData.amount,
        signData.startBlock,
        signData.endBlock,
        signature.v,
        signature.r,
        signature.s
      );
      expect(await web3Gas.balanceOf(signData.account)).equal(
        signData.amount.mul(await web3Gas.gasMul())
      );
      expect(await web3Gas.lastEndBlock(signData.account)).equal(
        BigNumber.from(3)
      );

      const signData2 = {
        account: await deployer.getAddress(),
        amount: BigNumber.from((10 ** 18).toString()),
        startBlock: BigNumber.from(2),
        endBlock: BigNumber.from(4),
      };
      const signature2 = await web3Gas.signClaim(
        accountA,
        signData2.account,
        signData2.amount,
        signData2.startBlock,
        signData2.endBlock
      );
      await expect(
        web3Gas.claim(
          signData2.account,
          signData2.amount,
          signData2.startBlock,
          signData2.endBlock,
          signature2.v,
          signature2.r,
          signature2.s
        )
      ).revertedWith('Web3Gas: startBlock must over claimEndBlock');

      const signData3 = {
        account: await deployer.getAddress(),
        amount: BigNumber.from((10 ** 18).toString()),
        startBlock: BigNumber.from(3),
        endBlock: BigNumber.from(3),
      };
      const signature3 = await web3Gas.signClaim(
        accountA,
        signData3.account,
        signData3.amount,
        signData3.startBlock,
        signData3.endBlock
      );
      await expect(
        web3Gas.claim(
          signData3.account,
          signData3.amount,
          signData3.startBlock,
          signData3.endBlock,
          signature3.v,
          signature3.r,
          signature3.s
        )
      ).revertedWith('Web3Gas: startBlock must over endBlock');

      const signData4 = {
        account: await deployer.getAddress(),
        amount: BigNumber.from((10 ** 18).toString()),
        startBlock: BigNumber.from(3),
        endBlock: BigNumber.from(4),
      };
      const signature4 = await web3Gas.signClaim(
        deployer,
        signData4.account,
        signData4.amount,
        signData4.startBlock,
        signData4.endBlock
      );
      await expect(
        web3Gas.claim(
          signData4.account,
          signData4.amount,
          signData4.startBlock,
          signData4.endBlock.add(1),
          signature4.v,
          signature4.r,
          signature4.s
        )
      ).revertedWith('Web3Gas: not claimSigner');
    });
  });

  describe('test Web3Gas contract', function () {
    let web3Gas: Web3Gas;
    let erc20: ERC20TEST;

    beforeEach('deploy and init contract', async () => {
      const ERC20 = await ethers.getContractFactory('ERC20_TEST');
      erc20 = (await ERC20.connect(deployer).deploy()) as ERC20TEST;
      Logger.info(`deployed ERC20 contract`);

      const Web3Gas = await ethers.getContractFactory('Web3Gas');
      web3Gas = (await upgrades.deployProxy(
        Web3Gas.connect(deployer),
        [await accountA.getAddress()],
        {
          kind: 'uups',
        }
      )) as Web3Gas;
      Logger.info(`deployed Web3Gas contract`);
    });

    it('check admin', async function () {
      const Web3Gas = await ethers.getContractFactory('Web3Gas');
      await expect(
        upgrades.upgradeProxy(web3Gas.address, Web3Gas.connect(accountA), {
          kind: 'uups',
        })
      ).revertedWith('Web3Gas: require admin permission');
      await upgrades.upgradeProxy(web3Gas.address, Web3Gas.connect(deployer), {
        kind: 'uups',
      });

      await expect(web3Gas.connect(accountA).pause()).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3Gas.connect(deployer).pause();
      expect(await web3Gas.paused()).equal(true);

      await expect(web3Gas.connect(accountA).unpause()).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3Gas.connect(deployer).unpause();
      expect(await web3Gas.paused()).equal(false);

      await expect(
        web3Gas.connect(accountA).setClaimSigner(await deployer.getAddress())
      ).revertedWith('Web3Gas: require admin permission');
      await web3Gas
        .connect(deployer)
        .setClaimSigner(await deployer.getAddress());
      expect(await web3Gas.claimSigner()).equal(await deployer.getAddress());

      await expect(web3Gas.connect(accountA).setGasMul(100)).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3Gas.connect(deployer).setGasMul(100);
      expect(await web3Gas.gasMul()).equal(BigNumber.from(100));

      await expect(web3Gas.connect(accountA).setEffectBlock(1)).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3Gas.connect(deployer).setEffectBlock(1);
      expect(await web3Gas.effectBlock()).equal(1);

      await erc20.transfer(web3Gas.address, BigNumber.from(100));
      await expect(
        web3Gas
          .connect(accountA)
          .transferAnyERC20Token(
            erc20.address,
            await accountA.getAddress(),
            BigNumber.from(100)
          )
      ).revertedWith('Web3Gas: require admin permission');
      await web3Gas
        .connect(deployer)
        .transferAnyERC20Token(
          erc20.address,
          await accountA.getAddress(),
          BigNumber.from(100)
        );
      expect(await erc20.balanceOf(await accountA.getAddress())).equal(
        BigNumber.from(100)
      );
    });
  });
});
