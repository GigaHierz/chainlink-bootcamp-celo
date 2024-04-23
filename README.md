# Chainlink Developer Bootcamp - Special Guest Session with CELO

This repository is part of the presentation on Celo for the [Chainlink Developer Bootcamp 2024](https://lu.ma/ChainlinkBootcamp2024?utm_source=0czoelvgwhbx).

Find the slides here:


## Install Celo-Composer 

The easiest way to start with Celo Composer is using [`@celo/celo-composer`](https://github.com/celo-org/celo-composer). This CLI tool lets you quickly start building dApps on Celo for multiple frameworks, including React (with either react-celo or rainbowkit-celo). To get started, just run the following command, and follow the steps:

```bash
npx @celo/celo-composer@latest create
```

### Install all dependencies

run

```bash
npm I
```

or 

```bash
yarn
```

## Get token Balance

In the `index.tsx` file, you will find some template code. We will add our code in there. 

First we want to read the balance of CELO tokens.





1. For that we will need to get the address of CELO on Alfajores. You can find the addresses in the [Celo docs](https://docs.celo.org/token-addresses).

```typescript
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet

```

2. Import an eRC20 abi from viem
```typescript
 //  Import an eRC20 abi from viem
    import { erc20Abi } from "viem";
```

3. we will use [web3.js](https://web3js.org/) to read from the contracts. so, we need to create an instance, initialize it with the RPC for Celo Alfajores.
```typescript
    // create a Web3 instance, initialize it with the RPC for Celo Alfajores
    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
```


4. Create a Contract instance of the celo contract to be able to interact with it
```typescript
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)
```

5. Call the contract function to read the users current CELO balance.

```typescript
    // save the balance value in the state
    const [celoBalance, setCeloBalance] = useState("");

    const getBalance = async () => {
        celoContract.methods.balanceOf(userAddress as `0x${string}`).call()
            .then(balance => {
                // Balance is returned in Wei, convert it to Ether (or token's equivalent)
                const tokenBalance = web3.utils.fromWei(balance, 'ether');
                setCeloBalance((tokenBalance))
                console.log(`The balance is: ${tokenBalance}`);
            })
            .catch(error => {
                console.error(error);
            });

        return;
    };
```


Your code should now look likes this: 

```typescript
// ERC20 abi 

export default function Home() {
    //  Import an eRC20 abi from viem
    import { erc20Abi } from "viem";

    // CELO token address on Alfajore Celo Testnet
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; 

    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)

    // create a state for the celoBalance
    const [celoBalance, setCeloBalance ]  = useState("");

    const getBalance = async () => {
          celoContract.methods.balanceOf(userAddress as `0x${string}`).call()
            .then(balance => {
                // Balance is returned in Wei, convert it to Ether (or token's equivalent)
                const tokenBalance = web3.utils.fromWei(balance, 'ether');
                setCeloBalance((tokenBalance))
                console.log(`The balance is: ${tokenBalance}`);
            })
            .catch(error => {
                console.error(error);
            });

        return;
    };
}
```

## Get USD value of CELO tokens

For this tutorial we will follow the guide from the [Chainlink docs](https://docs.chain.link/data-feeds/using-data-feeds#reading-data-feeds-offchain) for reading data prcie feeds offchain


1. Find the address of the CELO/USD pricefeed in the [Chainlink docs ](https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview)

```typescript
    // pricefeed address for CELO/USD on Alfajores
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946";
```

2. Add the aggregatorV3InterfaceABI from the tutorial 
```typescript
    // pricefeed address for CELO/USD on Alfajores
    const aggregatorV3InterfaceABI = [
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "description",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
        name: "getRoundData",
        outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "latestRoundData",
        outputs: [
        { internalType: "uint80", name: "roundId", type: "uint80" },
        { internalType: "int256", name: "answer", type: "int256" },
        { internalType: "uint256", name: "startedAt", type: "uint256" },
        { internalType: "uint256", name: "updatedAt", type: "uint256" },
        { internalType: "uint80", name: "answeredInRound", type: "uint80" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    ]
```


3. Create the contract instance for the priceFeed contract

```typescript
    // contract instance of the price feed contract
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, celoToUsd)
```

4. Call the latestRound data to get the latest price data. This is the response data that you will get, so you will want to read the second value
```typescript
    0: roundID,
    1: answer, // this is the value we want
    3: timeStamp,
    2: startedAt,
    4: answeredInRound
```

This is the function to call the price feed data

```typescript
    // store the celoValue in the state
    const [celoValue, setCeloValue] = useState("");

    const getUSDValue = async () => {
    priceFeed.methods
        .latestRoundData()
        .call()
        .then((roundData: any) => {
            // get the value from position one of the response object. The value will come back as bigInt so we will have to format it. 
            const balance = (formatUnits(roundData[1], 8))
            setCeloValue(balance)
            // Do something with roundData
            console.log("Latest Round Data", roundData)
        })
    };

```

```typescript
export default function Home() {
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946"; // Price Feed Contract Address. You can find it here: https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview

    const [celoValue, setCeloValue ]  = useState("");

   const getUSDValue = async () => {
        priceFeed.methods
            .latestRoundData()
            .call()
            .then((roundData: any) => {
                const balance = (formatUnits(roundData[1], 8))
                setCeloValue(balance)
                // Do something with roundData
                console.log("Latest Round Data", roundData)
            })
    };
}
```

## Final code

Let's add some code to showcase the values to the user. Your whole code should look like this now. 

```typescript
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, custom, erc20Abi, formatEther, formatUnits } from "viem";
import { celoAlfajores } from "viem/chains";
import Web3 from "web3";



export default function Home() {
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946";
    const aggregatorV3InterfaceABI = [
        {
            inputs: [],
            name: "decimals",
            outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "description",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
            name: "getRoundData",
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" },
                { internalType: "int256", name: "answer", type: "int256" },
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "latestRoundData",
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" },
                { internalType: "int256", name: "answer", type: "int256" },
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "version",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
    ]
    const web3 = new Web3("https://alfajores-forno.celo-testnet.org")
    const celoContract = new web3.eth.Contract(erc20Abi, CELOTokenAddress)
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, celoToUsd)

    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [celoBalance, setCeloBalance] = useState("");
    const [celoValue, setCeloValue] = useState("");

    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);

            if (isMounted) {
                getBalance();
                getUSDValue()
            }
        }
    }, [address, isConnected, isMounted]);

    if (!isMounted) {
        return null;
    }

    const getBalance = async () => {
        celoContract.methods.balanceOf(userAddress as `0x${string}`).call()
            .then(balance => {
                // Balance is returned in Wei, convert it to Ether (or token's equivalent)
                const tokenBalance = web3.utils.fromWei(balance, 'ether');
                setCeloBalance((tokenBalance))
                console.log(`The balance is: ${tokenBalance}`);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getUSDValue = async () => {
        priceFeed.methods
            .latestRoundData()
            .call()
            .then((roundData: any) => {
                const balance = (formatUnits(roundData[1], 8))
                setCeloValue(balance)
                // Do something with roundData
                console.log("Latest Round Data", roundData)
            })
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="h1">
                There you go... a canvas for your next Celo project!
            </div>
            {isConnected ? (
                <div className="h2 text-center">
                    Your address: {userAddress}
                    <p> CELO Balance {Number(celoBalance).toFixed(2)}</p>
                    <p> USD value of CELO {(Number(celoBalance) * Number(celoValue)).toFixed(2)}</p>
                </div>

            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}


```