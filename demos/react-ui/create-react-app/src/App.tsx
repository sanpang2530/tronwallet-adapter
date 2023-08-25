import React, {useMemo, useState} from 'react';
import type {WalletError} from '@tronweb3/tronwallet-abstract-adapter';
import {WalletDisconnectedError, WalletNotFoundError} from '@tronweb3/tronwallet-abstract-adapter';
import {useWallet, WalletProvider} from '@tronweb3/tronwallet-adapter-react-hooks';
import {
    WalletActionButton,
    WalletConnectButton,
    WalletDisconnectButton,
    WalletModalProvider,
    WalletSelectButton,
} from '@tronweb3/tronwallet-adapter-react-ui';
import toast from 'react-hot-toast';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Alert} from '@mui/material';
import {BitKeepAdapter, OkxWalletAdapter, TokenPocketAdapter, TronLinkAdapter} from '@tronweb3/tronwallet-adapters';
import {WalletConnectAdapter} from '@tronweb3/tronwallet-adapter-walletconnect';
import {tronWeb} from './tronweb';
import {LedgerAdapter} from '@tronweb3/tronwallet-adapter-ledger';
import {Button} from '@tronweb3/tronwallet-adapter-react-ui';

const rows = [
    {name: 'Connect Button', reactUI: WalletConnectButton},
    {name: 'Disconnect Button', reactUI: WalletDisconnectButton},
    {name: 'Select Wallet Button', reactUI: WalletSelectButton},
    {name: 'Multi Action Button', reactUI: WalletActionButton},
];

const abi_1 = {
    "entrys": [{
        "outputs": [{"type": "string"}],
        "constant": true,
        "name": "name",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [{"name": "spender", "type": "address"}, {"name": "value", "type": "uint256"}],
        "name": "approve",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "constant": true,
        "name": "totalSupply",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [
            {"name": "sender", "type": "address"},
            {"name": "recipient", "type": "address"},
            {"name": "amount", "type": "uint256"}
        ],
        "name": "transferFrom",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "uint8"}],
        "constant": true,
        "name": "decimals",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [{"name": "spender", "type": "address"}, {"name": "addedValue", "type": "uint256"}],
        "name": "increaseAllowance",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "constant": true,
        "inputs": [{"name": "account", "type": "address"}],
        "name": "balanceOf",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "string"}],
        "constant": true,
        "name": "symbol",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [{"name": "spender", "type": "address"}, {"name": "subtractedValue", "type": "uint256"}],
        "name": "decreaseAllowance",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [{"name": "recipient", "type": "address"}, {"name": "amount", "type": "uint256"}],
        "name": "transfer",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "constant": true,
        "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
        "name": "allowance",
        "stateMutability": "view",
        "type": "function"
    }, {"stateMutability": "Nonpayable", "type": "Constructor"}, {
        "inputs": [{
            "indexed": true,
            "name": "from",
            "type": "address"
        }, {"indexed": true, "name": "to", "type": "address"}, {"name": "value", "type": "uint256"}],
        "name": "Transfer",
        "type": "Event"
    }, {
        "inputs": [{"indexed": true, "name": "owner", "type": "address"}, {
            "indexed": true,
            "name": "spender",
            "type": "address"
        }, {"name": "value", "type": "uint256"}], "name": "Approval", "type": "Event"
    }]
};

/**
 * wrap your app content with WalletProvider and WalletModalProvider
 * WalletProvider provide some useful properties and methods
 * WalletModalProvider provide a Modal in which you can select wallet you want use.
 *
 * Also, you can provide a onError callback to process any error such as ConnectionError
 */
