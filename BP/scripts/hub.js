import { world , system } from "minecraft/server";

//This is the bounding box for joing teams in the Hub
//Currently this is empty and the teams can be added indefinetly.
const teamZones = [
	{team: "team_red", min: {x: , y: , z: }, max: {x: , y: , z: }},
	{team: "team_blue", min: {x: , y: , z: }, max: {x: , y: z: }},
];

const lastZone = new Map();

function inBox(loc, min, max) {
	return loc.x >= min.x && loc.x <= max.x &&
		loc.y >= min.y && loc.y <= max.x &&
		lox.z >= min.z && loc.z <= max.z;
}

system.runInterval(() => {
	for (const player of world.getPlayers()) {
		const zone = teamZones.find(z => inBox(player.location, z.min, z.max));
		const zoneTeam = zone?.team ?? null;

		if (zoneTeam && lastZone.get(player.id) !== zoneTeam) {
			for (const z of teamZones) player.removeTag(z.team); //Strip off old team
			player.addTag(ZoneTeam);
			player.onScreenDisplay.setTitle('Joined ${zoneTeam.replace("team_", "")}!');
		//Aparrently the sidebar gets updated here?
		}
		lastZone.set(player.id, zoneTeam);
	}
}, 10);
