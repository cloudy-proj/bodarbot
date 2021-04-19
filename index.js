// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;
//   var user_profile = bot.getUserProfilePhotos(msg.from.id);
//   user_profile.then(function (res) {
      
//   });
// });
// EXPORTS

const db = require("./test");
db.start();
// let a = db.findOneByID("251196883");

// a.then(function (result) {
//   console.log("Promise: ")
//   console.log(result);
// })

const { addMethods } = require('telebot');
const TeleBot = require('telebot');

// getUserByID(id), updateData(user), findAllMatched(user)

const bot = new TeleBot("1761355313:AAG-bKTHdZOwe5Vj54xTLbMdy5BWrcUYNg4");

// const myModule = require('./m');
// let val = myModule.ass1; // val is "Hello"   

// var getUserByID = (id) => {
//   let i = users.findIndex((element, j) => {
//     return users[j]["id"] == id
//   });
//    return  users[i];
// }


// [${msg.from.first_name}](tg://user?id=${msg.from.id})


// `
// {
//     id: 251196883,
//     is_bot: false,
//     first_name: '🅰️🅱️🅾️🅱️🅰️',
//     username: 'zeqaf',
//     language_code: 'uk'
// }
// `

let started = {

};

// TEXT

const mainMenuText = "ГОЛОВНЕ МЕНЮ\n1. Розпочати пошук🔎\n2. Моя анкета📝";

bot.on("*", (msg) => {
  if (started[`${msg.from.id}`] == undefined && (msg.text.charAt(0) != "/" )) {
    started[`${msg.from.id}`] = "";
    console.log("a");
    setTimeout(() => {
      mainMenu(msg);
    }, 500);
    
  }
  else {}
});

bot.on("/start", (msg) => {
  console.log("bb");
  if (started[`${msg.from.id}`] == undefined) {
    started[`${msg.from.id}`] = "";
    
    bot.sendMessage(msg.from.id, `Привіт, ${msg.from.first_name}!\nЯ BodArBot і я допоможу тобі знайти другу половинку! Натискай кнопку і погнали!`, {
      replyMarkup: {
      keyboard: [
       [
         {
           text: 'Зареєструватись!', // текст на кнопке
         }
       ]
     ],
     resize_keyboard: true,
     one_time_keyboard: true
      }   
    });
  }
  else {
    setTimeout(() => {
      mainMenu(msg);
    }, 1000);
  }
     
}); 



//  KEYBOARDS

let inSearch = (msgOld) => {
  bot.sendMessage(msgOld.from.id, `не тикай поки сюди`, {
    replyMarkup: {
      keyboard: [ ["Перейти в головне меню"] ],
      resize_keyboard: true,
      one_time_keyboard: true
    } 
  });
  // setTimeout(() => {
    
  // }, 500);
};

let myProfile = (msgOld) => {
  let inMyProfile = true;
  let userId = msgOld.from.id;
  let userPromise = db.getUserByID("" + userId);
  
  userPromise.then((res) => { 
    user = res;
    bot.sendPhoto(userId, "" + user.photo, {
      caption: `Ім'я: [${user["name"]}](tg://user?id=${userId})\n\nВік: ${user["age"]} \n\nОпис: ${user["description"]}\n\nСтать: ${user["gender"] == "male"? "чоловіча":"жіноча"}\n\nШукаю: ${user["looking_for"] == "male"? "хлопця" :  user["looking_for"] == "both"? "без різниці" : "дівчину"}`,
      parseMode: "Markdown",
      replyMarkup: {
        keyboard: [ ["Перейти в головне меню", "Редагувати анкету"] ],
        resize_keyboard: true,
        one_time_keyboard: true
      } 
    });
  });
}
              

