const axios = require("axios");
const cron = require("node-cron");
const io = require("socket.io");
// const Bot = require("node-telegram-bot-api");
const tgresolve = require("tg-resolve");
var _ = require("lodash");
var request = require("request");

// let bot;
var http = require("http");

// const token = process.env.TOKEN;
const token = "974617027:AAED_Wl1IKBFfsOH17f-dwzuuPk2QGG3qNk";
// 925199314:AAFkbcXUJLnF1S_w1GGZHcfh92ArHYxNJJE

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");

const adapter = new FileSync("db.json");
const db = low(adapter);

const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
app.use(express.json());



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const server = app.listen(PORT, function() {
  console.log(`Listening on Port ${PORT}`);
  console.log('This is a test')
});

const socketio = require("socket.io")(server);

// bot = new Bot(token, { polling: true });

users = [];
messages = [];

socketio.on("connection", client => {
  client.on("SEND_MESSAGE", function(data) {
    data["id"] = shortid.generate();
    db.get("messages")
      .push(data)
      .write();
    socketio.emit("MESSAGE", data);
    console.log(data);
  });
});

function adduser(user) {
  var existingUser = db
    .get("users")
    .find({ id: user.id })
    .value();

  if (existingUser == undefined) {
    db.get("users")
      .push(user)
      .write();
  } else {
    db.get("users")
      .find({ id: user.id })
      .assign({ telegram: user.telegram })
      .write();
  }
}

// bot.onText(/\/start/, msg => {
//   bot.sendMessage(
//     msg.chat.id,
//     "Welcome. To continue please enter the following verification code in your Edgeryders Now account settings. You can find these settings at now.edgeryders.eu/settings/telegram"
//   );

//   var code = Math.floor(1000 + Math.random() * 9000);

//   var obj = {
//     id: msg.from.id,
//     telegram: {
//       from: msg.from,
//       verification: code,
//       verified: false
//     }
//   };
//   adduser(obj);

//   bot.sendMessage(msg.chat.id, code);

//   console.log(msg);
// });

// bot.onText(/\/boards/, msg => {
//   bot.sendMessage(
//     msg.chat.id,
//     "Welcome. Please choose one of the following options. You can always change command by typing forward slash (/) followed by the available command."
//   );
// });

const states = {};
var isQuestion = null;

var opts = {
  reply_markup: JSON.stringify({
    force_reply: true
  })
};

var opts_choice = {
  reply_markup: JSON.stringify({
    force_reply: true,
    keyboard: [["Answer 1", "Answer 2", "Answer 3"]]
  })
};

// bot.onText(/\/questions/, msg => {
//   states[msg.chat.id] = 0;

//   var obj = {
//     status: 0,
//     questions: []
//   };

//   states[msg.chat.id] = obj;

//   console.log(states);

//   bot.sendMessage(
//     msg.chat.id,
//     "Please complete the following questionnaire for the workshop."
//   );

//   let current = states[msg.chat.id];

//   setTimeout(function() {
//     var questionNumber = "Question 1/4";
//     var questionEntry = "Here is the first question.";

//     bot.sendMessage(msg.chat.id, questionNumber + ": " + questionEntry, opts);

//     current.status = 1;

//     var obj = {
//       question: questionEntry,
//       answer: ""
//     };

//     current.questions.push(obj);

//     console.log(states[msg.chat.id].status);
//   }, 500);
// });

// bot.on("message", data => {
//   if (states[data.chat.id]) {
//     let current = states[data.chat.id];

//     if (states[data.chat.id].status == 1) {
//       console.log(states[data.chat.id]);

//       current.questions[0].answer = data.text;

//       var questionNumber = "Question 2/4";
//       var questionEntry = "Here is question 2.";

//       bot.sendMessage(
//         data.chat.id,
//         questionNumber + ": " + questionEntry,
//         opts
//       );

//       var obj = {
//         question: questionEntry,
//         answer: ""
//       };

//       current.questions.push(obj);

//       setTimeout(function() {
//         current.status = 2;

//         console.log(current);
//       }, 500);
//     }

//     if (states[data.chat.id].status == 2) {
//       console.log(states);

//       current.questions[1].answer = data.text;

//       var questionNumber = "Question 3/4";
//       var questionEntry = "Here is a multiple choice question.";

