const {Router} = require('express')
const multer  = require('multer')
const mime = require('mime')
const fs = require("fs")
const verify = require('../middlewares/verifyToken')
const bodyParser = require("body-parser")
const jsonParser = bodyParser.json()
const router = Router()

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			cb(null, raw.toString('hex') + Date.now() + '.' + mime.getExtension(file.mimetype))
		});
	}
});
var upload = multer({ storage: storage });

router.get("/", function(request, response) {
	var content = fs.readFileSync("plans.json", "utf8")
	var plans = JSON.parse(content)
	response.send(plans)
});

router.get("/download", function(request, response){
	var file = `${__dirname}/${request.query.file_path}`
	response.download(file)
});

router.post("/create", verify, upload.single('attachment'), function(request, response){
	if (!request.body) {
		return response.sendStatus(400)
	}
	else {
		var planData = JSON.parse(request.body.data)
		var data = fs.readFileSync("plans.json", "utf8")
		var plans = JSON.parse(data)
		var id = 0
		if (plans.length == 0) {
			id = 1
		}
		else {
			var ids = []
			for (var index = 0; index < plans.length; ++index) {
				ids.push(plans[index].id)
			}
			id = Math.max.apply(null, ids) + 1
		}
		var title = planData.title
		var content = planData.content
		var deadline = planData.deadline
		var status = 'Не прочитано'
		var newPlan = { id: id, status: status, title: title, content: content, deadline: deadline }
		if (typeof request.file !== 'undefined' && request.file) {
			newPlan['attachment'] = request.file.path
		}
		plans.push(newPlan)
		var newData = JSON.stringify(plans)
		fs.writeFileSync("plans.json", newData)
		response.send(newPlan)
	}
});

router.delete("/delete", jsonParser, function(request, response){
	var plan_id = request.body.plan_id
	var data = fs.readFileSync("plans.json", "utf8")
	var plans = JSON.parse(data)
	var isPlanFound = false
	for (var index = 0; index < plans.length; ++index) {
		if (plans[index].id == plan_id) {
			plans.splice(index, 1)
			isPlanFound = true
			break;
		}
	}
	if (!isPlanFound) {
		response.sendStatus(404)
	}
	else{
		fs.writeFileSync("plans.json", JSON.stringify(plans))
		response.send(plan_id)
	}
});

router.put("/change-status", jsonParser, function(request, response) {
    var newStatus = request.body.new_status
    var planId = request.body.plan_id
	var data = fs.readFileSync("plans.json", "utf8")
	var plans = JSON.parse(data)
	for (var index = 0; index < plans.length; ++index) {
		if (plans[index].id == planId) {
			plans[index].status = newStatus
			break;
		}
	}
	fs.writeFileSync("plans.json", JSON.stringify(plans))
	response.send(new_status)
});

router.get("/get-by-status", function(request, response) {
	var sortQuery = request.query.sortQuery
	var newPlanList = []
	var data = fs.readFileSync("plans.json", "utf8")
	var plans = JSON.parse(data)
	if (sortQuery == 'Все') {
		response.send(plans);
	}
	else{
		for (var index = 0; index < plans.length; ++index) {
			if (plans[index].status == sortQuery) {
				newPlanList.push(plans[index])
			}
		}
		response.send(`newPlanList`)
	}
});

module.exports = router