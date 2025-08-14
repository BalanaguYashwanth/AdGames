// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PuzzleRewards is Ownable {
    IERC721 public immutable nftContract;

    mapping(address => uint256) public playerLevels;

    uint256 public constant EASY_NFT_ID = 0;
    uint256 public constant MEDIUM_NFT_ID = 1;
    uint256 public constant HARD_REWARD_AMOUNT = 0.001 ether;

    event RewardClaimed(address indexed player, uint256 level, string rewardType);

    constructor(address _nftContractAddress) Ownable(msg.sender) {
        require(_nftContractAddress != address(0), "Invalid NFT contract address");
        nftContract = IERC721(_nftContractAddress);
    }

    function claimReward() external payable {
        address player = msg.sender;
        uint256 currentLevel = playerLevels[player];

        require(currentLevel < 3, "All reward levels completed. Play again to restart cycle.");

        if (currentLevel == 0) {
            nftContract.safeTransferFrom(address(this), player, EASY_NFT_ID);
            emit RewardClaimed(player, currentLevel, "Easy NFT");
        } else if (currentLevel == 1) {
            nftContract.safeTransferFrom(address(this), player, MEDIUM_NFT_ID);
            emit RewardClaimed(player, currentLevel, "Medium NFT"); 
        } else if (currentLevel == 2) {
            require(address(this).balance >= HARD_REWARD_AMOUNT, "Contract has insufficient funds for reward.");
            (bool success, ) = player.call{value: HARD_REWARD_AMOUNT}("");
            require(success, "Failed to send ETH reward.");
            emit RewardClaimed(player, currentLevel, "Hard ETH");
        }

        playerLevels[player] = (currentLevel + 1) % 3;
    }

    function getPlayerLevel(address _player) external view returns (uint256) {
        return playerLevels[_player];
    } 

    function withdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed"); 
    }

    receive() external payable {}
}