//       bot.sendMessage(
//         data.chat.id,
//         questionNumber + ": " + questionEntry,
//         opts_choice
//       );

//       var obj = {
//         question: questionEntry,
//         answer: ""
//       };

//       current.questions.push(obj);

//       setTimeout(function() {
//         current.status = 3;
//         console.log(current);
//       }, 500);
//     }

//     if (states[data.chat.id].status == 3) {
//       console.log(states);

//       current.questions[2].answer = data.text;

//       var questionNumber = "Question 4/4";
//       var questionEntry = "Here is another question.";

//       bot.sendMessage(
//         data.chat.id,
//         questionNumber + ": " + questionEntry,
//         opts
//       );

//       var obj = {
//         question: questionEntry,
//         answer: ""
//       };

//       current.questions.push(obj);

//       setTimeout(function() {
//         current.status = 4;
//         console.log(current);
//       }, 500);
//     }

//     if (states[data.chat.id].status == 4) {
//       current.questions[3].answer = data.text;

//       bot.sendMessage(
//         data.chat.id,
//         "That's it, thanks for answering! Find your answers and others on now.edgeryders.eu"
//       );

//       let entry = {
//         from: {
//           name: data.from.first_name,
//           id: data.from.id
//         },
//         type: "questionnaire",
//         date: data.date,
//         questions: current.questions
//       };

//       console.log(entry);

//       db.get("messages")
//         .push(entry)
//         .write();

//       socketio.emit("chat-message", entry);

//       setTimeout(function() {
//         delete states[data.chat.id];

//         console.log("no states");
//       }, 2000);
//     }
//   }

//   setTimeout(function() {
//     if (states[data.chat.id] == undefined) {
//       console.log("Not Question");

//       let entry = {
//         from: {
//           name: data.from.first_name,
//           id: data.from.id
//         },
//         date: data.date
//       };

//       var existingUser = db
//         .get("users")
//         .find({ id: data.from.id })
//         .value();

//       if (existingUser == undefined) {
//         bot.sendMessage(
//           data.chat.id,
//           "\u00AF\\_(\u30C4)_/\u00AF It looks like you're not registered! In order to post to this board you need to sign up for an Edgeryders account and link it to Telegram. Find out more at https://now.edgeryders.eu"
//         );
//       }

//       if (data.caption) {
//         entry["text"] = data.caption;
//       }

//       if (data.text) {
//         entry["text"] = data.text;
//         entry["type"] = "text";
//         socketio.emit("chat-message", entry);

//         db.get("messages")
//           .push(entry)
//           .write();
//       }

//       if (data.photo) {
//         const fileId = data.photo[0].file_id;
//         bot.getFileLink(fileId).then(function(resp) {
//           entry["url"] = resp;
//           entry["type"] = "photo";
//           console.log(entry);
//           socketio.emit("chat-message", entry);

//           db.get("messages")
//             .push(entry)
//             .write();
//         });
//       }

//       if (data.video) {
//         const fileId = data.video.file_id;
//         bot.getFileLink(fileId).then(function(resp) {
//           entry["url"] = resp;
//           entry["type"] = "video";
//           console.log(entry);
//           socketio.emit("chat-message", entry);

//           db.get("messages")
//             .push(entry)
//             .write();
//         });
//       }
//     }
//   }, 500);

  //  function getAvatar(id) {
  //    bot.getUserProfilePhotos(id).then(function(resp){
  //      if (resp.photos[0][0].file_id){
  //        let avatarId = resp.photos[0][0].file_id;
  //        bot.getFileLink(avatarId).then(function(result){
  //          const obj = {
  //            userId: id,
  //            avatar: result
  //          }
  //          socketio.emit('new-user', (obj));

  // db.get('users')
  //    .push(entry)
  //    .write()

  //          console.log(users)
  //        })
  //      }
  //    })
  //  }
// });

app.get("/messages", function(req, res) {
  if (req.query.id == undefined) {
    res.send(db.get("messages"));
  } else {
    var channel = db
      .get("messages")
      .filter({ channel: req.query.id })
      .value();
    res.send(channel);
  }
});

