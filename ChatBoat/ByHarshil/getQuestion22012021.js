var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb+srv://harshil:harshil@123@cluster0.stbbj.mongodb.net/?retryWrites=true&w=majority";
var URL ="mongodb+srv://pinkypromisedev:pinkypromise123@@pinkypromise-dev.1yain.mongodb.net";
var Database = require("../Database/dbaccess");

async function getQuestion(req, res) {
  try {
    let { QID, TID, SelectedOptions } = req.body;
    QID = parseInt(QID)
    TID = parseInt(TID)
    // console.log(QID, typeof QID, TID, typeof TID, QID == "1", TID == "3");
    if (TID== 3 && SelectedOptions && SelectedOptions.length == 2) {
      // console.log(SelectedOptions[0].QID == 18, SelectedOptions[0].QID == 19);
      let selectedQId;
      if (SelectedOptions[0].QID == 18 && SelectedOptions[1].QID == 19) {
        // console.log(
        //   SelectedOptions[0].ID,
        //   typeof SelectedOptions[0].ID,
        //   SelectedOptions[0].ID == 2
        // );
        if (SelectedOptions[0].ID == 2 && SelectedOptions[1].ID == 2) {
          // console.log("1");
          selectedQId = 1;
        } else if (SelectedOptions[0].ID == 1 && SelectedOptions[1].ID == 2) {
          // console.log("13");
          selectedQId = 13;
        } else {
          // console.log("15");
          selectedQId = 15;
        }
        try {
          let result = await Database.GetDbAccess({"collection":"questions", query: { QID: selectedQId, TID:TID }});
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   console.log("QUERY", selectedQId, TID);
          //   const dbo = db.db("ChatBoat");
          //   dbo
          //     .collection("questions")
          //     .findOne({ QID: selectedQId, TID }, function (err, result) {
          //       if (err) throw err;
          //       console.log(result);
          //       db.close();
                if (result)
                  res.send({ status: 200, message: "success", data: result });
                else res.send({ status: 404, message: "Data Not Found" });
                return;
          //     });
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      }
      else {
        try {
          let result = await Database.GetDbAccess({"collection":"questions", query: { QID:QID, TID:TID }});
          // MongoClient.connect(url, function (err, db) {
          //   if (err) throw err;
          //   const dbo = db.db("ChatBoat");
          //   dbo
          //     .collection("questions")
          //     .findOne({ QID, TID }, function (err, result) {
          //       if (err) throw err;
          //       console.log(result);
          //       db.close();
          if (result)
            res.send({ status: 200, message: "success", data: result });
          else res.send({ status: 404, message: "Data Not Found" });
          //     });
          // });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      }
      return;
    } else {
      try {
        let result = await Database.GetDbAccess({"collection":"questions", query: { QID:QID, TID:TID }});
        // MongoClient.connect(url, function (err, db) {
        //   if (err) throw err;
        //   const dbo = db.db("ChatBoat");
        //   dbo
        //     .collection("questions")
        //     .findOne({ QID, TID }, function (err, result) {
        //       if (err) throw err;
        //       console.log(result);
        //       db.close();
        if (result)
          res.send({ status: 200, message: "success", data: result });
        else res.send({ status: 404, message: "Data Not Found" });
        //     });
        // });
      } catch (error) {
        res.send({ status: 400, message: error.message });
      }
      return;
    }
  } catch (error) {
    res.send({ status: 400, message: error.message });
  }
}
exports.processInput = getQuestion;
