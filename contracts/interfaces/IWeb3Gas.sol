// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWeb3Gas {
    /* ================ EVENTS ================ */

    event Mint(address indexed receiver, uint256 indexed amount);

    /* ================ VIEW FUNCTIONS ================ */

    function implementationVersion() external pure returns (string memory);

    function claimStartBlock(address account) external view returns (uint256);

    function predictToken(uint256 gasAmount) external view returns (uint256);

    /* ================ TRANSACTION FUNCTIONS ================ */

    function claim(
        address account,
        uint256 gasAmount,
        uint256 startBlock,
        uint256 endBlock,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /* ================ ADMIN FUNCTIONS ================ */

    function setClaimSigner(address newClaimSigner) external;

    function setEffectBlock(uint256 newEffectBlock) external;

    function setGasMul(uint256 newGasMul) external;

    function pause() external;

    function unpause() external;

    function transferAnyERC20Token(
        address token,
        address to,
        uint256 amount
    ) external;
}
