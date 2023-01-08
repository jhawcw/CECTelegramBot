var token = ""; // removed due to security reasons
const botname = "CEC_PLT1_bot" // bot username = @CEC_PLT1_bot
var telegramUrl = "https://api.telegram.org/bot" + token;
var webAppUrl = ""; removed due to security reasons

let namelist = undefined

var timezone = "Asia/Singapore"
//timezone = "GMT+8" + new Date().getTimezoneOffset()/60
var date = Utilities.formatDate(new Date(), timezone, "dd-MM-yyyy HH:mm"); // "yyyy-MM-dd'T'HH:mm:ss'Z'"

var userIDDirectory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange("E2:E").getValues();

var userNameDirectory = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange("D2:D").getValues();

var theta = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Log");

const sheetName1 = "Parade State"
const sheetName2 = "Reminder"
const sheetName3 = "Welfare Bal."
const groupChatId = '' // CEC PLT 1 GROUP CHAT removed due to security reasons
const groupChatIDCDS = "" // CEC CDS GROUP CHAT removed due to security reasons

function sendParadeState() {
  var today = new Date().getDay();
  if (today == 1 || today == 2 || today == 3 || today == 4 || today == 5) {
    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName1);
    const lastRow = dataSheet.getLastRow();
    const lines = removeConsecutiveEmptys(dataSheet.getRange(`A1:A${lastRow}`).getDisplayValues().map(x => x[0]));
    const message = encodeURIComponent(lines.join('\n'));
    UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${groupChatId}&text=${message}`)
  }
}

function sendReminder() {
  var today = new Date().getDay();
  if (today == 1 || today == 2 || today == 3 || today == 4 || today == 0) {
    const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName2);
    const lastRow = dataSheet.getLastRow();
    const lines = removeConsecutiveEmptys(dataSheet.getRange(`A1:A${lastRow}`).getDisplayValues().map(x => x[0]));
    const message = encodeURIComponent(lines.join('\n'));
    UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${groupChatId}&text=${message}`)
  }
}

