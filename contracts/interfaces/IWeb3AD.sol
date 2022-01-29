// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWeb3AD {
    /* ================ EVENTS ================ */

    event Mint(address indexed receiver, uint256 indexed amount);

    /* ================ STRUCTS ================ */

    struct Show {
        uint256 ad;
        uint256 expiredTime;
    }

    struct AD {
        string name;
        string photoUrl;
        string linkUrl;
        string description;
        uint256 balance;
        address sender;
        bool lock;
    }

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    /* ================ TRANSACTION FUNCTIONS ================ */

    /* ================ ADMIN FUNCTIONS ================ */

    function setShowLength(uint256 newShowLength) external;

    function pause() external;

    function unpause() external;

    function transferAnyERC20Token(
        address token,
        address to,
        uint256 amount
    ) external;
}