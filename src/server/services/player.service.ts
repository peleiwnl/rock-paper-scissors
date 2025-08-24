import { Players, DataStoreService } from "@rbxts/services";

const statsStore = DataStoreService.GetDataStore("PlayerStats");

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

		task.spawn(() => {
			const [success, rawData] = pcall(() => statsStore.GetAsync(tostring(player.UserId)));

			const data = rawData as { Wins?: number; Losses?: number } | undefined;

			if (success && data) {
				if (data.Wins !== undefined) wins.Value = data.Wins;
				if (data.Losses !== undefined) losses.Value = data.Losses;
			}
		});

		Players.PlayerRemoving.Connect((player: Player) => {
			const leaderstats = player.FindFirstChild("leaderstats") as Folder | undefined;
			if (!leaderstats) return;

			const wins = leaderstats.FindFirstChild("Wins") as NumberValue | undefined;
			const losses = leaderstats.FindFirstChild("Losses") as NumberValue | undefined;

			task.spawn(() => {
				pcall(() =>
					statsStore.SetAsync(tostring(player.UserId), {
						Wins: wins?.Value ?? 0,
						Losses: losses?.Value ?? 0,
					}),
				);
			});
		});
	});
}