let mainMenu = (msgOld) => {
  
  let inMenu = true;
  let userId = msgOld.from.id;
  bot.sendMessage(userId, mainMenuText, {
    replyMarkup: {
      keyboard: [ ["1", "2"] ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
  bot.on("*", (msg) => {
    if (msg.from.id == userId && inMenu && msg.text != "Перейти в головне меню") {
      if (msg.text == "1") {
        inMenu = false;
        inSearch(msg);
      }
      else if(msg.text == "2") {
        inMenu = false;
        myProfile(msg);
      }
      else {
        if (msg.text.charAt(0) != "/") {
          bot.sendMessage(msg.from.id, "Вибери, будь ласка, один із варіантів.");
          setTimeout(() => {
          bot.sendMessage(msg.from.id, mainMenuText, {
            replyMarkup: {
              keyboard: [ ["1", "2"] ],
              resize_keyboard: true,
              one_time_keyboard: true
            }
          });
          }, 500);
        } else inMenu = false;
      }
        
    }
  })
};

bot.on([/Перейти в головне меню/], (msg) => {
  mainMenu(msg);
});

bot.on(/Зареєструватись!/, (msg)=> {
  let userId = msg.from.id;
  const newUser = db.getUserByID("" + userId);
  newUser.then((res) => {
    // console.log(res);
    if (res == null) {
      if (msg.from.username == undefined) {
        bot.sendMessage(userId, "Вибач, але щоб зареєструватись в тебе має бути псевдонім, але його немає 😔\n[Ось інструкція як його створити](https://youtu.be/RtxySv4ANDU?t=23)", {
          parseMode: "Markdown",
          replyMarkup: {
            keyboard: [
              ["Все, псевдонім створив!"]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
          }
        });
      }
      else {
        registration(msg);
      }
    }
    else {
      bot.sendMessage(userId, "Ой! Схоже ти вже зареєстрований, ось твоя анкета:");
      setTimeout(() => {
        myProfile(msg);
      }, 500);
    }
  });
  
  
  
});

bot.on([/Все, псевдонім створив!/, /Все, тепер точно!/], (msg) => {
  let userId = msg.from.id;
  if (msg.from.username == undefined) {
    bot.sendMessage(userId, "Його все ще немає...", {
      parseMode: "Markdown",
      replyMarkup: {
        keyboard: [
          ["Все, тепер точно!"]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    })
  }
  else {
    registration(msg);
  }
});


let registration = (msgOld) => {

  let step = 1;
  let userId = msgOld.from.id;
  let user = {
    "id": "" + msgOld.from.id,
    "active": true,
    // 0: notStarted | 1: main menu | 2: my info | 3: search | 4: registration
    "name": "",
    "login": msgOld.from.username,
    "age": 0,
    "gender": "",
    "looking_for": "",
    "description": "",
    "photo": "",
    "history": {    }
  }

  bot.sendMessage(userId, `Чудово! Давай розпочнемо реєстрацію. Твоє ім'я?`, {
    replyMarkup: {
      keyboard: [
        [
        { text: msgOld.from.first_name }
        ]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });

  bot.on("*", (msg) => {
    if (msg.from.id == userId && step < 8 && msg.text != /\/*/) {
      if (msg.text != undefined || step == 4 || step == 3) {

        switch (step){
          // case 0:
          //   bot.sendMessage(msg.from.id, `Чудово! Давай розпочнемо реєстрацію. Твоє ім'я?`, {
          //     replyMarkup: {
          //       keyboard: [
          //         [
          //         { text: msg.from.first_name }
          //         ]
          //       ],
          //       resize_keyboard: true,
          //       one_time_keyboard: true
          //     }
          //   });
          //   step++;
          //   break;
          case 1:
            user["name"] = msg.text;
            bot.sendMessage(msg.from.id, `Ага, далі. Твій вік?`, {
              replyMarkup: {
                remove_keyboard: true
              }
            });
            step++;
            break;
          case 2:
            if (parseInt(msg.text) < 1 || parseInt(msg.text) > 120 || parseInt(msg.text) == NaN) {
              bot.sendMessage(msg.from.id, "Некоректний вік, спробуй по іншому!")
            }
            else {
              user["age"] = parseInt(msg.text);
              bot.sendMessage(msg.from.id, `Так, записав... ${user["name"]}, ${user["age"]}. Тепер розкажи мені щось про себе.`, {
                replyMarkup: {
                  keyboard: [
                    [
                    { text: "Залишити поле пустим" }
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
              step++;
            }
            break;
          case 3:
            if (!msg.text) {
              bot.sendMessage(msg.from.id, `Напиши щось про себе, будь ласка, або натисни на кнопку.`);
            }
            else if (msg.text == "Залишити поле пустим") {
              user["description"] = "";
              bot.sendMessage(msg.from.id, `Окей, йдем далі. Тепер відправ мені своє фото`, {
                replyMarkup: {
                  keyboard: [
                    [
                      { text: "Використати фото з аватарки" }
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
              step++;
            }
            else {
              user["description"] = msg.text;
              bot.sendMessage(msg.from.id, `Тепер відправ мені своє фото`, {
                replyMarkup: {
                  keyboard: [
                    [
                      { text: "Використати фото з аватарки" }
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
              step++;
            }
            break;
          case 4:
            if (msg["photo"] != undefined) {
              user["photo"] = msg["photo"][0]["file_id"];
              step++;
              bot.sendMessage(msg.from.id, "Фото отримав, тепер вкажи свою стать", {
                replyMarkup: {
                  keyboard:  [
                    ["Я чоловік","Я дівчина"]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
            }
            else if (msg["text"] == "Використати фото з аватарки") {
              var user_profile = bot.getUserProfilePhotos(msg.from.id);
              user_profile.then(function (res) {
                if (res["total_count"] == 0) {
                  bot.sendMessage(msg.from.id, `Ой, схоже аватарки в тебе немає... Відправ мені, будь ласка, своє фото`, {
                    replyMarkup: {
                      remove_keyboard: true
                    }
                  });
                }
                else {
                  var file_id = res.photos[0][0].file_id;
                  user["photo"] = file_id;
                  bot.sendMessage(msg.from.id, "Тепер вкажи свою стать", {
                    replyMarkup: {
                      keyboard:  [
                        ["Я чоловік","Я дівчина"]
                      ],
                      resize_keyboard: true,
                      one_time_keyboard: true
                    }
                  });
                  
                  step++;
                }
               
              });
            }
            else {
              bot.sendMessage(msg.from.id, "Відправ мені, будь ласка, своє фото або натисни на кнопку, щоб я використав фото твого профілю в телеграм 🥺") ;
            }
            break;
          case 5:
            if (msg.text == "Я чоловік") {
              user["gender"] = "male";
              step++;
              bot.sendMessage(msg.from.id, "Кого шукаєш?", {
                replyMarkup: {
                  keyboard: [
                    [
                      { text: "Чоловіків" }, { text: "Дівчат" }, { text: "Без різниці" }
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
            }
            else if (msg.text == "Я дівчина") {
              user["gender"] = "female";
              step++;
              bot.sendMessage(msg.from.id, "Кого шукаєш?", {
                replyMarkup: {
                  keyboard: [
                    [
                      { text: "Чоловіків" }, { text: "Дівчат" }, { text: "Без різниці" }
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
            }
            else {
              bot.sendMessage(msg.from.id, "Натисни одну з кнопок, будь ласка");
            }
            break;
          case 6:
            if (msg.text == "Чоловіків" || msg.text == "Дівчат" || msg.text == "Без різниці") {
              if (msg.text == "Чоловіків") user["looking_for"] = "male";              
              else if(msg.text == "Дівчат") user["looking_for"] = "female";              
              else if (msg.text == "Без різниці") user["looking_for"] = "both";
              bot.sendMessage(msg.from.id, "Все, реєстрацію закінчено. Тепер можеш перейти в головне меню. Доречі, ось твоя анкета:");
              setTimeout(() => {
                // console.log(user.photo);
                bot.sendPhoto(msg.from.id, user.photo, {
                  caption: `[${user.name}](tg://user?id=${msg.from.id})  -  ${user.age} \n\n${user.description}`,
                  parseMode: "Markdown",
                  replyMarkup: {
                    keyboard: [ ["Перейти в головне меню"] ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                  }
                });
              }, 1000);
              db.updateData(user);
              step++;
            }
            else {
              bot.sendMessage(msg.from.id, "Вибери, будь ласка, кого ти шукаєш", {
                replyMarkup: {
                  keyboard: [
                    [
                      { text: "Чоловіків" }, { text: "Дівчат" }, { text: "Без різниці" }
                    ]
                  ],
                  resize_keyboard: true,
                  one_time_keyboard: true
                }
              });
            }
            break;
          // case 7:
          //   mainMenu(msg);
          //   step++;
          //   break;
        }
      }
      else {
        bot.sendMessage(msg.from.id, "Не дуже розумію про що ти 😔")
      }
    }
});

}




bot.on(/show*/, (msg) => {
  // bot.getUserProfilePhotos(msg.from.id).then(result => console.log(result['photos'][0][0]['file_id']));
});


bot.start();

var users= [
    // { 
    //   "id": "",
    //   "active": true,
    //    // 0: notStarted | 1: main menu | 2: my info | 3: search | 4: registration
    //   "name": "",
    //   "login": "",
    //   "age": 0,
    //   "gender": "",
    //   "looking_for": "",
    //   "description": "",
    //   "photo": "",
    //   "history": {
    //       "id1": true,
    //       "id2": false
    //   }
    // }
];

