import { useState, useEffect } from 'react'
import slavetemplate from "./slaves/slavetemplate"
import './index.css';

function App() {
  const [aura, setAura] = useState(0);
  const [totalAura, setTotalAura] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [taita] = useState(() => new slavetemplate("Taita", 0, 0.2, 20, 1.05, 100));
  const [aadi] = useState(() => new slavetemplate("Aadi", 0, 0.2, 100, 1.1, 500));
  const [jerry] = useState(() => new slavetemplate("Jerry", 0, 0.2, 500, 1.5, 1000));
  const [ayush] = useState(() => new slavetemplate("Ayush", 0, 0.2, 2000, 2.5, 3000));
  const [slaves] = useState([taita, aadi, jerry, ayush]);
  const [dummy, setDummy] = useState(0); // dummy state to force re-render

  const handleBuy = (slave: slavetemplate) => {
    const price = slave.getPrice();
    if (aura < price) {
      return;
    }
    const newAura = aura - price;
    setAura(newAura);

    const newAmount = slave.getAmount() + 1;
    const newNumBought = slave.getNumBought() + 1;
    slave.setAmount(newAmount);
    slave.setNumBought(newNumBought);
    slave.setPrice(Math.pow(slave.getMultiplyer(), slave.getNumBought()) * slave.getBasePrice());
    slave.setSelf();
  }

  const handleClick = () => {
    setAura((aura) => aura + 1);
    setTotalAura((totalAura) => totalAura + 1);
    setClicks((clicks) => clicks + 1);
  }

  const forceRender = () => {
    setDummy(dummy + 1);
  }

  useEffect(() => {
    const auraPerSecond = taita.getAmount() * taita.getSpeed();

    const interval = setInterval(() => {
      setAura((aura) => aura + 0.1 * auraPerSecond);
      setTotalAura((totalAura) => totalAura + 0.1 * auraPerSecond);

      slaves.forEach((slave, index) => {
        if (index > 0) {
          const production = 0.1 * slave.getSpeed() * slave.getAmount();
          const target = slaves[index - 1];
          target.setAmount(target.getAmount() + production);
          slave.setSelf();
          target.setSelf();
        }
      });
      forceRender();
    }, 100);

    return () => clearInterval(interval);
  });

  const displayNum = (datum: string) => {
    if (parseInt(datum) < 1000000) {
      return new Intl.NumberFormat('en-US', {notation: 'compact'}).format(parseFloat(datum));
    }
    return new Intl.NumberFormat('en-US', {notation: 'scientific'}).format(parseFloat(datum));
  }

  return (
    <div className='text-center flex items-center justify-center flex-col gap-3'>
      <p className="text-8xl">Aura Clicker</p>
      <p className="text-6xl">Aura: {displayNum(aura.toFixed(2))}</p>
      <p className="text-4xl">Total Aura: {displayNum(totalAura.toFixed(2))}</p>
      <p className="text-4xl">Clicks: {clicks}</p>
      <button onClick={handleClick} className="btn">
        Increase Aura
      </button>


      {slaves.map((slave) => (
        <>
          <p className='text-6xl'>{slave.getName()}: {displayNum(slave.getAmount().toFixed(2))}</p>
          <p className='text-3xl'>{slave.getName()} price: {displayNum(slave.getPrice().toFixed(2))}</p>
          <button onClick={() => handleBuy(slave)} className="btn">
            Increase {slave.getName()}
          </button>
        </>
      ))}
    </div>
  );
}

export default App;