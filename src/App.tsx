import { useState, useEffect } from "react";
import Decimal from "break_eternity.js";
import slavetemplate from "./slaves/slavetemplate";
import displayNum from "./displayNum";
import "./index.css";

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
      slave.setPrice(
        price.multiply(multiplier)
      )
      slave.setSpeed(
        slave.getSpeed().times(10)
      )
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
    <div className="text-center flex items-center justify-center flex-col gap-3">
      <div className="flex flex-col gap-3 items-center w-full">
        <p className="text-6xl w-auto">Aura Clicker</p>
        <p className="text-4xl w-auto">Aura: {displayNum(aura)}</p>
        <p className="text-2xl">Total Aura: {displayNum(totalAura)}</p>
        <p className="text-2xl">Clicks: {clicks}</p>
        <button onClick={handleClick} className="btn">
          Increase Aura
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 items-center p-4">
        {slaves.map((slave) => (
          <>
            <div className="flex flex-col flex-wrap gap-2 items-start w-auto p-2">
              <p className="text-4xl text-start w-0">
                {slave.getName()}: {displayNum(slave.getAmount())}
              </p>
              <p className="text-3xl text-start">
                {slave.getName()} price: {displayNum(slave.getPrice())}
              </p>
            </div>
            <button onClick={() => handleBuy(slave)} className="btn">
              {/* <div
                className="relative top-0 left-0 min-h-1 bg-gray-300 overflow-visible text-nowrap text-center"
                style={{
                  width: `${Math.min(slave.getNumBought().mod(10).toNumber(), 10) * 10}%`,
                  transition: "width 0.5s ease-in-out",
                }}
              >
              </div>
              <span className="absolute z-10 text-center">Increase {slave.getName()}</span> */}
              Increase {slave.getName()}
            </button>
          </>
        ))}
      </div>
    </div>
  );
}

export default App;
