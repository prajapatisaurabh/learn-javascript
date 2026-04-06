function manualNew(Constructor, ...args) {
  // Step 1: create empty object
  const obj = {};

  // Step 2: link prototype
  Object.setPrototypeOf(obj, Constructor.prototype);

  // Step 3: run constructor with `this` = new object
  const result = Constructor.apply(obj, args);

  // Step 4: return the new object (or constructor's return if it's an object)
  return result instanceof Object ? result : obj;
}

function Vehicle(make, model) {
  this.make = make;
  this.model = model;
}
Vehicle.prototype.describe = function () {
  return `${this.make} ${this.model}`;
};

const car = manualNew(Vehicle, "Toyota", "Camry");
console.log(car.describe()); // Toyota Camry
console.log(car instanceof Vehicle); // true
