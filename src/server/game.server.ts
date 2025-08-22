import { Players, ReplicatedStorage } from "@rbxts/services";
import { Answer } from "shared/Answer";
import { Result } from "shared/Result";

const startAppearEvent = ReplicatedStorage.FindFirstChild("StartAppearEvent") as RemoteEvent;
const startGame = ReplicatedStorage.FindFirstChild("StartGame") as RemoteEvent;
const chosenItem = ReplicatedStorage.FindFirstChild("ChosenItem") as RemoteEvent;
const winnerEvent = ReplicatedStorage.FindFirstChild("WinnerEvent") as RemoteEvent;

const arenas = game.Workspace.WaitForChild("Arenas");
const roundChoices: Map<Player, Answer> = new Map();

let currentPlayer1: Player | undefined;
let currentPlayer2: Player | undefined;

function checkSeats(seat1: Seat, seat2: Seat) {
	const player1Humanoid = seat1.Occupant?.Parent;
	const player2Humanoid = seat2.Occupant?.Parent;

	if (player1Humanoid && player2Humanoid) {
		const player1 = Players.GetPlayerFromCharacter(player1Humanoid);
		const player2 = Players.GetPlayerFromCharacter(player2Humanoid);

		if (player1 && player2) {
			print("Both players seated");
			startAppearEvent.FireClient(player1, true);
			startAppearEvent.FireClient(player2, true);
			currentPlayer1 = player1;
			currentPlayer2 = player2;
			return;
		}
	}

	if (currentPlayer1 && currentPlayer2) {
		print("One of the players has got up");
		startAppearEvent.FireClient(currentPlayer1, false);
		startAppearEvent.FireClient(currentPlayer2, false);
		currentPlayer1 = undefined;
		currentPlayer2 = undefined;
	}
}

for (const arena of arenas.GetChildren()) {
	const seat1 = arena.WaitForChild("Seat1") as Seat;
	const seat2 = arena.WaitForChild("Seat2") as Seat;
	[seat1, seat2].forEach((seat) => {
		seat.GetPropertyChangedSignal("Occupant").Connect(() => {
			checkSeats(seat1, seat2);
		});
	});
}

startGame.OnServerEvent.Connect((player) => {
	print(player.Name + " started the game!");

	if (currentPlayer1 && currentPlayer2) {
		startGame.FireClient(currentPlayer1);
		startGame.FireClient(currentPlayer2);
	}
});

chosenItem.OnServerEvent.Connect((player, ...args) => {
	const answer = args[0] as Answer;
	roundChoices.set(player, answer);

	if (roundChoices.size() === 2) {
		processRound();
	}
});

function processRound() {
	const players: Player[] = [];

	roundChoices.forEach((_choice, player) => {
		players.push(player);
	});

	const [player1, player2] = players;
	const choice1 = roundChoices.get(player1)!;
	const choice2 = roundChoices.get(player2)!;

	const winner = determineWinner(choice1, choice2);

	if (winner === 0) {
		print("its a tie");
		winnerEvent.FireClient(player1, Result.Tie);
		winnerEvent.FireClient(player2, Result.Tie);
	} else if (winner === 1) {
		print(player1.Name + " wins!");
		winnerEvent.FireClient(player1, Result.Win);
		winnerEvent.FireClient(player2, Result.Loss);
	} else {
		print(player2.Name + " wins!");
		winnerEvent.FireClient(player1, Result.Loss);
		winnerEvent.FireClient(player2, Result.Win);
	}

	roundChoices.clear();
}

function determineWinner(choice1: Answer, choice2: Answer): number {
	if (choice1 === choice2) return 0;

	if (
		(choice1 === Answer.Rock && choice2 === Answer.Scissors) ||
		(choice1 === Answer.Paper && choice2 === Answer.Rock) ||
		(choice1 === Answer.Scissors && choice2 === Answer.Paper)
	) {
		return 1;
	}

	return 2;
}
