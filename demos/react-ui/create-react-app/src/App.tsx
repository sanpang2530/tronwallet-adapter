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
// import bigNumber from 'bignumber.js';
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
    // const receiver = 'TMDKznuDWaZwfZHcM61FVFstyYNmK6Njk1';
    const abi = [{
        "stateMutability": "Nonpayable",
        "type": "Constructor"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [{"name": "btcAmount", "type": "uint256"}],
        "name": "BtcToEvf",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "inputs": [{"name": "evfAmount", "type": "uint256"}],
        "name": "EvfToBtc",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "address"}],
        "name": "btcAddress",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "btcBalance",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "address"}],
        "name": "btcToken",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "address"}],
        "name": "evfAddress",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "evfBalance",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "evfPrice",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "address"}],
        "name": "evfToken",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "exchangeEvfNum",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "getMaxTransferAmount",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "initTimestamp",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "outputEvfNum",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "address"}],
        "name": "owner",
        "stateMutability": "view",
        "type": "function"
    }, {
        "inputs": [
            {"name": "_evfAddress", "type": "address"},
            {"name": "_btcAddress", "type": "address"},
            {"name": "_targetAddress", "type": "address"}],
        "name": "set",
        "stateMutability": "nonpayable",
        "type": "function"
    }, {
        "outputs": [{"type": "address"}],
        "name": "targetAddress",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "tokensPerDay",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "uint256"}],
        "name": "transferInterval",
        "stateMutability": "view",
        "type": "function"
    }, {
        "outputs": [{"type": "bool"}],
        "name": "transferTokens",
        "stateMutability": "nonpayable",
        "type": "function"
    }];
    const contractAddress = 'TVuXsrgv9bG8SvbarX94awSg9sr32m7st7'
    const contractEvfAddress = 'TM9wvE7CzqZaK9GfBNttXLenq8fhJYzBFm'
    const [open, setOpen] = useState(false);

    async function onSignMessage() {
        const res = await signMessage(message);
        setSignedMessage(res);
    }

    //example 1
    async function totalSupplyContract() {
        let result
        // let result2

        let contractEvf = await tronWeb.contract().at(contractEvfAddress);
        console.log('  contractEvf: ', contractEvf);
        result = await contractEvf.balanceOf(address).call();
        console.log('地址: ', address, '  evf 余额: ', parseInt(result.toString(10)) / 100000000);

        let contract = await tronWeb.contract(abi, contractAddress);
        console.log('  contract: ', contract);

        result = await contract.evfPrice().call();
        console.log(' evf 价格: ', parseInt(result.toString(10)) / 100000000);

        // result = await contract.exchangeEvfNum().call();
        // console.log(' evf 兑换数量: ', parseInt(result.toString(10)) / 100000000);


        const functionSelector = 'BtcToEvf(uint256)';
        const parameter = [{type: 'uint256', value: 1 * 100000000}]
        const tx = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {}, parameter);
        console.log(' evf tx       : ', tx);
        const signedTx = await signTransaction(tx.transaction);
        console.log(' evf signedTx : ', signedTx);
        result = await tronWeb.trx.sendRawTransaction(signedTx);
        console.log(' evf BtcToEvf : ', result);


        // const functionSelector = 'EvfToBtc(uint256)';
        // const parameter = [{type: 'uint256', value: 1 * 100000000}]
        // const tx = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {}, parameter);
        // console.log(' evf tx       : ', tx);
        // const signedTx = await signTransaction(tx.transaction);
        // console.log(' evf signedTx : ', signedTx);
        // result = await tronWeb.trx.sendRawTransaction(signedTx);
        // console.log(' evf EvfToBtc : ', result);

        return result
    }


    async function onSignTransaction() {
        // console.log(" receiver:", receiver)
        console.log(" address:", address)

        // eslint-disable-next-line eqeqeq
        if (address != "") {
            tronWeb.setAddress(address);
        }

        let res2 = await totalSupplyContract()
        console.log(" res2: ", res2);

        // const transaction = await tronWeb.transactionBuilder.sendTrx(receiver, tronWeb.toSun(0.001), address);
        //
        // console.log(" transaction:", transaction)
        //
        // const signedTransaction = await signTransaction(transaction);
        // // const signedTransaction = await tronWeb.trx.sign(transaction);
        // await tronWeb.trx.sendRawTransaction(signedTransaction);
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
                contractAddress &nbsp;<i>{contractAddress}</i>&nbsp;
            </p>
            <p style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', wordBreak: 'break-all'}}>
                contractEvfAddress &nbsp;<i>{contractEvfAddress}</i>&nbsp;
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
