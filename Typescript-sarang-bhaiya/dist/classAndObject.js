"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Car {
    brand = "";
    //   color: string;
    //   constructor(brand: string, color: string) {
    //     this.brand = brand;
    //     this.color = color;
    //   }
    start() {
        console.log(`${this.brand} is starting`);
    }
}
// const car1 = new Car("BMW", "Black");
// const car2 = new Car("Audi", "White");
const car1 = new Car();
car1.brand = "lund";
console.log(car1.brand); // BMW
// console.log(car2.color); // White
// car1.start(); // BMW is starting
//# sourceMappingURL=classAndObject.js.map