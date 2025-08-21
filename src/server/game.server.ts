import { Players, ReplicatedStorage } from "@rbxts/services";

const startAppearEvent = ReplicatedStorage.FindFirstChild("StartAppearEvent") as RemoteEvent;

const seat1 = game.Workspace.WaitForChild("Player1Seat") as Seat;
const seat2 = game.Workspace.WaitForChild("Player2Seat") as Seat;

let lastPlayer1: Player | undefined;
let lastPlayer2: Player | undefined;

function getPlayerFromSeat(seat: Seat): Player | undefined {
	const humanoid = seat.Occupant as Humanoid | undefined;
	if (humanoid) {
		return Players.GetPlayerFromCharacter(humanoid.Parent);
	} else {
		return undefined;
	}
}

function updateSeats() {
	const player1 = getPlayerFromSeat(seat1);
	const player2 = getPlayerFromSeat(seat2);

	if (player1) startAppearEvent.FireClient(player1, !!player2);

	if (lastPlayer1 && lastPlayer1 !== player1) startAppearEvent.FireClient(lastPlayer1, false);

	lastPlayer1 = player1;

	if (player2) startAppearEvent.FireClient(player2, !!player1);

	if (lastPlayer2 && lastPlayer2 !== player2) startAppearEvent.FireClient(lastPlayer2, false);

	lastPlayer2 = player2;

	print("got here");
}

seat1.GetPropertyChangedSignal("Occupant").Connect(updateSeats);
seat2.GetPropertyChangedSignal("Occupant").Connect(updateSeats);
