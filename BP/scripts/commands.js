import { system, CommandPermissionLevel, CustomCommandStatus } from "@minecraft/server";
import { startVote, isVoteInProgress } from "./voting.js";
 
system.beforeEvents.startup.subscribe((init) => {
	init.customCommandRegistry.registerCommand(
	{
		name: "hub:startvote",
		description: "Starts a 60-second minigame vote",
		permissionLevel: CommandPermissionLevel.GameDirectors, // ops/admins only
		cheatsRequired: false,
	},
	(_origin) => {
	if (isVoteInProgress()) {
		return { status: CustomCommandStatus.Failure, message: "A vote is already running." };
	}
	startVote();
	return { status: CustomCommandStatus.Success, message: "Vote started!" };
	});
});
