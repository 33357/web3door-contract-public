// SPDX-License-Identifier: MIT
// pragma solidity ^0.8.2;
// pragma abicoder v2;

// interface IWeb3NFT {
//     /* ================ EVENTS ================ */

//     event NFTClaimed(address indexed payer, uint256 indexed tokenId, uint256 eventTime);

//     /* ================ VIEW FUNCTIONS================ */

//     function supportsInterface(bytes4 interfaceId) external view returns (bool);

//     function implementationVersion() external view returns (string memory);

//     function price() external view returns (uint256);

//     /* ================ TRANSACTION FUNCTIONS ================ */

//     function buy() external payable;

//     function lock(uint256 tokenId) external;

//     function unlock() external;

//     /* ================ ADMIN FUNCTIONS ================ */

//     function setBaseURI(string memory newBaseURI) external;

//     function setPrice(uint256 newBasePrice, uint256 newAddPrice) external;

//     function setLockBlock(uint256 newLockBlock) external;

//     function setShareAddress(
//         address newFund,
//         address newDev,
//         address newPool
//     ) external;

//     function setShare(uint256 newFundShare, uint256 newDevShare) external;

//     function pause() external;

//     function unpause() external;

//     function transferAnyERC20Token(
//         address token,
//         address to,
//         uint256 amount
//     ) external;
// }
