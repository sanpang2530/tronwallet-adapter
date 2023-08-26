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
    const receiver = 'TMDKznuDWaZwfZHcM61FVFstyYNmK6Njk1';

    // const abi = []
    const contractAddress = 'TVuXsrgv9bG8SvbarX94awSg9sr32m7st7'
    const [open, setOpen] = useState(false);

    async function onSignMessage() {
        const res = await signMessage(message);
        setSignedMessage(res);
    }

    //example 1
    async function totalSupplyContract() {
        // @ts-ignore
        // let abi = [...];
        // let instance = await tronWeb.contract(abi, contractAddress);
        // console.log("instance:", instance);
        //
        // let result = await instance.balanceOf('TJc1TtL3u1zhjk2nfbhTyYNZSot4QJwu9y').call();
        // console.log("result:", result.toString(10));

        //example 1
        // let instance =await tronWeb.contract([{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}],"TREwN2qRkME9TyQUz8dG6HfjEyKGMPHAS5")
        // let res = await instance.totalSupply().call({_isConstant:true})

        let abi = [{
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

        let result
        // let result2

        let contract = await tronWeb.contract(abi, contractAddress);
        console.log('  contract: ', contract);

        result = await contract.evfPrice().call();
        console.log(' evf 价格: ', parseInt(result.toString(10)) / 100000000);


        result = await contract.exchangeEvfNum().call();
        console.log(' evf 兑换数量: ', parseInt(result.toString(10)) / 100000000);


        // contract = await tronWeb.contract(abi, contractAddress);
        // result = await contract.EvfToBtc(1 * 100000000);
        // console.log(' evf contract : ', contract);
        // console.log(' evf result   : ', result);
        // result2 = await result.send();

        // const signedTx = await tronWeb.trx.sign(tx.transaction);

        const functionSelector = 'EvfToBtc(uint256)';
        const parameter = [{type: 'uint256', value: 1 * 100000000}]
        const tx = await tronWeb.transactionBuilder.triggerSmartContract(contractAddress, functionSelector, {}, parameter);
        console.log(' evf tx       : ', tx);
        const signedTx = await signTransaction(tx.transaction);
        console.log(' evf signedTx : ', signedTx);
        result = await tronWeb.trx.sendRawTransaction(signedTx);

        console.log(' evf EvfToBtc : ', result);

        // let contract = await tronWeb.contract().at(contractAddress);
        // console.log('contract: ', contract);
        //
        // // const decimals = 18;
        // // const input = 999;
        // // const amount = tronWeb.toBigInt(999)
        //

        // // let result3
        //
        // // result = await contract.evfPrice();
        // // console.log('  evfPrice: ', result);
        // // console.log('  contract.address: ', contract.address);
        // //
        // // result2 = await result.call();
        // // console.log('  evfPrice2: ', result2);
        // //
        // // result3 = await result2.call;
        // // console.log('  evfPrice3: ', result3);
        //
        //
        // result = await contract.EvfToBtc(10000000000);
        // console.log('  EvfToBtc1: ', result);
        // result2 = await result.send();
        // console.log('  EvfToBtc2: ', result2);

        // let res = await contract.evfPrice().call();
        // console.log(res);
        return result
    }


    async function onSignTransaction() {
        console.log(" receiver:", receiver)
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
