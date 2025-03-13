class slavetemplate {
    name: string;
    amount: number = 0;
    numBought: number = 0; 
    speed: number;
    price: number;
    basePrice: number;
    multiplyer: number;
    upgradePrice: number;

    constructor(name: string, amount: number, speed: number, price: number, multiplyer: number, upgradePrice: number) {
        this.name = name;
        this.amount = amount;
        this.speed = speed;
        this.price = price;
        this.basePrice = price;
        this.multiplyer = multiplyer;
        this.upgradePrice = upgradePrice;
    }

    setSelf(): slavetemplate {
        return Object.assign(
          Object.create(Object.getPrototypeOf(this)),
          this
        );
    }
    
    setAmount(amount: number) {
        this.amount = amount;
    }

    setSpeed(speed: number) {
        this.speed = speed;
    }

    setPrice(price: number) {
        this.price = price;
    }

    setUpgradePrice(upgradePrice: number) {
        this.upgradePrice = upgradePrice;
    }

    setNumBought(numBought: number) {
        this.numBought = numBought;
    }

    getSpeed() {
        return this.speed;
    }

    getPrice() {
        return this.price;
    }

    getBasePrice() {
        return this.basePrice;
    }

    getUpgradePrice() {
        return this.upgradePrice;
    }

    getAmount() {
        return this.amount;
    }

    getMultiplyer() {
        return this.multiplyer;
    }

    getName() {
        return this.name;
    }
    
    getNumBought() {
        return this.numBought;
    }
}

export default slavetemplate;