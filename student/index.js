import express from "express";
import bodyParser from "body-parser";
import mysql2  from "mysql2";

const app=express();
const port=5000;
var islogedin=false;
var user=null;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('static'));

const connection = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mycamu'
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
  });

app.get("/",(req,res)=>{
    res.render("Slogin.ejs");
})

app.post("/login_submit",(req,res)=>{
    var data=req.body;
    var val=null;
    connection.query('SELECT * FROM student WHERE mail=? and passwd=? ', [data.username, data.password], (err, rows) => {
        if (err) throw err;
        val = rows;
        if (val[0]!=undefined){
            user=val[0];
            islogedin=true;
            res.redirect('/home');
        }else{
            res.redirect('/');
        }
    });
})

app.get("/home",(req,res)=>{
    if(!islogedin){
        res.redirect('/');
    }else{
        connection.query('SELECT * FROM map JOIN subject WHERE map.suid=subject.sid and stid=?',[user.id],(err,rows)=>{
            if (err) throw err;
            res.render( 'Shome.ejs',{data:rows});
        });
        
    }
})

app.get("/leave",(req,res)=>{
    if(!islogedin){
        res.redirect('/');
    }else{
        connection.query('SELECT * FROM sleave  WHERE sid=? ', [user.id], (err, rows) => {
            if (err) throw err;
            var val = rows;
            res.render('Sleave.ejs',{data:val});
        });
    }
})

app.post("/leave_sumbit",(req,res)=>{
    console.log(req.body)
    var data=req.body
    var type=data.leave=="Medical Leave"?1:0;
    const newRecord = { sid: user.id, type: type,fdate: data.fdate, 
        tdate: data.tdate, reason: data.leavereason, status: 0,tid: user.tid};

    connection.query('INSERT INTO sleave SET ?', newRecord, (err, result) => {
    if (err) throw err;
    console.log('Record inserted successfully');
    });
    res.redirect('/leave')
})

app.post("/profile_sumbit",(req,res)=> {
    var data=req.body;
    if (user.passwd == data.oldpass && data.newpass ==data.conpass){
        connection.query('UPDATE student SET passwd= ? WHERE id = ?', [data.newpass, user.id], (err, result) => {
            if (err) throw err;
            console.log('Number of rows updated:', result.affectedRows);
          });
    }
    res.redirect('/profile');
});

app.get("/bill",(req,res)=>{
    if(!islogedin){
        res.redirect('/');
    }else{
        res.render('Sbill.ejs');
    }
})

app.get("/result",(req,res)=>{
    if(!islogedin){
        res.redirect('/');
    }else{
        res.render('Sresult.ejs');
    }
})

app.get("/profile",(req,res)=>{
    if(!islogedin){
        res.redirect('/');
    }else{
        res.render('Sprofile.ejs', {user: user});
    }
})

app.listen(port,()=>{
    console.log("running...");
})
