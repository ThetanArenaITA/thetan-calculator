import { useEffect, useState } from "react";
import { ethers } from "ethers";

function LoginWithMetamask() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setconButtonText] = useState("Connect Wallet");

  const connectWalletHandler = () => {
    if (window.ethereum) {
      // metamask c'è
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          console.log(result[0]);

          let url =
            "https://data.thetanarena.com/thetan/v1/authentication/token";
          let signature =
            "0x55d62a64f11dfa28c22a138531ff50c2923d44b6f72a09343b7e529cf5c804546a8e3c2cf1861399a8c8db3efe0fa7934a16df12a6838e95e9c2f7bf40890a0a1c";
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address: result[0],
              signature: signature,
            }),
          };
          fetch(url, requestOptions)
            .then((results) => results.json())
            .then((data) => console.log(data));
        });
    } else {
      // metamask non c'è
      setErrorMessage("Installa MetaMask");
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    getUserBalance(newAccount.toString());
  };

  const getUserBalance = (adress) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [adress, "latest"] })
      .then((balance) => {
        setUserBalance(ethers.utils.formatEther(balance));
      });
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  return (
    <div>
      <button onClick={() => connectWalletHandler()}>{connButtonText}</button>

      <div>{defaultAccount}</div>
      <div>{userBalance}</div>
      <div>{errorMessage}</div>
    </div>
  );
}

export default LoginWithMetamask;
