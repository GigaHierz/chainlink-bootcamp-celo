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

For that we will need to get the address of CELO on Alfajores. You can find the addresses in the [Celo docs](https://docs.celo.org/token-addresses).

```typescript
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet

```

1. Create an `abis` folder and add an ERC20 abi. You can find a template through ChatGPT.
2. Create a [public client ](https://viem.sh/docs/clients/public)
3. Use viems [readContract](https://viem.sh/docs/contract/readContract) function to read the balance

```typescript
// ERC20 abi 
import ERC20ABI from "../abis/ERC20ABI.json";

export default function Home() {
    // CELO token address on Alfajore Celo Testnet
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; 

    const [celoBalance, setCeloBalance ]  = useState("");

    const getBalance = async () => {
        // create a public client on Alfajores
        let publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const response = await publicClient.readContract({
            address: CELOTokenAddress,
            abi: ERC20ABI,
            functionName: "balanceOf",
            args: [address],
        }) as any;
        
        const balance = Number(formatEther(response)).toFixed(2)
        setCeloBalance((balance))
        return ((balance));
    };
}
```

## Get USD value of CELO tokens

1. In the `abis` folder and add an the AggregatorV3InterfaceABI  abi. 
2. Find the address of the CELO/USD pricefeed in the [Chainlink docs ](https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview)
3. Use viems [readContract](https://viem.sh/docs/contract/readContract) function to get the curren price of CELO in USD


```typescript
import AggregatorV3InterfaceABI from "../abis/aggregatorV3InterfaceABI.json";

export default function Home() {
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946"; // Price Feed Contract Address. You can find it here: https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview

    const getUSDValue = async () => {
        let publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const response = await publicClient.readContract({
            address: celoToUsd,
            abi: AggregatorV3InterfaceABI,
            functionName: "latestRoundData",
            args: [],
        }) as any;

        const balance = Number(formatUnits(response[1], 8)).toFixed(2)
        setCeloValue(balance)
        return (balance);
    };
}
```


Your whole code should look like this now.

```typescript
import { useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, formatEther, formatGwei, formatUnits, parseEther } from "viem";
import { celoAlfajores } from "viem/chains";
import { useAccount } from "wagmi";
import ERC20ABI from "../abis/ERC20ABI.json";
import AggregatorV3InterfaceABI from "../abis/aggregatorV3InterfaceABI.json";


export default function Home() {
    const CELOTokenAddress = "0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9"; // CELO Testnet
    const celoToUsd = "0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946"; // Price Feed Contract Address. You can find it here: https://docs.chain.link/data-feeds/price-feeds/addresses?network=celo&page=1#overview

        // get the user address using wagmi
    const { address, isConnected } = useAccount();
    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [celoBalance, setCeloBalance ]  = useState("");
    const [celoValue, setCeloValue ]  = useState("");


    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
             // set the user address when a wallet is connected
            setUserAddress(address);
        }
    }, [address, isConnected]);


    useEffect(() => {
        if (isMounted) {
            getBalance();
            getUSDValue()
        }
    }, [isMounted]);

    if (!isMounted) {
        return null;
    }


    const getBalance = async () => {
        let publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const response = await publicClient.readContract({
            address: CELOTokenAddress,
            abi: ERC20ABI,
            functionName: "balanceOf",
            args: [address],
        }) as any;
        
        const balance = Number(formatEther(response)).toFixed(2)
        setCeloBalance((balance))
        return ((balance));
    };
 


    const getUSDValue = async () => {
        let publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const response = await publicClient.readContract({
            address: celoToUsd,
            abi: AggregatorV3InterfaceABI,
            functionName: "latestRoundData",
            args: [],
        }) as any;

        const balance = Number(formatUnits(response[1], 8)).toFixed(2)
        setCeloValue(balance)
        return (balance);
    };


    return (
        <div className="flex flex-col justify-center items-center">
            <div className="h1">
                There you go... a canvas for your next Celo project!
            </div>
            {isConnected ? (
                <div className="h2 text-center">
                    Your address: {userAddress}

                   <br />
                   <br />
                   <br />
                   // Add the CELO balance and the USD value of the balance
                    <p>CELO Balance {celoBalance}</p>
                    <p>Balance in USD {Number(celoValue) * Number(celoBalance)}</p>
                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}

```