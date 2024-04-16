create database mycamu;
use mycamu;

create table teacher(
id int primary key auto_increment,
name varchar(25),
mail varchar(25),
passwd varchar(15));

create table student(
id int primary key auto_increment,
tid int,
name varchar(25),
mail varchar(25),
passwd varchar(25),
adno int,
rollno varchar(10),
degree varchar(35),
department varchar(50),
foreign key(tid) references teacher(id));

create table subject(
sid int primary key auto_increment,
tid int,
subject_code varchar(15),
subject_name varchar(30),
semster int,
credit int,
foreign key(tid) references teacher(id));

create table map(
mid int primary key auto_increment,
sid int,
suid int,
cat1 int,
cat2 int,
sem int,
attendance int,
foreign key(suid) references subject(id),
foreign key(sid) references student(id));

create table sleave(
id int primary key auto_increment,
tid int,
sid int,
type int,
fdate varchar(15),
tdate varchar(15),
reason varchar(25),
status int,
foreign key (tid) references teacher(id),
foreign key (sid) references students(id));

create table bill(
id int primary key auto_increment,
sid int,
amount int,
status int,
foreign key (sid) references student(id));

insert into teacher(name,mail,passwd) values
("akash","akash@abc.com","123"),
("teacher2","teacher2@abc.com",123),
("teacher3","teacher3@abc.com",123),
("teacher4","teacher4@abc.com",123),
("teacher5","teacher5@abc.com",123);

select * from map; 

ALTER TABLE map
RENAME COLUMN sid TO stid;