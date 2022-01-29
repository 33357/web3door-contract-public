import {expect} from 'chai';
import {ethers, getNamedAccounts, upgrades} from 'hardhat';
import {BigNumber, Signer} from 'ethers';
import {EtherWeb3GasV2Client, Web3GasV2, Web3Gas} from '../sdk/dist';
import pino from 'pino';
import {ERC20TEST} from '../sdk/src/typechain';
import {Web3GasConfig} from '../config';

const Logger = pino();

describe('test Web3GasV2', function () {
  let deployer: Signer;
  let accountA: Signer;

  before('setup accounts', async () => {
    const NamedAccounts = await getNamedAccounts();
    deployer = await ethers.getSigner(NamedAccounts.deployer);
    accountA = await ethers.getSigner(NamedAccounts.accountA);
  });

  describe('test Web3GasV2 sdk', function () {
    const web3GasV2 = new EtherWeb3GasV2Client();

    beforeEach('deploy and init contract', async () => {
      const Web3Gas = await ethers.getContractFactory('Web3Gas');
      const Web3GasV2 = await ethers.getContractFactory('Web3GasV2');
      const web3GasResult = await upgrades.deployProxy(
        Web3Gas.connect(deployer),
        [await accountA.getAddress()],
        {
          kind: 'uups',
        }
      );
      await upgrades.upgradeProxy(web3GasResult.address, Web3GasV2);
      await web3GasV2.connect(deployer, web3GasResult.address, 1);
      const _web3GasV2 = Web3GasV2.connect(deployer).attach(
        web3GasResult.address
      ) as Web3GasV2;
      await _web3GasV2.setFunder(Web3GasConfig.funder);
      await _web3GasV2.setShare(
        Web3GasConfig.referShare,
        Web3GasConfig.funderShare,
        Web3GasConfig.shareBase
      );

      Logger.info(`deployed Web3Gas contract`);
    });

    it('check init data', async function () {
      expect(await web3GasV2.implementationVersion()).equal('1.0.0');
      expect(await web3GasV2.name()).equal('Web3Gas');
      expect(await web3GasV2.symbol()).equal('W3G');
      expect(await web3GasV2.claimSigner()).equal(await accountA.getAddress());
      expect(await web3GasV2.effectBlock()).equal(
        BigNumber.from((7 * 24 * 60 * 60) / 3)
      );
      expect(await web3GasV2.gasMul()).equal(BigNumber.from(10000));
    });

    it('check claim', async function () {
      const signData = {
        account: await deployer.getAddress(),
        amount: BigNumber.from((10 ** 18).toString()),
        startBlock: BigNumber.from(1),
        endBlock: BigNumber.from(3),
      };
      const signature = await web3GasV2.signClaim(
        accountA,
        signData.account,
        signData.amount,
        signData.startBlock,
        signData.endBlock
      );
      await web3GasV2.claim(
        signData.account,
        signData.amount,
        signData.startBlock,
        signData.endBlock,
        signature.v,
        signature.r,
        signature.s
      );
      expect(await web3GasV2.balanceOf(signData.account)).equal(
        signData.amount.mul(await web3GasV2.gasMul())
      );
      expect(await web3GasV2.lastEndBlock(signData.account)).equal(
        BigNumber.from(3)
      );

      const signData2 = {
        account: await deployer.getAddress(),
        amount: BigNumber.from((10 ** 18).toString()),
        startBlock: BigNumber.from(2),
        endBlock: BigNumber.from(4),
      };
      const signature2 = await web3GasV2.signClaim(
        accountA,
        signData2.account,
        signData2.amount,
        signData2.startBlock,
        signData2.endBlock
      );
      await expect(
        web3GasV2.claim(
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
      const signature3 = await web3GasV2.signClaim(
        accountA,
        signData3.account,
        signData3.amount,
        signData3.startBlock,
        signData3.endBlock
      );
      await expect(
        web3GasV2.claim(
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
      const signature4 = await web3GasV2.signClaim(
        deployer,
        signData4.account,
        signData4.amount,
        signData4.startBlock,
        signData4.endBlock
      );
      await expect(
        web3GasV2.claim(
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
    let web3GasV2: Web3GasV2;
    let erc20: ERC20TEST;

    beforeEach('deploy and init contract', async () => {
      const ERC20 = await ethers.getContractFactory('ERC20_TEST');
      erc20 = (await ERC20.connect(deployer).deploy()) as ERC20TEST;
      Logger.info(`deployed ERC20 contract`);

      const Web3Gas = await ethers.getContractFactory('Web3Gas');
      const Web3GasV2 = await ethers.getContractFactory('Web3GasV2');
      const web3Gas = (await upgrades.deployProxy(
        Web3Gas.connect(deployer),
        [await accountA.getAddress()],
        {
          kind: 'uups',
        }
      )) as Web3Gas;
      await upgrades.upgradeProxy(web3Gas.address, Web3GasV2);
      web3GasV2 = Web3GasV2.connect(deployer).attach(
        web3Gas.address
      ) as Web3GasV2;
      await web3GasV2.setFunder(Web3GasConfig.funder);
      await web3GasV2.setShare(
        Web3GasConfig.referShare,
        Web3GasConfig.funderShare,
        Web3GasConfig.shareBase
      );
      Logger.info(`deployed Web3GasV2 contract`);
    });

    it('check admin', async function () {
      const Web3GasV2 = await ethers.getContractFactory('Web3GasV2');
      await expect(
        upgrades.upgradeProxy(web3GasV2.address, Web3GasV2.connect(accountA), {
          kind: 'uups',
        })
      ).revertedWith('Web3Gas: require admin permission');
      await upgrades.upgradeProxy(
        web3GasV2.address,
        Web3GasV2.connect(deployer),
        {
          kind: 'uups',
        }
      );

      await expect(web3GasV2.connect(accountA).pause()).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3GasV2.connect(deployer).pause();
      expect(await web3GasV2.paused()).equal(true);

      await expect(web3GasV2.connect(accountA).unpause()).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3GasV2.connect(deployer).unpause();
      expect(await web3GasV2.paused()).equal(false);

      await expect(
        web3GasV2.connect(accountA).setClaimSigner(await deployer.getAddress())
      ).revertedWith('Web3Gas: require admin permission');
      await web3GasV2
        .connect(deployer)
        .setClaimSigner(await deployer.getAddress());
      expect(await web3GasV2.claimSigner()).equal(await deployer.getAddress());

      await expect(web3GasV2.connect(accountA).setGasMul(100)).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3GasV2.connect(deployer).setGasMul(100);
      expect(await web3GasV2.gasMul()).equal(BigNumber.from(100));

      await expect(web3GasV2.connect(accountA).setEffectBlock(1)).revertedWith(
        'Web3Gas: require admin permission'
      );
      await web3GasV2.connect(deployer).setEffectBlock(1);
      expect(await web3GasV2.effectBlock()).equal(1);

      await erc20.transfer(web3GasV2.address, BigNumber.from(100));
      await expect(
        web3GasV2
          .connect(accountA)
          .transferAnyERC20Token(
            erc20.address,
            await accountA.getAddress(),
            BigNumber.from(100)
          )
      ).revertedWith('Web3Gas: require admin permission');
      await web3GasV2
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
