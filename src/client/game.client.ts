import { ReplicatedStorage, Players } from "@rbxts/services";
import { Answer } from "shared/Answer";
import { Result } from "shared/Result";

const startAppearEvent = ReplicatedStorage.WaitForChild("StartAppearEvent") as RemoteEvent;
const startGame = ReplicatedStorage.WaitForChild("StartGame") as RemoteEvent;
const chosenItem = ReplicatedStorage.WaitForChild("ChosenItem") as RemoteEvent;
const winnerEvent = ReplicatedStorage.WaitForChild("WinnerEvent") as RemoteEvent;

const player = Players.LocalPlayer as Player;
const playerGui = player.WaitForChild("PlayerGui") as PlayerGui;
const startGameUI = playerGui.WaitForChild("StartGameUI") as ScreenGui;
const startGameButton = startGameUI.FindFirstChild("StartGameButton") as TextButton;
const chooseItem = playerGui.WaitForChild("ChooseItem") as ScreenGui;
const resultUI = playerGui.WaitForChild("ResultUI") as ScreenGui;
const resultLabel = resultUI.WaitForChild("ResultLabel") as TextLabel;

const rock = chooseItem.FindFirstChild("RockButton") as TextButton;
const paper = chooseItem.FindFirstChild("PaperButton") as TextButton;
const scissors = chooseItem.FindFirstChild("ScissorsButton") as TextButton;

function toggleJump(enabled: boolean) {
	const humanoid = player.Character?.WaitForChild("Humanoid") as Humanoid;
	humanoid.SetStateEnabled(Enum.HumanoidStateType.Jumping, enabled);
}

startAppearEvent.OnClientEvent.Connect((showButton: boolean) => {
	startGameUI.Enabled = showButton;
});

startGameButton.Activated.Connect(() => {
	startGame.FireServer();
});

startGame.OnClientEvent.Connect(() => {
	print("Game started!");
	toggleJump(false);
	startGameUI.Enabled = false;

	startRound();
});

function sendChoice(choice: Answer) {
	chosenItem.FireServer(choice);
	chooseItem.Enabled = false;
}

rock.Activated.Connect(() => {
	sendChoice(Answer.Rock);
});

paper.Activated.Connect(() => {
	sendChoice(Answer.Paper);
});

scissors.Activated.Connect(() => {
	sendChoice(Answer.Scissors);
});

function startRound() {
	chooseItem.Enabled = true;
}

winnerEvent.OnClientEvent.Connect((result: Result) => {
	resultUI.Enabled = true;
	resultLabel.Text = result;
	task.wait(5);
	resultUI.Enabled = false;
	toggleJump(true);
});
