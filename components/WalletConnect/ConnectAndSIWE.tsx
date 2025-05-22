// components/ConnectAndSIWE.tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Hex } from "viem";
import { useAccount, useConnect, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "@/lib/wagmi";
import CustomButton from "../CustomButton";
import { useZustandStore } from "@/lib/store";

export function ConnectAndSIWE() {
    const router = useRouter();
    const setWallet = useZustandStore((state) => state.setWallet);
    const wallet = useZustandStore((state) => state.wallet);

    const { connect } = useConnect({
        mutation: {
            onSuccess: async (data) => {
                const address = data.accounts[0];
                const chainId = data.chainId;

                setWallet({
                    address,
                    isConnected: true,
                    isValid: false,
                });

                const m = new SiweMessage({
                    domain: document.location.host,
                    address,
                    chainId,
                    uri: document.location.origin,
                    version: "1",
                    statement: "Smart Wallet SIWE Example",
                    nonce: "12345678",
                });

                setMessage(m);
                signMessage({ message: m.prepareMessage() });
            },
            onError: (error) => {
                console.error("Connection error:", error);
            },
        },
    });

    const account = useAccount();
    const client = usePublicClient();
    const [signature, setSignature] = useState<Hex | undefined>(undefined);
    const { signMessage } = useSignMessage({
        mutation: {
            onSuccess: (sig) => setSignature(sig),
        },
    });

    const [message, setMessage] = useState<SiweMessage | undefined>(undefined);

    const checkValid = useCallback(async () => {
        if (!signature || !account.address || !client || !message) return;

        try {
            const isValid = await client.verifyMessage({
                address: account.address,
                message: message.prepareMessage(),
                signature,
            });

            setWallet({
                address: account.address,
                isConnected: true,
                isValid,
            });
        } catch (error) {
            console.error("Validation error:", error);
            setWallet({
                address: account.address,
                isConnected: true,
                isValid: false,
            });
        }
    }, [signature, account, message, client]);

    useEffect(() => {
        checkValid();
    }, [signature, account]);

    const handleButtonClick = () => {
        if (wallet?.isConnected) {
            router.push("/story-input");
        } else {
            connect({ connector: cbWalletConnector });
        }
    };

    return (
        <div>
            <CustomButton onClick={handleButtonClick}>
                {wallet?.isConnected ? "Proceed" : "Connect Wallet with Smart Wallet"}
            </CustomButton>
        </div>
    );
}
