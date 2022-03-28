import { useEffect, useRef, useState } from "react";

function UserInfo(props) {
  const info = props.data;
  const userProfile = info.userProfile;
  const statistiche = info.playerStatistic;
  const winrate = ((statistiche.victory / statistiche.battle) * 100).toFixed(2);
  const mvpRate = ((statistiche.mvp / statistiche.victory) * 100).toFixed(2);
  const tripleRate = ((statistiche.triple / statistiche.battle) * 100).toFixed(
    2
  );
  const megaRate = ((statistiche.mega / statistiche.battle) * 100).toFixed(2);

  console.log(info);

  const [avatar, setAvatar] = useState(null);

  function truncate(str, max, sep) {
    // Default to 10 characters
    max = max || 20;

    var len = str.length;
    if (len > max) {
      // Default to elipsis
      sep = sep || "...";

      var seplen = sep.length;

      // If seperator is larger than character limit,
      // well then we don't want to just show the seperator,
      // so just show right hand side of the string.
      if (seplen > max) {
        return str.substr(len - max);
      }

      // Half the difference between max and string length.
      // Multiply negative because small minus big.
      // Must account for length of separator too.
      var n = -0.5 * (max - len - seplen);

      // This gives us the centerline.
      var center = len / 2;

      var front = str.substr(0, center - n);
      var back = str.substr(len - center + n); // without second arg, will automatically go to end of line.

      return front + sep + back;
    }

    return str;
  }

  useEffect(() => {
    setAvatar(null);
    fetch("https://data.thetanarena.com/thetan/v1/userItemsConfig?configVer=-1")
      .then((response) => response.json())
      .then((data) => {
        const avatars = data.data.avatarConfig;
        avatars.map((avt, index) => {
          //console.log(avt);
          if (info.avatarId === avt.avatarId) {
            const avtURL = "https://assets.thetanarena.com/" + avt.imageAvatar;
            setAvatar(avtURL);
            //console.log(avtURL);
          }
        });
        //console.log(data.data.avatarConfig);
      });
  }, []);
  
  const nameDiv = useRef()
  const lunghezzaParola = info.username.length
  const fontSizePrg = 1.5 - (lunghezzaParola*0.01)

  return (
    <div>
      <div className="mainLayout flexSpace marginTop10 maxWidth350 margin10">
        <div className="flexLayout">
          {avatar && (
            <div
              className="avatarProfile"
              style={{ backgroundImage: "url(" + avatar + ")" }}
            ></div>
          )}
        </div>
        <div ref={nameDiv} style={{ maxWidth: "50%" }}>
          {" "}
          <h2 style={{fontSize: fontSizePrg+"em"}}>{info.username}</h2>
          <h5>{info.email}</h5>
          <div>{truncate(info.address)}</div>
          <div>
            <h5>
              LIVELLO: {userProfile.level} ({userProfile.xp}XP)
            </h5>
          </div>
          <div>
            <h5>Behavior Point: {statistiche.behaviorPoint}</h5>
          </div>
        </div>
      </div>
      <div className="mainLayout flexSpace marginTop10 maxWidth350 margin10">
        <div>
          <h2>Battaglie Totali</h2>
          <div>
            <h2>{statistiche.battle}</h2>
          </div>
        </div>
        <div className="separatore"></div>
        <div style={{ textAlign: "right" }}>
          <h2>Battaglie Vinte</h2>
          <div>
            <h2>{statistiche.victory}</h2>
          </div>
        </div>
      </div>
      <div className="mainLayout flexSpace marginTop10 maxWidth350 margin10">
        <div>
          <h2>WINRATE</h2>
        </div>
        <div>
          <h2
            style={{
              color:
                winrate < 48 ? "#d80000" : winrate > 51 ? "#0dc900" : "#feca2e",
            }}
          >
            {winrate}%
          </h2>
        </div>
      </div>
      <div className="mainLayout flexSpace marginTop10 maxWidth350 margin10">
        <div>
          <h2>MVP</h2>
          <div>
            <h2 style={{ marginBottom: 0 }}>
              {statistiche.mvp}{" "}
              <div style={{ fontSize: "15px" }}>
                {mvpRate}%{" "}
                <span style={{ fontSize: "10px", fontWeight: "normal" }}>
                  delle vittorie
                </span>
              </div>
            </h2>
          </div>
        </div>
        <div className="separatore"></div>
        <div style={{ textAlign: "right" }}>
          <h2>STREAK</h2>
          <div>
            <h2 style={{ marginBottom: 0 }}>{statistiche.streak}</h2>
            <span style={{ fontSize: "10px", fontWeight: "normal" }}>
              vittorie consecutive
            </span>
          </div>
        </div>
      </div>
      <div className="mainLayout flexSpace marginTop10 maxWidth350 margin10">
        <div>
          <h2>TRIPLE KILL</h2>
          <div>
            <h2 style={{ marginBottom: 0 }}>
              {statistiche.triple}{" "}
              <div style={{ fontSize: "15px" }}>
                {tripleRate}%{" "}
                <span style={{ fontSize: "10px", fontWeight: "normal" }}>
                  delle battaglie
                </span>
              </div>
            </h2>
          </div>
        </div>
        <div className="separatore"></div>
        <div style={{ textAlign: "right" }}>
          <h2>MEGA KILL</h2>
          <div>
            <h2 style={{ marginBottom: 0 }}>
              {statistiche.mega}{" "}
              <div style={{ fontSize: "15px", fontWeight: "normal" }}>
                {megaRate}%{" "}
                <span style={{ fontSize: "10px", fontWeight: "normal" }}>
                  delle battaglie
                </span>
              </div>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
