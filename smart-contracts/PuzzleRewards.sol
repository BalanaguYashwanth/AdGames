// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PuzzleRewards is Ownable, IERC721Receiver, ReentrancyGuard {
    using Address for address payable;

    IERC721 public immutable nftContract;
    AggregatorV3Interface internal priceFeed;

    enum Level { Easy, Medium, Hard, Completed }
    mapping(address => Level) public playerLevels;

    uint256 public constant EASY_NFT_ID = 0;
    uint256 public constant MEDIUM_NFT_ID = 1;

    event RewardClaimed(address indexed player, Level level, string rewardType);

    constructor(address _nftContractAddress, address _priceFeed) Ownable(msg.sender) {
        require(_nftContractAddress != address(0), "Invalid NFT contract address");
        nftContract = IERC721(_nftContractAddress);

        require(_priceFeed != address(0), "Invalid price feed address");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function claimReward() external nonReentrant {
        address player = msg.sender;
        Level currentLevel = playerLevels[player];

        require(currentLevel != Level.Completed, "All reward levels completed.");

        if (currentLevel == Level.Easy) {
            playerLevels[player] = Level.Medium;
            emit RewardClaimed(player, currentLevel, "Easy NFT");
            nftContract.safeTransferFrom(address(this), player, EASY_NFT_ID);
        } else if (currentLevel == Level.Medium) {
            playerLevels[player] = Level.Hard;
            emit RewardClaimed(player, currentLevel, "Medium NFT"); 
            nftContract.safeTransferFrom(address(this), player, MEDIUM_NFT_ID);
        } else if (currentLevel == Level.Hard) {
            (, int price, , , ) = priceFeed.latestRoundData();
            uint256 ethPrice = uint256(price);
            uint256 rewardInWei = (0.1 * 1e8 * 1e18) / ethPrice; 

            require(address(this).balance >= rewardInWei, "Insufficient funds for reward.");
            playerLevels[player] = Level.Completed;
            emit RewardClaimed(player, currentLevel, "Hard ETH");

            (bool success, ) = player.call{value: rewardInWei}("");
            require(success, "Failed to send ETH reward.");
        }
    }

    function getPlayerLevel(address _player) external view returns (Level) {
        return playerLevels[_player];
    } 

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No balance to withdraw.");
        payable(owner()).sendValue(amount); 
    }

    receive() external payable {}

    function onERC721Received(
        address, /* _operator */
        address, /* _from */
        uint256, /* _tokenId */
        bytes calldata /* _data */
    ) external override returns (bytes4) {
        require(msg.sender == address(nftContract), "Only the designated NFT contract can send NFTs");
        return IERC721Receiver.onERC721Received.selector;
    }
}