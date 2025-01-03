#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log('Приветствую! Это игра "Угадай число"');
console.log('Для начала введи имя файла для логирования игры: ');

rl.question('', input => {
	const writerStream = fs.createWriteStream(input + '.json');
	const logEntries = [];

	writerStream.on('error', () => {
		console.error('Ошибка при записи в файл');
	});

	console.log('\nДля завершения игры введите: ВЫХОД');
	coinToss(writerStream, logEntries);
});

const coinToss = (writerStream, logEntries) => {
	const coin = Math.floor(Math.random() * 2) + 1;
	console.log('\nУгадайте, какое число выпало: 1 или 2?');

	rl.question('', input => {
		if (input === 'ВЫХОД') {
			console.log('Игра завершена');
			writerStream.write(JSON.stringify(logEntries, null, 2), 'UTF8');
			writerStream.end();
			rl.close();
			return;
		}

		const userAnswer = Number(input);

		if (userAnswer !== 1 && userAnswer !== 2) {
			console.log('Вы ввели что-то другое');
		}

		if (userAnswer === coin) {
			console.log('Вы угадали!');
		} else {
			console.log('К сожалению, вы не угадали. Правильный ответ: ', coin);
		}

		logging(logEntries, coin, userAnswer);
		coinToss(writerStream, logEntries);
	});
};

const logging = (logEntries, coin, userAnswer) => {
	const time = new Date().toISOString();
	const content = {
		time: time,
		coin: coin,
		userAnswer: userAnswer,
		result: userAnswer === coin ? 'Угадано' : 'Не угадано',
	};

	logEntries.push(content);
};
