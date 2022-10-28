const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");

async function readData(Student) {

    let query = Student.find({}, { "name": 1, "prn": 1, "class": 1, "_id": 0 });
    let result = await query.exec();
    return result;
}


async function addData(Student) {
    const nikunj = new Student({
        name: "Nikunj Padia",
        prn: 1032190109,
        class: 16
    });

    const king = new Student({
        name: "Virat Kohli",
        prn: 1032190110,
        class: 16
    });

    const mamba = new Student({
        name: "Kobe Bryant",
        prn: 1032190111,
        class: 16
    })

    const hitman = new Student({
        name: "Rohit Sharma",
        prn: 1032190112,
        class: 16
    });

    const boom = new Student({
        name: "Jasprit Bumrah",
        prn: 1032190113,
        class: 16
    });

    const jordan = new Student({
        name: "Michael Jordan",
        prn: 1032190114,
        class: 16
    });

    const god = new Student({
        name: "Sachin Tendulkar",
        prn: 1032190115,
        class: 16
    });


    // Insering One at a Time
    await nikunj.save();

    // Inserting Many at once
    await Student.insertMany([king, mamba, hitman, boom, jordan, god]);
}

async function updateData(Student) {
    try {
        const result = await Student.updateOne({ "name": "Virat Kohli" }, { "class": 15 });
        console.log(result);
    }
    catch (err) {
        console.log(err);
    }
}

async function start() {
    dotenv.config({ path: "./config.env" });
    const connectionString = process.env.ConnectionString;


    mongoose.connect(connectionString).then(function () {
        console.log("Connection Successfull");
    });

    const studentSchema = new mongoose.Schema({
        name: String,
        prn: Number,
        class: Number
    });

    const Student = mongoose.model("Student", studentSchema);
    // // Inserting into DB
    // await addData(Student);



    // Reading from DB
    let cosmosData = await readData(Student);
    let finalResult = [];
    for (let i = 0; i < cosmosData.length; i++) {
        let temp = `Name: ${cosmosData[i].name}, PRN: ${cosmosData[i].prn}, Class: ${cosmosData[i].class}`;
        finalResult.push(temp);
    }

    return finalResult;

    // Updating the DB
    // await updateData(Student);
    // readData(Student);


    // // Deleting from the DB
    // try {
    //     const result = await Student.deleteOne({ "name": "Nikunj Padia" });
    //     console.log(result);
    // }
    // catch (err) {
    //     console.log(err);
    // }
}

const app = express();
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
    let finalResult = await start();
    res.render("index", { finalResult: finalResult });
});