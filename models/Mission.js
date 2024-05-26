const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema({
	url: String,
	name: String,
	description: String,
	startDate: String,
	endDate: String,
	launchSite: String,
	destination: String,
});

const Mission = mongoose.model("Mission", missionSchema);

module.exports = Mission;
