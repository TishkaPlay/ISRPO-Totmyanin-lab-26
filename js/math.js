import { square, cube, E } from './math.js';

export function square(x) {
    return x * x;
}

export function cube(x) {
    return x * x * x;
}

export const E = 2.718;

console.log("=== Задание 8.5: Модуль math.js ===");
console.log(`Квадрат 6: ${square(6)}`);
console.log(`Куб 4: ${cube(4)}`);
console.log(`Константа E: ${E.toFixed(3)}`);
