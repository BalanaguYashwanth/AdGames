import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData } from 'viem';
import { PUZZLE_REWARDS_ABI } from '@/lib/abi';

const PUZZLE_REWARDS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PUZZLE_REWARDS_CONTRACT_ADDRESS as `0x${string}`;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || 84532;

export async function POST(req: NextRequest) {
    try {
        const { untrustedData } = await req.json();
        const recipientAddress = untrustedData.address;

        if (!recipientAddress) {
            return new NextResponse('Address not found.', { status: 400 });
        }

        const data = encodeFunctionData({
            abi: PUZZLE_REWARDS_ABI,
            functionName: 'claimReward'
        });

        const txData = {
            chainId: `eip155:${CHAIN_ID}`,
            method: 'eth_sendTransaction',
            params: [
                {
                    abi: PUZZLE_REWARDS_ABI,
                    from: recipientAddress,
                    to: PUZZLE_REWARDS_CONTRACT_ADDRESS,
                    data,
                    value: '0'
                },
            ],
        };

        return NextResponse.json(txData);

    } catch (error) {
        console.error('Minting transaction error:', error);
        return new NextResponse('Error preparing transaction.', { status: 500 });
    }
}