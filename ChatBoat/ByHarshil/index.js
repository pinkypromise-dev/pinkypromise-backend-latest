var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://harshil:harshil@123@cluster0.stbbj.mongodb.net/?retryWrites=true&w=majority";
// var url = "mongodb+srv://PrabhuD:qxawIEsoRfqDggqo@cluster0.js80h.mongodb.net";

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/getQuestion", function (req, res) {
    console.log(req.body);
  const { QID, TID, SelectedOptions } = req.body;
  if (SelectedOptions && SelectedOptions.length) {
    console.log(SelectedOptions[0].QID === 18, SelectedOptions[0].QID === 19);
    let selectedQId;
    if (SelectedOptions[0].QID === 18 && SelectedOptions[1].QID === 19) {
      console.log(
        SelectedOptions[0].Option,
        typeof SelectedOptions[0].Option,
        SelectedOptions[0].Option === "n"
      );
      if (
        SelectedOptions[0].Option === "n" &&
        SelectedOptions[1].Option === "n"
      ) {
        console.log("1");
        selectedQId = 1;
      } else if (
        SelectedOptions[0].Option === "y" &&
        SelectedOptions[1].Option === "n"
      ) {
        console.log("13");
        selectedQId = 13;
      } else {
        console.log("15");
        selectedQId = 15;
      }
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log("QUERY", selectedQId, TID);
        const dbo = db.db("ChatBoat");
        dbo
          .collection("questions")
          .findOne({ QID: selectedQId, TID }, function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.send(result);
            return;
          });
      });
    }
    return;
  } else {
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("ChatBoat");
      dbo.collection("questions").findOne({ QID, TID }, function (err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return res.send(result);
      });
    });
    return;
  }
});

