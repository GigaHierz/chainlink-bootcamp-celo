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
                    <p>CELO Balance {celoBalance}</p>
                    <p>Balance in USD {Number(celoValue) * Number(celoBalance)}</p>
                </div>
            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}
