let number_attempt = 0
let number_to_guess =  Math.floor((Math.random() * 10) + 1);
let number_guessed;
while (number_guessed != number_to_guess) {
    number_guessed = Number(prompt("Try to guess again: "))
    if (number_guessed > number_to_guess) console.log("Too high")
    else if (number_guessed < number_to_guess) console.log("Too low")
    number_attempt += 1
}
console.log(`Correct! You tried ${number_attempt} times`)    