function sendWelfareBalance() {
  const dataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName3);
  const lastRow = dataSheet.getLastRow();
  const lines = removeConsecutiveEmptys(dataSheet.getRange(`A1:A${lastRow}`).getDisplayValues().map(x => x[0]));
  const message = encodeURIComponent(lines.join('\n'));
  UrlFetchApp.fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${groupChatId}&text=${message}`)
}

function removeConsecutiveEmptys(arr) {
  const newArr = []
  let prev = '';
  for(let i=0;i<arr.length;i++) {
    const line = arr[i]
    if(prev === '' && line === '') continue;
    newArr.push(line)
    prev = line;
  }
  return newArr;
}

function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
}

// function setWebhook2() {
//   var url = telegramUrl2 + "/setWebhook?url=" + webAppUrl;
//   var response = UrlFetchApp.fetch(url);
// }

function sendMessage(id, text) {
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
}


function sendText(chatId, text, keyBoard) {
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function getUsers(){
  namelist=SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange("D2:D").getValues()
}

getUsers()

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var id = contents.message.from.id;

  var today = new Date();
  var year = today.getFullYear();
  var nextYear = year + 1;
  var dateString = String(year);
  var newDateString = String(nextYear);


  var command = new RegExp("-remarks")
  var leaveCommand = new RegExp("-leave")
  var offCommand = new RegExp("-off")
  var othersCommand = new RegExp("-others")
  var statusCommand = new RegExp("-status")
  var courseCommand = new RegExp("-course")

  var day = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

  var rank = ["3SG", "2SG", "1SG", "SSG", "MSG", "3WO", "2WO", "1WO", "MWO", "SWO", "CWO", "2LT", "LTA", "CPT", "MAJ", "LTC", "COL", "ME1", "ME2", "ME3", "ME4", "ME5", "ME6", "ME7", "REC", "PTE", "LCP", "CPL", "CFC","DXO"]; // SLTC is not included because upon looking up for LTC , string SLTC can also be recognised as a exsisting rank.

  var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  var year = ["2021","2022","2023","2024","2025","2026","2027","2028","2029","2030","2031","2032"];

  var amOrPm = ["Am","Pm"];

  var dayEnd = ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12.", "13.", "14.", "15.", "16.", "17.", "18.", "19.", "20.", "21.", "22.", "23.", "24.", "25.", "26.", "27.", "28.", "29.", "30.", "31."];
  var monthEnd = ["January.","February.","March.","April.","May.","June.","July.","August.","September.","October.","November.","December."];
  var yearEnd = ["2021.","2022.","2023.","2024.","2025.","2026.","2027.","2028.","2029.","2030.","2031.","2032."];
  var amOrPmEnd = ["Am.","Pm."];

  var keyBoard = {
    "one_time_keyboard": true,
    "keyboard": [
      ["Apply Leave"],
      ["Apply Off"],
      ["Status"],
      ["Others(includes MC)"],
      ["Course"],
      ["Delete Entry"],
      ["Off Recording"],
      ["Manual Mode"],
      ["Cancel"]
    ]
  };

   var keyBoardDay = {
    "one_time_keyboard": true,
    "keyboard": [
      ["1","2","3","4","5"],
      ["6","7","8","9","10"],
      ["11","12","13","14","15"],
      ["16","17","18","19","20"],
      ["21","22","23","24","25"],
      ["26","27","28","29","30"],
      ["31","Cancel"]
    ]
  };

  var keyBoardMonth = {
    "one_time_keyboard":true,
    "keyboard": [
      ["January","February","March"],
      ["April","May","June"],
      ["July","August","September"],
      ["October","November","December"],
      ["Cancel"]
    ]
  };

  var keyBoardYear = {
    "one_time_keyboard":true,
    "keyboard": [
      [dateString,newDateString],
      ["Cancel"]
    ]
  };

  var keyBoardAmOrPm = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Am","Pm"],
      ["Cancel"]
    ]
  };
  var keyBoardDayEnd = {
    "one_time_keyboard": true,
    "keyboard": [
      ["1.","2.","3.","4.","5."],
      ["6.","7.","8.","9.","10."],
      ["11.","12.","13.","14.","15."],
      ["16.","17.","18.","19.","20."],
      ["21.","22.","23.","24.","25."],
      ["26.","27.","28.","29.","30."],
      ["31.","Cancel"]
    ]
  };
  var keyBoardMonthEnd = {
    "one_time_keyboard":true,
    "keyboard": [
      ["January.","February.","March."],
      ["April.","May.","June."],
      ["July.","August.","September."],
      ["October.","November.","December."],
      ["Cancel"]
    ]
  };
  var keyBoardYearEnd = {
    "one_time_keyboard":true,
    "keyboard": [
      [dateString + ".", newDateString + "."],
      ["Cancel"]
    ]
  };
  var keyBoardAmOrPmEnd = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Am.","Pm."],
      ["Cancel"]
    ]
  };
  var keyBoardName = {
    "one_time_keyboard":true,
    "keyboard": namelist
  };
  var keyBoardRemarks = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Yes, I would like to write remarks"],
      ["No, I do not need to write remarks"],
      ["Cancel"]
    ]
  };

  var keyBoardDeletion = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Delete leave entry"],
      ["Delete off entry"],
      ["Delete status(MC included) entry"],
      ["Delete others entry"],
      ["Delete course entry"],
      ["Cancel"]
    ]
  };

  var keyBoardLeaveDeletion = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Yes, delete that leave entry"],
      ["No, do not delete that"],
      ["Cancel"]
    ]
  };

  var keyBoardOffDeletion = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Yes, delete that off entry"],
      ["No, do not delete that"],
      ["Cancel"]
    ]
  };
  var keyBoardStatusDeletion = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Yes, delete that status entry"],
      ["No, do not delete that"],
      ["Cancel"]
    ]
  };
  var keyBoardOthersDeletion = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Yes, delete that others entry"],
      ["No, do not delete that"],
      ["Cancel"]
    ]
  };
  var keyBoardCourseDeletion = {
    "one_time_keyboard":true,
    "keyboard": [
      ["Yes, delete that course entry"],
      ["No, do not delete that"],
      ["Cancel"]
    ]
  };

  for (let x = 0; x < rank.length; x++) {
    var newRank = new RegExp(rank[x]);
    var userSentMessage1 = contents.message.text;
    if (newRank.test(contents.message.text)) {
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"",userSentMessage1])
      sendText(id,"Received!," + userSentMessage1 + " may i know which day does it starts?", keyBoardDay)
    }
  }
  for (let d = 0; d < day.length; d++) {
    var startDay = day[d];
    if (contents.message.text == startDay) {
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","",userSentMessage1]);
      sendText(id,"Received! Please input the starting month",keyBoardMonth);
    } 
  }
  for (let m = 0; m < month.length; m++) {
    var startMonth = month[m];
    if (contents.message.text == startMonth) {
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","",userSentMessage1]);
      sendText(id,"Received! Please input the starting Year",keyBoardYear);
    } 
  }
  for (let y = 0; y < year.length; y++) {
    var startYear = year[y];
    if (contents.message.text == startYear) {
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","",userSentMessage1]);
      sendText(id,"Received! Please state if it starts in the Am or Pm,if its regarding status just put PM",keyBoardAmOrPm);
    } 
  }
  for (let t = 0; t < amOrPm.length; t++) {
    var startAmOrPm = amOrPm[t];
    if (contents.message.text == startAmOrPm) {
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","",userSentMessage1]);
      sendText(id,"Received! Please state which day does it ends",keyBoardDayEnd);
    } 
  }
  for (let de = 0; de < dayEnd.length; de++) {
    var endDay = dayEnd[de];
    if (contents.message.text == endDay) {
      userSentMessage1 = userSentMessage1.replace("."," ")
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","","",userSentMessage1]);
      sendText(id,"Received! Please state which month does it ends",keyBoardMonthEnd);
    } 
  }
  for (let me = 0; me < monthEnd.length; me++) {
    var endMonth = monthEnd[me];
    if (contents.message.text == endMonth) {
      userSentMessage1 = userSentMessage1.replace("."," ")
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","","","",userSentMessage1]);
      sendText(id,"Received! Please state which year does it ends",keyBoardYearEnd);
    } 
  }
  for (let ye = 0; ye < yearEnd.length; ye++) {
    var endYear = yearEnd[ye];
    if (contents.message.text == endYear) {
      userSentMessage1 = userSentMessage1.replace("."," ")
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","","","","",userSentMessage1]);
      sendText(id,"Received! Please state if its in the Am or Pm,if its regarding status just put PM. AM is till 1159, PM is till 2359",keyBoardAmOrPmEnd);
    } 
  }
  for (let te = 0; te < amOrPmEnd.length; te++) {
    var endAmOrPm = amOrPmEnd[te];
    if (contents.message.text == endAmOrPm) {
      userSentMessage1 = userSentMessage1.replace("."," ")
      SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","","","","","",userSentMessage1]);
      sendText(id,"Received! Would you like to write additional remarks? (To insert status press yes)",keyBoardRemarks);
    } 
  }

  if (contents.message.text == "/start") {
    sendMessage(id, "Greetings Sir!" + "%0A" + "I am JIA HAW(Jason Is Always Handy And Working)" + "%0A" + "I am enlisted to automate the following functions" + "%0A" + "Track Leaves" + "%0A" + "Track Offs" + "%0A" + "Track Statuses" + "%0A" + "Track Course Duration" + "%0A" + "Track Other movements(Other)" + "%0A" + "Press /apply to begin");
  }
  else if (contents.message.text == "/apply") {
    var txt = "Greetings Sir, what would you like to apply?"
    sendText(id, txt, keyBoard);
  }
  else if (contents.message.text == "Apply Leave") {
    sendMessage(id,"Please wait out, cleaning database...");
    var sheetlastrow = theta.getLastRow();
    for (let o = sheetlastrow; o > 0; o--) {
      cellremarks = theta.getRange(o, 14).getValue();
      celluserid = theta.getRange(o, 2).getValue();
      if (cellremarks == "remarks" && celluserid == id) {
        numberOfRowsinbtw = sheetlastrow - o; // Returns number of rows between latest entry and latest completed entry of user
        for (let hoj = 1; hoj <= numberOfRowsinbtw; hoj++) {
          cellbelowlatest = o + hoj // gives the row number below latest completed entry of user
          queryuserid = theta.getRange(cellbelowlatest, 2).getValue();
          if (theta.getRange(cellbelowlatest, 2).getValue() == id) {
            theta.getRange("B" + cellbelowlatest + ":M" + cellbelowlatest).clearContent()
          }
        }
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Can I get your rank and name, sir?", keyBoardName );
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"On Leave"]);
  }
  else if (contents.message.text == "Off Recording") {
    sendMessage(id,"Please wait out, cleaning database...");
    var sheetlastrow = theta.getLastRow();
    for (let o = sheetlastrow; o > 0; o--) {
      cellremarks = theta.getRange(o, 14).getValue();
      celluserid = theta.getRange(o, 2).getValue();
      if (cellremarks == "remarks" && celluserid == id) {
        numberOfRowsinbtw = sheetlastrow - o; // Returns number of rows between latest entry and latest completed entry of user
        for (let hoj = 1; hoj <= numberOfRowsinbtw; hoj++) {
          cellbelowlatest = o + hoj // gives the row number below latest completed entry of user
          queryuserid = theta.getRange(cellbelowlatest, 2).getValue();
          if (theta.getRange(cellbelowlatest, 2).getValue() == id) {
            theta.getRange("B" + cellbelowlatest + ":M" + cellbelowlatest).clearContent()
          }
        }
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Can I get your rank and name, sir?", keyBoardName );
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"Off Recording"]);
  }
  else if (contents.message.text == "Apply Off") {
    sendMessage(id,"Please wait out, cleaning database...");
    var sheetlastrow = theta.getLastRow();
    for (let o = sheetlastrow; o > 0; o--) {
      cellremarks = theta.getRange(o, 14).getValue();
      celluserid = theta.getRange(o, 2).getValue();
      if (cellremarks == "remarks" && celluserid == id) {
        numberOfRowsinbtw = sheetlastrow - o; // Returns number of rows between latest entry and latest completed entry of user
        for (let hoj = 1; hoj <= numberOfRowsinbtw; hoj++) {
          cellbelowlatest = o + hoj // gives the row number below latest completed entry of user
          queryuserid = theta.getRange(cellbelowlatest, 2).getValue();
          if (theta.getRange(cellbelowlatest, 2).getValue() == id) {
            theta.getRange("B" + cellbelowlatest + ":M" + cellbelowlatest).clearContent()
          }
        }
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Can I get your rank and name, sir?", keyBoardName );
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"On Off"]);
  }
  else if (contents.message.text == "Status(includes MC)") {
    sendMessage(id,"Please wait out, cleaning database...");
    var sheetlastrow = theta.getLastRow();
    for (let o = sheetlastrow; o > 0; o--) {
      cellremarks = theta.getRange(o, 14).getValue();
      celluserid = theta.getRange(o, 2).getValue();
      if (cellremarks == "remarks" && celluserid == id) {
        numberOfRowsinbtw = sheetlastrow - o; // Returns number of rows between latest entry and latest completed entry of user
        for (let hoj = 1; hoj <= numberOfRowsinbtw; hoj++) {
          cellbelowlatest = o + hoj // gives the row number below latest completed entry of user
          queryuserid = theta.getRange(cellbelowlatest, 2).getValue();
          if (theta.getRange(cellbelowlatest, 2).getValue() == id) {
            theta.getRange("B" + cellbelowlatest + ":M" + cellbelowlatest).clearContent()
          }
        }
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Can I get your rank and name, sir?", keyBoardName );
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"Status"]);
  }
  else if (contents.message.text == "Manual Mode"){
    sendMessage(id,"Input your entry in the following format" + "%0A" + "'-leave 11/03/21 am 12/03/21 pm'" + "%0A" + "other commands includes" + "%0A" + "-off,-others,-status,-course")
  }
  else if (leaveCommand.test(contents.message.text)){
    const manualmessage = contents.message.text.split(" ");
    if (manualmessage.length == 5){ 
    var useridlastrow = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getLastRow();
    for (let x = useridlastrow; x > 0 ; x--){
      targetuserid = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,5).getValue()
      if (id == targetuserid) {
        var mstartDate = manualmessage[1];
        var mstartday = (mstartDate.split("/"))[0];
        switch (mstartday){
          case "01":
          case "1": mstartday = day[0];
          break
          case "02":
          case "2": mstartday = day[1];
          break;
          case "03":
          case "3": mstartday = day[2];
          break
          case "04":
          case "4": mstartday = day[3];
          break
          case "05":
          case "5": mstartday = day[4];
          break
          case "06":
          case "6" : mstartday = day[5];
          break
          case "07":
          case "7": mstartday = day[6];
          break
          case "08":
          case "8": mstartday = day[7];
          break
          case "09":
          case "9": mstartday = day[8];
          break
        }
        var mstartmonth = (mstartDate.split("/"))[1];
        switch (mstartmonth){
          case "01":
          case "1": mstartmonth = month[0];
          break;
          case "02":
          case "2": mstartmonth = month[1];
          break;
          case "03":
          case "3": mstartmonth = month[2];
          break
          case "04":
          case "4": mstartmonth = month[3];
          break
          case "05":
          case "5": mstartmonth = month[4];
          break
          case "06":
          case "6" : mstartmonth = month[5];
          break
          case "07":
          case "7": mstartmonth = month[6];
          break
          case "08":
          case "8": mstartmonth = month[7];
          break
          case "09":
          case "9": mstartmonth = month[8];
          break
          case "10": mstartmonth = month[9];
          break
          case "11": mstartmonth = month[10];
          break
          case "12": mstartmonth = month[11];
          break
        }
        var mstartyear= (mstartDate.split("/"))[2]
        if (mstartyear == (dateString[2]+dateString[3])){
          mstartyear = dateString
        }
        else{ mstartyear = newDateString}
        var mstarttime = manualmessage[2]
        switch (mstarttime){
          case "am":
          case "AM":
          case "Am": mstarttime = amOrPm[0];
          break;
          case "pm":
          case "PM":
          case "Pm": mstarttime = amOrPm[1];
          break;
        }
        var mendDate = manualmessage[3];
        var mendday = (mendDate.split("/"))[0];
        switch (mendday){
          case "01":
          case "1": mendday = day[0];
          break
          case "02":
          case "2": mendday = day[1];
          break;
          case "03":
          case "3": mendday = day[2];
          break
          case "04":
          case "4": mendday = day[3];
          break
          case "05":
          case "5": mendday = day[4];
          break
          case "06":
          case "6" : mendday = day[5];
          break
          case "07":
          case "7": mendday = day[6];
          break
          case "08":
          case "8": mendday = day[7];
          break
          case "09":
          case "9": mendday = day[8];
          break
        }
        var mendmonth = (mendDate.split("/"))[1];
        switch (mendmonth){
          case "01":
          case "1": mendmonth = month[0]+" ";
          break;
          case "02":
          case "2": mendmonth = month[1]+" ";
          break;
          case "03":
          case "3": mendmonth = month[2]+" ";
          break
          case "04":
          case "4": mendmonth = month[3]+" ";
          break
          case "05":
          case "5": mendmonth = month[4]+" ";
          break
          case "06":
          case "6" : mendmonth = month[5]+" ";
          break
          case "07":
          case "7": mendmonth = month[6]+" ";
          break
          case "08":
          case "8": mendmonth = month[7]+" ";
          break
          case "09":
          case "9": mendmonth = month[8]+" ";
          break
          case "10": mendmonth = month[9]+" ";
          break
          case "11": mendmonth = month[10]+" ";
          break
          case "12": mendmonth = month[11]+" ";
          break
        }
        var mendyear= (mendDate.split("/"))[2]
        if (mendyear == (dateString[2]+dateString[3])){
          mendyear = dateString
        }
        else{ mendyear = newDateString}
        var mendtime = manualmessage[4]
        switch (mendtime){
          case "am":
          case "AM":
          case "Am": mendtime = amOrPm[0]+" ";
          break;
          case "pm":
          case "PM":
          case "Pm": mendtime = amOrPm[1]+" ";
          break;
        }
        var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,4).getValue()
        SpreadsheetApp.getActiveSheet().appendRow([date, id, "On Leave", name, mstartday,mstartmonth,mstartyear,mstarttime,mendday,mendmonth,mendyear,mendtime]);
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Received! Would you like to write additional remarks? (To insert status press yes)",keyBoardRemarks);
    }
    else{
      sendMessage(id,"Please send in proper format"+ "%0A" + "'-leave 11/03/21 am 12/03/21 pm'");
    }
  }
  else if (statusCommand.test(contents.message.text)){
    const manualmessage = contents.message.text.split(" ");
    if (manualmessage.length == 5){ 
    var useridlastrow = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getLastRow();
    for (let x = useridlastrow; x > 0 ; x--){
      targetuserid = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,5).getValue()
      if (id == targetuserid) {
        var mstartDate = manualmessage[1];
        var mstartday = (mstartDate.split("/"))[0];
        switch (mstartday){
          case "01":
          case "1": mstartday = day[0];
          break
          case "02":
          case "2": mstartday = day[1];
          break;
          case "03":
          case "3": mstartday = day[2];
          break
          case "04":
          case "4": mstartday = day[3];
          break
          case "05":
          case "5": mstartday = day[4];
          break
          case "06":
          case "6" : mstartday = day[5];
          break
          case "07":
          case "7": mstartday = day[6];
          break
          case "08":
          case "8": mstartday = day[7];
          break
          case "09":
          case "9": mstartday = day[8];
          break
        }
        var mstartmonth = (mstartDate.split("/"))[1];
        switch (mstartmonth){
          case "01":
          case "1": mstartmonth = month[0];
          break;
          case "02":
          case "2": mstartmonth = month[1];
          break;
          case "03":
          case "3": mstartmonth = month[2];
          break
          case "04":
          case "4": mstartmonth = month[3];
          break
          case "05":
          case "5": mstartmonth = month[4];
          break
          case "06":
          case "6" : mstartmonth = month[5];
          break
          case "07":
          case "7": mstartmonth = month[6];
          break
          case "08":
          case "8": mstartmonth = month[7];
          break
          case "09":
          case "9": mstartmonth = month[8];
          break
          case "10": mstartmonth = month[9];
          break
          case "11": mstartmonth = month[10];
          break
          case "12": mstartmonth = month[11];
          break
        }
        var mstartyear= (mstartDate.split("/"))[2]
        if (mstartyear == (dateString[2]+dateString[3])){
          mstartyear = dateString
        }
        else{ mstartyear = newDateString}
        var mstarttime = manualmessage[2]
        switch (mstarttime){
          case "am":
          case "AM":
          case "Am": mstarttime = amOrPm[0];
          break;
          case "pm":
          case "PM":
          case "Pm": mstarttime = amOrPm[1];
          break;
        }
        var mendDate = manualmessage[3];
        var mendday = (mendDate.split("/"))[0];
        switch (mendday){
          case "01":
          case "1": mendday = day[0];
          break
          case "02":
          case "2": mendday = day[1];
          break;
          case "03":
          case "3": mendday = day[2];
          break
          case "04":
          case "4": mendday = day[3];
          break
          case "05":
          case "5": mendday = day[4];
          break
          case "06":
          case "6" : mendday = day[5];
          break
          case "07":
          case "7": mendday = day[6];
          break
          case "08":
          case "8": mendday = day[7];
          break
          case "09":
          case "9": mendday = day[8];
          break
        }
        var mendmonth = (mendDate.split("/"))[1];
        switch (mendmonth){
          case "01":
          case "1": mendmonth = month[0]+" ";
          break;
          case "02":
          case "2": mendmonth = month[1]+" ";
          break;
          case "03":
          case "3": mendmonth = month[2]+" ";
          break
          case "04":
          case "4": mendmonth = month[3]+" ";
          break
          case "05":
          case "5": mendmonth = month[4]+" ";
          break
          case "06":
          case "6" : mendmonth = month[5]+" ";
          break
          case "07":
          case "7": mendmonth = month[6]+" ";
          break
          case "08":
          case "8": mendmonth = month[7]+" ";
          break
          case "09":
          case "9": mendmonth = month[8]+" ";
          break
          case "10": mendmonth = month[9]+" ";
          break
          case "11": mendmonth = month[10]+" ";
          break
          case "12": mendmonth = month[11]+" ";
          break
        }
        var mendyear= (mendDate.split("/"))[2]
        if (mendyear == (dateString[2]+dateString[3])){
          mendyear = dateString
        }
        else{ mendyear = newDateString}
        var mendtime = manualmessage[4]
        switch (mendtime){
          case "am":
          case "AM":
          case "Am": mendtime = amOrPm[0]+" ";
          break;
          case "pm":
          case "PM":
          case "Pm": mendtime = amOrPm[1]+" ";
          break;
        }
        var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,4).getValue()
        SpreadsheetApp.getActiveSheet().appendRow([date, id, "Status", name, mstartday,mstartmonth,mstartyear,mstarttime,mendday,mendmonth,mendyear,mendtime]);
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Received! Would you like to write additional remarks? (To insert status press yes)",keyBoardRemarks);
    }
    else{
      sendMessage(id,"Please send in proper format"+ "%0A" + "'-status 11/03/21 am 12/03/21 pm'");
    }
  }
  else if (courseCommand.test(contents.message.text)){
    const manualmessage = contents.message.text.split(" ");
    if (manualmessage.length == 5){ 
    var useridlastrow = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getLastRow();
    for (let x = useridlastrow; x > 0 ; x--){
      targetuserid = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,5).getValue()
      if (id == targetuserid) {
        var mstartDate = manualmessage[1];
        var mstartday = (mstartDate.split("/"))[0];
        switch (mstartday){
          case "01":
          case "1": mstartday = day[0];
          break
          case "02":
          case "2": mstartday = day[1];
          break;
          case "03":
          case "3": mstartday = day[2];
          break
          case "04":
          case "4": mstartday = day[3];
          break
          case "05":
          case "5": mstartday = day[4];
          break
          case "06":
          case "6" : mstartday = day[5];
          break
          case "07":
          case "7": mstartday = day[6];
          break
          case "08":
          case "8": mstartday = day[7];
          break
          case "09":
          case "9": mstartday = day[8];
          break
        }
        var mstartmonth = (mstartDate.split("/"))[1];
        switch (mstartmonth){
          case "01":
          case "1": mstartmonth = month[0];
          break;
          case "02":
          case "2": mstartmonth = month[1];
          break;
          case "03":
          case "3": mstartmonth = month[2];
          break
          case "04":
          case "4": mstartmonth = month[3];
          break
          case "05":
          case "5": mstartmonth = month[4];
          break
          case "06":
          case "6" : mstartmonth = month[5];
          break
          case "07":
          case "7": mstartmonth = month[6];
          break
          case "08":
          case "8": mstartmonth = month[7];
          break
          case "09":
          case "9": mstartmonth = month[8];
          break
          case "10": mstartmonth = month[9];
          break
          case "11": mstartmonth = month[10];
          break
          case "12": mstartmonth = month[11];
          break
        }
        var mstartyear= (mstartDate.split("/"))[2]
        if (mstartyear == (dateString[2]+dateString[3])){
          mstartyear = dateString
        }
        else{ mstartyear = newDateString}
        var mstarttime = manualmessage[2]
        switch (mstarttime){
          case "am":
          case "AM":
          case "Am": mstarttime = amOrPm[0];
          break;
          case "pm":
          case "PM":
          case "Pm": mstarttime = amOrPm[1];
          break;
        }
        var mendDate = manualmessage[3];
        var mendday = (mendDate.split("/"))[0];
        switch (mendday){
          case "01":
          case "1": mendday = day[0];
          break
          case "02":
          case "2": mendday = day[1];
          break;
          case "03":
          case "3": mendday = day[2];
          break
          case "04":
          case "4": mendday = day[3];
          break
          case "05":
          case "5": mendday = day[4];
          break
          case "06":
          case "6" : mendday = day[5];
          break
          case "07":
          case "7": mendday = day[6];
          break
          case "08":
          case "8": mendday = day[7];
          break
          case "09":
          case "9": mendday = day[8];
          break
        }
        var mendmonth = (mendDate.split("/"))[1];
        switch (mendmonth){
          case "01":
          case "1": mendmonth = month[0]+" ";
          break;
          case "02":
          case "2": mendmonth = month[1]+" ";
          break;
          case "03":
          case "3": mendmonth = month[2]+" ";
          break
          case "04":
          case "4": mendmonth = month[3]+" ";
          break
          case "05":
          case "5": mendmonth = month[4]+" ";
          break
          case "06":
          case "6" : mendmonth = month[5]+" ";
          break
          case "07":
          case "7": mendmonth = month[6]+" ";
          break
          case "08":
          case "8": mendmonth = month[7]+" ";
          break
          case "09":
          case "9": mendmonth = month[8]+" ";
          break
          case "10": mendmonth = month[9]+" ";
          break
          case "11": mendmonth = month[10]+" ";
          break
          case "12": mendmonth = month[11]+" ";
          break
        }
        var mendyear= (mendDate.split("/"))[2]
        if (mendyear == (dateString[2]+dateString[3])){
          mendyear = dateString
        }
        else{ mendyear = newDateString}
        var mendtime = manualmessage[4]
        switch (mendtime){
          case "am":
          case "AM":
          case "Am": mendtime = amOrPm[0]+" ";
          break;
          case "pm":
          case "PM":
          case "Pm": mendtime = amOrPm[1]+" ";
          break;
        }
        var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,4).getValue()
        SpreadsheetApp.getActiveSheet().appendRow([date, id, "On Course", name, mstartday,mstartmonth,mstartyear,mstarttime,mendday,mendmonth,mendyear,mendtime]);
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Received! Would you like to write additional remarks? (To insert status press yes)",keyBoardRemarks);
    }
    else{
      sendMessage(id,"Please send in proper format"+ "%0A" + "'-course 11/03/21 am 12/03/21 pm'");
    }
  }
  else if (offCommand.test(contents.message.text)){
    const manualmessage = contents.message.text.split(" ");
    if (manualmessage.length == 5){ 
    var useridlastrow = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getLastRow();
    for (let x = useridlastrow; x > 0 ; x--){
      targetuserid = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,5).getValue()
      if (id == targetuserid) {
        var mstartDate = manualmessage[1];
        var mstartday = (mstartDate.split("/"))[0];
        switch (mstartday){
          case "01":
          case "1": mstartday = day[0];
          break
          case "02":
          case "2": mstartday = day[1];
          break;
          case "03":
          case "3": mstartday = day[2];
          break
          case "04":
          case "4": mstartday = day[3];
          break
          case "05":
          case "5": mstartday = day[4];
          break
          case "06":
          case "6" : mstartday = day[5];
          break
          case "07":
          case "7": mstartday = day[6];
          break
          case "08":
          case "8": mstartday = day[7];
          break
          case "09":
          case "9": mstartday = day[8];
          break
        }
        var mstartmonth = (mstartDate.split("/"))[1];
        switch (mstartmonth){
          case "01":
          case "1": mstartmonth = month[0];
          break;
          case "02":
          case "2": mstartmonth = month[1];
          break;
          case "03":
          case "3": mstartmonth = month[2];
          break
          case "04":
          case "4": mstartmonth = month[3];
          break
          case "05":
          case "5": mstartmonth = month[4];
          break
          case "06":
          case "6" : mstartmonth = month[5];
          break
          case "07":
          case "7": mstartmonth = month[6];
          break
          case "08":
          case "8": mstartmonth = month[7];
          break
          case "09":
          case "9": mstartmonth = month[8];
          break
          case "10": mstartmonth = month[9];
          break
          case "11": mstartmonth = month[10];
          break
          case "12": mstartmonth = month[11];
          break
        }
        var mstartyear= (mstartDate.split("/"))[2]
        if (mstartyear == (dateString[2]+dateString[3])){
          mstartyear = dateString
        }
        else{ mstartyear = newDateString}
        var mstarttime = manualmessage[2]
        switch (mstarttime){
          case "am":
          case "AM":
          case "Am": mstarttime = amOrPm[0];
          break;
          case "pm":
          case "PM":
          case "Pm": mstarttime = amOrPm[1];
          break;
        }
        var mendDate = manualmessage[3];
        var mendday = (mendDate.split("/"))[0];
        switch (mendday){
          case "01":
          case "1": mendday = day[0];
          break
          case "02":
          case "2": mendday = day[1];
          break;
          case "03":
          case "3": mendday = day[2];
          break
          case "04":
          case "4": mendday = day[3];
          break
          case "05":
          case "5": mendday = day[4];
          break
          case "06":
          case "6" : mendday = day[5];
          break
          case "07":
          case "7": mendday = day[6];
          break
          case "08":
          case "8": mendday = day[7];
          break
          case "09":
          case "9": mendday = day[8];
          break
        }
        var mendmonth = (mendDate.split("/"))[1];
        switch (mendmonth){
          case "01":
          case "1": mendmonth = month[0]+" ";
          break;
          case "02":
          case "2": mendmonth = month[1]+" ";
          break;
          case "03":
          case "3": mendmonth = month[2]+" ";
          break
          case "04":
          case "4": mendmonth = month[3]+" ";
          break
          case "05":
          case "5": mendmonth = month[4]+" ";
          break
          case "06":
          case "6" : mendmonth = month[5]+" ";
          break
          case "07":
          case "7": mendmonth = month[6]+" ";
          break
          case "08":
          case "8": mendmonth = month[7]+" ";
          break
          case "09":
          case "9": mendmonth = month[8]+" ";
          break
          case "10": mendmonth = month[9]+" ";
          break
          case "11": mendmonth = month[10]+" ";
          break
          case "12": mendmonth = month[11]+" ";
          break
        }
        var mendyear= (mendDate.split("/"))[2]
        if (mendyear == (dateString[2]+dateString[3])){
          mendyear = dateString
        }
        else{ mendyear = newDateString}
        var mendtime = manualmessage[4]
        switch (mendtime){
          case "am":
          case "AM":
          case "Am": mendtime = amOrPm[0]+" ";
          break;
          case "pm":
          case "PM":
          case "Pm": mendtime = amOrPm[1]+" ";
          break;
        }
        var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,4).getValue()
        SpreadsheetApp.getActiveSheet().appendRow([date, id, "On Off", name, mstartday,mstartmonth,mstartyear,mstarttime,mendday,mendmonth,mendyear,mendtime]);
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Received! Would you like to write additional remarks? (To insert status press yes)",keyBoardRemarks);
    }
    else{
      sendMessage(id,"Please send in proper format"+ "%0A" + "'-off 11/03/21 am 12/03/21 pm'");
    }
  }
  else if (othersCommand.test(contents.message.text)){
    const manualmessage = contents.message.text.split(" ");
    if (manualmessage.length == 5){ 
    var useridlastrow = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getLastRow();
    for (let x = useridlastrow; x > 0 ; x--){
      targetuserid = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,5).getValue()
      if (id == targetuserid) {
        var mstartDate = manualmessage[1];
        var mstartday = (mstartDate.split("/"))[0];
        switch (mstartday){
          case "01":
          case "1": mstartday = day[0];
          break
          case "02":
          case "2": mstartday = day[1];
          break;
          case "03":
          case "3": mstartday = day[2];
          break
          case "04":
          case "4": mstartday = day[3];
          break
          case "05":
          case "5": mstartday = day[4];
          break
          case "06":
          case "6" : mstartday = day[5];
          break
          case "07":
          case "7": mstartday = day[6];
          break
          case "08":
          case "8": mstartday = day[7];
          break
          case "09":
          case "9": mstartday = day[8];
          break
        }
        var mstartmonth = (mstartDate.split("/"))[1];
        switch (mstartmonth){
          case "01":
          case "1": mstartmonth = month[0];
          break;
          case "02":
          case "2": mstartmonth = month[1];
          break;
          case "03":
          case "3": mstartmonth = month[2];
          break
          case "04":
          case "4": mstartmonth = month[3];
          break
          case "05":
          case "5": mstartmonth = month[4];
          break
          case "06":
          case "6" : mstartmonth = month[5];
          break
          case "07":
          case "7": mstartmonth = month[6];
          break
          case "08":
          case "8": mstartmonth = month[7];
          break
          case "09":
          case "9": mstartmonth = month[8];
          break
          case "10": mstartmonth = month[9];
          break
          case "11": mstartmonth = month[10];
          break
          case "12": mstartmonth = month[11];
          break
        }
        var mstartyear= (mstartDate.split("/"))[2]
        if (mstartyear == (dateString[2]+dateString[3])){
          mstartyear = dateString
        }
        else{ mstartyear = newDateString}
        var mstarttime = manualmessage[2]
        switch (mstarttime){
          case "am":
          case "AM":
          case "Am": mstarttime = amOrPm[0];
          break;
          case "pm":
          case "PM":
          case "Pm": mstarttime = amOrPm[1];
          break;
        }
        var mendDate = manualmessage[3];
        var mendday = (mendDate.split("/"))[0];
        switch (mendday){
          case "01":
          case "1": mendday = day[0];
          break
          case "02":
          case "2": mendday = day[1];
          break;
          case "03":
          case "3": mendday = day[2];
          break
          case "04":
          case "4": mendday = day[3];
          break
          case "05":
          case "5": mendday = day[4];
          break
          case "06":
          case "6" : mendday = day[5];
          break
          case "07":
          case "7": mendday = day[6];
          break
          case "08":
          case "8": mendday = day[7];
          break
          case "09":
          case "9": mendday = day[8];
          break
        }
        var mendmonth = (mendDate.split("/"))[1];
        switch (mendmonth){
          case "01":
          case "1": mendmonth = month[0]+" ";
          break;
          case "02":
          case "2": mendmonth = month[1]+" ";
          break;
          case "03":
          case "3": mendmonth = month[2]+" ";
          break
          case "04":
          case "4": mendmonth = month[3]+" ";
          break
          case "05":
          case "5": mendmonth = month[4]+" ";
          break
          case "06":
          case "6" : mendmonth = month[5]+" ";
          break
          case "07":
          case "7": mendmonth = month[6]+" ";
          break
          case "08":
          case "8": mendmonth = month[7]+" ";
          break
          case "09":
          case "9": mendmonth = month[8]+" ";
          break
          case "10": mendmonth = month[9]+" ";
          break
          case "11": mendmonth = month[10]+" ";
          break
          case "12": mendmonth = month[11]+" ";
          break
        }
        var mendyear= (mendDate.split("/"))[2]
        if (mendyear == (dateString[2]+dateString[3])){
          mendyear = dateString
        }
        else{ mendyear = newDateString}
        var mendtime = manualmessage[4]
        switch (mendtime){
          case "am":
          case "AM":
          case "Am": mendtime = amOrPm[0]+" ";
          break;
          case "pm":
          case "PM":
          case "Pm": mendtime = amOrPm[1]+" ";
          break;
        }
        var name = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("User ID").getRange(x,4).getValue()
        SpreadsheetApp.getActiveSheet().appendRow([date, id, "Others", name, mstartday,mstartmonth,mstartyear,mstarttime,mendday,mendmonth,mendyear,mendtime]);
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Received! Would you like to write additional remarks? (To insert status press yes)",keyBoardRemarks);
    }
    else{
      sendMessage(id,"Please send in proper format"+ "%0A" + "'-others 11/03/21 am 12/03/21 pm'");
    }
  }
  else if (contents.message.text == "Others") {
    sendMessage(id,"Please wait out, cleaning database...");
    var sheetlastrow = theta.getLastRow();
    for (let o = sheetlastrow; o > 0; o--) {
      cellremarks = theta.getRange(o, 14).getValue();
      celluserid = theta.getRange(o, 2).getValue();
      if (cellremarks == "remarks" && celluserid == id) {
        numberOfRowsinbtw = sheetlastrow - o; // Returns number of rows between latest entry and latest completed entry of user
        for (let hoj = 1; hoj <= numberOfRowsinbtw; hoj++) {
          cellbelowlatest = o + hoj // gives the row number below latest completed entry of user
          queryuserid = theta.getRange(cellbelowlatest, 2).getValue();
          if (theta.getRange(cellbelowlatest, 2).getValue() == id) {
            theta.getRange("B" + cellbelowlatest + ":M" + cellbelowlatest).clearContent()
          }
        }
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Can I get your rank and name, sir?", keyBoardName );
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"Others"]);
  }
  else if (contents.message.text == "Course") {
    sendMessage(id,"Please wait out, cleaning database...");
    var sheetlastrow = theta.getLastRow();
    for (let o = sheetlastrow; o > 0; o--) {
      cellremarks = theta.getRange(o, 14).getValue();
      celluserid = theta.getRange(o, 2).getValue();
      if (cellremarks == "remarks" && celluserid == id) {
        numberOfRowsinbtw = sheetlastrow - o; // Returns number of rows between latest entry and latest completed entry of user
        for (let hoj = 1; hoj <= numberOfRowsinbtw; hoj++) {
          cellbelowlatest = o + hoj // gives the row number below latest completed entry of user
          queryuserid = theta.getRange(cellbelowlatest, 2).getValue();
          if (theta.getRange(cellbelowlatest, 2).getValue() == id) {
            theta.getRange("B" + cellbelowlatest + ":M" + cellbelowlatest).clearContent()
          }
        }
        break
      }
    }
    SpreadsheetApp.flush();
    sendText(id,"Can I get your rank and name, sir?", keyBoardName );
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"On Course"]);
  }
  else if (command.test(contents.message.text)) {
    sendText(id,"Remarks received! Successful entry, bringing you back to main menu", keyBoard );
    userSentMessage1 = userSentMessage1.replace("-remarks"," ")  
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","","","","","","",userSentMessage1,"remarks"]);
    myCopyAndPaste();
    prompt();
  }
  else if (contents.message.text == "Yes, I would like to write remarks") {
    sendMessage(id,"To enter remarks, type -remarks followed by your text" + "%0A" + "For example" + "%0A" + "-remarks light duty" + "%0A" + "For MC" + "%0A" + "-remarks MC" + "%0A" + "MC to be in CAPS");
  }
  else if (contents.message.text == "No, I do not need to write remarks") {
    SpreadsheetApp.getActiveSheet().appendRow([date,id,"","","","","","","","","","","nil","remarks"]);
    myCopyAndPaste();
    sendText(id,"Roger! Your entry has been received, bringing you back to main menu.",keyBoard);
    prompt();
  }
  else if (contents.message.text == "Delete Entry") {
    sendText(id,"Roger! Which entry would you like to delete?",keyBoardDeletion);
  }
  else if (contents.message.text == "Delete leave entry") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "On Leave" && logSheet.getRange(dle, 2).getValue() == username) {
            var leaveVal = logSheet.getRange("A" + dle + ":G" + dle).getValues();
            var text1 = leaveVal[0][0];
            var text2 = leaveVal[0][1];
            var text3 = leaveVal[0][2];
            var text4 = leaveVal[0][3];
            var text5 = leaveVal[0][4];
            var text6 = leaveVal[0][5];
            var text7 = leaveVal[0][6];
            sendMessage(id, "This is your previous leave entry:" + "%0A" + text1 + " " + text2 + " " + text3 + " to " + text4 + " " + text5 + " " + text6 + " " + text7);
            sendText(id, "Are you sure you would like to delete the above?", keyBoardLeaveDeletion)
            break
          }
        }
      }
    }
  }
  else if (contents.message.text == "Yes, delete that leave entry"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "On Leave" && logSheet.getRange(dle, 2).getValue() == username) {
            logSheet.getRange(dle,1).clearContent()
            logSheet.getRange(dle,1).setValue("(On Leave)")
            sendText(id,"Roger, your entry has been deleted, binging you back to main menu.",keyBoard)
            break
          }
        } 
      }
    }  
  }
  else if (contents.message.text == "No, do not delete that"){
    sendText(id,"Roger, returning you to main menu.",keyBoard);
  }
  else if (contents.message.text == "Delete off entry") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "On Off" && logSheet.getRange(dle, 2).getValue() == username) {
            var leaveVal = logSheet.getRange("A" + dle + ":G" + dle).getValues();
            var text1 = leaveVal[0][0];
            var text2 = leaveVal[0][1];
            var text3 = leaveVal[0][2];
            var text4 = leaveVal[0][3];
            var text5 = leaveVal[0][4];
            var text6 = leaveVal[0][5];
            var text7 = leaveVal[0][6];
            sendMessage(id, "This is your previous off entry:" + "%0A" + text1 + " " + text2 + " " + text3 + " to " + text4 + " " + text5 + " " + text6 + " " + text7);
            sendText(id, "Are you sure you would like to delete the above?", keyBoardOffDeletion)
            break
          }
        }
      }
    }
  }
  else if (contents.message.text == "Yes, delete that off entry"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "On Off" && logSheet.getRange(dle, 2).getValue() == username) {
            logSheet.getRange(dle,1).clearContent()
            logSheet.getRange(dle,1).setValue("(On Off)")
            sendText(id,"Roger, your entry has been deleted, binging you back to main menu.",keyBoard)
            break
          }
        } 
      }
    }  
  }
  else if (contents.message.text == "Delete status(MC included) entry") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "Status" && logSheet.getRange(dle, 2).getValue() == username) {
            var leaveVal = logSheet.getRange("A" + dle + ":G" + dle).getValues();
            var text1 = leaveVal[0][0];
            var text2 = leaveVal[0][1];
            var text3 = leaveVal[0][2];
            var text4 = leaveVal[0][3];
            var text5 = leaveVal[0][4];
            var text6 = leaveVal[0][5];
            var text7 = leaveVal[0][6];
            sendMessage(id, "This is your previous status entry:" + "%0A" + text1 + " " + text2 + " " + text3 + " to " + text4 + " " + text5 + " " + text6 + " " + text7);
            sendText(id, "Are you sure you would like to delete the above?", keyBoardStatusDeletion)
            break
          }
        }
      }
    }
  }
  else if (contents.message.text == "Yes, delete that status entry"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "Status" && logSheet.getRange(dle, 2).getValue() == username) {
            logSheet.getRange(dle,1).clearContent()
            logSheet.getRange(dle,1).setValue("(Status)")
            sendText(id,"Roger, your entry has been deleted, binging you back to main menu.",keyBoard)
            break
          }
        } 
      }
    }  
  }
  else if (contents.message.text == "Delete others entry") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "Others" && logSheet.getRange(dle, 2).getValue() == username) {
            var leaveVal = logSheet.getRange("A" + dle + ":G" + dle).getValues();
            var text1 = leaveVal[0][0];
            var text2 = leaveVal[0][1];
            var text3 = leaveVal[0][2];
            var text4 = leaveVal[0][3];
            var text5 = leaveVal[0][4];
            var text6 = leaveVal[0][5];
            var text7 = leaveVal[0][6];
            sendMessage(id, "This is your previous others entry:" + "%0A" + text1 + " " + text2 + " " + text3 + " to " + text4 + " " + text5 + " " + text6 + " " + text7);
            sendText(id, "Are you sure you would like to delete the above?", keyBoardOthersDeletion)
            break
          }
        }
      }
    }
  }
  else if (contents.message.text == "Yes, delete that others entry"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "Others" && logSheet.getRange(dle, 2).getValue() == username) {
            logSheet.getRange(dle,1).clearContent()
            logSheet.getRange(dle,1).setValue("(Others)")
            sendText(id,"Roger, your entry has been deleted, binging you back to main menu.",keyBoard)
            break
          }
        } 
      }
    }  
  }
  else if (contents.message.text == "Delete course entry") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "On Course" && logSheet.getRange(dle, 2).getValue() == username) {
            var leaveVal = logSheet.getRange("A" + dle + ":G" + dle).getValues();
            var text1 = leaveVal[0][0];
            var text2 = leaveVal[0][1];
            var text3 = leaveVal[0][2];
            var text4 = leaveVal[0][3];
            var text5 = leaveVal[0][4];
            var text6 = leaveVal[0][5];
            var text7 = leaveVal[0][6];
            sendMessage(id, "This is your previous course entry:" + "%0A" + text1 + " " + text2 + " " + text3 + " to " + text4 + " " + text5 + " " + text6 + " " + text7);
            sendText(id, "Are you sure you would like to delete the above?", keyBoardCourseDeletion)
            break
          }
        }
      }
    }
  }
  else if (contents.message.text == "Yes, delete that course entry"){
    var sheet = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = sheet.getSheetByName("For View (log) [target]");
    var endLogSheet = logSheet.getLastRow()
    for (let cui = 15; cui >= 0; cui--) {
      if (id == userIDDirectory[cui]) {
        var username = userNameDirectory[cui]
        for (let dle = endLogSheet; dle >= 0; dle--) {
          if (logSheet.getRange(dle, 1).getValue() === "On Course" && logSheet.getRange(dle, 2).getValue() == username) {
            logSheet.getRange(dle,1).clearContent()
            logSheet.getRange(dle,1).setValue("(On Course)")
            sendText(id,"Roger, your entry has been deleted, binging you back to main menu.",keyBoard)
            break
          }
        } 
      }
    }  
  }
  else if (contents.message.text == "Cancel") {
    sendText(id, "Roger, binging you back to main menu.", keyBoard)
  }

  else if (contents.message.text == "/paradestate" || contents.message.text == "/paradestate@"+botname) {
    sendParadeState();
  }
  else if (contents.message.text == "/balance" || contents.message.text == "/balance@"+botname) {
    sendWelfareBalance();
  }
}


function myCopyAndPaste() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allsheets = ss.getSheets();

  for (var m = 0; m < allsheets.length; m++) {
    if (allsheets[m].getName().includes("source")) {
      var source = ss.getSheetByName(allsheets[m].getName());
      Logger.log(source.getRange(1, 17).getValue());
      for (var i = 1; i <= 1000; i++) {
        //Logger.log(source.getRange(i,19).getValue().length);
        if (source.getRange(i, 17).getValue() == 0) {
          break
        }


        Logger.log((source.getRange(i, 17).getValue() == "Completed"));
        if ((source.getRange(i, 17).getValue()).includes("Completed") && source.getRange(i, 18).getValue() != "Moved") {

          var dataToCopy = source.getRange('J' + i + ':Q' + i).getValues();

          source.getRange(i, 18).setValue("Moved");

          for (var j = 1; j <= 1000; j++) {
            var destination = ss.getSheetByName('For View (log) [target]');

            //Logger.log(source.getRange(i,19).getValue().length);
            if (destination.getRange(j, 8).getValue() == 0) {




              destination.getRange('A' + j + ':H' + j).setValues(dataToCopy);



              break
            }


          }

        }

      }

    }

  }

}



function prompt() {
  var requestorrow = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("For View (log) [target]").getLastRow();
  var requestor = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("For View (log) [target]").getRange(requestorrow, 2).getValue();
  var reasons = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("For View (log) [target]").getRange(requestorrow, 1).getValue();
  if (reasons == "On Leave" || reasons == "On Off") {
    sendMessage(groupChatId, requestor + " has applied leave/off, approving bodies please approve via googlesheet");
  }
  else if(reasons == "Off Recording"){
    sendMessage(groupChatId, requestor + " has applied for Off Recording, approving bodies please approve via googlesheet");
  }
}