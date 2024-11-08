const assert = require('assert');
const ganache = require('ganache');
const { describe } = require('mocha');
const { Web3 } = require('web3');
const web3 = new Web3(ganache.provider())

const { interface, bytecode } = require('../compile')

let accounts;
let inbox;

beforeEach(async () => {

    // Get a list of all counts
    accounts = await web3.eth.getAccounts()


    // Use one of those acoounts to deploy
    // the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['hi there!'] })
        .send({ from: accounts[0], gas: '1000000' })



})


describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)
    })
})