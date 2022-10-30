const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


async function readData() {

    let query = Student.find({}, { "name": 1, "prn": 1, "class": 1, "_id": 0 });
    let result = await query.exec();
    let finalResult = [];
    for (let i = 0; i < result.length; i++) {
        let temp = `Name: ${result[i].name}, PRN: ${result[i].prn}, Class: ${result[i].class}`;
        finalResult.push(temp);
    }

    return finalResult;
}

async function deleteData() {
    let query = Student.deleteMany({ "name": { $in: ["Utkrist", "Nikunj", "Dolly", "Prabhat"] } });
    let result = await query.exec();

    console.log(result);
}

async function addData(Class, name, prn) {
    const newStudent = new Student({
        name: `${name}`,
        prn: `${prn}`,
        class: `${Class}`
    });

    let doc = await newStudent.save();
    return doc;
}

async function updateData() {
    try {
        const result = await Student.updateOne({ "name": "Virat Kohli" }, { "class": 15 });
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
}

function getConnected() {
    dotenv.config({ path: "./config.env" });
    const connectionString = process.env.ConnectionString;


    mongoose.connect(connectionString).then(function () {
        console.log("Connection Successfull");
    });
}

function getScahema() {
    const studentSchema = new mongoose.Schema({
        name: String,
        prn: Number,
        class: Number
    });

    const Student = mongoose.model("Student", studentSchema);
    return Student;
}




// Starting of the Program
getConnected();
const Student = getScahema();

app.get("/", async function (req, res) {
    let finalResult = await readData();
    res.render("index", { finalResult: finalResult });
});

app.get("/addUser", function (req, res) {
    res.sendFile(__dirname + "/addUser.html");
});

app.post("/addUser", async function (req, res) {

    let name = req.body.name;
    let prn = Number(req.body.prn);
    let Class = Number(req.body.class);

    let doc = await addData(Class, name, prn);
    console.log(doc);

    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Listening at port 3000");
})