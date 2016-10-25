// Robert James Brennan 12357031

document.addEventListener("deviceready", onDeviceReady, false);
           
var db;

function onDeviceReady(){
    db = window.openDatabase("Database", "1.0", "Demo", 2*1024*1024);
    db.transaction(createDB, errorCB, successCB);
}


/*function submitForm(){
    var uname = $('[name ="username" ]').val();
    var email = $('[name ="email" ]').val();
    
    window.localStorage.setItem("username", uname);
    window.localStorage.setItem("email", email);
    
    $.mobile.changePage("#page2", {reverse: false, transition: "slide"});
    
    $('#output').html("Userbane: " +window.localStorage.getItem("username") + "<br>" +
                        "Email: " +window.localStorage.getItem("email"));
    
    return false;
}*/
function createDB(tx){
    //tx.executeSql('DROP TABLE IF EXISTS DEMO');//Remove to save database for next runtime
    //tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, title, image, description)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, title, date, description)');//Create db table
}

function errorCB(err){
    alert("Error processing SQL: " +err.code);
}

function successCB(){
    alert("Yeah!!!");
}

function insertDB(tx){
    var _title = $("[name = 'title']").val();
    //var _image = $("[name = 'image']").val();
    var _date = new Date();
    _date.setDate(_date.getDate());
    var _description = $("[name = 'description']").val();
    var sql = 'INSERT INTO DEMO (title, date, description) VALUES (?,?,?)';
    tx.executeSql(sql, [_title, _date, _description], sucessQueryDB, errorCB);
}

function sucessQueryDB(tx){
    alert("query");
    tx.executeSql('SELECT * FROM DEMO', [], renderList, errorCB);
}

function renderList(tx, result){
    var htmlstring = '';
    var len = result.rows.length;
    /*for(var i = 0; i<len; i++){
        htmlstring += '<li>' + '<bold>Mood:</bold><br>' +result.rows.item(i).title + '<br>' + result.rows.item(i).date + '<br>' + result.rows.item(i).description  + '</li>'
    }*/ //Retrieves results from DB chronologically from first entry to most recent
    
    for(var x = len-1; x>=0; x--){
        htmlstring += '<li>' + '<bold>Mood:</bold><br>' +result.rows.item(x).title + '<br>' + result.rows.item(x).date + '<br>' +result.rows.item(x).description   + '</li>'
    }
    
    $('#resultlist').html(htmlstring);
    //$('#resultlist').listview('refresh');
    $('#resultlist').listview().listview('refresh');
}


function submitForm(){
    db.transaction(insertDB, errorCB);
    $.mobile.changePage('#page3', {reverse: false, transition: "slide"});
    return false;
}  