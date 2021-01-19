var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb+srv://harshil:harshil@123@cluster0.stbbj.mongodb.net/?retryWrites=true&w=majority";
var url =
  "mongodb+srv://pinkypromisedev:pinkypromise123@@pinkypromise-dev.1yain.mongodb.net";

async function getQuestion(req, res) {
  try {
    let { QID, TID, SelectedOptions } = req.body;
    QID = parseInt(QID)
    TID = parseInt(TID)
    console.log(QID, typeof QID, TID, typeof TID, QID == "1", TID == "3");
    if (SelectedOptions && SelectedOptions.length > 1) {
      console.log(SelectedOptions[0].QID == 18, SelectedOptions[0].QID == 19);
      let selectedQId;
      if (SelectedOptions[0].QID == 18 && SelectedOptions[1].QID == 19) {
        console.log(
          SelectedOptions[0].ID,
          typeof SelectedOptions[0].ID,
          SelectedOptions[0].ID == 2
        );
        if (SelectedOptions[0].ID == 2 && SelectedOptions[1].ID == 2) {
          console.log("1");
          selectedQId = 1;
        } else if (SelectedOptions[0].ID == 1 && SelectedOptions[1].ID == 2) {
          console.log("13");
          selectedQId = 13;
        } else {
          console.log("15");
          selectedQId = 15;
        }
        try {
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
                if (result)
                  res.send({ status: 200, message: "success", data: result });
                else res.send({ status: 404, message: "Data Not Found" });
                return;
              });
          });
        } catch (error) {
          res.send({ status: 400, message: error.message });
        }
      }
      return;
    } else {
      try {
        MongoClient.connect(url, function (err, db) {
          if (err) throw err;
          const dbo = db.db("ChatBoat");
          dbo
            .collection("questions")
            .findOne({ QID, TID }, function (err, result) {
              if (err) throw err;
              console.log(result);
              db.close();
              return res.send({
                status: 200,
                message: "success",
                data: result,
              });
            });
        });
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
