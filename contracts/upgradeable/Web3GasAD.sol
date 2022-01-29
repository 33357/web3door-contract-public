//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "../interfaces/IWeb3AD.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

contract Web3AD is IWeb3AD, ERC20Upgradeable, AccessControlUpgradeable, PausableUpgradeable, UUPSUpgradeable {
    using SafeMathUpgradeable for uint256;
    using SafeERC20Upgradeable for IERC20Upgradeable;

    IERC20Upgradeable public web3Gas;

    uint256 public balance;

    mapping(uint256 => AD) public adMap;

    uint256 public ADLength;

    mapping(uint256 => Show) public showMap;

    uint256 public showLength;

    mapping(uint256 => uint256) public preShowMap;

    uint256 public showTime;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize(address newWeb3Gas) public initializer {
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        web3Gas = IERC20Upgradeable(newWeb3Gas);
        showLength = 3;
        showTime = 7 days;
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

    /* ================ TRANSACTION FUNCTIONS ================ */

    function createAD(
        string memory name,
        string memory photoUrl,
        string memory linkUrl,
        string memory description,
        uint256 show
    ) public payable {
        require(msg.value >= showMap[show]., "Web3AD: low balance");

        adMap[ADLength] = AD(name, photoUrl, linkUrl, description, balance, _msgSender());
        ADLength++;

    }

    function addAD() public {

    }

    function lockAD() public {}

    function stakeGas() public {}

    function withdrawBNB() public {}

    /* ================ ADMIN FUNCTIONS ================ */

    function setShowLength(uint256 newShowLength) external override _onlyAdmin {
        showLength = newShowLength;
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
