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
       // store the celoValue in the state
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
                      {/* add your values here, we will shorten it to two decimal values */}
                    <p> CELO Balance {Number(celoBalance).toFixed(2)}</p>
                    <p> USD value of CELO {(Number(celoBalance) * Number(celoValue)).toFixed(2)}</p>
                </div>

            ) : (
                <div>No Wallet Connected</div>
            )}
        </div>
    );
}
