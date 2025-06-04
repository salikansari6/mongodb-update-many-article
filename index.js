import express from "express";
import mongoose, { mongo } from "mongoose";

const app = express();
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  mongoose.connect("mongodb://localhost:27017/school_db").then(() => {
    console.log("Connected to MongoDB");
    populateDB();
  });
});

app.put("/schools/:schoolId/students", (req, res) => {
  for (const student of req.body) {
    mongoose.connection.db.collection("schools").updateOne({
      "schoolId": req.params.schoolId,
      "students.studentId": student.studentId
    }, {
      $set: {
        "students.$": student
      }
    })
  }
    res.send("Students updated")
})


app.get("/schools/:schoolId/students", async (req, res) => {
    const school = await mongoose.connection.db.collection("schools").findOne({
        "schoolId": req.params.schoolId
    })
    res.send(school.students)
})

function populateDB() {
    mongoose.connection.db.collection("schools").drop()
    let students =[]
    for (let i = 0; i < 1000; i++) {
        students.push({
            studentId : `student${i}`,
            name: `Student ${i}`,
            age: 20,
            email: `student${i}@example.com`,
        })
    }
  mongoose.connection.db.collection("schools").insertOne(
    {
      name: "School 1",
      schoolId: "1",
      address: "123 Main St",
      city: "New York",
      students: students,
    },
  );
}