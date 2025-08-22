import { ReplicatedStorage, Players } from "@rbxts/services";

const startAppearEvent = ReplicatedStorage.WaitForChild("StartAppearEvent") as RemoteEvent;
const player = Players.LocalPlayer as Player;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const startGameUI = playerGui.WaitForChild("StartGameUI") as ScreenGui;
const startGameButton = startGameUI.FindFirstChild("StartGameButton") as TextButton;

startAppearEvent.OnClientEvent.Connect((showButton: boolean) => {
	startGameUI.Enabled = showButton;
});

startGameButton.Activated.Connect(() => {});
