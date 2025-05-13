import mongoose from 'mongoose';
import dotenv from 'dotenv';
import VulnerabilityKnowledge from '../models/Vulnerability';
import { VulnerabilitySeverity } from '../models/Scan';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcontract-analyzer')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Vulnerability data
const vulnerabilityData = [
  {
    name: 'Reentrancy',
    description: 'A vulnerability where a function can be interrupted and called again before its previous execution is complete.',
    details: 'Reentrancy attacks occur when a contract function makes an external call to another untrusted contract before resolving its state. If the untrusted contract calls back into the original function, it may be able to execute multiple withdrawals or manipulate state in unintended ways.',
    severity: VulnerabilitySeverity.CRITICAL,
    category: 'Security',
    remediation: 'Use the "checks-effects-interactions" pattern, where you first perform all checks, then update state, and finally interact with external contracts. Consider using reentrancy guards or the OpenZeppelin ReentrancyGuard.',
    examples: {
      vulnerable: `function withdraw() public {
  uint amount = balances[msg.sender];
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success);
  balances[msg.sender] = 0;
}`,
      fixed: `function withdraw() public {
  uint amount = balances[msg.sender];
  balances[msg.sender] = 0;
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success);
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-107',
      'https://consensys.github.io/smart-contract-best-practices/attacks/reentrancy/'
    ]
  },
  {
    name: 'Integer Overflow and Underflow',
    description: 'When arithmetic operations exceed the maximum or minimum size of the integer type.',
    details: 'In Solidity versions prior to 0.8.0, arithmetic operations can overflow or underflow without reverting, leading to unexpected behavior. For example, adding 1 to the maximum value of a uint8 (255) will result in 0.',
    severity: VulnerabilitySeverity.HIGH,
    category: 'Arithmetic',
    remediation: 'Use Solidity 0.8.0 or later which includes built-in overflow/underflow protection, or use SafeMath library for earlier versions.',
    examples: {
      vulnerable: `function increment(uint8 x) public pure returns (uint8) {
  return x + 1; // Can overflow if x = 255
}`,
      fixed: `// Using Solidity 0.8.0+
function increment(uint8 x) public pure returns (uint8) {
  return x + 1; // Will revert on overflow
}

// Using SafeMath for earlier versions
using SafeMath for uint8;
function increment(uint8 x) public pure returns (uint8) {
  return x.add(1); // Will revert on overflow
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-101',
      'https://docs.openzeppelin.com/contracts/4.x/api/utils#SafeMath'
    ]
  },
  {
    name: 'Unchecked External Call',
    description: 'Not checking the return value of low-level external calls.',
    details: 'Low-level calls (call, delegatecall, staticcall) may fail but will not automatically revert the transaction. If their return value is not checked, the contract might continue execution even when the call failed.',
    severity: VulnerabilitySeverity.HIGH,
    category: 'Security',
    remediation: 'Always check the return value of low-level calls and revert when they fail. Consider using OpenZeppelin\'s Address library which has safe versions of these functions.',
    examples: {
      vulnerable: `function withdraw(address payable recipient, uint amount) public {
  recipient.call{value: amount}("");
}`,
      fixed: `function withdraw(address payable recipient, uint amount) public {
  (bool success, ) = recipient.call{value: amount}("");
  require(success, "Transfer failed");
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-104',
      'https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/external-calls/'
    ]
  },
  {
    name: 'Timestamp Dependence',
    description: 'Relying on block timestamps for critical contract logic.',
    details: 'Block timestamps can be manipulated by miners within a certain threshold. Using block.timestamp as a source of randomness or for critical time-dependent logic can be manipulated by miners.',
    severity: VulnerabilitySeverity.MEDIUM,
    category: 'Security',
    remediation: 'Avoid using block.timestamp for random number generation. For time-dependent logic, consider using block numbers instead, or accept that there can be a small amount of miner influence.',
    examples: {
      vulnerable: `function isLuckyDay() public view returns (bool) {
  return block.timestamp % 10 == 0; // Can be manipulated by miners
}`,
      fixed: `function getTimeEstimate() public view returns (uint) {
  // Still uses timestamp but acknowledges miner manipulation is acceptable
  // for this non-critical function with a tolerance of a few seconds
  return block.timestamp;
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-116',
      'https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/timestamp-dependence/'
    ]
  },
  {
    name: 'Access Control Issues',
    description: 'Missing or incorrect access controls allowing unauthorized operations.',
    details: 'Smart contracts often need to restrict who can perform certain actions. Missing or incorrectly implemented access controls can lead to unauthorized users being able to execute privileged functions.',
    severity: VulnerabilitySeverity.CRITICAL,
    category: 'Security',
    remediation: 'Use modifiers or require statements to check permissions before executing sensitive functions. Consider implementing role-based access control using libraries like OpenZeppelin\'s AccessControl.',
    examples: {
      vulnerable: `function withdrawAll() public {
  msg.sender.transfer(address(this).balance);
}`,
      fixed: `address public owner;

constructor() {
  owner = msg.sender;
}

modifier onlyOwner() {
  require(msg.sender == owner, "Not owner");
  _;
}

function withdrawAll() public onlyOwner {
  msg.sender.transfer(address(this).balance);
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-105',
      'https://docs.openzeppelin.com/contracts/4.x/access-control'
    ]
  },
  {
    name: 'Denial of Service',
    description: 'Contract functionality can be blocked or disrupted, preventing normal operation.',
    details: 'A Denial of Service (DoS) attack makes a contract temporarily or permanently unavailable. This can happen through various methods such as consuming all gas with expensive operations, blocking contract execution with failed calls, or manipulating contract state.',
    severity: VulnerabilitySeverity.HIGH,
    category: 'Security',
    remediation: 'Implement pull payment patterns instead of push, avoid loops with unbounded gas consumption, and handle failed calls appropriately.',
    examples: {
      vulnerable: `function distributeRewards(address[] memory recipients) public {
  for (uint i = 0; i < recipients.length; i++) {
    recipients[i].transfer(rewardAmount);
  }
}`,
      fixed: `// Pull payment pattern
mapping(address => uint) public pendingRewards;

function assignRewards(address[] memory recipients) public {
  for (uint i = 0; i < recipients.length; i++) {
    pendingRewards[recipients[i]] += rewardAmount;
  }
}

function withdrawReward() public {
  uint amount = pendingRewards[msg.sender];
  pendingRewards[msg.sender] = 0;
  (bool success, ) = msg.sender.call{value: amount}("");
  require(success, "Transfer failed");
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-128',
      'https://consensys.github.io/smart-contract-best-practices/development-recommendations/general/denial-of-service/'
    ]
  },
  {
    name: 'Front-Running',
    description: 'Transaction ordering can be manipulated to gain advantage.',
    details: 'In blockchain, transactions wait in a mempool before being included in a block. During this time, attackers can observe pending transactions and submit their own with higher gas prices to be executed first, gaining an unfair advantage.',
    severity: VulnerabilitySeverity.MEDIUM,
    category: 'Security',
    remediation: 'Use commit-reveal schemes, batch auction mechanisms, or add minimum/maximum constraints to mitigate front-running risks.',
    examples: {
      vulnerable: `function claimReward(uint256 solution) public {
  require(solution == correctSolution, "Incorrect solution");
  msg.sender.transfer(reward);
}`,
      fixed: `// Commit-reveal pattern
mapping(address => bytes32) public commitments;
mapping(address => bool) public hasRevealed;

function commit(bytes32 commitment) public {
  commitments[msg.sender] = commitment;
}

function reveal(uint256 solution, bytes32 salt) public {
  require(keccak256(abi.encodePacked(solution, salt)) == commitments[msg.sender], "Invalid commitment");
  require(!hasRevealed[msg.sender], "Already revealed");
  hasRevealed[msg.sender] = true;
  
  if (solution == correctSolution) {
    msg.sender.transfer(reward);
  }
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-114',
      'https://consensys.github.io/smart-contract-best-practices/attacks/frontrunning/'
    ]
  },
  {
    name: 'Uninitialized Storage Pointer',
    description: 'Storage variables not explicitly initialized can point to other storage variables.',
    details: 'In Solidity, uninitialized local storage variables can point to unexpected storage locations, potentially allowing attackers to modify critical contract state variables.',
    severity: VulnerabilitySeverity.HIGH,
    category: 'Coding',
    remediation: 'Always initialize storage variables. Use memory for temporary arrays and structs when possible. Consider using newer Solidity versions that catch these issues at compile time.',
    examples: {
      vulnerable: `function createItem() public {
  Item storage item; // Uninitialized storage pointer
  item.name = "New Item"; // Might overwrite existing storage
}`,
      fixed: `function createItem() public {
  Item storage item = items[msg.sender]; // Explicitly set storage pointer
  item.name = "New Item"; // Safe modification
  
  // Or use memory for temporary data
  Item memory tempItem = Item("New Item");
  items[msg.sender] = tempItem;
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-109',
      'https://docs.soliditylang.org/en/latest/types.html#data-location'
    ]
  },
  {
    name: 'Arbitrary Jump/Storage Write',
    description: 'Assembly code or delegatecall allowing arbitrary control flow or storage modification.',
    details: 'Low-level assembly operations like delegatecall can be dangerous if used incorrectly. They allow a contract to execute code from another contract with its own storage context, potentially leading to storage corruption if not carefully implemented.',
    severity: VulnerabilitySeverity.CRITICAL,
    category: 'Security',
    remediation: 'Avoid using assembly and delegatecall when possible. If necessary, implement strict validations and safety checks, and follow well-tested patterns for proxy contracts.',
    examples: {
      vulnerable: `function callContract(address _addr, bytes memory _data) public {
  (bool success,) = _addr.delegatecall(_data);
  require(success, "Delegatecall failed");
}`,
      fixed: `// Restrict delegatecall to specific known implementations
address public implementation;

function setImplementation(address _implementation) public onlyOwner {
  implementation = _implementation;
}

function callImplementation(bytes memory _data) public {
  require(implementation != address(0), "Implementation not set");
  (bool success,) = implementation.delegatecall(_data);
  require(success, "Delegatecall failed");
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-127',
      'https://blog.openzeppelin.com/proxy-patterns'
    ]
  },
  {
    name: 'Tx.origin Authentication',
    description: 'Using tx.origin for authentication instead of msg.sender.',
    details: 'tx.origin refers to the original external account that initiated the transaction, while msg.sender is the immediate caller. Using tx.origin for authentication is vulnerable to phishing attacks where a user is tricked into calling a malicious contract.',
    severity: VulnerabilitySeverity.HIGH,
    category: 'Security',
    remediation: 'Always use msg.sender instead of tx.origin for authentication purposes.',
    examples: {
      vulnerable: `function transferFunds(address payable _to, uint _amount) public {
  require(tx.origin == owner, "Not owner");
  _to.transfer(_amount);
}`,
      fixed: `function transferFunds(address payable _to, uint _amount) public {
  require(msg.sender == owner, "Not owner");
  _to.transfer(_amount);
}`
    },
    references: [
      'https://swcregistry.io/docs/SWC-115',
      'https://consensys.github.io/smart-contract-best-practices/development-recommendations/solidity-specific/tx-origin/'
    ]
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing vulnerabilities
    await VulnerabilityKnowledge.deleteMany({});
    console.log('Cleared existing vulnerability data');
    
    // Insert new vulnerabilities
    await VulnerabilityKnowledge.insertMany(vulnerabilityData);
    console.log(`Inserted ${vulnerabilityData.length} vulnerabilities`);
    
    // Disconnect from database
    await mongoose.disconnect();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run the seeder
seedDatabase(); 