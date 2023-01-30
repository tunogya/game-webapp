export const BACCARAT_ABI = [{
  "inputs": [],
  "stateMutability": "nonpayable",
  "type": "constructor"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "_player", "type": "address"}, {
    "indexed": true,
    "internalType": "address",
    "name": "_token",
    "type": "address"
  }, {"indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256"}, {
    "indexed": false,
    "internalType": "uint256",
    "name": "_betType",
    "type": "uint256"
  }],
  "name": "Action",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "indexed": false,
    "internalType": "address",
    "name": "previousAdmin",
    "type": "address"
  }, {"indexed": false, "internalType": "address", "name": "newAdmin", "type": "address"}],
  "name": "AdminChanged",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "beacon", "type": "address"}],
  "name": "BeaconUpgraded",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "uint256", "name": "_amount", "type": "uint256"}],
  "name": "Burning",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "uint8", "name": "version", "type": "uint8"}],
  "name": "Initialized",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"}, {
    "indexed": true,
    "internalType": "address",
    "name": "newOwner",
    "type": "address"
  }],
  "name": "OwnershipTransferred",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{
    "components": [{"internalType": "uint16", "name": "cursor", "type": "uint16"}, {
      "internalType": "uint8",
      "name": "bankerPoints",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "playerPoints", "type": "uint8"}, {
      "internalType": "uint8",
      "name": "bankerHands1",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "bankerHands2", "type": "uint8"}, {
      "internalType": "uint8",
      "name": "bankerHands3",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "playerHands1", "type": "uint8"}, {
      "internalType": "uint8",
      "name": "playerHands2",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "playerHands3", "type": "uint8"}],
    "indexed": false,
    "internalType": "struct IBaccarat.Result",
    "name": "result",
    "type": "tuple"
  }],
  "name": "Settle",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": false, "internalType": "uint256", "name": "_nonce", "type": "uint256"}],
  "name": "Shuffle",
  "type": "event"
}, {
  "anonymous": false,
  "inputs": [{"indexed": true, "internalType": "address", "name": "implementation", "type": "address"}],
  "name": "Upgraded",
  "type": "event"
}, {
  "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
    "internalType": "uint256",
    "name": "_amount",
    "type": "uint256"
  }, {"internalType": "uint256", "name": "_betType", "type": "uint256"}],
  "name": "action",
  "outputs": [],
  "stateMutability": "payable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "_player", "type": "address"}, {
    "internalType": "address",
    "name": "_token",
    "type": "address"
  }],
  "name": "chequesOf",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "cursor",
  "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "initialize",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "layout",
  "outputs": [{
    "components": [{
      "internalType": "address",
      "name": "player",
      "type": "address"
    }, {"internalType": "address", "name": "token", "type": "address"}, {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }, {"internalType": "uint256", "name": "betType", "type": "uint256"}],
    "internalType": "struct IBaccarat.LayoutAction[]",
    "name": "",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "owner",
  "outputs": [{"internalType": "address", "name": "", "type": "address"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "proxiableUUID",
  "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [],
  "name": "renounceOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "results",
  "outputs": [{
    "components": [{"internalType": "uint16", "name": "cursor", "type": "uint16"}, {
      "internalType": "uint8",
      "name": "bankerPoints",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "playerPoints", "type": "uint8"}, {
      "internalType": "uint8",
      "name": "bankerHands1",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "bankerHands2", "type": "uint8"}, {
      "internalType": "uint8",
      "name": "bankerHands3",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "playerHands1", "type": "uint8"}, {
      "internalType": "uint8",
      "name": "playerHands2",
      "type": "uint8"
    }, {"internalType": "uint8", "name": "playerHands3", "type": "uint8"}],
    "internalType": "struct IBaccarat.Result[]",
    "name": "",
    "type": "tuple[]"
  }],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "nonce", "type": "uint256"}],
  "name": "settle",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [],
  "name": "shoe",
  "outputs": [{"internalType": "uint8[]", "name": "", "type": "uint8[]"}],
  "stateMutability": "view",
  "type": "function"
}, {
  "inputs": [{"internalType": "uint256", "name": "_nonce", "type": "uint256"}],
  "name": "shuffle",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "newOwner", "type": "address"}],
  "name": "transferOwnership",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "newImplementation", "type": "address"}],
  "name": "upgradeTo",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "newImplementation", "type": "address"}, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }], "name": "upgradeToAndCall", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
    "internalType": "uint256",
    "name": "_amount",
    "type": "uint256"
  }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}, {
  "inputs": [{"internalType": "address", "name": "_token", "type": "address"}, {
    "internalType": "uint256",
    "name": "_amount",
    "type": "uint256"
  }], "name": "withdrawOnlyOwner", "outputs": [], "stateMutability": "nonpayable", "type": "function"
}];