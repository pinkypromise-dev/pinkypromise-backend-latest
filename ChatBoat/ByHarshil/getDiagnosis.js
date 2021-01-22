// var MongoClient = require("mongodb").MongoClient;
var Database = require("../Database/dbaccess");
var ObjectId = require("mongodb").ObjectID;
async function getDiagnosis(req, res) {
  try {
    console.log(req.body);
    // Testing
    // let result = await Database.GetDbAccess({"collection":"diagnosis", query: { MsgId: 1, TID:3 }});
    // console.log(result)
    // res.send(result);
    const calcAge = (dob) => {
      var dob = new Date(dob);
      //calculate month difference from current date in time
      var month_diff = Date.now() - dob.getTime();

      //convert the calculated difference in date format
      var age_dt = new Date(month_diff);

      //extract year from date
      var year = age_dt.getUTCFullYear();

      //now calculate the age of the user
      var age = Math.abs(year - 1970);

      return age;
    };

    const user = await Database.GetPinkyPromiseAccess({
      collection: "userdetails",
      query: { _id: new ObjectId(req.body.user) },
    });

    const weight = user.weight;
    let wt, ht;
    if (weight.unit !== "Kg") {
      wt = weight.measure / 2.205;
    } else wt = weight.measure;

    const height = user.height;
    ht = height.measure / 39.37;

    let bmi = wt / (ht * ht);
    // res.send({status:200,message:"success"});
    let { MsgId, TID, SelectedOptions } = req.body;
    MsgId = parseInt(MsgId);
    TID = parseInt(TID);
    let age = calcAge(user.dob);
    console.log("USER", age, bmi);
    // console.log(SelectedOptions);
    if (TID == 3) {
      if (SelectedOptions.length == 10) {
        const answers = SelectedOptions.map((elem) => elem.ID);
        const filteredAnswers = answers.filter((answer) => answer == 1);
        let selectedDiagnosis;
        if (filteredAnswers.length == 0) selectedDiagnosis = 41;
        // console.log(selectedDiagnosis);
        if (age > 35) {
          const checkNone = answers.find((elem) => elem == 1);
          if ((answers[2] == 1 && answers[4] == 1) || !checkNone) {
            selectedDiagnosis = 23;
          }
          if (
            answers[4] == 1 &&
            (answers[1] == 1 || answers[5] == 1 || answers[6] == 1)
          ) {
            selectedDiagnosis = 25;
          }
          if (
            answers[0] == 1 &&
            (answers[1] == 1 ||
              answers[2] == 1 ||
              answers[3] == 1 ||
              answers[5] == 1 ||
              answers[6] == 1)
          ) {
            selectedDiagnosis = 27;
          }
          if (answers[7] == 1 || answers[8] == 1 || answers[9] == 1) {
            selectedDiagnosis = 28;
          }
        }
        if (age < 35) {
          // const checkNone = answers.find((elem) => elem == 1);
          // console.log(answers[4] == 1, answers[5] == 1);
          if (
            answers[4] == 1 &&
            (answers[1] == 1 || answers[5] == 1 || answers[6] == 1)
          ) {
            selectedDiagnosis = 24;
          } else if (
            answers[0] == 1 &&
            (answers[1] == 1 ||
              answers[2] == 1 ||
              answers[3] == 1 ||
              answers[5] == 1 ||
              answers[6] == 1)
          ) {
            selectedDiagnosis = 26;
          } else {
            selectedDiagnosis = 22;
          }
          if (answers[7] == 1 || answers[8] == 1 || answers[9] == 1) {
            selectedDiagnosis = 28;
          }
        }
        // console.log(selectedDiagnosis, TID);
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          // const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId: selectedDiagnosis, TID },
          });
          // console.log(result)
          // db.db("ChatBoat").collection("diagnosis").findOne({ MsgId: selectedDiagnosis, TID },function (err, result) {
          //       if (err) throw err;
          // console.log(result);
          // db.close();
          result = {
            ...result,
            count: `You answered yes to ${filteredAnswers.length} factors that are commonly associated with infertility.`,
          };
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          //   }
          // );
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      } else if (SelectedOptions.length == 9 && SelectedOptions[1].QID == 3) {
        const answers = SelectedOptions.map((elem) => elem.ID);
        const filteredAnswers = answers.filter((answer) => answer == 1);
        let selectedDiagnosis;
        // console.log(selectedDiagnosis);
        if (age > 35) {
          const checkNone = answers.find((elem) => elem == 1);
          if (answers[1] == 1 || answers[4] == 1 || answers[5] == 1) {
            selectedDiagnosis = 25;
          }
          if (
            answers[0] == 1 &&
            (answers[1] == 1 ||
              answers[2] == 1 ||
              answers[3] == 1 ||
              answers[5] == 1)
          ) {
            selectedDiagnosis = 27;
          }
          if (answers[6] == 1 || answers[7] == 1 || answers[8] == 1) {
            selectedDiagnosis = 28;
          }
        }
        if (age < 35) {
          // const checkNone = answers.find((elem) => elem == 1);
          // console.log(answers[4] == 1, answers[5] == 1);
          if (answers[1] == 1 || answers[4] == 1 || answers[5] == 1) {
            selectedDiagnosis = 24;
          } else if (
            answers[0] == 1 &&
            (answers[1] == 1 ||
              answers[2] == 1 ||
              answers[3] == 1 ||
              answers[5] == 1)
          ) {
            selectedDiagnosis = 26;
          } else {
            selectedDiagnosis = 22;
          }
          if (answers[6] == 1 || answers[7] == 1 || answers[8] == 1) {
            selectedDiagnosis = 28;
          }
        }
        // console.log(selectedDiagnosis, TID);
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          // const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId: selectedDiagnosis, TID },
          });
          // console.log(result)
          // db.db("ChatBoat").collection("diagnosis").findOne({ MsgId: selectedDiagnosis, TID },function (err, result) {
          //       if (err) throw err;
          // console.log(result);
          // db.close();
          result = {
            ...result,
            count: `You answered yes to ${filteredAnswers.length} factors that are commonly associated with infertility.`,
          };
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          //   }
          // );
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      } else if (SelectedOptions.length == 9 && SelectedOptions[1].QID == 4) {
        const answers = SelectedOptions.map((elem) => elem.ID);
        const filteredAnswers = answers.filter((answer) => answer == 1);
        let selectedDiagnosis;
        // console.log(selectedDiagnosis);
        if (age > 35) {
          const checkNone = answers.find((elem) => elem == 1);
          if ((answers[1] == 1 && answers[3] == 1) || !checkNone) {
            selectedDiagnosis = 23;
          }
          if (answers[3] == 1 && (answers[4] == 1 || answers[5] == 1)) {
            selectedDiagnosis = 25;
          }
          if (
            answers[0] == 1 &&
            (answers[1] == 1 ||
              answers[2] == 1 ||
              answers[4] == 1 ||
              answers[5] == 1)
          ) {
            selectedDiagnosis = 27;
          }
          if (answers[6] == 1 || answers[7] == 1 || answers[8] == 1) {
            selectedDiagnosis = 28;
          }
        }
        if (age < 35) {
          // const checkNone = answers.find((elem) => elem == 1);
          // console.log(answers[4] == 1, answers[5] == 1);
          if (answers[3] == 1 && (answers[4] == 1 || answers[5] == 1)) {
            selectedDiagnosis = 24;
          } else if (
            answers[0] == 1 &&
            (answers[1] == 1 ||
              answers[2] == 1 ||
              answers[4] == 1 ||
              answers[5] == 1)
          ) {
            selectedDiagnosis = 26;
          } else {
            selectedDiagnosis = 22;
          }
          if (answers[6] == 1 || answers[7] == 1 || answers[8] == 1) {
            selectedDiagnosis = 28;
          }
        }
        // console.log(selectedDiagnosis, TID);
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          // const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId: selectedDiagnosis, TID },
          });
          // console.log(result)
          // db.db("ChatBoat").collection("diagnosis").findOne({ MsgId: selectedDiagnosis, TID },function (err, result) {
          //       if (err) throw err;
          // console.log(result);
          // db.close();
          result = {
            ...result,
            count: `You answered yes to ${filteredAnswers.length} factors that are commonly associated with infertility.`,
          };
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          //   }
          // );
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      } else if (SelectedOptions.length == 8) {
        const answers = SelectedOptions.map((elem) => elem.ID);
        const filteredAnswers = answers.filter((answer) => answer == 1);
        let selectedDiagnosis;
        // console.log(selectedDiagnosis);
        if (age > 35) {
          const checkNone = answers.find((elem) => elem == 1);
          if (answers[3] == 1 || answers[4] == 1) {
            selectedDiagnosis = 25;
          }
          if (
            answers[0] == 1 &&
            (answers[2] == 1 ||
              answers[3] == 1 ||
              answers[3] == 1 ||
              answers[4] == 1)
          ) {
            selectedDiagnosis = 27;
          }
          if (answers[5] == 1 || answers[6] == 1 || answers[7] == 1) {
            selectedDiagnosis = 28;
          }
        }
        if (age < 35) {
          // const checkNone = answers.find((elem) => elem == 1);
          // console.log(answers[4] == 1, answers[5] == 1);
          if (answers[5] == 1 || answers[6] == 1) {
            selectedDiagnosis = 24;
          } else if (
            answers[0] == 1 &&
            (answers[2] == 1 || answers[3] == 1 || answers[4] == 1)
          ) {
            selectedDiagnosis = 26;
          } else {
            selectedDiagnosis = 22;
          }
          if (answers[5] == 1 || answers[6] == 1 || answers[7] == 1) {
            selectedDiagnosis = 28;
          }
        }
        // console.log(selectedDiagnosis, TID);
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          // const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId: selectedDiagnosis, TID },
          });
          // console.log(result)
          // db.db("ChatBoat").collection("diagnosis").findOne({ MsgId: selectedDiagnosis, TID },function (err, result) {
          //       if (err) throw err;
          // console.log(result);
          // db.close();
          result = {
            ...result,
            count: `You answered yes to ${filteredAnswers.length} factors that are commonly associated with infertility.`,
          };
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          //   }
          // );
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      } else {
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          // const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId, TID },
          });
          // dbo.collection("diagnosis").findOne({ MsgId, TID }, function (err, result) {
          //     if (err) throw err;
          // console.log(result);
          // db.close();
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else {
            res.send({ status: 404, message: "Data Not Found" });
          }
          // });
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      }
    }
    if (TID == 5) {
      // console.log(SelectedOptions)
      const answers = SelectedOptions.map((answer) => answer.ID);
      let selectedDiagnosis;
      // console.log(answers.length);
      if (answers.length == 7) {
        if (
          answers[0] == 2 &&
          answers[1] == 2 &&
          answers[2] == 2 &&
          answers[3] == 2 &&
          answers[4] !== 2 &&
          answers[5] == 1 &&
          answers[6] == 2
        ) {
          selectedDiagnosis = 22;
        } else if (
          answers[0] == 2 &&
          answers[1] == 2 &&
          answers[2] == 2 &&
          answers[4] == 3 &&
          answers[6] == 2 &&
          !selectedDiagnosis
        )
          selectedDiagnosis = 1;
        else if (
          answers[0] == 1 &&
          answers[1] == 2 &&
          answers[2] == 2 &&
          answers[3] == 2 &&
          answers[4] == 3 &&
          answers[5] == 2
        )
          selectedDiagnosis = 3;
        else if (
          (answers[1] == 1 || answers[2] == 1) &&
          answers[3] == 1 &&
          answers[4] == 1 &&
          answers[5] == 1
        )
          selectedDiagnosis = 10;
        else if (
          (answers[1] == 1 || answers[2] == 1) &&
          answers[3] == 1 &&
          answers[4] == 1
        )
          selectedDiagnosis = 10;
        else if (
          answers[1] == 1 &&
          answers[3] == 2 &&
          answers[4] == 1 &&
          !selectedDiagnosis
        )
          selectedDiagnosis = 15;
        else if (answers[3] == 2 && answers[4] == 1 && !selectedDiagnosis)
          selectedDiagnosis = 15;
      } else if (answers.length == 10) {
        const copyAnswers = [...answers];
        const truncatedArr = copyAnswers.splice(5, 3);
        // console.log("-=-=", truncatedArr, copyAnswers);
        if (
          copyAnswers[0] == 2 &&
          copyAnswers[1] == 2 &&
          copyAnswers[2] == 2 &&
          copyAnswers[3] == 2 &&
          copyAnswers[4] !== 2 &&
          copyAnswers[5] == 1 &&
          copyAnswers[6] == 2
        ) {
          selectedDiagnosis = 22;
        } else if (
          copyAnswers[0] == 2 &&
          copyAnswers[1] == 2 &&
          copyAnswers[2] == 2 &&
          copyAnswers[4] == 3 &&
          copyAnswers[6] == 2 &&
          !selectedDiagnosis
        )
          selectedDiagnosis = 1;
        else if (
          copyAnswers[0] == 1 &&
          copyAnswers[1] == 2 &&
          copyAnswers[2] == 2 &&
          copyAnswers[3] == 2 &&
          copyAnswers[4] == 3 &&
          copyAnswers[5] == 2
        )
          selectedDiagnosis = 3;
        let check = [
          copyAnswers[0],
          copyAnswers[1],
          copyAnswers[2],
          copyAnswers[3],
          copyAnswers[6],
        ];
        let checkOccurence1 = check.filter((elem) => elem == 1);
        if (checkOccurence1.length > 1) {
          selectedDiagnosis = 5;
        } else if (
          (copyAnswers[1] == 1 || copyAnswers[2] == 1) &&
          copyAnswers[3] == 1 &&
          copyAnswers[4] == 1 &&
          copyAnswers[5] == 1
        )
          selectedDiagnosis = 10;
        else if (
          (copyAnswers[1] == 1 || copyAnswers[2] == 1) &&
          copyAnswers[3] == 1 &&
          copyAnswers[4] == 1
        )
          selectedDiagnosis = 10;
        else if (
          copyAnswers[1] == 1 &&
          copyAnswers[3] == 2 &&
          copyAnswers[4] == 1 &&
          !selectedDiagnosis
        )
          selectedDiagnosis = 15;
        else if (
          copyAnswers[3] == 2 &&
          copyAnswers[4] == 1 &&
          !selectedDiagnosis
        ) {
          if (answers[5] == 1 && answers[6] == 1 && answers[7] == 1) {
            selectedDiagnosis = 23;
          }
          if (answers[5] == 2 && answers[6] == 1 && answers[7] == 1)
            selectedDiagnosis = 24;
          else selectedDiagnosis = 15;
        }
      } else {
        // console.log("else");
        const { RefType } = req.body;
        if (RefType == "Diagnostic Result") {
          try {
            // MongoClient.connect(url, function (err, db) {
            //   if (err) throw err;
            // const dbo = db.db("ChatBoat");
            let result = await Database.GetDbAccess({
              collection: "diagnosis2",
              query: { ID: MsgId, TID },
            });
            // dbo
            //   .collection("diagnosis2")
            //   .findOne({ ID: MsgId, TID }, function (err, result) {
            //     if (err) throw err;
            //     console.log(result);
            // db.close();
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({ status: 200, message: "success", data: [result] });
            } else res.send({ status: 404, message: "Data Not Found" });
            // });
            // });
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }
          return;
        }
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId, TID },
          });
          // dbo
          //   .collection("diagnosis")
          //   .findOne({ MsgId, TID }, function (err, result) {
          //     if (err) throw err;
          //     console.log(result);
          // db.close();
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          // });
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      }
      console.log("---------------------", selectedDiagnosis, TID);
      try {
        // MongoClient.connect(url, function (err, db) {
        //   if (err) throw err;
        //   const dbo = db.db("ChatBoat");
        let result = await Database.GetDbAccess({
          collection: "diagnosis",
          query: { MsgId: selectedDiagnosis, TID },
        });
        // dbo
        //   .collection("diagnosis")
        //   .findOne({ MsgId: selectedDiagnosis, TID }, function (err, result) {
        //     if (err) throw err;
        //     console.log(result);
        //     // db.close();
        //     console.log(answers.length);
        if (
          result &&
          (answers.length == 10) & (answers[5] == 1) &&
          answers[6] == 1 &&
          answers[7] == 1
        )
          result = {
            ...result,
            Destination: false,
            Diagnosis: true,
            info:
              "Based on your responses, there may be a also be a chance that you may have an STI since pain during intercourse, and back/belly pain along with discolored discharge are indications of an infection. Based on your symptoms, you may have Chlamydia since you have a yellow discharge however, if it is more greenish, you may have gonorrhea. It is always a good idea to get tested for STIs as treating them and preventing them from becoming serious is quite simple. Please click here to learn more about Chlamydia and Gonorrhea. You can also go back to our STI screen if you want to do a more in-depth screen!",
          };
        if (
          result &&
          answers.length == 10 &&
          answers[5] == 2 &&
          answers[6] == 1 &&
          answers[7] == 1
        )
          result = {
            ...result,
            Destination: false,
            Diagnosis: true,
            info:
              "Based on your responses, there may also be a chance that you may have an STI since pain during intercourse, and back/belly pain along with discolored discharge are indications of an infection. Based on your symptoms, you may have Gonorrhea since you have a green discharge however, if it is more yellowish, you may have Chlamydia. It is always a good idea to get tested for STIs as treating them and preventing them from becoming serious is quite simple. Please click here to learn more about Chlamydia and Gonorrhea. You can also go back to our STI screen if you want to do a more in-depth screen!",
          };
        if (result) {
          if (result.RefType === "Diagnostic Result") {
            result.RefType = "diagnosis";
          }
          if (result.RefType === "" && result.diagnosis2 === true) {
            result.RefType = "Diagnostic Result";
          }
          res.send({ status: 200, message: "success", data: result });
        } else res.send({ status: 404, message: "Data Not Found" });
        // });
        // });
      } catch (error) {
        res.send({ status: 400, message: error.message });
      }
    }
    if (TID == 6) {
      console.log(SelectedOptions.length);
      if (SelectedOptions && SelectedOptions.length > 1) {
        console.log("inside");
        if (SelectedOptions[1].QID == 3 && SelectedOptions[1].ID == 1) {
          let yeast = 0,
            chlamydia = 0,
            gonorrhea = 0,
            trichmoniasis = 0;

          let selectedDiagnosis,
            diagnosis = true;
          const answers = SelectedOptions.map((answer) => answer.ID);
          console.log(SelectedOptions.length);
          if (SelectedOptions.length == 20) {
            if (answers[2] == 1) {
              chlamydia += 1;
              trichmoniasis += 1;
            }
            if (answers[3] == 1) {
              chlamydia += 20;
            }

            if (answers[4] == 1) {
              chlamydia += 1;
              gonorrhea += 1;
              trichmoniasis += 1;
            }

            if (answers[5] == 1) {
              chlamydia += 1;
              trichmoniasis += 1;
            }

            if (answers[6] == 1) {
              yeast += 1;
              chlamydia += 1;
              trichmoniasis += 1;
            }

            if (answers[8] == 1) {
              yeast += 1;
              chlamydia += 1;
              gonorrhea += 1;
            }

            if (answers[9] == 1) {
              gonorrhea += 20;
            }

            if (answers[10] == 1) {
              trichmoniasis += 1;
            }

            if (answers[11] == 1) {
              trichmoniasis += 1;
            }

            if (answers[12] == 1) {
              yeast += 20;
            }

            if (answers[13] == 1) {
              yeast += 1;
              trichmoniasis += 1;
            }

            if (answers[14] == 1) {
              yeast += 1;
              trichmoniasis += 1;
            }

            if (answers[15] == 1) {
              chlamydia += 20;
            }

            if (answers[16] == 1) {
              chlamydia += 20;
            }

            if (answers[17] == 1) {
              chlamydia += 1;
              gonorrhea += 1;
              trichmoniasis += 1;
            }

            if (answers[19] == 1) {
              chlamydia += 20;
            }

            console.log("+++++++", chlamydia, trichmoniasis);

            //Yeast
            if (answers[12] == 1 && (answers[13] == 1 || answers[14] == 1)) {
              selectedDiagnosis = 3;
            }

            //Yeast
            else if (
              answers[13] == 1 &&
              answers[14] == 1 &&
              yeast > trichmoniasis
            ) {
              selectedDiagnosis = 3;
            }

            //chlymdia
            else if (chlamydia > gonorrhea && chlamydia > trichmoniasis) {
              selectedDiagnosis = 4;
            }

            //gonorrhea
            else if (gonorrhea > chlamydia && gonorrhea > trichmoniasis) {
              selectedDiagnosis = 5;
            }

            //trichmoniasis
            else if (trichmoniasis > chlamydia && trichmoniasis > gonorrhea) {
              selectedDiagnosis = 6;
            }

            //CANNOT SAY FOR SURE
            else {
              diagnosis = false;
            }

            if (!diagnosis) selectedDiagnosis = 2;
            console.log(diagnosis, selectedDiagnosis);

            try {
              // MongoClient.connect(url, function (err, db) {
              //   if (err) throw err;
              //   const dbo = db.db("ChatBoat");
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: selectedDiagnosis, TID },
              });
              // dbo
              //   .collection("diagnosis")
              //   .findOne({ MsgId: 2, TID }, function (err, result) {
              //     if (err) throw err;
              //     console.log(result);
              //     // db.close();
              //     console.log(answers.length);
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
              } else res.send({ status: 404, message: "Data Not Found" });
              // });
              // });
            } catch (error) {
              res.send({ status: 400, message: error.message });
            }

            return;
          }

          if (SelectedOptions.length == 17) {
            if (answers[2] == 1) {
              chlamydia += 1;
              trichmoniasis += 1;
            }
            if (answers[3] == 1) {
              chlamydia += 20;
            }

            if (answers[4] == 1) {
              chlamydia += 1;
              gonorrhea += 1;
              trichmoniasis += 1;
            }

            if (answers[5] == 1) {
              chlamydia += 1;
              trichmoniasis += 1;
            }

            if (answers[6] == 1) {
              yeast += 1;
              chlamydia += 1;
              trichmoniasis += 1;
            }

            if (answers[8] == 1) {
              trichmoniasis += 1;
            }

            if (answers[9] == 1) {
              yeast += 20;
            }

            if (answers[10] == 1) {
              yeast += 1;
              trichmoniasis += 1;
            }

            if (answers[11] == 1) {
              yeast += 1;
              trichmoniasis += 1;
            }

            if (answers[12] == 1) {
              chlamydia += 20;
            }

            if (answers[13] == 1) {
              chlamydia += 20;
            }

            if (answers[14] == 1) {
              chlamydia += 1;
              gonorrhea += 1;
              trichmoniasis += 1;
            }

            if (answers[16] == 1) {
              chlamydia += 20;
            }

            //Yeast here
            if (
              answers[9] == 1 &&
              (answers[10] == 1 || answers[11] == 1) &&
              yeast > trichmoniasis
            ) {
              selectedDiagnosis = 3;
            }

            //Yeast here
            else if (
              answers[10] == 1 &&
              answers[11] == 1 &&
              yeast > trichmoniasis
            ) {
              selectedDiagnosis = 3;
            }

            //chlymdia
            else if (chlamydia > gonorrhea && chlamydia > trichmoniasis) {
              selectedDiagnosis = 4;
            }

            //gonorrhea
            else if (gonorrhea > chlamydia && gonorrhea > trichmoniasis) {
              selectedDiagnosis = 5;
            }

            //trichmoniasis
            else if (trichmoniasis > chlamydia && trichmoniasis > gonorrhea) {
              selectedDiagnosis = 6;
            }

            //CANNOT SAY FOR SURE
            else {
              diagnosis = false;
            }
            if (!diagnosis) selectedDiagnosis = 2;

            try {
              // MongoClient.connect(url, function (err, db) {
              //   if (err) throw err;
              //   const dbo = db.db("ChatBoat");
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: selectedDiagnosis, TID },
              });
              // dbo
              //   .collection("diagnosis")
              //   .findOne({ MsgId: 2, TID }, function (err, result) {
              //     if (err) throw err;
              //     console.log(result);
              //     // db.close();
              //     console.log(answers.length);
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
              } else res.send({ status: 404, message: "Data Not Found" });
              // });
              // });
            } catch (error) {
              res.send({ status: 400, message: error.message });
            }

            return;
          } else {
            res.send({ status: 400, message: "Invalid Selected Options" });
          }
        }

        if (SelectedOptions[1].QID == 3 && SelectedOptions[1].ID == 2) {
          let herpes = 0,
            syphilis = 0,
            genitalWart = 0;

          let selectedDiagnosis,
            diagnosis = true;
          const answers = SelectedOptions.map((elem) => elem.ID);

          //Required question for syphilis and herpes is 22, if answer is no check for genital warts
          if (SelectedOptions[2].QID == 22 && SelectedOptions[2].ID == 2) {
            SelectedOptions.map((elem) => {
              //Genital Wart
              if (elem.QID == 32) {
                if (elem.ID == 1) {
                  selectedDiagnosis = 9;
                } else diagnosis = false;
              }
            });
          }

          if (SelectedOptions[2].QID == 22 && SelectedOptions[2].ID == 1) {
            //all needed questions for syphilis answered with yes and atleast 1 needed for herpes answered no
            if (
              answers[3] == 1 &&
              answers[4] == 1 &&
              (answers[5] !== 1 || answers[5] !== 1)
            ) {
              selectedDiagnosis = 8;
              diagnosis = true;
            }

            //all needed questions for herpes answered with yes and atleast 1 needed for syphilis answered no
            if (
              answers[5] == 1 &&
              answers[6] == 1 &&
              (answers[3] !== 1 || answers[4] !== 1)
            ) {
              selectedDiagnosis = 7;
              diagnosis = true;
            }

            if (
              answers[5] == 1 &&
              answers[6] == 1 &&
              answers[3] == 1 &&
              answers[4] == 1
            ) {
              SelectedOptions.map((elem) => {
                if (elem.QID == 27 && elem.ID == 1) herpes += 1;
                if (elem.QID == 28 && elem.ID == 1) herpes += 1;
                if (elem.QID == 29 && elem.ID == 1) herpes += 1;
                if (elem.QID == 30 && elem.ID == 1) herpes += 1;
                if (elem.QID == 31 && elem.ID == 1) herpes += 1;
                if (elem.QID == 33 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 34 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 35 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 37 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 38 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 39 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 40 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 41 && elem.ID == 1) syphilis += 1;
                if (elem.QID == 90 && elem.ID == 1) herpes += 1;
                if (elem.QID == 91 && elem.ID == 1) herpes += 1;
              });

              if (herpes > syphilis) selectedDiagnosis = 5;
              else selectedDiagnosis = 8;
              diagnosis = true;
            }
          }

          if (!diagnosis) selectedDiagnosis = 2;

          try {
            // MongoClient.connect(url, function (err, db) {
            //   if (err) throw err;
            //   const dbo = db.db("ChatBoat");
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            // dbo
            //   .collection("diagnosis")
            //   .findOne({ MsgId: 2, TID }, function (err, result) {
            //     if (err) throw err;
            //     console.log(result);
            //     // db.close();
            //     console.log(answers.length);
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: result,
              });
            } else res.send({ status: 404, message: "Data Not Found" });
            // });
            // });
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }
        }

        if (SelectedOptions[1].QID == 3 && SelectedOptions[1].ID == 3) {
          let syphilis = 0,
            scabies = 0;
          const answers = SelectedOptions.map((answer) => answer.ID);

          let selectedDiagnosis,
            diagnosis = true;

          //SYPHILIS
          if (
            SelectedOptions[2].QID == 42 &&
            SelectedOptions[2].ID == 1 &&
            SelectedOptions[3].QID == 43 &&
            SelectedOptions[3].ID == 1 &&
            SelectedOptions[4].QID == 44 &&
            SelectedOptions[4].ID == 1 &&
            ((SelectedOptions[5].QID == 45 && SelectedOptions[5].ID !== 1) ||
              (SelectedOptions[8].QID == 48 && SelectedOptions[8].ID !== 1))
          ) {
            console.log("8");
            selectedDiagnosis = 8;
          } else if (
            SelectedOptions[5].QID == 45 &&
            SelectedOptions[5].ID == 1 &&
            SelectedOptions[8].QID == 48 &&
            SelectedOptions[8].ID == 1 &&
            ((SelectedOptions[2].QID == 42 && SelectedOptions[2].ID !== 1) ||
              (SelectedOptions[3].QID == 43 && SelectedOptions[3].ID !== 1) ||
              (SelectedOptions[4].QID == 44 && SelectedOptions[4].ID !== 1))
          ) {
            console.log("11");
            selectedDiagnosis = 11;
          } else if (
            SelectedOptions[2].QID == 42 &&
            SelectedOptions[2].ID == 1 &&
            SelectedOptions[3].QID == 43 &&
            SelectedOptions[3].ID == 1 &&
            SelectedOptions[4].QID == 44 &&
            SelectedOptions[4].ID == 1 &&
            SelectedOptions[5].QID == 45 &&
            SelectedOptions[5].ID == 1 &&
            SelectedOptions[8].QID == 48 &&
            SelectedOptions[8].ID == 1
          ) {
            console.log("checking between syph and scab");

            SelectedOptions.map((elem) => {
              if (elem.QID == 42 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 43 && elem.ID == 1) syphilis += 20;
              if (elem.QID == 44 && elem.ID == 1) syphilis += 20;
              if (elem.QID == 45 && elem.ID == 1) {
                syphilis += 1;
                scabies += 1;
              }
              if (elem.QID == 46 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 47 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 48 && elem.ID == 1) scabies += 1;
              if (elem.QID == 49 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 50 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 51 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 52 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 53 && elem.ID == 1) syphilis += 1;
              if (elem.QID == 54 && elem.ID == 1) scabies += 1;
              if (elem.QID == 55 && elem.ID == 1) scabies += 1;
              if (elem.QID == 56 && elem.ID == 1) scabies += 1;
              if (elem.QID == 57 && elem.ID == 1) scabies += 1;
              if (elem.QID == 58 && elem.ID == 1) scabies += 20;
            });

            if (syphilis > scabies) selectedDiagnosis = 8;
            else selectedDiagnosis = 11;
          } else diagnosis = false;
          if (!diagnosis) {
            selectedDiagnosis = 2;
          }

          try {
            // MongoClient.connect(url, function (err, db) {
            //   if (err) throw err;
            //   const dbo = db.db("ChatBoat");
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            // dbo
            //   .collection("diagnosis")
            //   .findOne({ MsgId: 2, TID }, function (err, result) {
            //     if (err) throw err;
            //     console.log(result);
            //     // db.close();
            //     console.log(answers.length);
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: result,
              });
            } else res.send({ status: 404, message: "Data Not Found" });
            // });
            // });
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }

          return;
        }

        if (SelectedOptions[1].QID == 3 && SelectedOptions[1].ID == 4) {
          let yeast = 0,
            trichmoniasis = 0,
            herpes = 0,
            crabs = 0,
            scabies = 0;

          let selectedDiagnosis,
            diagnosis = true;
          const answers = SelectedOptions.map((answer) => answer.ID);

          if (
            (SelectedOptions[11].QID == 68 &&
              SelectedOptions[11].ID == 1 &&
              SelectedOptions[12].QID == 69 &&
              SelectedOptions[12].ID == 1) ||
            (SelectedOptions[11].QID == 68 &&
              SelectedOptions[11].ID == 1 &&
              SelectedOptions[13].QID == 70 &&
              SelectedOptions[13].ID == 1) ||
            (SelectedOptions[12].QID == 69 &&
              SelectedOptions[12].ID == 1 &&
              SelectedOptions[13].QID == 70 &&
              SelectedOptions[13].ID == 1)
          ) {
            selectedDiagnosis = 3;
          } else if (
            SelectedOptions.length > 16 &&
            SelectedOptions[15].QID == 72 &&
            SelectedOptions[15].ID == 1 &&
            SelectedOptions[16].QID == 73 &&
            SelectedOptions[16].ID == 1 &&
            SelectedOptions[17].QID == 74 &&
            SelectedOptions[17].ID == 1
          ) {
            selectedDiagnosis = 7;
          } else if (
            SelectedOptions.length > 23 &&
            SelectedOptions[23].QID == 80 &&
            SelectedOptions[23].ID == 1 &&
            SelectedOptions[24].QID == 81 &&
            SelectedOptions[24].ID == 1
          ) {
            selectedDiagnosis = 11;
          } else if (
            SelectedOptions.length > 29 &&
            SelectedOptions[28].QID == 85 &&
            SelectedOptions[28].ID == 1 &&
            SelectedOptions[30].QID == 87 &&
            SelectedOptions[30].ID == 1
          ) {
            selectedDiagnosis = 10;
          }

          //4
          else {
            SelectedOptions.map((elem) => {
              if (elem.QID == 59 && elem.ID == 1) {
                trichmoniasis += 1;
              }
              if (elem.QID == 60 && elem.ID == 1) {
                trichmoniasis += 1;
              }
              if (elem.QID == 61 && elem.ID == 1) {
                trichmoniasis += 1;
              }
              if (elem.QID == 62 && elem.ID == 1) {
                trichmoniasis += 1;
                yeast += 1;
              }
              if (elem.QID == 63 && elem.ID == 1) {
              }
              if (elem.QID == 64 && elem.ID == 1) {
                yeast += 1;
              }
              if (elem.QID == 65 && elem.ID == 1) {
              }
              if (elem.QID == 66 && elem.ID == 1) {
                trichmoniasis += 1;
              }
              if (elem.QID == 67 && elem.ID == 1) {
                trichmoniasis += 1;
              }
              if (elem.QID == 68 && elem.ID == 1) {
                yeast += 20;
              }
              if (elem.QID == 69 && elem.ID == 1) {
                yeast += 1;
                trichmoniasis += 1;
              }
              if (elem.QID == 70 && elem.ID == 1) {
                yeast += 1;
                trichmoniasis += 1;
                herpes += 1;
              }
              if (elem.QID == 71 && elem.ID == 1) {
                trichmoniasis += 1;
                herpes += 1;
              }
              if (elem.QID == 72 && elem.ID == 1) {
                herpes += 1;
              }
              if (elem.QID == 73 && elem.ID == 1) {
                herpes += 20;
              }
              if (elem.QID == 74 && elem.ID == 1) {
                herpes += 20;
              }
              if (elem.QID == 75 && elem.ID == 1) {
                herpes += 1;
              }
              if (elem.QID == 76 && elem.ID == 1) {
                herpes += 1;
              }
              if (elem.QID == 77 && elem.ID == 1) {
                herpes += 1;
              }
              if (elem.QID == 78 && elem.ID == 1) {
                herpes += 1;
              }
              if (elem.QID == 79 && elem.ID == 1) {
                herpes += 1;
              }
              if (elem.QID == 80 && elem.ID == 1) {
                scabies += 1;
              }
              if (elem.QID == 81 && elem.ID == 1) {
                scabies += 1;
              }
              if (elem.QID == 82 && elem.ID == 1) {
                scabies += 1;
              }
              if (elem.QID == 83 && elem.ID == 1) {
                scabies += 1;
              }
              if (elem.QID == 84 && elem.ID == 1) {
                scabies += 1;
              }
              if (elem.QID == 85 && elem.ID == 1) {
                scabies += 1;
                crabs += 1;
              }
              if (elem.QID == 86 && elem.ID == 1) {
                scabies += 20;
              }
              if (elem.QID == 87 && elem.ID == 1) {
                crabs += 1;
              }
              if (elem.QID == 88 && elem.ID == 1) {
                crabs += 1;
              }
              if (elem.QID == 89 && elem.ID == 1) {
                crabs += 1;
              }

              if (
                trichmoniasis > yeast &&
                trichmoniasis > herpes &&
                trichmoniasis > crabs &&
                trichmoniasis > scabies
              )
                selectedDiagnosis = 6;
              else diagnosis = false;
            });
          }

          //CANT DIAGNOSE
          if (!diagnosis) selectedDiagnosis = 2;

          try {
            // MongoClient.connect(url, function (err, db) {
            //   if (err) throw err;
            //   const dbo = db.db("ChatBoat");
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            // dbo
            //   .collection("diagnosis")
            //   .findOne({ MsgId: 2, TID }, function (err, result) {
            //     if (err) throw err;
            //     console.log(result);
            //     // db.close();
            //     console.log(answers.length);
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: result,
              });
            } else res.send({ status: 404, message: "Data Not Found" });
            // });
            // });
            return;
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }
        }
      }

      if (req.body.RefType === "Diagnostic Result") {
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis2",
            query: { ID: MsgId, TID },
          });
          // dbo
          //   .collection("diagnosis")
          //   .findOne({ MsgId, TID }, function (err, result) {
          //     if (err) throw err;
          //     console.log(result);
          // db.close();
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: [result] });
          } else res.send({ status: 404, message: "Data Not Found" });
          // });
          // });
          return;
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      } else {
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId, TID },
          });
          // dbo
          //   .collection("diagnosis")
          //   .findOne({ MsgId, TID }, function (err, result) {
          //     if (err) throw err;
          //     console.log(result);
          // db.close();
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          // });
          // });
          return;
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      }
    }
    if (TID == 7) {
      const { RefType } = req.body;
      if (RefType == "Diagnostic Result") {
        console.log("DIAGNOSIS 2");
        try {
          let result = await Database.GetDbAccess({
            collection: "diagnosis2",
            query: { ID: MsgId, TID },
          });
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: [result] });
          } else res.send({ status: 404, message: "Data Not Found" });
          return;
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
        return;
      }
      if (
        req.body.MsgId !== "-1" &&
        req.body.MsgId !== "" &&
        req.body.MsgId !== null &&
        req.body.MsgId !== undefined
      ) {
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId, TID },
          });
          // dbo
          //   .collection("diagnosis2")
          //   .findOne({ ID: MsgId, TID }, function (err, result) {
          //     if (err) throw err;
          //     console.log(result);
          // db.close();
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          return;
          // });
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      }
      if (SelectedOptions.length > 0) {
        let selectedDiagnosis,
          diagnosis = true;
        const answers = SelectedOptions.map((elem) => elem.ID);
        //Irregular - late, early, no periods
        if (SelectedOptions[0].QID == 1 && SelectedOptions[0].ID == 1) {
          //LATER THAN DUE
          if (SelectedOptions[1].QID == 2 && SelectedOptions[1].ID == 1) {
            console.log("HELLO");
            //LESS THAN 2 Weeks
            if (SelectedOptions[2].QID == 3 && SelectedOptions[2].ID == 1) {
              //If days <= 7; and Y to Genetic
              if (
                SelectedOptions[3].QID == 4 &&
                SelectedOptions[3].ID <= 7 &&
                SelectedOptions[4].QID == 5 &&
                SelectedOptions[4].ID == 1
              ) {
                try {
                  console.log("here");
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: 3, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                    return;
                  } else res.send({ status: 404, message: "Data Not Found" });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
              //if not genetic; or if days > 7 and Y to Genetic
              if (
                (SelectedOptions[3].QID == 4 && SelectedOptions[3].ID > 7) ||
                (SelectedOptions[4].QID == 5 && SelectedOptions[4].ID == 2)
              ) {
                //TAKE TO PCOS
                console.log("1");
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: 45, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                  } else res.send({ status: 404, message: "Data Not Found" });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
            }

            //2-4 WEEKS OR MORE THAN 4 WEEKS
            else {
              let points = 0;

              SelectedOptions.map((elem) => {
                if (elem.QID == 24 && elem.ID == 1) points += 1;
                if (elem.QID == 25 && elem.ID == 1) points += 1;
                if (elem.QID == 26 && elem.ID == 1) points += 1;
                if (elem.QID == 27 && elem.ID == 1) points += 1;
                if (elem.QID == 28 && elem.ID == 1) points += 1;
                if (elem.QID == 29 && elem.ID == 1) points += 1;
                if (elem.QID == 30 && elem.ID == 1) points += 1;
                if (elem.QID == 31 && elem.ID == 1) points += 1;
              });

              let { overweight } = req.body;
              let status;
              if (points < 3 && !overweight) {
                //low
                status = "low";
                selectedDiagnosis = 4;
              }
              if (points < 3 && overweight) {
                //medium
                status = "medium";
                selectedDiagnosis = 5;
              }
              if (points == 3) {
                //medium
                status = "medium";
                selectedDiagnosis = 5;
              }
              if (points == 4) {
                //high
                status = "high";
                selectedDiagnosis = 6;
              }
              if (points == 5) {
                //high -v.high
                status = "high to very high";
                selectedDiagnosis = 6;
              }
              if (points >= 6) {
                //V.high
                status = "very high";
                selectedDiagnosis = 6;
              }

              count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;

              try {
                let result = await Database.GetDbAccess({
                  collection: "diagnosis",
                  query: { MsgId: selectedDiagnosis, TID },
                });
                if (result) {
                  if (result.RefType === "Diagnostic Result") {
                    result.RefType = "diagnosis";
                  }
                  if (result.RefType === "" && result.diagnosis2 === true) {
                    result.RefType = "Diagnostic Result";
                  }
                  res.send({
                    status: 200,
                    message: "success",
                    data: { ...result, count },
                  });
                  return;
                } else res.send({ status: 404, message: "Data Not Found" });
                return;
              } catch (error) {
                res.send({ status: 400, message: error.message });
                return;
              }
            }
          }

          //EARLIER THAN DUE
          if (SelectedOptions[1].QID == 2 && SelectedOptions[1].ID == 2) {
            if (SelectedOptions.length > 2) {
              if (
                SelectedOptions[2].QID == 32 &&
                SelectedOptions[2].ID == 2 &&
                SelectedOptions[3].QID == 33 &&
                SelectedOptions[3].ID == 1 &&
                SelectedOptions[4].QID == 34 &&
                SelectedOptions[4].ID == 2
              ) {
                if (age <= 36) {
                  try {
                    let result = await Database.GetDbAccess({
                      collection: "diagnosis",
                      query: { MsgId: 19, TID },
                    });
                    if (result) {
                      if (result.RefType === "Diagnostic Result") {
                        result.RefType = "diagnosis";
                      }
                      if (result.RefType === "" && result.diagnosis2 === true) {
                        result.RefType = "Diagnostic Result";
                      }
                      res.send({
                        status: 200,
                        message: "success",
                        data: result,
                      });
                    } else
                      res.send({
                        status: 404,
                        message: "Data Not Found",
                      });
                    return;
                  } catch (error) {
                    res.send({ status: 400, message: error.message });
                    return;
                  }
                } else {
                  try {
                    let result = await Database.GetDbAccess({
                      collection: "diagnosis",
                      query: { MsgId: 52, TID },
                    });
                    if (result) {
                      if (result.RefType === "Diagnostic Result") {
                        result.RefType = "diagnosis";
                      }
                      if (result.RefType === "" && result.diagnosis2 === true) {
                        result.RefType = "Diagnostic Result";
                      }
                      res.send({
                        status: 200,
                        message: "success",
                        data: result,
                      });
                    } else
                      res.send({
                        status: 404,
                        message: "Data Not Found",
                      });
                    return;
                  } catch (error) {
                    res.send({ status: 400, message: error.message });
                    return;
                  }
                }
              }
              if (SelectedOptions[2].QID == 32 && SelectedOptions[2].ID == 2) {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: 18, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                  return;
                }
              } else if (
                SelectedOptions[2].QID == 32 &&
                SelectedOptions[2].ID == 1
              ) {
                //FETCH AGE
                let age = 17;
                let questionId;
                if (age <= 19) questionId = 46;
                if (age > 36) questionId = 47;
                else questionId = 48;

                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: questionId, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                  return;
                }
              } else if (
                SelectedOptions[2].QID == 45 &&
                SelectedOptions[2].ID == 1
              ) {
                //FETCH AGE
                let age = 39,
                  questionId;
                if (age > 36) {
                  questionId = 46;
                } else {
                  questionId = 22;
                }

                try {
                  let result = await Database.GetDbAccess({
                    collection: "questions",
                    query: { QID: questionId, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                    return;
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
            } else {
              let questionId;
              if (age > 36) questionId = 65;
            }
          }

          if (SelectedOptions[1].QID == 2 && SelectedOptions[1].ID == 3) {
            if (SelectedOptions[2].QID == 45 && SelectedOptions[2].ID == 2) {
              let points = 0;

              SelectedOptions.map((elem) => {
                if (elem.QID == 24 && elem.ID == 1) points += 1;
                if (elem.QID == 25 && elem.ID == 1) points += 1;
                if (elem.QID == 26 && elem.ID == 1) points += 1;
                if (elem.QID == 27 && elem.ID == 1) points += 1;
                if (elem.QID == 28 && elem.ID == 1) points += 1;
                if (elem.QID == 29 && elem.ID == 1) points += 1;
                if (elem.QID == 30 && elem.ID == 1) points += 1;
                if (elem.QID == 31 && elem.ID == 1) points += 1;
              });

              let { overweight } = req.body;
              let status;
              if (points < 3 && !overweight) {
                //low
                status = "low";
                selectedDiagnosis = 4;
              }
              if (points < 3 && overweight) {
                //medium
                status = "medium";
                selectedDiagnosis = 5;
              }
              if (points == 3) {
                //medium
                status = "medium";
                selectedDiagnosis = 5;
              }
              if (points == 4) {
                //high
                status = "high";
                selectedDiagnosis = 6;
              }
              if (points == 5) {
                //high -v.high
                status = "high to very high";
                selectedDiagnosis = 6;
              }
              if (points >= 6) {
                //V.high
                status = "very high";
                selectedDiagnosis = 6;
              }

              count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;

              try {
                let result = await Database.GetDbAccess({
                  collection: "diagnosis",
                  query: { MsgId: selectedDiagnosis, TID },
                });

                if (result) {
                  if (result.RefType === "Diagnostic Result") {
                    result.RefType = "diagnosis";
                  }
                  if (result.RefType === "" && result.diagnosis2 === true) {
                    result.RefType = "Diagnostic Result";
                  }
                  res.send({
                    status: 200,
                    message: "success",
                    data: { ...result, count },
                  });
                } else res.send({ status: 404, message: "Data Not Found" });
                //   }
                // );
                // });
              } catch (error) {
                res.send({ status: 400, message: error.message });
              }
            }
            if (SelectedOptions[2].QID == 45 && SelectedOptions[2].ID == 1) {
              if (age > 36) {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: selectedDiagnosis, TID },
                  });

                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: { ...result, count },
                    });
                  } else res.send({ status: 404, message: "Data Not Found" });
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              } else {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: 55, TID },
                  });

                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                  } else res.send({ status: 404, message: "Data Not Found" });
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
            }
          }

          if (SelectedOptions[1].QID == 2 && SelectedOptions[1].ID == 4) {
            let selectedDiagnosis;
            if (age > 36) {
              selectedDiagnosis = 59;
            } else selectedDiagnosis = 60;

            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: selectedDiagnosis, TID },
              });

              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
              } else res.send({ status: 404, message: "Data Not Found" });
              //   }
              // );
              // });
            } catch (error) {
              res.send({ status: 400, message: error.message });
            }
          }
        }

        if (SelectedOptions[0].QID == 1 && SelectedOptions[0].ID == 2) {
          let answers = SelectedOptions.map((elem) => elem.ID);
          // TOO HEAVY or TOO LIGHT
          if (answers[0] == 2) {
            //TOO HEAVY
            if (answers[1] == 1) {
              if (answers.length < 11) {
                let points = 0;
                if (answers[3] == 1) points += 2;
                if (answers[4] == 1) points += 1;
                if (answers[5] == 1) points += 1;
                if (answers[6] == 1) points += 1;
                if (answers[7] == 1) points += 1;
                if (answers[8] == 1) points += 2;
                if (answers.length > 9) {
                  if (answers[9] == 1) points += 1;
                }
                //LOW
                if (points < 3) {
                  try {
                    let result = await Database.GetDbAccess({
                      collection: "diagnosis",
                      query: { MsgId: 1, TID },
                    });
                    if (result) {
                      if (result.RefType === "Diagnostic Result") {
                        result.RefType = "diagnosis";
                      }
                      if (result.RefType === "" && result.diagnosis2 === true) {
                        result.RefType = "Diagnostic Result";
                      }
                      res.send({
                        status: 200,
                        message: "success",
                        data: result,
                      });
                    } else
                      res.send({
                        status: 404,
                        message: "Data Not Found",
                      });
                    return;
                  } catch (error) {
                    res.send({ status: 400, message: error.message });
                    return;
                  }
                }
                //MEDIUM OR HIGH
                else {
                  try {
                    let result = await Database.GetDbAccess({
                      collection: "diagnosis",
                      query: { MsgId: 54, TID },
                    });
                    if (result) {
                      if (result.RefType === "Diagnostic Result") {
                        result.RefType = "diagnosis";
                      }
                      if (result.RefType === "" && result.diagnosis2 === true) {
                        result.RefType = "Diagnostic Result";
                      }
                      res.send({
                        status: 200,
                        message: "success",
                        data: result,
                      });
                    } else
                      res.send({
                        status: 404,
                        message: "Data Not Found",
                      });
                    return;
                  } catch (error) {
                    res.send({ status: 400, message: error.message });
                  }
                }
              }
            }
            //TOO LIGHT

            if (SelectedOptions[1].QID == 94 && SelectedOptions[0].ID == 2) {
              if (SelectedOptions[2].QID == 93 && SelectedOptions[2].ID == 1) {
                let selectedDiagnosis;
                if (bmi < 18.5) {
                  selectedDiagnosis = 37;
                }
              }
              if (SelectedOptions[2].QID == 93 && SelectedOptions[2].ID == 2) {
                let points = 0;

                SelectedOptions.map((elem) => {
                  if (elem.QID == 24 && elem.ID == 1) points += 1;
                  if (elem.QID == 25 && elem.ID == 1) points += 1;
                  if (elem.QID == 26 && elem.ID == 1) points += 1;
                  if (elem.QID == 27 && elem.ID == 1) points += 1;
                  if (elem.QID == 28 && elem.ID == 1) points += 1;
                  if (elem.QID == 29 && elem.ID == 1) points += 1;
                  if (elem.QID == 30 && elem.ID == 1) points += 1;
                  if (elem.QID == 31 && elem.ID == 1) points += 1;
                });

                let { overweight } = req.body;
                let status;
                if (points < 3 && !overweight) {
                  //low
                  status = "low";
                  selectedDiagnosis = 65;
                }
                if (points < 3 && overweight) {
                  //medium
                  status = "medium";
                  selectedDiagnosis = 5;
                }
                if (points == 3) {
                  //medium
                  status = "medium";
                  selectedDiagnosis = 5;
                }
                if (points == 4) {
                  //high
                  status = "high";
                  selectedDiagnosis = 6;
                }
                if (points == 5) {
                  //high -v.high
                  status = "high to very high";
                  selectedDiagnosis = 6;
                }
                if (points >= 6) {
                  //V.high
                  status = "very high";
                  selectedDiagnosis = 6;
                }

                count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: selectedDiagnosis, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: { ...result, count },
                    });
                  } else res.send({ status: 404, message: "Data Not Found" });
                  //   }
                  // );
                  // });
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
            }
          }
        }

        if (SelectedOptions[0].QID == 1 && SelectedOptions[0].ID == 3) {
          let points = 0;
          SelectedOptions.map((elem) => {
            if (elem.QID == 110 && elem.ID == 1) points += 0;
            if (elem.QID == 110 && elem.ID == 2) points += 1;
            if (elem.QID == 110 && elem.ID == 3) points += 2;
            if (elem.QID == 111 && elem.ID == 2) points += 1;
            if (elem.QID == 112 && elem.ID == 1) points += 1;
            if (elem.QID == 113 && elem.ID == 1) points += 1;
            if (elem.QID == 115 && elem.ID == 1) points += 2;
          });

          if (points == 0) {
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: 42, TID },
              });
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
                return;
              } else res.send({ status: 404, message: "Data Not Found" });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
          if (points == 1) {
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: 43, TID },
              });
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
                return;
              } else res.send({ status: 404, message: "Data Not Found" });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
          if (points > 1) {
            selectedDiagnosis = 44;
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: selectedDiagnosis, TID },
              });
              if (result) {
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
                return;
              } else res.send({ status: 404, message: "Data Not Found" });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
        }

        if (SelectedOptions[0].QID == 37) {
          const menarche1 =
            "It sometimes takes a while for your periods to regularise and you may be getting early periods because your ovulation schedule is still trying to get on track";
          const wt1 =
            "Weight fluctuations tend to have an effect on your menstrual cycles. Sometimes, excessively depriving yourself of nutrition can lead you to have anovulatory menstrual cycles - when you do not ovulate but some hormonal imbalances can cause your uterine lining to be shed, making you mistake it for a period";
          const hormonalmed1 =
            "IUDs, and birth control pills, and other horminal medications can have an effect on your period cycle. Please consult your doctor immediately if you suspect this to be the case - you may need to chance your medication";
          const thinner =
            "Blood thinners contain substances called anti-coagulants. Anticoagulants can cause you to bleed more frequently and have heavier bleeding than normal";
          let text = "";
          if (SelectedOptions[0].QID == 37 && SelectedOptions[0].ID == 1) {
            text += menarche1 + "\n\n";
          }
          if (SelectedOptions[1].QID == 40 && SelectedOptions[1].ID == 1) {
            text += wt1 + "\n\n";
          }
          if (SelectedOptions[2].QID == 41 && SelectedOptions[2].ID == 1) {
            text += hormonalmed1 + "\n\n";
          }
          if (SelectedOptions[3].QID == 42 && SelectedOptions[3].ID == 1) {
            text += thinner + "\n\n";
          }
          if (text == "")
            text =
              "We will now ask you some more questions to identify if you may be having heavy or painful Periods";

          result = {
            Message: text,
            NextRef: 43,
            Destination: false,
            TID: 7,
          };

          res.send({ status: 200, message: "success", data: result });
          return;
        }

        if (SelectedOptions[0].QID == 38) {
          const wt1 =
            "Weight fluctuations tend to have an effect on your menstrual cycles. Sometimes, excessively depriving yourself of nutrition can lead you to have anovulatory menstrual cycles - when you do not ovulate but some hormonal imbalances can cause your uterine lining to be shed, making you mistake it for a period";
          const hormonalmed1 =
            "IUDs, and birth control pills, and other horminal medications can have an effect on your period cycle. Please consult your doctor immediately if you suspect this to be the case - you may need to chance your medication";
          const thinner =
            "Blood thinners contain substances called anti-coagulants. Anticoagulants can cause you to bleed more frequently and have heavier bleeding than normal";
          let text = "";

          SelectedOptions.map((elem) => {
            if (elem.QID == 40 && elem.ID == 1) {
              text += wt1 + "\n\n";
            }
            if (elem.QID == 41 && elem.ID == 1) {
              text += hormonalmed1 + "\n\n";
            }
            if (elem.QID == 42 && elem.ID == 1) {
              text += thinner + "\n\n";
            }
          });
          if (text == "")
            text =
              "We will now ask you some more questions to identify if you may be having heavy or painful Periods";
          result = {
            Message: text,
            NextRef: 43,
            Destination: false,
            TID: 7,
          };

          res.send({ status: 200, message: "success", data: result });
          return;
        }

        if (SelectedOptions[0].QID == 40) {
          const wt1 =
            "Weight fluctuations tend to have an effect on your menstrual cycles. Sometimes, excessively depriving yourself of nutrition can lead you to have anovulatory menstrual cycles - when you do not ovulate but some hormonal imbalances can cause your uterine lining to be shed, making you mistake it for a period";
          const hormonalmed1 =
            "IUDs, and birth control pills, and other horminal medications can have an effect on your period cycle. Please consult your doctor immediately if you suspect this to be the case - you may need to chance your medication";
          const thinner =
            "Blood thinners contain substances called anti-coagulants. Anticoagulants can cause you to bleed more frequently and have heavier bleeding than normal";
          let text = "";

          SelectedOptions.map((elem) => {
            if (elem.QID == 40 && elem.ID == 1) {
              text += wt1 + "\n\n";
            }
            if (elem.QID == 41 && elem.ID == 1) {
              text += hormonalmed1 + "\n\n";
            }
            if (elem.QID == 42 && elem.ID == 1) {
              text += thinner + "\n\n";
            }
          });

          if ((text = ""))
            text =
              "We will now ask you some more questions to identify if you may be having heavy or painful Periods";
          result = {
            Message: text,
            NextRef: 43,
            Destination: false,
            TID: 7,
          };

          res.send({ status: 200, message: "success", data: result });
          return;
        }

        //PCOS SCREENING
        if (SelectedOptions[0].QID == 24) {
          let points = 0;

          SelectedOptions.map((elem) => {
            if (elem.QID == 24 && elem.ID == 1) points += 1;
            if (elem.QID == 25 && elem.ID == 1) points += 1;
            if (elem.QID == 26 && elem.ID == 1) points += 1;
            if (elem.QID == 27 && elem.ID == 1) points += 1;
            if (elem.QID == 28 && elem.ID == 1) points += 1;
            if (elem.QID == 29 && elem.ID == 1) points += 1;
            if (elem.QID == 30 && elem.ID == 1) points += 1;
            if (elem.QID == 31 && elem.ID == 1) points += 1;
          });

          let { overweight } = req.body;
          let status;
          if (points < 3 && !overweight) {
            //low
            status = "low";
            selectedDiagnosis = 4;
          }
          if (points < 3 && overweight) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 3) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 4) {
            //high
            status = "high";
            selectedDiagnosis = 6;
          }
          if (points == 5) {
            //high -v.high
            status = "high to very high";
            selectedDiagnosis = 6;
          }
          if (points >= 6) {
            //V.high
            status = "very high";
            selectedDiagnosis = 6;
          }

          count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;

          try {
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: { ...result, count },
              });
            } else res.send({ status: 404, message: "Data Not Found" });
            //   }
            // );
            // });
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }
        }

        if (SelectedOptions[0].QID == 50) {
          let points = 0;

          SelectedOptions.map((elem) => {
            if (elem.QID == 50 && elem.ID == 1) points += 1;
            if (elem.QID == 51 && elem.ID == 1) points += 1;
            if (elem.QID == 52 && elem.ID == 1) points += 1;
            if (elem.QID == 53 && elem.ID == 1) points += 1;
            if (elem.QID == 54 && elem.ID == 1) points += 1;
            if (elem.QID == 55 && elem.ID == 1) points += 1;
            if (elem.QID == 56 && elem.ID == 1) points += 1;
            if (elem.QID == 57 && elem.ID == 1) points += 1;
          });

          let { overweight } = req.body;
          let status;
          if (points < 3 && !overweight) {
            //low
            status = "low";
            selectedDiagnosis = 29;
          }
          if (points < 3 && overweight) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 3) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 4) {
            //high
            status = "high";
            selectedDiagnosis = 6;
          }
          if (points == 5) {
            //high -v.high
            status = "high to very high";
            selectedDiagnosis = 6;
          }
          if (points >= 6) {
            //V.high
            status = "very high";
            selectedDiagnosis = 6;
          }

          count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;

          try {
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: { ...result, count },
              });
            } else res.send({ status: 404, message: "Data Not Found" });
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }
        }

        if (SelectedOptions[0].QID == 97) {
          let points = 0;

          SelectedOptions.map((elem) => {
            if (elem.QID == 97 && elem.ID == 1) points += 1;
            if (elem.QID == 98 && elem.ID == 1) points += 1;
            if (elem.QID == 99 && elem.ID == 1) points += 1;
            if (elem.QID == 100 && elem.ID == 1) points += 1;
            if (elem.QID == 101 && elem.ID == 1) points += 1;
            if (elem.QID == 102 && elem.ID == 1) points += 1;
            if (elem.QID == 103 && elem.ID == 1) points += 1;
            if (elem.QID == 104 && elem.ID == 1) points += 1;
          });

          let { overweight } = req.body;
          let status;
          if (points < 3 && !overweight) {
            //low
            status = "low";
            selectedDiagnosis = 56;
          }
          if (points < 3 && overweight) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 3) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 4) {
            //high
            status = "high";
            selectedDiagnosis = 6;
          }
          if (points == 5) {
            //high -v.high
            status = "high to very high";
            selectedDiagnosis = 6;
          }
          if (points >= 6) {
            //V.high
            status = "very high";
            selectedDiagnosis = 6;
          }

          count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;

          try {
            // MongoClient.connect(url, function (err, db) {
            //   if (err) throw err;
            //   const dbo = db.db("ChatBoat");
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            // dbo
            //   .collection("diagnosis")
            //   .findOne(
            //     { MsgId: selectedDiagnosis, TID },
            //     function (err, result) {
            //       if (err) throw err;
            //       console.log(result);
            //       // db.close();
            //       console.log(answers.length);
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: { ...result, count },
              });
            } else res.send({ status: 404, message: "Data Not Found" });
            //   }
            // );
            // });
          } catch (error) {
            res.send({ status: 400, message: error.message });
          }
        }

        //PCOS SCREENING 1
        if (SelectedOptions[0].QID == 8) {
          let points = 0;
          if (SelectedOptions[0].QID == 8 && SelectedOptions[0].ID == 1)
            points += 1;
          if (SelectedOptions[1].QID == 9 && SelectedOptions[1].ID == 1)
            points += 1;
          if (SelectedOptions[2].QID == 10 && SelectedOptions[2].ID == 1)
            points += 1;
          if (SelectedOptions[3].QID == 11 && SelectedOptions[3].ID == 1)
            points += 1;
          if (SelectedOptions[4].QID == 12 && SelectedOptions[4].ID == 1)
            points += 1;
          if (SelectedOptions[5].QID == 13 && SelectedOptions[5].ID == 1)
            points += 1;
          if (SelectedOptions[6].QID == 14 && SelectedOptions[6].ID == 1)
            points += 1;
          if (SelectedOptions[7].QID == 15 && SelectedOptions[7].ID == 1)
            points += 1;

          //FETCH IF OVERWEIGHT
          let { overweight } = req.body;
          let status;
          if (points < 3 && !overweight) {
            //low
            status = "low";
            selectedDiagnosis = 4;
          }
          if (points < 3 && overweight) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 3) {
            //medium
            status = "medium";
            selectedDiagnosis = 5;
          }
          if (points == 4) {
            //high
            status = "high";
            selectedDiagnosis = 6;
          }
          if (points == 5) {
            //high -v.high
            status = "high to very high";
            selectedDiagnosis = 6;
          }
          if (points >= 6) {
            //V.high
            status = "very high";
            selectedDiagnosis = 6;
          }

          count = `You have indicated a positive response to ${points} of 8 of typical PCOS related symptoms. We categorise your PCOS risk as ${status}. PCOS or polycystic ovaries syndrome is a commonly occuring condition among women, typically identified through irregular periods as well as due to certain symptoms which we just screened you for, that indicate higher levels of androgens (male hormones).  Read on to know more about your assessment and how to manage it`;

          try {
            let result = await Database.GetDbAccess({
              collection: "diagnosis",
              query: { MsgId: selectedDiagnosis, TID },
            });
            if (result) {
              if (result.RefType === "Diagnostic Result") {
                result.RefType = "diagnosis";
              }
              if (result.RefType === "" && result.diagnosis2 === true) {
                result.RefType = "Diagnostic Result";
              }
              res.send({
                status: 200,
                message: "success",
                data: { ...result, result },
              });
              return;
            } else res.send({ status: 404, message: "Data Not Found" });
            return;
          } catch (error) {
            res.send({ status: 400, message: error.message });
            return;
          }
        }

        //NO or LOW PCOS
        if (SelectedOptions[0].QID == 16) {
          let temp1 = false,
            temp11 = false,
            temp2 = false,
            anemia1 = false,
            anemia11 = false,
            stress = false;

          SelectedOptions.map((elem) => {
            if (elem.QID == 16 && elem.ID == 1) temp1 = true;
            if (elem.QID == 17 && elem.ID == 1) temp11 = true;
            if (elem.QID == 18 && elem.ID == 1) temp2 = true;
            if (elem.QID == 19 && elem.ID == 1) anemia1 = true;
            if (elem.QID == 20 && elem.ID == 1) anemia11 = true;
            if (elem.QID == 21 && elem.ID == 1) stress = true;
          });

          let text = "";

          let ovrwt =
            "In your case, your periods may be irregular because of your weight - which does have an effect on your hormone levels. Start following a regimented exercise routine to slowly reduce your weight over time, and avoid crash diets. That should help you restore your cycle! :)";
          let underwt =
            "Our system categorises you as underweight. In your case, your periods may be irregular because of your weight - which does have an effect on your hormone levels. Start following a regimented exercise routine to slowly reduce your weight over time, and avoid crash diets. That should help you restore your cycle! :)";
          let anemia1t =
            "Anemia can certainly have an impact on your flow - not having enough iron in your blood, can lead to a lot of exhaustion and also to delayed and light periods. ";
          let anemia11t =
            "Feeling tired, restless, irritable or dizzy can be signs of anemia - get yourself tested for anemia so you can start with iron supplements - Anemia can certainly have an impact on your flow - not having enough iron in your blood, can lead to a lot of exhaustion and also to delayed and light periods. ";
          let stresst =
            "Stress is supposed to have an effect on your periods because it affects your hypothallamus - the part of your brain that is responsible for many of the hormones which eventually cause your periods. You may not be getting your periods because you may be stressed out. So take a deep breath, and try to see if you can find ways to remedy the cause of your stress! We are always here for you";

          if (bmi > 24.9) text += ovrwt + "\n\n";
          if (bmi < 18.5) text += underwt + "\n\n";
          if (anemia1) text += anemia1t + "\n\n";
          if (anemia11) text += anemia11t + "\n\n";
          if (stress) text += stresst + "\n\n";
          if (text == "")
            text =
              "It looks like you may not have any of the common reasons for delayed periods. In your case, if you do not get your periods every three months, its a good idea to see a doctor as your delayed periods may be caused by non gynecological issues like throid, blood sugar etc. Take care and do check our forum to get connected to experts!";

          let result = {
            MsgId: "1000",
            Message: text,
            NextRef: -1,
            RefType: "",
            TID: 7,
          };
          try {
            res.send({
              status: 200,
              message: "success",
              data: result,
            });
            return;
          } catch (error) {
            res.send({ status: 400, message: error.message });
            return;
          }
        }

        if (
          SelectedOptions[0].QID == 43 &&
          SelectedOptions[0].ID == 2 &&
          SelectedOptions[1].QID == 44 &&
          SelectedOptions[1].ID == 1
        ) {
          let points = 0;
          SelectedOptions.map((elem) => {
            if (elem.QID == 139 && elem.ID == 1) points += 0;
            if (elem.QID == 139 && elem.ID == 2) points += 1;
            if (elem.QID == 139 && elem.ID == 3) points += 2;
            if (elem.QID == 134 && elem.ID == 2) points += 1;
            if (elem.QID == 135 && elem.ID == 1) points += 1;
            if (elem.QID == 136 && elem.ID == 1) points += 1;
            if (elem.QID == 138 && elem.ID == 1) points += 2;
          });

          if (points == 0) {
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: 50, TID },
              });
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
                return;
              } else res.send({ status: 404, message: "Data Not Found" });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
          if (points == 1) {
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: 51, TID },
              });
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
                return;
              } else res.send({ status: 404, message: "Data Not Found" });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
          if (points > 1) {
            selectedDiagnosis = 44;
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: selectedDiagnosis, TID },
              });
              if (result) {
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
                return;
              } else res.send({ status: 404, message: "Data Not Found" });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
        }

        if (SelectedOptions[0].QID == 75) {
          {
            //Previous answers array had all yes - 10 answers, 2 main questions 8 sub
            let endo = 0,
              fibroid = 0,
              polyps = 0,
              adeno = 0;
            if (answers.length == 18) {
              if (answers[0] == 1) {
                endo += 1;
                fibroid += 1;
                adeno += 1;
              }

              if (answers[1] == 1) {
                adeno += 1;
              }

              if (answers[2] == 1) {
                endo += 1;
                fibroid += 1;
              }
              if (answers[3] == 1) {
                endo += 1;
                fibroid += 1;
                polyps += 1;
                adeno += 1;
              }
              if (answers[4] == 1) {
                endo += 1;
                fibroid += 1;
              }
              if (answers[5] == 1) {
                endo += 20;
              }
              if (answers[6] == 1) {
                endo += 1;
                fibroid += 1;
                polyps += 1;
              }
              if (answers[7] == 1) {
                endo += 20;
              }
              if (answers[8] == 1) {
                fibroid += 20;
              }
              if (answers[9] == 1) {
                fibroid += 20;
              }
              if (answers[10] == 1) {
                endo += 20;
              }
              if (answers[11] == 1) {
                endo += 20;
              }
              if (answers[12] == 1) {
              }
              if (answers[13] == 1) {
                fibroid += 20;
              }
              if (answers[14] == 1) {
                polyps += 20;
              }
              if (answers[15] == 1) {
                endo += 20;
              }
              if (answers[16] == 1) {
                endo += 20;
              }
              if (answers[17] == 1) {
                polyps += 20;
              }

              console.log(endo, fibroid, polyps, adeno);
              let selectedDiagnosis,
                diagnosis = true;
              //ENDO
              if (age < 35) {
                if (answers[0] == 1) {
                  selectedDiagnosis = 1;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }

              //ENDO VS FIBROID
              else if (age >= 30 && age <= 35) {
                if (answers[0] == 1) {
                  if (endo > fibroid) {
                    selectedDiagnosis = 1;
                    diagnosis = true;
                  } else {
                    selectedDiagnosis = 2;
                    diagnosis = true;
                  }
                } else {
                  diagnosis = false;
                }
              }

              //FIBROID
              else if (age > 35 && age < 40) {
                if (answers[0] == 1) {
                  selectedDiagnosis = 2;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }

              //FIBROID VS POLYPS VS ADENO
              else if (age >= 40 && age < 45) {
                if (fibroid > polyps && fibroid > adeno && answers[0] == 1) {
                  selectedDiagnosis = 2;
                  diagnosis = true;
                } else if (
                  polyps > fibroid &&
                  polyps > adeno &&
                  (answers[3] == 1 || answers[6] == 1)
                ) {
                  selectedDiagnosis = 3;
                  diagnosis = true;
                } else if (
                  adeno > fibroid &&
                  adeno > polyps &&
                  answers[0] == 1 &&
                  answers[1] == 1
                ) {
                  selectedDiagnosis = 4;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }
              //POLYPS VS ADENO
              else {
                if (polyps > adeno && (answers[3] == 1 || answers[6] == 1)) {
                  selectedDiagnosis = 3;
                  diagnosis = true;
                } else if (
                  adeno > polyps &&
                  answers[0] == 1 &&
                  answers[1] == 1
                ) {
                  selectedDiagnosis = 4;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }

              if (diagnosis) {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: selectedDiagnosis, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: [result],
                    });
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              } else {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: 2, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
            }
          }
        }

        if (SelectedOptions[0].QID == 116) {
          {
            //Previous answers array had all yes - 10 answers, 2 main questions 8 sub
            let endo = 0,
              fibroid = 0,
              polyps = 0,
              adeno = 0;
            if (answers.length == 18) {
              if (answers[0] == 1) {
                endo += 1;
                fibroid += 1;
                adeno += 1;
              }

              if (answers[1] == 1) {
                adeno += 1;
              }

              if (answers[2] == 1) {
                endo += 1;
                fibroid += 1;
              }
              if (answers[3] == 1) {
                endo += 1;
                fibroid += 1;
                polyps += 1;
                adeno += 1;
              }
              if (answers[4] == 1) {
                endo += 1;
                fibroid += 1;
              }
              if (answers[5] == 1) {
                endo += 20;
              }
              if (answers[6] == 1) {
                endo += 1;
                fibroid += 1;
                polyps += 1;
              }
              if (answers[7] == 1) {
                endo += 20;
              }
              if (answers[8] == 1) {
                fibroid += 20;
              }
              if (answers[9] == 1) {
                fibroid += 20;
              }
              if (answers[10] == 1) {
                endo += 20;
              }
              if (answers[11] == 1) {
                endo += 20;
              }
              if (answers[12] == 1) {
              }
              if (answers[13] == 1) {
                fibroid += 20;
              }
              if (answers[14] == 1) {
                polyps += 20;
              }
              if (answers[15] == 1) {
                endo += 20;
              }
              if (answers[16] == 1) {
                endo += 20;
              }
              if (answers[17] == 1) {
                polyps += 20;
              }

              console.log(endo, fibroid, polyps, adeno);
              let selectedDiagnosis,
                diagnosis = true;
              //ENDO
              if (age < 35) {
                if (answers[0] == 1) {
                  selectedDiagnosis = 1;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }

              //ENDO VS FIBROID
              else if (age >= 30 && age <= 35) {
                if (answers[0] == 1) {
                  if (endo > fibroid) {
                    selectedDiagnosis = 1;
                    diagnosis = true;
                  } else {
                    selectedDiagnosis = 2;
                    diagnosis = true;
                  }
                } else {
                  diagnosis = false;
                }
              }

              //FIBROID
              else if (age > 35 && age < 40) {
                if (answers[0] == 1) {
                  selectedDiagnosis = 2;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }

              //FIBROID VS POLYPS VS ADENO
              else if (age >= 40 && age < 45) {
                if (fibroid > polyps && fibroid > adeno && answers[0] == 1) {
                  selectedDiagnosis = 2;
                  diagnosis = true;
                } else if (
                  polyps > fibroid &&
                  polyps > adeno &&
                  (answers[3] == 1 || answers[6] == 1)
                ) {
                  selectedDiagnosis = 3;
                  diagnosis = true;
                } else if (
                  adeno > fibroid &&
                  adeno > polyps &&
                  answers[0] == 1 &&
                  answers[1] == 1
                ) {
                  selectedDiagnosis = 4;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }
              //POLYPS VS ADENO
              else {
                if (polyps > adeno && (answers[3] == 1 || answers[6] == 1)) {
                  selectedDiagnosis = 3;
                  diagnosis = true;
                } else if (
                  adeno > polyps &&
                  answers[0] == 1 &&
                  answers[1] == 1
                ) {
                  selectedDiagnosis = 4;
                  diagnosis = true;
                } else {
                  diagnosis = false;
                }
              }

              if (diagnosis) {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: selectedDiagnosis, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: result,
                    });
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              } else {
                try {
                  let result = await Database.GetDbAccess({
                    collection: "diagnosis",
                    query: { MsgId: 2, TID },
                  });
                  if (result) {
                    if (result.RefType === "Diagnostic Result") {
                      result.RefType = "diagnosis";
                    }
                    if (result.RefType === "" && result.diagnosis2 === true) {
                      result.RefType = "Diagnostic Result";
                    }
                    res.send({
                      status: 200,
                      message: "success",
                      data: [result],
                    });
                  } else
                    res.send({
                      status: 404,
                      message: "Data Not Found",
                    });
                  return;
                } catch (error) {
                  res.send({ status: 400, message: error.message });
                }
              }
            }
          }
        }

        if (SelectedOptions[0].QID == 58) {
          const answers = SelectedOptions.filter((elem) => elem.ID == 1);

          if (answers.length < 1) {
            //57 diagnosis
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: 57, TID },
              });
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
              } else
                res.send({
                  status: 404,
                  message: "Data Not Found",
                });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          } else {
            try {
              let result = await Database.GetDbAccess({
                collection: "diagnosis",
                query: { MsgId: 58, TID },
              });
              if (result) {
                if (result.RefType === "Diagnostic Result") {
                  result.RefType = "diagnosis";
                }
                if (result.RefType === "" && result.diagnosis2 === true) {
                  result.RefType = "Diagnostic Result";
                }
                res.send({
                  status: 200,
                  message: "success",
                  data: result,
                });
              } else
                res.send({
                  status: 404,
                  message: "Data Not Found",
                });
              return;
            } catch (error) {
              res.send({ status: 400, message: error.message });
              return;
            }
          }
        }

        if(SelectedOptions[0].QID == 146){
          const answers = SelectedOptions.filter(elem => elem.ID == 1)
          let selectedDiagnosis
          if(answers.length < 1){
            if(age > 36) {
              selectedDiagnosis = 69;
            }
            else selectedDiagnosis = 71
          }

        }
        // ----------------------------------------------------------
      } else {
        try {
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   const dbo = db.db("ChatBoat");
          let result = await Database.GetDbAccess({
            collection: "diagnosis",
            query: { MsgId, TID },
          });
          // dbo
          //   .collection("diagnosis")
          //   .findOne({ MsgId, TID }, function (err, result) {
          //     if (err) throw err;
          //     console.log(result);
          //     // db.close();
          if (result) {
            if (result.RefType === "Diagnostic Result") {
              result.RefType = "diagnosis";
            }
            if (result.RefType === "" && result.diagnosis2 === true) {
              result.RefType = "Diagnostic Result";
            }
            res.send({ status: 200, message: "success", data: result });
          } else res.send({ status: 404, message: "Data Not Found" });
          // });
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      }
    }
  } catch (error) {
    res.send({ status: 400, message: error.message });
  }
}
exports.processInput = getDiagnosis;