export function App() {
    function onError(e: WalletError) {
        if (e instanceof WalletNotFoundError) {
            toast.error(e.message);
        } else if (e instanceof WalletDisconnectedError) {
            toast.error(e.message);
        } else toast.error(e.message);
    }

    const adapters = useMemo(function () {
        const tronLinkAdapter = new TronLinkAdapter();
        const walletConnectAdapter = new WalletConnectAdapter({
            network: 'Nile',
            options: {
                relayUrl: 'wss://relay.walletconnect.com',
                // example WC app project ID
                projectId: '5fc507d8fc7ae913fff0b8071c7df231',
                metadata: {
                    name: 'Test DApp',
                    description: 'JustLend WalletConnect',
                    url: 'https://your-dapp-url.org/',
                    icons: ['https://your-dapp-url.org/mainLogo.svg'],
                },
            },
            web3ModalConfig: {
                themeMode: 'dark',
                themeVariables: {
                    '--w3m-z-index': '1000'
                },
            }
        });
        const ledger = new LedgerAdapter({
            accountNumber: 2,
        });
        const bitKeepAdapter = new BitKeepAdapter();
        const tokenPocketAdapter = new TokenPocketAdapter();
        const okxwalletAdapter = new OkxWalletAdapter();
        return [tronLinkAdapter, bitKeepAdapter, tokenPocketAdapter, okxwalletAdapter, walletConnectAdapter, ledger];
    }, []);
    return (
        <WalletProvider onError={onError} autoConnect={true} disableAutoConnectOnLoad={true} adapters={adapters}>
            <WalletModalProvider>
                <UIComponent></UIComponent>
                <Profile></Profile>
                <SignDemo></SignDemo>
            </WalletModalProvider>
        </WalletProvider>
    );
}

function UIComponent() {
    return (
        <div>
            <h2>UI Component</h2>
            <TableContainer style={{overflow: 'visible'}} component="div">
                <Table sx={{}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Component</TableCell>
                            <TableCell align="left">React UI</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.name} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="left">
                                    <row.reactUI></row.reactUI>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

function Profile() {
    const {address, connected, wallet} = useWallet();
    return (
        <div>
            <h2>Wallet Connection Info</h2>
            <p>
                <span>Connection Status:</span> {connected ? 'Connected' : 'Disconnected'}
            </p>
            <p>
                <span>Your selected Wallet:</span> {wallet?.adapter.name}
            </p>
            <p>
                <span>Your Address:</span> {address}
            </p>
        </div>
    );
}

function SignDemo() {
    const {signMessage, signTransaction, address} = useWallet();
    const [message, setMessage] = useState('');
    const [signedMessage, setSignedMessage] = useState('');
    const receiver = 'TMDKznuDWaZwfZHcM61FVFstyYNmK6Njk1';

    const abi = [abi_1]
    const contractAddress = 'TVuXsrgv9bG8SvbarX94awSg9sr32m7st7'
    const [open, setOpen] = useState(false);

    async function onSignMessage() {
        const res = await signMessage(message);
        setSignedMessage(res);
    }

    //example 1
    async function totalSupplyContract() {
        // let abi = [...];
        let instance = await tronWeb.contract(abi, contractAddress);

        console.log(instance);

        // let res = await instance.totalSupply().call();
        // console.log(res);
    }


    async function onSignTransaction() {
        console.log(" receiver:", receiver)
        console.log(" address:", address)

        await totalSupplyContract()

        // triggercontract();

        const transaction = await tronWeb.transactionBuilder.sendTrx(receiver, tronWeb.toSun(0.001), address);

        console.log(" transaction:", transaction)

        const signedTransaction = await signTransaction(transaction);
        // const signedTransaction = await tronWeb.trx.sign(transaction);
        await tronWeb.trx.sendRawTransaction(signedTransaction);
        setOpen(true);
    }

    return (
        <div style={{marginBottom: 200}}>
            <h2>Sign a message</h2>
            <p style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all'}}>
                You can sign a message by click the button.
            </p>
            <Button style={{marginRight: '20px'}} onClick={onSignMessage}>
                SignMessage
            </Button>
            <TextField
                size="small"
                onChange={(e) => setMessage(e.target.value)}
                placeholder="input message to signed"
            ></TextField>
            <p>Your sigedMessage is: {signedMessage}</p>
            <h2>Sign a Transaction</h2>
            <p style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all'}}>
                You can transfer 0.001 Trx to &nbsp;<i>{receiver}</i>&nbsp;by click the button.
            </p>
            <Button onClick={onSignTransaction}>Transfer</Button>
            {open && (
                <Alert onClose={() => setOpen(false)} severity="success" sx={{width: '100%', marginTop: 1}}>
                    Success! You can confirm your transfer on{' '}
                    <a target="_blank" rel="noreferrer" href={`https://shasta.tronscan.org/#/address/${address}`}>
                        Tron Scan
                    </a>
                </Alert>
            )}
        </div>
    );
}
