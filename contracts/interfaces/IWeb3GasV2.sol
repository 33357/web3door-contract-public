// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IWeb3GasV2 {
    /* ================ EVENTS ================ */

    event ClaimMint(
        address indexed receiver,
        uint256 amount,
        address indexed refer,
        uint256 referAmount,
        uint256 startBlock,
        uint256 endBlock
    );

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
        address refer,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    /* ================ ADMIN FUNCTIONS ================ */

    function setClaimSigner(address newClaimSigner) external;

    function setEffectBlock(uint256 newEffectBlock) external;

    function setGasMul(uint256 newGasMul) external;

    function setFunder(address newFunder) external;

    function setShare(
        uint256 newReferShare,
        uint256 newFunderShare,
        uint256 newShareBase
    ) external;

    function pause() external;

    function unpause() external;

    function transferAnyERC20Token(
        address token,
        address to,
        uint256 amount
    ) external;
}