app.get("/room", function(req, res) {

    let roomId = req.query.id;

    var exists = db
      .get("channels")
      .some({ id: roomId })
      .value();
    if (exists) {
      var room = db
        .get("channels")
        .filter({ id: roomId })
        .value();
      res.send(room);
    } else {

var obj = {
  "name": roomId
}
var string = JSON.stringify(obj);

var options = {
  method: 'POST',
  url: 'https://api.daily.co/v1/rooms',
  headers: {
    'content-type': 'application/json',
    authorization: 'Bearer 0b38a287e9a33b53809a50c9db0b2a7a56664a6e9361f5a74802148f2a125bce'
  },
  body: string
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
  var bodyObj = JSON.parse(body);

  var roomObj = {
        "id": roomId,
        "name": roomId,
        "call_url": bodyObj.url,
        "theme": {
          "color": null,
          "icon": ""
        },
        "created": bodyObj.created_at,
        "access": true,
        "active": true
      };

       db.get("channels")
        .push(roomObj)
        .write();

      res.send(roomObj);
        console.log(roomObj);

});

    }

});

app.get("/channels", function(req, res) {
  res.send(db.get("channels"));
});

app.get("/groups", function(req, res) {
  res.send(db.get("groups"));
});

app.get("/users", function(req, res) {
  if (req.query.id == undefined) {
    res.send(db.get("users"));
  } else {
    let userId = Number(req.query.id);
    var exists = db
      .get("users")
      .some({ id: userId })
      .value();
    if (exists) {
      var user = db
        .get("users")
        .filter({ id: userId })
        .value();
      res.send(user);
    } else {
      return res.status(400).json({
        status: "error",
        message: "There is no user with that id."
      });
    }
  }
});

var allUsers = null;

async function getActiveUsers(n) {
  const calls = [...Array(n + 1).keys()].map(x =>
    axios
      .get(
        `https://edgeryders.eu/directory_items.json?order=days_visited&page=${x}&period=all`
      )
      .then(response => {
        return response.data.directory_items;
      })
  );

  // This will ensure that all api calls happen parallely
  result = await Promise.all(calls);

  var array = [].concat(...result);

  function getAvatar(template, size) {
    var avatar = "https://edgeryders.eu" + template.replace("{size}", size);
    return avatar;
  }

  const users = array.map(obj => ({
    id: obj.user.id,
    username: obj.user.username,
    avatar: getAvatar(obj.user.avatar_template, 100)
  }));

  allUsers = users;
}

getActiveUsers(20);

app.get("/users/edgeryders", function(req, res) {
  res.send(allUsers);
});

app.post("/users", function(req, res) {
  if (req.query.id == undefined) {
    return res.status(400).json({
      status: "error",
      message: "Invalid id."
    });
  } else {
    let userId = Number(req.query.id);
    var exists = db
      .get("users")
      .some({ id: userId })
      .value();
    if (exists) {
      return res.status(400).json({
        status: "error",
        message: "User already exists."
      });
    } else {
      var obj = req.body;
      obj["created"] = Date.now();

      db.get("users")
        .push(obj)
        .write();
      console.log(obj);

      res.send(obj);
    }
  }
});

app.post("/channels", function(req, res) {
  if (req.query.delete !== undefined) {
    db.get("channels")
      .remove({ id: req.query.id })
      .remove(_.isEmpty)
      .write();

    res.send(db.get("channels").value);
  } else {
    const channel = req.body;

    if (channel.id) {
      var exists = db
        .get("channels")
        .some({ id: channel.id })
        .value();
      if (exists) {
        db.get("channels")
          .find({ id: channel.id })
          .assign(channel)
          .write();
        res.send(
          db
            .get("channels")
            .find({ id: channel.id })
            .value()
        );
      } else {
        return res.status(400).json({
          status: "error",
          message: "Channel with this id could not be found. Please try again"
        });
      }
    } else {
      channel["id"] = shortid.generate();

      db.get("channels")
        .push(channel)
        .write();

      res.send(channel);
    }
  }
});

app.post("/groups", function(req, res) {
  if (req.query.delete !== undefined) {
    db.get("groups")
      .remove({ id: req.query.id })
      .remove(_.isEmpty)
      .write();

    res.send(db.get("groups").value);
  } else if (req.query.id !== undefined) {
    obj = {
      id: req.body.id,
      name: req.body.name,
      members: req.body.members
    };

    db.get("groups")
      .find({ id: req.query.id })
      .assign(obj)
      .write();

    res.send(obj);
  } else {
    const group = req.body;

    group["id"] = shortid.generate();

    db.get("groups")
      .push(group)
      .write();

    res.send(group);
  }
});

