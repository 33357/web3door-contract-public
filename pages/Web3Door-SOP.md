# Web3Door-SOP
## environment
### localhost 
``` bash
yarn localhost

export ENV_FILE='./envs/env.localhost'
export NETWORK='localhost'
export WAIT_NUM=1
export GAS_PRICE=1
```

### rinkeby
``` bash
export ENV_FILE='./envs/env.rinkeby'
export NETWORK_ID=1
export WAIT_NUM=1
export GAS_PRICE=3
```

### eth
``` bash
export ENV_FILE='./envs/env.eth'
export NETWORK_ID=4
export WAIT_NUM=3
export GAS_PRICE=30
```

### bscTest
``` bash
export ENV_FILE='./envs/env.bsc-test'
export NETWORK_ID=97
export WAIT_NUM=1
export GAS_PRICE=10
```

### bsc
``` bash
export ENV_FILE='./envs/env.bsc'
export NETWORK_ID=56
export WAIT_NUM=3
export GAS_PRICE=5
```
## script
### deploy script
```bash
yarn run env-cmd -f $ENV_FILE yarn run hardhat Web3Gas:deploy --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID

# yarn run env-cmd -f $ENV_FILE yarn run hardhat Web3NFT:deploy --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID
```

### upgrade script
```bash
yarn run env-cmd -f $ENV_FILE yarn run hardhat Web3GasV2:upgrade --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID

# yarn run env-cmd -f $ENV_FILE yarn run hardhat Web3NFT:deploy --gas-price $GAS_PRICE --wait-num $WAIT_NUM --network $NETWORK_ID
```

### verify contract
```bash
yarn run env-cmd -f $ENV_FILE yarn run hardhat Web3Gas:verify --network $NETWORK_ID

# yarn run env-cmd -f $ENV_FILE yarn run hardhat Web3NFT:verify --network $NETWORK_ID
```