import { Players } from "@rbxts/services";

export function leaderboardSetup() {
	print("Setting up lb");
	Players.PlayerAdded.Connect((player: Player) => {
		const leaderstats = new Instance("Folder");
		leaderstats.Name = "leaderstats";
		leaderstats.Parent = player;

		const wins = new Instance("NumberValue");
		wins.Name = "Wins";
		wins.Value = 0;
		wins.Parent = leaderstats;

		const losses = new Instance("NumberValue");
		losses.Name = "Losses";
		losses.Value = 0;
		losses.Parent = leaderstats;
	});
}
