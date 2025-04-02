import { useEffect, useState } from "react";
import Decimal from "break_eternity.js";
import slavetemplate from "../slaves/slavetemplate";
import displayNum from "../displayNum";
import "../index.css";

// images
import taitaimage from "../img/taita.png";
import aadiimage from "../img/aadi.jpg";
import jerryimage from "../img/jerry.jpg";
import ayushimage from "../img/ayush.jpg";

function Clicker() {
  const [aura, setAura] = useState(() => {
    const storedAura = localStorage.getItem("aura");
    return storedAura ? new Decimal(storedAura) : new Decimal(100000000);
  });
  const [totalAura, setTotalAura] = useState(() => {
    const storedTotalAura = localStorage.getItem("totalAura");
    return storedTotalAura ? new Decimal(storedTotalAura) : new Decimal(0);
  });
  const [clicks, setClicks] = useState(() => {
    const storedClicks = localStorage.getItem("clicks");
    return storedClicks ? parseInt(storedClicks) : 0;
  });
  const [taita] = useState(() => {
    const storedTaita = localStorage.getItem("taita");
    if (storedTaita) {
      const parsedTaita = JSON.parse(storedTaita);
      return new slavetemplate(
        parsedTaita.name,
        parsedTaita.amount,
        parsedTaita.speed,
        parsedTaita.basePrice,
        parsedTaita.multiplier,
        parsedTaita.upgradePrice,
        parsedTaita.locked,
        parsedTaita.unlockPrice,
        parsedTaita.index,
      );
    } else {
      return new slavetemplate("Taita", 0, 0.5, 10, 1000, 100, false, 0, 0)
    }
  });
  const [aadi] = useState(() => {
    const storedAadi = localStorage.getItem("aadi");
    if (storedAadi) {
      const parsedAadi = JSON.parse(storedAadi);
      return new slavetemplate(
        parsedAadi.name,
        parsedAadi.amount,
        parsedAadi.speed,
        parsedAadi.basePrice,
        parsedAadi.multiplier,
        parsedAadi.upgradePrice,
        parsedAadi.locked,
        parsedAadi.unlockPrice,
        parsedAadi.index,
      );
    } else {
      return new slavetemplate("Aadi", 0, 0.5, 1000, 10000, 500, false, 0, 1)
    }
  });
  const [jerry] = useState(() => {
    const storedJerry = localStorage.getItem("jerry");
    if (storedJerry) {
      const parsedJerry = JSON.parse(storedJerry);
      return new slavetemplate(
        parsedJerry.name,
        parsedJerry.amount,
        parsedJerry.speed,
        parsedJerry.basePrice,
        parsedJerry.multiplier,
        parsedJerry.upgradePrice,
        parsedJerry.locked,
        parsedJerry.unlockPrice,
        parsedJerry.index,
      );
    } else {
      return new slavetemplate("Jerry", 0, 0.5, 10000, 100000, 1000, false, 0, 2)
    }
  });
  const [ayush] = useState(
    () => {
      const storedAyush = localStorage.getItem("ayush");
      if (storedAyush) {
        const parsedAyush = JSON.parse(storedAyush);
        return new slavetemplate(
          parsedAyush.name,
          parsedAyush.amount,
          parsedAyush.speed,
          parsedAyush.basePrice,
          parsedAyush.multiplier,
          parsedAyush.upgradePrice,
          parsedAyush.locked,
          parsedAyush.unlockPrice,
          parsedAyush.index,
        );
      } else {
        return new slavetemplate("Ayush", 0, 0.5, 100000, 1000000, 10000, false, 0, 3)
      }
    }
  ); // only string works here to parse BIG values (small is fine) into Decimal
  const [slaves] = useState([taita, aadi, jerry, ayush]);
  const [dummy, setDummy] = useState(0); // dummy state to force re-render
  const [buyQuantity, setBuyQuantity] = useState(1); // 1 for single, 10 for max

  const saveToLocalStorage = () => {
    localStorage.setItem("aura", aura.toString());
    localStorage.setItem("totalAura", totalAura.toString());
    localStorage.setItem("clicks", clicks.toString());
    localStorage.setItem("taita", JSON.stringify(taita));
    localStorage.setItem("aadi", JSON.stringify(aadi));
    localStorage.setItem("jerry", JSON.stringify(jerry));
    localStorage.setItem("ayush", JSON.stringify(ayush));
    console.log("Saved to local storage");
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToLocalStorage();
    }
    window.addEventListener("beforeunload", handleBeforeUnload);

    const handleMouseClick = () => {
      saveToLocalStorage();
    }
    window.addEventListener("click", handleMouseClick);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("click", handleMouseClick);
    }
  }, [aura, totalAura, clicks, taita, aadi, jerry, ayush]);

  const handleUpgrade = (slave: slavetemplate) => {
    slave.setPrice(slave.getPrice().multiply(slave.getMultiplier()));
    slave.setSpeed(slave.getSpeed().times(10));
  };
  const handleBuy = (slave: slavetemplate) => {
    const price = slave.getPrice();
    if (aura.lt(price)) {
      return;
    }
    const newAura = aura.minus(price);
    setAura(newAura);

    const newAmount = slave.getAmount().plus(1);
    const newNumBought = slave.getNumBought().plus(1);
    slave.setAmount(newAmount);
    slave.setNumBought(newNumBought);
    if (newNumBought.mod(10).eq(0)) {
      handleUpgrade(slave);
      // slave.setMultiplier(multiplier.times(100));
    }
    slave.setSelf();
  };

  const handleClick = () => {
    setAura((aura) => aura.plus(1));
    setTotalAura((totalAura) => totalAura.plus(1));
    setClicks((clicks) => clicks + 1);
  };

  const forceRender = () => {
    setDummy(dummy + 1);
  };

  const toggleBuyMode = () => {
    setBuyQuantity((prev) => (prev === 1 ? 10 : 1));
  };

  const handleMultiBuy = (slave: slavetemplate) => {
    const currentBought = slave.getNumBought();
    const modVal = currentBought.mod(10);
    const threshold = new Decimal(10).minus(modVal);
    const price = slave.getPrice();
    const costToUpgrade = price.times(threshold);

    if (aura.lt(costToUpgrade)) {
      // cannot afford 10
      const affordableUnits = aura.divide(price).floor();
      if (affordableUnits === new Decimal(0)) return;
      const totalCost = price.times(affordableUnits);
      setAura(aura.minus(totalCost));
      slave.setAmount(slave.getAmount().plus(affordableUnits));
      slave.setNumBought(slave.getNumBought().plus(affordableUnits));
    } else {
      // can afford 10
      setAura(aura.minus(costToUpgrade));
      slave.setAmount(slave.getAmount().plus(threshold));
      slave.setNumBought(slave.getNumBought().plus(threshold));
      handleUpgrade(slave);
    }
    slave.setSelf();
  };

  const resetAll = () => {
    setAura(new Decimal(0));
    slaves.map((slave) => {
      slave.setAmount(0);
      slave.setNumBought(0);
      slave.setPrice(slave.getBasePrice());
      slave.setSpeed(slave.getBaseSpeed());
      slave.setSelf();
    });
  };

  const handleUnlock = (slave: slavetemplate, targetSlave: slavetemplate) => {
    if (targetSlave.getAmount().lt(slave.getUnlockPrice())) {
      return;
    }
    resetAll();
    slave.setLocked(false);
    slave.setSelf();
  };

  useEffect(() => {
    const auraPerSecond = taita.getAmount().times(taita.getSpeed());

    const interval = setInterval(() => {
      const increment = new Decimal(0.1).times(auraPerSecond);
      setAura((aura) => aura.plus(increment));
      setTotalAura((totalAura) => totalAura.plus(increment));

      slaves.forEach((slave, index) => {
        if (index > 0) {
          const production = new Decimal(0.1)
            .times(slave.getSpeed())
            .times(slave.getAmount());
          const target = slaves[index - 1];
          target.setAmount(target.getAmount().plus(production));
          slave.setSelf();
          target.setSelf();
        }
      });
      forceRender();
    }, 100);

    return () => clearInterval(interval);
  });

  return (
    <div className="text-center flex items-center justify-center flex-col gap-3 bg-gray-950">
      <div className="flex flex-col gap-3 items-center w-full text-textprimary">
        <p className="text-6xl w-auto">Aura Clicker</p>
        <p className="text-4xl w-auto">Aura: {displayNum(aura)}</p>
        <p className="text-2xl">Total Aura: {displayNum(totalAura)}</p>
        <p className="text-2xl">Clicks: {clicks}</p>
        <button onClick={handleClick} className="btn">
          Increase Aura
        </button>
      </div>
      <div className="flex flex-row w-full p-8">
        <div className="flex flex-col gap-3 w-full items-center">
          <div className="w-3/5 flex justify-end">
            <button
              onClick={toggleBuyMode}
              className="btn text-textprimary !w-25 !text-base !h-12 relative overflow-hidden"
              style={{
                backgroundColor: `${buyQuantity === 1 ? "" : "#c09cfa"}`,
              }}
            >
              <span className="mix-blend-difference">
                {buyQuantity === 1 ? "buy one" : "buy max"}
              </span>
            </button>
          </div>
          <div className="grid gap-3 p-2 w-3/5">
            {slaves.map((slave) => (
              <div
                key={slave.getName()}
                className="flex items-center gap-4 border border-border rounded-xl p-4"
                style={{ opacity: slave.getLocked() ? 0.5 : 1 }}
              >
                <div className="relative group">
                  {" "}
                  {/*images*/}
                  <img
                    src={
                      slave.getName() === "Taita"
                        ? taitaimage
                        : slave.getName() === "Aadi"
                          ? aadiimage
                          : slave.getName() === "Jerry"
                            ? jerryimage
                            : slave.getName() === "Ayush"
                              ? ayushimage
                              : ""
                    }
                    alt={slave.getName()}
                    className="w-20 h-25 rounded"
                  />
                  {/*tooltip*/}
                  <div className="absolute w-100 bottom-full transform mb-1 invisible group-hover:visible p-1.5 bg-gray-900 rounded-2xl border border-border tooltip">
                    <p className="text-textsecondary text-lg">
                      Each {slave.getName()} produces{" "}
                      {displayNum(slave.getSpeed())}{" "}
                      {slave.getName() === "Taita"
                        ? "aura"
                        : slave.getName() === "Aadi"
                          ? "Taita"
                          : slave.getName() === "Jerry"
                            ? "Aadi"
                            : slave.getName() === "Ayush"
                              ? "Jerry"
                              : "N/A"}{" "}
                      per second.
                    </p>
                  </div>
                </div>
                {/*display for amount and price*/}
                <div className="flex flex-col flex-grow text-textprimary">
                  <p className="text-4xl">
                    {slave.getName()}: {displayNum(slave.getAmount())}
                  </p>
                  <p className="text-3xl">
                    {slave.getName()} price: {displayNum(slave.getPrice())}
                  </p>
                </div>
                {slave.getLocked() ? (
                  // locked
                  <div className="relative">
                    <button
                      onClick={() =>
                        handleUnlock(slave, slaves[slave.getIndex() - 1])
                      }
                      className="btn absolute inset-0 z-20 bg-btnbghover text-white"
                    >
                      Unlock
                    </button>
                    <button className="btn invisible">
                      Increase {slave.getName()}
                    </button>
                  </div>
                ) : (
                  // unlocked
                  <button
                    onClick={() =>
                      buyQuantity === 1
                        ? handleBuy(slave)
                        : handleMultiBuy(slave)
                    }
                    className="btn relative overflow-hidden text-textsecondary"
                  >
                    <div
                      className="absolute left-0 top-0 bg-btnlightbg h-full transition-all duration-300 ease-in-out animate-flash"
                      style={{
                        width:
                          buyQuantity === 1
                            ? `${
                                aura.lt(slave.getPrice())
                                  ? 0
                                  : slave
                                      .getNumBought()
                                      .mod(10)
                                      .multiply(10)
                                      .toNumber() + 10
                              }%`
                            : `${
                                (slave.getNumBought().mod(10).toNumber() +
                                  (aura
                                    .divide(slave.getPrice())
                                    .gt(new Decimal(10))
                                    ? new Decimal(10)
                                        .subtract(slave.getNumBought().mod(10))
                                        .toNumber()
                                    : aura
                                        .divide(slave.getPrice())
                                        .floor()
                                        .toNumber())) *
                                10
                              }%`,
                      }}
                    ></div>
                    <div
                      className="absolute left-0 top-0 bg-btnbg h-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${slave.getNumBought().mod(10).multiply(10).toNumber()}%`,
                      }}
                    ></div>
                    <span className="relative z-10 flex items-center justify-center w-full h-full mix-blend-difference">
                      Increase {slave.getName()}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Clicker;
