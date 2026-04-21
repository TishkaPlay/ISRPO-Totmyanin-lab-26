export function greet(name) {
    return `Привет, ${name}!`
}

export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}

export const PI = 3.14159;

export default function sayHello() {
    return "Привет из модуля utils!";
}

import { greet, add, PI } from "./utils.js";

console.log("Модули");
console.log(greet("Алексей"));
console.log("5 + 3 =", add(5, 3));
console.log("Значение PI:", PI);

import { multiply as умножить } from "./utils.js";
console.log("4 * 7 =", умножить(4, 7));

import * as Utils from "./utils.js";
console.log(Utils.greet("Мария"));
console.log("Умножение:", Utils.multiply(3, 9));