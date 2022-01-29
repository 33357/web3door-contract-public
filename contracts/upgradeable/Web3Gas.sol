//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "../interfaces/IWeb3Gas.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Web3Gas is
    IWeb3Gas,
    ERC20Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable,
    EIP712Upgradeable
{
    bytes32 public constant ClAIM_TYPEHASH =
        keccak256("claim(address account,uint256 gasAmount,uint256 startBlock,uint256 endBlock)");

    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    address public claimSigner;

    uint256 public effectBlock;

    uint256 public gasMul;

    mapping(address => uint256) public lastEndBlock;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address newClaimSigner) public initializer {
        __ERC20_init("Web3Gas", "W3G");
        __EIP712_init_unchained(name(), implementationVersion());
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        claimSigner = newClaimSigner;
        effectBlock = (7 * 24 * 60 * 60) / 3;
        gasMul = 10000;
    }

    /* ================ UTIL FUNCTIONS ================ */

    modifier _onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Web3Gas: require admin permission");
        _;
    }

    function _authorizeUpgrade(address) internal view override _onlyAdmin {}

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() public pure override returns (string memory) {
        return "1.0.0";
    }

    function claimStartBlock(address account) external view override returns (uint256) {
        if (block.number.sub(lastEndBlock[account]) <= effectBlock) {
            return lastEndBlock[account];
        }
        return block.number.sub(effectBlock);
    }

    function predictToken(uint256 gasAmount) public view override returns (uint256) {
        return gasAmount.mul(gasMul);
    }

    /* ================ TRANSACTION FUNCTIONS ================ */

    function claim(
        address account,
        uint256 gasAmount,
        uint256 startBlock,
        uint256 endBlock,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override whenNotPaused {
        require(startBlock < endBlock, "Web3Gas: startBlock must over endBlock");
        require(startBlock >= lastEndBlock[account], "Web3Gas: startBlock must over claimEndBlock");
        address signer = ECDSAUpgradeable.recover(
            _hashTypedDataV4(keccak256(abi.encode(ClAIM_TYPEHASH, account, gasAmount, startBlock, endBlock))),
            v,
            r,
            s
        );
        require(claimSigner == signer, "Web3Gas: not claimSigner");
        uint256 tokenAmount = predictToken(gasAmount);
        _mint(account, tokenAmount);
        emit Mint(account, tokenAmount);
        lastEndBlock[_msgSender()] = endBlock;
    }

    /* ================ ADMIN FUNCTIONS ================ */

    function setClaimSigner(address newClaimSigner) external override _onlyAdmin {
        claimSigner = newClaimSigner;
    }

    function setEffectBlock(uint256 newEffectBlock) external override _onlyAdmin {
        effectBlock = newEffectBlock;
    }

    function setGasMul(uint256 newGasMul) external override _onlyAdmin {
        gasMul = newGasMul;
    }

    function pause() external override _onlyAdmin {
        _pause();
    }

    function unpause() external override _onlyAdmin {
        _unpause();
    }

    function transferAnyERC20Token(
        address token,
        address to,
        uint256 amount
    ) external override _onlyAdmin {
        IERC20Upgradeable(token).safeTransfer(to, amount);
    }
}
