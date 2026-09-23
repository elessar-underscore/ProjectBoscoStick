import { world, system } from "@minecraft/server";



const votePens = [
	{ game: "spleef", min: { x: , y: , z:  }, max: { x: , y: , z:  } }, //Enter bounding boxes here
	{ game: "craftmart", min: { x: , y: , z:  }, max: { x: , y: , z:  } },
];
 
const voteDurationTicks = 20 * 60; // 60 seconds
const voteCheckInterval = 20;      // recount once a second while vote is live
 
let voteInProgress = false;
let tickIntervalID = null;
 
function isInsideBox(point, min, max) {
	return (
		point.x >= min.x && point.x <= max.x &&
		point.y >= min.y && point.y <= max.y &&
		point.z >= min.z && point.z <= max.z
  	);
}
 
// Same idea as checkTeamZones(), but for the vote pens: each player only
// counts toward whichever pen they're CURRENTLY standing in, so moving
// pens = changing your vote in real time, which is the whole point.
function countVotes() {
	const tally = {};
	for (const pen of votePens) tally[pen.game] = 0;
 
	for (const player of world.getPlayers()) {
		const pen = votePens.find(p => isInsideBox(player.location, p.min, p.max));
		if (pen) tally[pen.game]++;
	}
	return tally;
}
 
// Whoever has the most players in their pen wins, no exceptions.
function resolveMajority(tally) {
	return Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0];
}
 
export function startVote() {
	if (voteInProgress) return { status: "already_running" };
	voteInProgress = true;
 
	world.sendMessage("Voting has started! Stand in your pick's area. (60 seconds)");
 
  // Live recount every second so the sidebar can show running totals,
  // and so players see their vote change the moment they switch pens.
	tickIntervalID = system.runInterval(() => {
		const tally = countVotes();
		// TODO: pass `tally` into hud.js's refreshSidebar() once that's wired up
  	}, voteCheckInterval);
 
	system.runTimeout(endVote, voteDurationTicks);
 
	return { status: "started" };
}
 
function endVote() {
	const finalTally = countVotes();
	const winner = resolveMajority(finalTally);
 
	system.clearRun(tickIntervalID);
	tickIntervalID = null;
	voteInProgress = false;
 
	world.sendMessage(`Vote complete! Next up: ${winner}`);
 
	// TODO once gameManager exists: gameManager.startGame(winner);
}
 
export function isVoteInProgress() {
	return voteInProgress;
}


