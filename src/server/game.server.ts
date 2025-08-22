import { Players, ReplicatedStorage } from "@rbxts/services";

const startAppearEvent = ReplicatedStorage.FindFirstChild("StartAppearEvent") as RemoteEvent;

const arenas = game.Workspace.WaitForChild("Arenas");

function findSeatedPlayers(seat1: Seat, seat2: Seat) {
	const checkSeats = () => {
		task.wait();
		print("Seat1 occupant:", seat1.Occupant);
		print("Seat2 occupant:", seat2.Occupant);

		const player1Humanoid = seat1.Occupant?.Parent;
		const player2Humanoid = seat2.Occupant?.Parent;

		if (player1Humanoid && player2Humanoid) {
			const player1 = Players.GetPlayerFromCharacter(player1Humanoid);
			const player2 = Players.GetPlayerFromCharacter(player2Humanoid);

			if (player1 && player2) {
				print("Both players seated");
				//fire player1 and player2
			}
		}
	};

	seat1.GetPropertyChangedSignal("Occupant").Connect(checkSeats);
	seat2.GetPropertyChangedSignal("Occupant").Connect(checkSeats);
}

for (const arena of arenas.GetChildren()) {
	const seat1 = arena.WaitForChild("Seat1") as Seat;
	const seat2 = arena.WaitForChild("Seat2") as Seat;
	findSeatedPlayers(seat1, seat2);
}
