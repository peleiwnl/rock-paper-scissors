import { Players, ReplicatedStorage } from "@rbxts/services";

const startAppearEvent = ReplicatedStorage.FindFirstChild("StartAppearEvent") as RemoteEvent;

const arenas = game.Workspace.WaitForChild("Arenas");

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
