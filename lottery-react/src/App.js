import React, { useEffect, useState } from "react";
import web3 from "./web3";
import lottery from "./lottery.js";

const App = () => {
  const [state, setState] = useState({ manager: "", players: [], balance: '', value: '', message: "" });



  useEffect(() => {
    const fetchManager = async () => {
      const managerAddress = await lottery.methods.manager().call();
      const players = await lottery.methods.getPlayers().call();
      const balance = await web3.eth.getBalance(lottery.options.address)
      setState({ ...state, manager: managerAddress, players, balance });
    };

    fetchManager();
  }, []); // Empty dependency array means this runs once when the component mounts


  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    setState({ ...state, message: "Waiting on transaction success..." })

    await lottery.methods.enter().send({ from: accounts[0], value: web3.utils.toWei(state.value, 'ether') })

    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    setState({ ...state, message: "You have been entered!" });
  }


  return (

    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {state.manager}
        there are currently {state.players.length} people entered,
        competing to win {web3.utils.fromWei(state.balance, 'ether')} there!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value={state.value} onChange={(event) => setState({ ...state, value: event.target.value })}>
          </input>
        </div>
        <button>Enter</button>
      </form>

      <hr />

      <h1>{state.message}</h1>

      <hr />

    </div>
  );
};

export default App;
