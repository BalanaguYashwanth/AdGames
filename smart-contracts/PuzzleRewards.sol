// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./myNFT.sol";

contract PuzzleRewards is Ownable, ReentrancyGuard {
    using Address for address payable;

    MyNFT public immutable nftContract;
    AggregatorV3Interface public immutable priceFeed;

    enum Level { Easy, Medium, Hard, Completed }
    mapping(address => Level) public playerLevels;

    event RewardClaimed(address indexed player, Level level, string rewardType);

    constructor(address _nftContract, address _priceFeed) Ownable(msg.sender) {
        require(_nftContract != address(0), "Invalid NFT contract");
        require(_priceFeed != address(0), "Invalid price feed");
        nftContract = MyNFT(_nftContract);
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance");
        payable(owner()).sendValue(amount);
    }

    receive() external payable {}

    function claimReward(string calldata metadataUri) external nonReentrant {
        address player = msg.sender;
        Level current = playerLevels[player];
        require(current != Level.Completed, "All rewards done.");

        if (current == Level.Easy) {
            playerLevels[player] = Level.Medium;
            nftContract.safeMint(player, metadataUri);
            emit RewardClaimed(player, Level.Easy, "Easy NFT");

        } else if (current == Level.Medium) {
            playerLevels[player] = Level.Hard;
            nftContract.safeMint(player, metadataUri);
            emit RewardClaimed(player, Level.Medium, "Medium NFT");
            
        } else if (current == Level.Hard) {
            playerLevels[player] = Level.Completed;
            _payOneDollarInETH(player);
            emit RewardClaimed(player, Level.Hard, "Hard ETH");
        }
    }

    function getPlayerLevel(address _player) external view returns (Level) {
        return playerLevels[_player];
    } 

    function _payOneDollarInETH(address to) internal {
        (
            uint80 roundId,
            int256 answer,
            , // startedAt
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        require(answer > 0, "Bad price");
        require(answeredInRound >= roundId, "Stale round");
        require(block.timestamp - updatedAt < 1 hours, "Stale price");

        uint8 dec = priceFeed.decimals();
        uint256 usd = 1 * (10 ** dec);
        uint256 weiOut = (usd * 1e18) / uint256(answer);

        require(address(this).balance >= weiOut, "Insufficient funds");
        (bool ok, ) = to.call{value: weiOut}("");
        require(ok, "ETH send failed");
    }
}