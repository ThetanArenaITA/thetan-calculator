import { useEffect, useState } from "react";
import { ethers } from "ethers";
import UserInfo from "./UserInfo";

import back from "../../images/back.png";
import Footer from "../Footer";

import { useNavigate } from "react-router-dom";

function LoginWithMetamask() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setconButtonText] = useState("Connect Wallet");
  const [userInfo, setInfo] = useState(null);

  let naviga = useNavigate();

  const connectWalletHandler = () => {
    if (window.ethereum) {
      // metamask c'è
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          const addressID = result[0];
          console.log(result[0]);

          let url =
            "https://data.thetanarena.com/thetan/v1/authentication/nonce?Address=" +
            addressID;

          fetch(url)
            .then((results) => results.json())
            .then((data) => {
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = provider.getSigner();
              const signature = signer.signMessage(data.data.nonce + "");
              const address = signer.getAddress();
              signature.then((sign) => {
                const signat = sign;
                const requestOptions = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    address: result[0],
                    signature: signat,
                  }),
                };
                console.log(result[0]);
                console.log(signat);
                const getTokenUrl =
                  "https://data.thetanarena.com/thetan/v1/authentication/token";
                fetch(getTokenUrl, requestOptions)
                  .then((rexponse) => rexponse.json())
                  .then((datax) => {
                    console.log(datax.data.accessToken);
                    localStorage.setItem(
                      "theta/accessToken",
                      JSON.stringify(datax.data.accessToken)
                    );
                    localStorage.setItem(
                      "theta/accessTokenExpiry",
                      JSON.stringify(datax.data.expiration)
                    );
                    const requestOptions2 = {
                      method: "GET",
                      headers: {
                        Authorization: "Bearer " + datax.data.accessToken,
                        "Content-Type": "application/json",
                      },
                    };
                    fetch(
                      "https://data.thetanarena.com/thetan/v1/profile",
                      requestOptions2
                    )
                      .then((rezponse) => rezponse.json())
                      .then((dataz) => {
                        setInfo(dataz.data);
                        console.log(dataz);
                      });
                  });
              });
            });
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
      <div style={{margin: "auto", width: "375px"}}>
        <div className="mainLayout column flexSpace marginTop30 maxWidth350 margin10">
          <div className="flexLayout ">
            <button
              disabled={userInfo}
              className="footerButton"
              onClick={() => connectWalletHandler()}
            >
              {userInfo ? "CONNESSO" : "CONNETTI WALLET"}
            </button>
            <div
              style={{ backgroundImage: "url(" + back + ")" }}
              className="back"
              onClick={() => naviga("/")}
            ></div>
          </div>
          <div className="resultLabel marginTop30"></div>
        </div>
        {userInfo && <UserInfo data={userInfo} />}
      </div>
    </div>
  );
}

export default LoginWithMetamask;
