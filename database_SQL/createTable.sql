drop table if exists users;
drop table if exists monthlysales;
drop table if exists annualsales;
drop table if exists stocks;
drop table if exists sales;
drop table if exists attrTable;
drop table if exists items;
drop table if exists attrValue;
drop table if exists attrName;
drop table if exists catagory;
drop table if exists pictures;
drop table if exists project;



create table project(
	pro_id int auto_increment not null,
    pro_name varchar(50) not null,
    pro_status ENUM('undo', 'done') not null,
    primary key(pro_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
create table pictures(
	pic_id int auto_increment not null,
    pic_path varchar(50) not null,
    pic_status ENUM('undo', 'done', 'useless') not null,
    pro_id int null null,
    primary key (pic_id),
    foreign key (pro_id) references project(pro_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

    
create table catagory(
	cata_id int auto_increment not null,
    cata_name varchar(20) unique,         #设置了类名不重复
    parent_id int default null,
    primary key (cata_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
create table attrName(
	attrn_id int auto_increment not null,
    attrName varchar(20) not null,
    cata_id int not null,
    multi bool not null,
    primary key (attrn_id),
    foreign key (cata_id) references catagory(cata_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
create table attrValue(
	attrv_id int auto_increment not null,
    attrValue varchar(20) not null,
    attrn_id int not null,
    primary key(attrv_id),
    foreign key(attrn_id) references attrName(attrn_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;


create table items(
	ID varchar(7) not null,
    item_name varchar(50) not null,
    cata_id int(11) not null,
    pic_id int not null,
	createTime Date,
    primary key (ID),
    foreign key (cata_id) references catagory(cata_id),
    foreign key (pic_id) references pictures(pic_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table attrTable(
	attrTable_id int auto_increment not null,
	ID varchar(7) not null,
    attrn_id int not null,
    attrv_id int not null,
    primary key (attrTable_id),
    foreign key (ID) references items(ID),
    foreign key (attrn_id) references attrName(attrn_id),
    foreign key (attrv_id) references attrValue(attrv_id)
    )ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
create table sales(
	ID varchar(7) not null,
    region_id int,
    channel varchar(20),
    agegroup varchar(20),
    primary key(ID),
    foreign key(ID) references items(ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


create table stocks(
	stocks_id int auto_increment not null,
    ID varchar(7) not null, 
    size ENUM('80', '90', '100', '110', '120', '130', '140', '150', '155', '160', '165', '170', '175', '180') not null,
    stocks_num int not null,
    primary key(stocks_id),
    foreign key (ID) references items(ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table monthlysales(
	month_id int auto_increment not null,
    ID varchar(7) not null, 
    month ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12') not null,
    amount int not null,
    primary key(month_id),
    foreign key (ID) references items(ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table annualsales(
	annual_id int auto_increment not null,
    ID varchar(7) not null, 
    year varchar(4) not null,
    amount int not null,
    primary key(annual_id),
    foreign key (ID) references items(ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
    
create table users(
	ID int(11) auto_increment not null,
	user_type enum('系统管理员','服装设计师','销售管理员') not null,
	name varchar(20) not null,
	password varchar(20) not null,
	createdAt datetime,
	updatedAt datetime,
	primary key(ID)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;