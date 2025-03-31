import Decimal from "break_eternity.js";

class slavetemplate {
  name: string;
  amount: Decimal;
  numBought: Decimal;
  speed: Decimal;
  price: Decimal;
  basePrice: Decimal;
  multiplier: Decimal;
  upgradePrice: Decimal;

  constructor(
    name: string,
    amount: number | string,
    speed: number | string,
    price: number,
    multiplyer: number,
    upgradePrice: number,
  ) {
    this.name = name;
    this.amount = new Decimal(amount);
    this.numBought = new Decimal(0);
    this.speed = new Decimal(speed);
    this.price = new Decimal(price);
    this.basePrice = new Decimal(price);
    this.multiplier = new Decimal(multiplyer);
    this.upgradePrice = new Decimal(upgradePrice);
  }

  setSelf(): slavetemplate {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }

  setAmount(amount: number | Decimal) {
    this.amount = amount instanceof Decimal ? amount : new Decimal(amount);
  }

  setSpeed(speed: number | Decimal) {
    this.speed = speed instanceof Decimal ? speed : new Decimal(speed);
  }

  setPrice(price: number | Decimal) {
    this.price = price instanceof Decimal ? price : new Decimal(price);
  }

  setUpgradePrice(upgradePrice: number | Decimal) {
    this.upgradePrice =
      upgradePrice instanceof Decimal
        ? upgradePrice
        : new Decimal(upgradePrice);
  }

  setNumBought(numBought: number | Decimal) {
    this.numBought =
      numBought instanceof Decimal ? numBought : new Decimal(numBought);
  }

  setMultiplier(multiplier: number | Decimal) {
    this.multiplier =
      multiplier instanceof Decimal ? multiplier : new Decimal(multiplier);
  }

  getSpeed(): Decimal {
    return this.speed;
  }

  getPrice(): Decimal {
    return this.price;
  }

  getBasePrice(): Decimal {
    return this.basePrice;
  }

  getUpgradePrice(): Decimal {
    return this.upgradePrice;
  }

  getAmount(): Decimal {
    return this.amount;
  }

  getMultiplier(): Decimal {
    return this.multiplier;
  }

  getName(): string {
    return this.name;
  }

  getNumBought(): Decimal {
    return this.numBought;
  }
}

export default slavetemplate;