app.post("/bookmark", function(req, res) {
  if (req.query.id == undefined) {
    return res.status(400).json({
      status: "error",
      message: "There is no user with that id."
    });
  } else {
    const userId = Number(req.query.id);
    const channelId = req.body.id;

    var user = db
      .get("users")
      .filter({ id: userId })
      .value();

    var userBookmarks = user[0].bookmarks;

    if (userBookmarks.includes(channelId)) {
      userBookmarks.splice(userBookmarks.indexOf(channelId), 1);
      db.get("users")
        .find({ id: userId })
        .assign({ bookmarks: userBookmarks })
        .write();
      res.send(userBookmarks);
    } else {
      userBookmarks.push(channelId);
      db.get("users")
        .find({ id: userId })
        .assign({ bookmarks: userBookmarks })
        .write();
      res.send(userBookmarks);
    }
  }
});

app.post("/notifications", function(req, res) {
  if (req.query.id == undefined) {
    return res.status(400).json({
      status: "error",
      message: "There is no user with that id."
    });
  } else {
    const userId = Number(req.query.id);
    const channelId = req.body.id;

    var user = db
      .get("users")
      .filter({ id: userId })
      .value();

    var userNotifications = user[0].notifications;

    if (userNotifications.includes(channelId)) {
      userNotifications.splice(userNotifications.indexOf(channelId), 1);
    } else {
      userNotifications.push(channelId);
    }

    db.get("users")
      .find({ id: userId })
      .assign({ notifications: userNotifications })
      .write();
    res.send(userNotifications);
  }
});

app.post("/like", function(req, res) {
  if (req.query.id == undefined) {
    return res.status(400).json({
      status: "error",
      message: "There is no user with that id."
    });
  } else {
    const userId = Number(req.query.id);
    const messageId = req.body.id;

    console.log(userId);

    var user = db
      .get("users")
      .filter({ id: userId })
      .value();

    console.log(user[0].favourites);

    if (user[0].favourites == undefined) {
      var array = [];
      array.push(messageId);

      obj = {
        favourites: array
      };

      db.get("users")
        .find({ id: userId })
        .assign(obj)
        .write();
      res.send(array);
    } else {
      var userFavourites = user[0].favourites;

      if (userFavourites.includes(messageId)) {
        userFavourites.splice(userFavourites.indexOf(messageId), 1);
        db.get("users")
          .find({ id: userId })
          .assign({ favourites: userFavourites })
          .write();
        res.send(userFavourites);
      } else {
        userFavourites.push(messageId);
        db.get("users")
          .find({ id: userId })
          .assign({ favourites: userFavourites })
          .write();
        res.send(userFavourites);
      }

      console.log(user.favourites);
    }
  }
});
app.post("/members/verify", function(req, res) {
  const user = req.body;

  var existingUser = db
    .get("users")
    .filter({ id: user.id })
    .value();

  var telegramUser = db
    .get("users")
    .filter({ telegram: { verification: user.telegram.verification } })
    .value();

  if (telegramUser.length == 0) {
    return res.status(400).json({
      status: "error",
      message: "Your code could not be validated, please try again."
    });
  } else {
    console.log(user);
    console.log(existingUser);

    if (
      existingUser.length !== 0 &&
      (existingUser[0].telegram.verified || existingUser[0].telegram.length)
    ) {
      var telegram = existingUser[0].telegram;
      var array = [];

      array.push(telegram);

      var obj = {
        id: telegramUser[0].id,
        verified: true
      };

      array.push(obj);

      db.get("users")
        .find({ id: existingUser[0].id })
        .assign({ telegram: array })
        .write();

      db.get("users")
        .remove(
          filteruser =>
            filteruser.telegram.verification == user.telegram.verification
        )
        .write();

      socketio.emit("verified-user", user.id);
    } else {
      db.get("users")
        .find({ id: telegramUser[0].id })
        .assign({
          id: user.id,
          avatar: user.avatar,
          email: user.email,
          username: user.username,
          telegram: { id: telegramUser[0].id, verified: true }
        })
        .write();

      socketio.emit("verified-user", user.id);
    }
  }
});