router.get("/getDiagnosis", function (req, res) {
  const { MsgId, TID, SelectedOptions, age } = req.body;
  console.log(SelectedOptions);
  if (TID === 3) {
    if (SelectedOptions.length === 10) {
      const answers = SelectedOptions.map((elem) => elem.Option);
      const filteredAnswers = answers.filter((answer) => answer === "y");
      let selectedDiagnosis;
      console.log(selectedDiagnosis);
      if (age > 35) {
        const checkNone = answers.find((elem) => elem === "y");
        if ((answers[2] === "y" && answers[4] === "y") || !checkNone) {
          selectedDiagnosis = 23;
        }
        if (
          answers[4] === "y" &&
          (answers[1] === "y" || answers[5] === "y" || answers[6] === "y")
        ) {
          selectedDiagnosis = 25;
        }
        if (
          answers[0] === "y" &&
          (answers[1] === "y" ||
            answers[2] === "y" ||
            answers[3] === "y" ||
            answers[5] === "y" ||
            answers[6] === "y")
        ) {
          selectedDiagnosis = 27;
        }
        if (answers[7] === "y" || answers[8] === "y" || answers[9] === "y") {
          selectedDiagnosis = 28;
        }
      }
      if (age < 35) {
        // const checkNone = answers.find((elem) => elem === "y");
        // console.log(answers[4] === "y", answers[5] === "y");
        if (
          answers[4] === "y" &&
          (answers[1] === "y" || answers[5] === "y" || answers[6] === "y")
        ) {
          selectedDiagnosis = 24;
        } else if (
          answers[0] === "y" &&
          (answers[1] === "y" ||
            answers[2] === "y" ||
            answers[3] === "y" ||
            answers[5] === "y" ||
            answers[6] === "y")
        ) {
          selectedDiagnosis = 26;
        } else {
          selectedDiagnosis = 22;
        }
      }
      console.log(selectedDiagnosis, TID);
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("ChatBoat");
        dbo
          .collection("diagnosis")
          .findOne({ MsgId: selectedDiagnosis, TID }, function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            result = {
              ...result,
              count: `You answered yes to ${filteredAnswers.length} factors that are commonly associated with infertility.`,
            };
            res.send(result);
          });
      });
      return;
    } else {
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("ChatBoat");
        dbo
          .collection("diagnosis")
          .findOne({ MsgId, TID }, function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.send(result);
          });
      });
      return;
    }
  }
  if (TID === 5) {
    const answers = SelectedOptions.map((answer) => answer.ID);
    let selectedDiagnosis;
    console.log(answers.length);
    if (answers.length === 7) {
      if (
        answers[0] === 2 &&
        answers[1] === 2 &&
        answers[2] === 2 &&
        answers[3] === 2 &&
        answers[4] !== 2 &&
        answers[5] === 1 &&
        answers[6] === 2
      ) {
        selectedDiagnosis = 22;
      } else if (
        answers[0] === 2 &&
        answers[1] === 2 &&
        answers[2] === 2 &&
        answers[4] === 3 &&
        answers[6] === 2 &&
        !selectedDiagnosis
      )
        selectedDiagnosis = 1;
      else if (
        answers[0] === 1 &&
        answers[1] === 2 &&
        answers[2] === 2 &&
        answers[3] === 2 &&
        answers[4] === 3 &&
        answers[5] === 2
      )
        selectedDiagnosis = 3;
      let check = [answers[0], answers[1], answers[2], answers[3], answers[6]];
      let checkOccurence1 = check.filter((elem) => elem === 1);
      if (checkOccurence1.length > 1) {
        selectedDiagnosis = 5;
      } else if (
        (answers[1] === 1 || answers[2] === 1) &&
        answers[3] === 1 &&
        answers[4] === 1 &&
        answers[5] === 1
      )
        selectedDiagnosis = 10;
      else if (
        (answers[1] === 1 || answers[2] === 1) &&
        answers[3] === 1 &&
        answers[4] === 1
      )
        selectedDiagnosis = 10;
      else if (
        answers[1] === 1 &&
        answers[3] === 2 &&
        answers[4] === 1 &&
        !selectedDiagnosis
      )
        selectedDiagnosis = 15;
      else if (answers[3] === 2 && answers[4] === 1 && !selectedDiagnosis)
        selectedDiagnosis = 15;
    } else if (answers.length === 10) {
      const copyAnswers = [...answers]
      const truncatedArr = copyAnswers.splice(5,3)
      console.log('-=-=',truncatedArr, copyAnswers);
      if (
        copyAnswers[0] === 2 &&
        copyAnswers[1] === 2 &&
        copyAnswers[2] === 2 &&
        copyAnswers[3] === 2 &&
        copyAnswers[4] !== 2 &&
        copyAnswers[5] === 1 &&
        copyAnswers[6] === 2
      ) {
        selectedDiagnosis = 22;
      } else if (
        copyAnswers[0] === 2 &&
        copyAnswers[1] === 2 &&
        copyAnswers[2] === 2 &&
        copyAnswers[4] === 3 &&
        copyAnswers[6] === 2 &&
        !selectedDiagnosis
      )
        selectedDiagnosis = 1;
      else if (
        copyAnswers[0] === 1 &&
        copyAnswers[1] === 2 &&
        copyAnswers[2] === 2 &&
        copyAnswers[3] === 2 &&
        copyAnswers[4] === 3 &&
        copyAnswers[5] === 2
      )
        selectedDiagnosis = 3;
      let check = [copyAnswers[0], copyAnswers[1], copyAnswers[2], copyAnswers[3], copyAnswers[6]];
      let checkOccurence1 = check.filter((elem) => elem === 1);
      if (checkOccurence1.length > 1) {
        selectedDiagnosis = 5;
      } else if (
        (copyAnswers[1] === 1 || copyAnswers[2] === 1) &&
        copyAnswers[3] === 1 &&
        copyAnswers[4] === 1 &&
        copyAnswers[5] === 1
      )
        selectedDiagnosis = 10;
      else if (
        (copyAnswers[1] === 1 || copyAnswers[2] === 1) &&
        copyAnswers[3] === 1 &&
        copyAnswers[4] === 1
      )
        selectedDiagnosis = 10;
      else if (
        copyAnswers[1] === 1 &&
        copyAnswers[3] === 2 &&
        copyAnswers[4] === 1 &&
        !selectedDiagnosis
      )
        selectedDiagnosis = 15;
      else if (copyAnswers[3] === 2 && copyAnswers[4] === 1 && !selectedDiagnosis)
        selectedDiagnosis = 15;
    } else {
      console.log("else");
      MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        const dbo = db.db("ChatBoat");
        dbo
          .collection("diagnosis")
          .findOne({ MsgId, TID }, function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            res.send(result);
          });
      });
      return;
    }
    console.log("---------------------", selectedDiagnosis, TID);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("ChatBoat");
      dbo
        .collection("diagnosis")
        .findOne({ MsgId: selectedDiagnosis, TID }, function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
          console.log(answers.length);
          if (result && answers.length === 10 & answers[5] === 1 && answers[6] === 1 && answers[7] === 1)
            result = {
              ...result,
              Destination: false,
              Diagnosis: true,
              info: 'Based on your responses, there may be a also be a chance that you may have an STI since pain during intercourse, and back/belly pain along with discolored discharge are indications of an infection. Based on your symptoms, you may have Chlamydia since you have a yellow discharge however, if it is more greenish, you may have gonorrhea. It is always a good idea to get tested for STIs as treating them and preventing them from becoming serious is quite simple. Please click here to learn more about Chlamydia and Gonorrhea. You can also go back to our STI screen if you want to do a more in-depth screen!',
            };
          if (result &&
            answers.length === 10 &&
            answers[5] === 2 &&
            answers[6] === 1 &&
            answers[7] === 1
          )
            result = {
              ...result,
              Destination: false,
              Diagnosis: true,
              info: 'Based on your responses, there may also be a chance that you may have an STI since pain during intercourse, and back/belly pain along with discolored discharge are indications of an infection. Based on your symptoms, you may have Gonorrhea since you have a green discharge however, if it is more yellowish, you may have Chlamydia. It is always a good idea to get tested for STIs as treating them and preventing them from becoming serious is quite simple. Please click here to learn more about Chlamydia and Gonorrhea. You can also go back to our STI screen if you want to do a more in-depth screen!',
            };
          res.send(result);
        });
    });
  }
});
module.exports = router;
