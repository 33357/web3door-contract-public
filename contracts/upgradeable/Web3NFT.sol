// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.2;
// pragma abicoder v2;

// import "../interfaces/IWeb3NFT.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
// import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

// contract Web3NFT is
//     IWeb3NFT,
//     ERC721Upgradeable,
//     ERC721EnumerableUpgradeable,
//     AccessControlUpgradeable,
//     PausableUpgradeable,
//     ReentrancyGuardUpgradeable,
//     UUPSUpgradeable,
//     OwnableUpgradeable
// {
//     using StringsUpgradeable for uint256;
//     using SafeMathUpgradeable for uint256;
//     using SafeERC20Upgradeable for IERC20Upgradeable;
//     using CountersUpgradeable for CountersUpgradeable.Counter;

//     CountersUpgradeable.Counter public tokenCount;

//     address public fund;
//     uint256 public fundShare;
//     address public dev;
//     uint256 public devShare;
//     address public pool;

//     string public baseURI;
//     uint256 public basePrice;
//     uint256 public addPrice;
//     uint256 public lockBlock;
//     uint256 public lastBuyBlock;
//     uint256 public subBlock;
//     uint256 public subCount;

//     mapping(address => uint256) public accountLockToken;
//     mapping(uint256 => uint256) public tokenLockBlock;
//     mapping(uint256 => uint256) public tokenLockTime;

//     /// @custom:oz-upgrades-unsafe-allow constructor
//     constructor() initializer {}

//     function initialize(
//         address newFund,
//         address newDev,
//         address newPool,
//         string memory newBaseUrl,
//         uint256 newlockBlock
//     ) public initializer {
//         __Ownable_init();
//         __Pausable_init();
//         __AccessControl_init();
//         __ReentrancyGuard_init();
//         __ERC721_init("Web3NFT", "W3NFT");
//         __UUPSUpgradeable_init();
//         _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
//         baseURI = newBaseUrl;
//         basePrice = 10**17;
//         addPrice = 10**15;
//         lockBlock = newlockBlock;
//         fund = newFund;
//         fundShare = 30;
//         dev = newDev;
//         devShare = 10;
//         pool = newPool;
//         lastBuyBlock = block.number;
//         subBlock = (12 * 60 * 60) / 3;
//     }

//     /* ================ UTIL FUNCTIONS ================ */

//     modifier _onlyAdmin() {
//         require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Web3NFT: require admin permission");
//         _;
//     }

//     function _baseURI() internal view override(ERC721Upgradeable) returns (string memory) {
//         return baseURI;
//     }

//     function _authorizeUpgrade(address) internal view override {
//         require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "Web3NFT: require admin permission");
//     }

//     function _awardNFT(address receiver) internal returns (uint256) {
//         tokenCount.increment();
//         uint256 newId = tokenCount.current();
//         _safeMint(receiver, newId);
//         return newId;
//     }

//     function _beforeTokenTransfer(
//         address from,
//         address to,
//         uint256 tokenId
//     ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
//         require(tokenLockBlock[tokenId] == 0, "Web3NFT: locked token");
//         super._beforeTokenTransfer(from, to, tokenId);
//     }

//     /* ================ VIEW FUNCTIONS ================ */

//     function supportsInterface(bytes4 interfaceId)
//         public
//         view
//         override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable, IWeb3NFT)
//         returns (bool)
//     {
//         return super.supportsInterface(interfaceId);
//     }

//     function implementationVersion() public pure override returns (string memory) {
//         return "1.0.0";
//     }

//     function price() public view override returns (uint256) {
//         if (block.number.sub(lastBuyBlock) >= subBlock) {
//             uint256 _subCount = block.number.sub(lastBuyBlock).div(subBlock).add(subCount);
//             return basePrice.add(tokenCount.current().sub(_subCount).mul(addPrice));
//         }
//         return basePrice.add(tokenCount.current().mul(addPrice));
//     }

//     /* ================ TRANSACTION FUNCTIONS ================ */

//     function buy() external payable override whenNotPaused nonReentrant {
//         require(msg.value >= price(), "Web3NFT: low value");
//         uint256 devAmount = msg.value.mul(devShare).div(100);
//         (bool ret, ) = dev.call{value: devAmount}("");
//         require(ret, "Web3NFT: transfer failed");
//         uint256 fundAmount = msg.value.mul(fundShare).div(100);
//         (ret, ) = fund.call{value: fundAmount}("");
//         require(ret, "Web3NFT: transfer failed");
//         uint256 poolAmount = msg.value.sub(devAmount).sub(fundAmount);
//         (ret, ) = pool.call{value: poolAmount}("");
//         require(ret, "Web3NFT: transfer failed");
//         uint256 tokenId = _awardNFT(_msgSender());
//         tokenLockTime[tokenId] = 3;
//         lastBuyBlock = block.number;
//         if (block.number.sub(lastBuyBlock) >= subBlock) {
//             subCount = block.number.sub(lastBuyBlock).div(subBlock).add(subCount);
//         }
//         emit NFTClaimed(_msgSender(), tokenId, block.timestamp);
//     }

//     function lock(uint256 tokenId) external override whenNotPaused {
//         require(ownerOf(tokenId) == _msgSender(), "Web3NFT: not owner");
//         if (accountLockToken[_msgSender()] != 0) {
//             tokenLockBlock[accountLockToken[_msgSender()]] = 0;
//         }
//         accountLockToken[_msgSender()] = tokenId;
//         tokenLockTime[tokenId] = tokenLockTime[tokenId].sub(1);
//         tokenLockBlock[tokenId] = block.number;
//     }

//     function unlock() external override whenNotPaused {
//         uint256 tokenId = accountLockToken[_msgSender()];
//         require(tokenId != 0, "Web3NFT: no locked token");
//         require(tokenLockBlock[tokenId].add(lockBlock) <= block.number, "Web3NFT: not over lock time");
//         accountLockToken[_msgSender()] = 0;
//         tokenLockBlock[tokenId] = 0;
//         if (tokenLockTime[tokenId] == 0) {
//             _burn(tokenId);
//         }
//     }

//     /* ================ ADMIN FUNCTIONS ================ */

//     function setBaseURI(string memory newBaseURI) external override _onlyAdmin {
//         baseURI = newBaseURI;
//     }

//     function setPrice(uint256 newBasePrice, uint256 newAddPrice) external override _onlyAdmin {
//         basePrice = newBasePrice;
//         addPrice = newAddPrice;
//     }

//     function setLockBlock(uint256 newLockBlock) external override _onlyAdmin {
//         lockBlock = newLockBlock;
//     }

//     function setShareAddress(
//         address newFund,
//         address newDev,
//         address newPool
//     ) external override _onlyAdmin {
//         fund = newFund;
//         dev = newDev;
//         pool = newPool;
//     }

//     function setShare(uint256 newFundShare, uint256 newDevShare) external override _onlyAdmin {
//         fundShare = newFundShare;
//         devShare = newDevShare;
//     }

//     function pause() external override _onlyAdmin {
//         _pause();
//     }

//     function unpause() external override _onlyAdmin {
//         _unpause();
//     }

//     function transferAnyERC20Token(
//         address token,
//         address to,
//         uint256 amount
//     ) external override _onlyAdmin {
//         IERC20Upgradeable(token).safeTransfer(to, amount);
//     }
// }
