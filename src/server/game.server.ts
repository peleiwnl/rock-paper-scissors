import { Players } from "@rbxts/services";

const seats = [
	game.Workspace.FindFirstChild("Player1Seat") as Seat,
	game.Workspace.FindFirstChild("Player2Seat") as Seat,
];

let currentPlayer: Player | undefined = undefined;

function onOccupantChanged(seat: Seat) {
	const humanoid = seat.Occupant as Humanoid | undefined;
	if (humanoid) {
		const player = Players.GetPlayerFromCharacter(humanoid.Parent);

		if (player) {
			print(player.Name + " Has sat down in " + seat.Name);
			currentPlayer = player;
			return;
		}
	}
	if (currentPlayer) {
		print(currentPlayer.Name + " has got up");
		currentPlayer = undefined;
	}
}

for (const seat of seats) {
	seat.GetPropertyChangedSignal("Occupant").Connect(() => onOccupantChanged(seat));
}
