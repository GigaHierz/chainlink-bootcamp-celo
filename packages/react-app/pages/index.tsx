import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, custom, erc20Abi, formatEther, formatUnits } from "viem";
import { celoAlfajores } from "viem/chains";



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
    const [userAddress, setUserAddress] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const [celoBalance, setCeloBalance ]  = useState("");
    const [celoValue, setCeloValue ]  = useState("");

    const { address, isConnected } = useAccount();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isConnected && address) {
            setUserAddress(address);

            if(isMounted){
                getBalance();
                getUSDValue()
            }
        }
    }, [address, isConnected, isMounted]);



    if (!isMounted) {
        return null;
    }



    const getBalance = async () => {
        // create a public client on Alfajores
        let publicClient = createPublicClient({
            transport: custom(window.ethereum),
            chain: celoAlfajores,
        });

        const response = await publicClient.readContract({
            address: CELOTokenAddress,
            abi: erc20Abi,
            functionName: "balanceOf",
            args: [userAddress as `0x${string}`],
        }) as any;
        
        console.log(response);
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
            abi: aggregatorV3InterfaceABI,
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
                    <p> CELO Balance {celoBalance}</p>
                    <p> USD value of CELO {Number(celoBalance) * Number(celoValue)}</p>
                </div>

            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}
