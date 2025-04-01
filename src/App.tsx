import { useState, useEffect } from "react";
import Decimal from "break_eternity.js";
import slavetemplate from "./slaves/slavetemplate";
import displayNum from "./displayNum";
import "./index.css";

import taitaimage from "./img/taita.png";
import aadiimage from "./img/aadi.jpg";
import jerryimage from "./img/jerry.jpg";
import ayushimage from "./img/ayush.jpg";

function App() {
  const [aura, setAura] = useState(new Decimal(100));
  const [totalAura, setTotalAura] = useState(new Decimal(0));
  const [clicks, setClicks] = useState(0);
  const [taita] = useState(
    () => new slavetemplate("Taita", 0, 0.2, 10, 1000, 100),
  );
  const [aadi] = useState(
    () => new slavetemplate("Aadi", 0, 0.2, 1000, 10000, 500),
  );
  const [jerry] = useState(
    () => new slavetemplate("Jerry", 0, 0.2, 100000, 100000, 1000),
  );
  const [ayush] = useState(
    () => new slavetemplate("Ayush", 0, "0.2", 10000000, 1000000, 3000),
  ); // only string works here to parse BIG values (small is fine) into Decimal
  const [slaves] = useState([taita, aadi, jerry, ayush]);
  const [dummy, setDummy] = useState(0); // dummy state to force re-render

  const handleBuy = (slave: slavetemplate) => {
    const price = slave.getPrice();
    if (aura.lt(price)) {
      return;
    }
    const newAura = aura.minus(price);
    setAura(newAura);

    const newAmount = slave.getAmount().plus(1);
    const newNumBought = slave.getNumBought().plus(1);
    const multiplier = slave.getMultiplier();
    slave.setAmount(newAmount);
    slave.setNumBought(newNumBought);
    if (newNumBought.mod(10).eq(0)) {
      slave.setPrice(price.multiply(multiplier));
      slave.setSpeed(slave.getSpeed().times(10));
      slave.setPrice(price.multiply(multiplier));
      slave.setSpeed(slave.getSpeed().times(10));
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
      <div className="grid gap-3 p-5 w-3/5">
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
              <div className="absolute w-100 bottom-full transform mb-1 invisible group-hover:visible p-1.5 bg-gray-900 rounded tooltip">
                <p className="text-textsecondary text-lg">
                  Each {slave.getName()} produces {displayNum(slave.getSpeed())}{" "}
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
            <button onClick={() => handleBuy(slave)} className="btn relative overflow-hidden text-textsecondary">
              <div className="absolute left-0 top-0 bg-btnbg h-full"
                style={{
                  width: `${slave.getNumBought().mod(10).multiply(10).toNumber()}%`,
                }}>
              </div>
              <span className="relative z-10 flex items-center justify-center w-full h-full mix-blend-difference">
                Increase {slave.getName()}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
