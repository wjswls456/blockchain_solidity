const assert = require('assert');
const ganache = require('ganache');
const { describe } = require('mocha');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile')

let lottery;
let accounts;

beforeEach(async () => {

    // Get a list of all counts
    accounts = await web3.eth.getAccounts()


    // Use one of those acoounts to deploy
    // the contract
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })

})


describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address)
    })

    it('allow one account to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', "ether")
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', "ether")
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', "ether")
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        })

        assert.equal(accounts[0], players[0])
        assert.equal(accounts[1], players[1])
        assert.equal(accounts[2], players[2])
        assert.equal(3, players.length)
    })

    it('requires a minimum amount of ether to enter', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: 0
            })
            assert(false)
        } catch (error) {
            assert.ok(error)
        }
    })

    it('only managet can call pickWinner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1],

            })
            assert(false)
        } catch (error) {
            assert.ok(error)
        }
    })

    it('sends money to the winner and resets the players array', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        })
        const initialBalance = await web3.eth.getBalance(accounts[0])
        await lottery.methods.pickWinner().send({ from: accounts[0] })
        const finalBalance = await web3.eth.getBalance(accounts[0])

        const difference = finalBalance - initialBalance;
        assert(difference > web3.utils.toWei('1.8', 'ether'));

    })
})