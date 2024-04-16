import express from "express";
import bodyParser from "body-parser";
import mysql2  from "mysql2";

const app=express();
const port=3000;
var islogedin=false;
var user=null;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('static'));

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '110akash62003',
  database: 'mycamu'
});
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});


app.get("/",(req,res)=>{
    res.render("Tlogin.ejs");
})

app.post("/login_submit",(req,res)=>{
    var data=req.body;
    var val=null;
    connection.query('SELECT * FROM teacher WHERE mail=? and passwd=? ', [data.username, data.password], (err, rows) => {
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
        res.redirect("/");
    }else{
        connection.query('SELECT * FROM student JOIN map JOIN subject WHERE subject.sid=map.suid and student.id=map.stid',(err,rows)=>{
            if (err) throw err;
            res.render("home.ejs",{data:rows});
        });
    }
})

app.post("/home_sumbit",(req,res)=>{
    var data=req.body;
    for (const [key, value] of Object.entries(data)) {
        if (value=="on"){
            connection.query('UPDATE map SET attendance=attendance+1 WHERE stid=?',[key],(err,result)=>{
                if (err) throw err; 
            });
        }
      }
    res.redirect('/home')
})

app.get("/leave",(req,res)=>{
    if(!islogedin){
        res.redirect("/");
    }else{
        connection.query('SELECT * FROM sleave join student WHERE sleave.sid=student.id and sleave.tid=? and sleave.status=0', [user.id], (err, rows) => {
            if (err) throw err;
            var val = rows;
            console.log(rows);
            res.render("Tleave.ejs",{data:val}); 
        });
    }
})

app.get("/result",(req,res)=>{
    if(!islogedin){
        res.redirect("/");
    }else{
        res.render("Tresult.ejs");
    }
})

app.get("/add",(req,res)=>{
    if(!islogedin){
        res.redirect("/");
    }else{
        connection.query('SELECT * FROM teacher', (err, rows) => {
            if (err) throw err;
            res.render("Tadd.ejs",{val:rows}); 
        });
    }
})


app.post("/add_sumbit",(req,res)=>{
    var data=req.body
    const newRecord = { name: data.name, mail: data.mail,passwd: data.mail, 
        adno: data.ADMISSIONNO, rollno: data.ROLLNO, degree: data.DEGREE, department: data.DEPARTMENT,tid: user.id};

    connection.query('INSERT INTO student SET ?', newRecord, (err, result) => {
    if (err) throw err;
    console.log('Record inserted successfully');
    });
    res.redirect('/home')
})

app.post("/leave_sumbit_a",(req,res)=>{
    console.log(req.body)
    var data=req.body;
    connection.query('UPDATE sleave SET status= ? WHERE lid = ?', [1, data.id], (err, result) => {
        if (err) throw err;
        console.log('Number of rows updated:', result.affectedRows);
      }); 
    res.redirect('/home')
})

app.post("/leave_sumbit_r",(req,res)=>{
    console.log(req.body)
    var data=req.body;
    connection.query('UPDATE sleave SET status= ? WHERE lid = ?', [2, data.id], (err, result) => {
        if (err) throw err;
        console.log('Number of rows updated:', result.affectedRows);
      }); 
    res.redirect('/home')
})

app.post("/result_sumbit",(req,res)=>{
    console.log(req.body)
    res.redirect('/home')
})

app.post("/teacher_sumbit",(req,res)=>{
    var data=req.body
    const newRecord = { tid: data.teachername, subject_code: data.sc,subject_name: data.sn, 
        semster: data.sem, credit: data.credit};
    connection.query('INSERT INTO subject SET ?', newRecord, (err, result) => {
        if (err) throw err;
        connection.query('SELECT id FROM subject ORDER BY id DESC',(err,rows)=>{
            if (err) throw err;
            console.log(rows[0])
            var last_id=rows[0].id;
            connection.query('SELECT id FROM student WHERE tid=?',[user.id],(err,rows)=>{
                if (err) throw err;
                rows.forEach(da => {
                    var value={stid:da.id, suid:last_id,attendance:0};
                   connection.query('INSERT INTO map SET ?',value,(err,result)=>{
                    if (err) throw err;
                   }) 
                });
            })
        });
        
    });
    res.redirect('/home')
})


app.listen(port,()=>{
    console.log("running...");
})