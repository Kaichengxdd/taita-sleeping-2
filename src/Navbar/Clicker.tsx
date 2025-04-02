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
    const [aura, setAura] = useState(new Decimal(100));
  const [totalAura, setTotalAura] = useState(new Decimal(0));
  const [clicks, setClicks] = useState(0);
  const [taita] = useState(
    () => new slavetemplate("Taita", 0, 0.5, 10, 1000, 100),
  );
  const [aadi] = useState(
    () => new slavetemplate("Aadi", 0, 0.5, 1000, 10000, 500),
  );
  const [jerry] = useState(
    () => new slavetemplate("Jerry", 0, 0.5, 100000, 100000, 1000),
  );
  const [ayush] = useState(
    () => new slavetemplate("Ayush", 0, "0.5", 10000000, 1000000, 3000),
  ); // only string works here to parse BIG values (small is fine) into Decimal
  const [slaves] = useState([taita, aadi, jerry, ayush]);
  const [dummy, setDummy] = useState(0); // dummy state to force re-render
  const [buyQuantity, setBuyQuantity] = useState(1); // 1 for single, 10 for max

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
              >
                <div className="relative group">
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
                <div className="flex flex-col flex-grow text-textprimary">
                  <p className="text-4xl">
                    {slave.getName()}: {displayNum(slave.getAmount())}
                  </p>
                  <p className="text-3xl">
                    {slave.getName()} price: {displayNum(slave.getPrice())}
                  </p>
                </div>
                <button
                  onClick={() =>
                    buyQuantity === 1 ? handleBuy(slave) : handleMultiBuy(slave)
                  }
                  className="btn relative overflow-hidden text-textsecondary"
                >
                  <div
                    className="absolute left-0 top-0 bg-btnlightbg h-full transition-all duration-300 ease-in-out animate-flash"
                    style={{
                      width:
                        buyQuantity === 1
                          ? `${aura.lt(slave.getPrice()) ? 0 : slave.getNumBought().mod(10).multiply(10).toNumber() + 10}%`
                          : `${(slave.getNumBought().mod(10).toNumber() + (aura.divide(slave.getPrice()).gt(new Decimal(10)) ? new Decimal(10).subtract(slave.getNumBought().mod(10)).toNumber() : aura.divide(slave.getPrice()).floor().toNumber())) * 10}%`, // also fine here
                    }}
                  ></div>
                  <div
                    className="absolute left-0 top-0 bg-btnbg h-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${slave.getNumBought().mod(10).multiply(10).toNumber()}%`, // tonumber is safe as it never gets too big
                    }}
                  ></div>
                  <span className="relative z-10 flex items-center justify-center w-full h-full mix-blend-difference">
                    Increase {slave.getName()}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
);}

export default Clicker;