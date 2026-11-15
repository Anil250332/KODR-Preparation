
class Car {
  brand: string;
  color: string;

  constructor(brand: string, color: string) {
    this.brand = brand;
    this.color = color;
  }

  start(): void {
    console.log(`${this.brand} is starting`);
  }
}

const car1 = new Car("BMW", "Black");
const car2 = new Car("Audi", "White");

console.log(car1.brand); // BMW
console.log(car2.color); // White

car1.start(); // BMW is starting
