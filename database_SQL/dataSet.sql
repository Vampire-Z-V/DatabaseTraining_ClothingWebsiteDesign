set sql_safe_updates = 0;

delete from pictures_items_relation;
delete from annualsales;
delete from monthlysales;
delete from attrTable; 
delete from sales;
delete from items;
delete from attrValue;
delete from attrName;
delete from catagory;
delete from pictures;
delete from project;


#catagory 初始化
insert into catagory(cata_id, cata_name) values('1', '服装');
insert into catagory(cata_id, cata_name, parent_id) values('2', '上衣', '1');
insert into catagory(cata_id, cata_name, parent_id) values('3', '下装', '1');
insert into catagory(cata_id, cata_name, parent_id) values('4', '连衣裙', '1');
#上衣子类型
insert into catagory(cata_id, cata_name, parent_id) values('21', 'T恤衫', '2');
insert into catagory(cata_id, cata_name, parent_id) values('22', '夹克', '2');
insert into catagory(cata_id, cata_name, parent_id) values('23', '衬衫', '2');
insert into catagory(cata_id, cata_name, parent_id) values('24', '棒球服', '2');
insert into catagory(cata_id, cata_name, parent_id) values('25', 'POLO衫', '2');
insert into catagory(cata_id, cata_name, parent_id) values('26', '西装', '2');
insert into catagory(cata_id, cata_name, parent_id) values('27', '毛呢衣', '2');
#下装子类型
insert into catagory(cata_id, cata_name, parent_id) values('31', '休闲裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('32', '牛仔裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('33', '西裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('34', '运动裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('35', '九分裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('36', '阔腿裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('37', '哈伦裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('38', '绵裤', '3');
insert into catagory(cata_id, cata_name, parent_id) values('39', '裙子', '3');
#连衣裙子类型
insert into catagory(cata_id, cata_name, parent_id) values('41', '半身裙', '4');
insert into catagory(cata_id, cata_name, parent_id) values('42', '吊带', '4');


#attrName 初始化
#衣服公共属性
insert into attrName(attrn_id, attrName, cata_id, multi) values('1', '颜色', 1, true);
insert into attrName(attrn_id, attrName, cata_id, multi) values('2', '面料', 1, true);
insert into attrName(attrn_id, attrName, cata_id, multi) values('3', '风格', 1, true);
#上衣特有属性
insert into attrName(attrn_id, attrName, cata_id, multi) values('4', '领型', 2, false);
insert into attrName(attrn_id, attrName, cata_id, multi) values('5', '袖型', 2, false);
insert into attrName(attrn_id, attrName, cata_id, multi) values('6', '衣长', 2, false);
#下装特有属性
insert into attrName(attrn_id, attrName, cata_id, multi) values('7', '厚薄', 3, false);
insert into attrName(attrn_id, attrName, cata_id, multi) values('8', '裤长', 3, false);
#连衣裙特有属性
insert into attrName(attrn_id, attrName, cata_id, multi) values('9', '腰型', 4, false);
insert into attrName(attrn_id, attrName, cata_id, multi) values('10', '袖长', 4, false);
insert into attrName(attrn_id, attrName, cata_id, multi) values('11', '领型', 4, false);
insert into attrName(attrn_id, attrName, cata_id, multi) values('12', '裙长', 4, false);


#attrValue初始化
#颜色初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values('1', '黑', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('2', '白', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('3', '红', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('4', '橙', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('5', '黄', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('6', '绿', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('7', '青', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('8', '蓝', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('9', '紫', 1);
insert into attrValue(attrv_id, attrValue, attrn_id) values('10', '花色', 1);
#面料初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values('11', '棉', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('12', '涤纶', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('13', '蚕丝', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('14', '锦纶', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('15', '麻', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('16', '针织布', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('17', '汗布', 2);
insert into attrValue(attrv_id, attrValue, attrn_id) values('18', '羊毛', 2);
#风格初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values('21', '潮流', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('22', '甜美', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('23', '简约', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('24', '嘻哈', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('25', '中性', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('26', '奢华', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('27', '性感', 3);
insert into attrValue(attrv_id, attrValue, attrn_id) values('28', '欧美', 3);
#领型初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values('31','圆领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(32,'V领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(33,'一字领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(34,'立领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(35,'POLO领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(36,'方领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(37,'斜领', 4);
insert into attrValue(attrv_id, attrValue, attrn_id) values(38,'高领', 4);
#袖型初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(41,'短袖', 5);
insert into attrValue(attrv_id, attrValue, attrn_id) values(42,'五分袖', 5);
insert into attrValue(attrv_id, attrValue, attrn_id) values(43,'长袖', 5);
insert into attrValue(attrv_id, attrValue, attrn_id) values(44,'无袖', 5);
insert into attrValue(attrv_id, attrValue, attrn_id) values(45,'七分袖', 5);
insert into attrValue(attrv_id, attrValue, attrn_id) values(46,'九分袖', 5);
#衣长初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(51,'常规', 6);
insert into attrValue(attrv_id, attrValue, attrn_id) values(52,'短款', 6);
insert into attrValue(attrv_id, attrValue, attrn_id) values(53,'中长款', 6);
insert into attrValue(attrv_id, attrValue, attrn_id) values(54,'超短款', 6);
insert into attrValue(attrv_id, attrValue, attrn_id) values(55,'超短', 6);
#厚薄初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(61,'常规', 7);
insert into attrValue(attrv_id, attrValue, attrn_id) values(62,'厚', 7);
insert into attrValue(attrv_id, attrValue, attrn_id) values(63,'加厚', 7);
insert into attrValue(attrv_id, attrValue, attrn_id) values(64,'超薄', 7);
insert into attrValue(attrv_id, attrValue, attrn_id) values(65,'薄', 7);
insert into attrValue(attrv_id, attrValue, attrn_id) values(66,'适中', 7);
insert into attrValue(attrv_id, attrValue, attrn_id) values(67,'加绒', 7);
#裤长初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(71,'长裤', 8);
insert into attrValue(attrv_id, attrValue, attrn_id) values(72,'七分裤', 8);
insert into attrValue(attrv_id, attrValue, attrn_id) values(73,'九分裤', 8);
insert into attrValue(attrv_id, attrValue, attrn_id) values(74,'短裤', 8);
insert into attrValue(attrv_id, attrValue, attrn_id) values(75,'五分裤', 8);
insert into attrValue(attrv_id, attrValue, attrn_id) values(76,'超短裤', 8);
#腰型初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(81,'中腰', 9);
insert into attrValue(attrv_id, attrValue, attrn_id) values(82,'宽腰', 9);
insert into attrValue(attrv_id, attrValue, attrn_id) values(83,'松紧腰', 9);
insert into attrValue(attrv_id, attrValue, attrn_id) values(84,'低腰', 9);
#袖长初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(91,'短袖', 10);
insert into attrValue(attrv_id, attrValue, attrn_id) values(92,'五分袖', 10);
insert into attrValue(attrv_id, attrValue, attrn_id) values(93,'长袖', 10);
insert into attrValue(attrv_id, attrValue, attrn_id) values(94,'无袖', 10);
insert into attrValue(attrv_id, attrValue, attrn_id) values(95,'七分袖', 10);
insert into attrValue(attrv_id, attrValue, attrn_id) values(96,'九分袖', 10);
insert into attrValue(attrv_id, attrValue, attrn_id) values(97,'吊带', 10);
#领型初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(101,'圆领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(102,'V领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(103,'一字领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(104,'立领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(105,'POLO领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(106,'方领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(107,'斜领', 11);
insert into attrValue(attrv_id, attrValue, attrn_id) values(108,'高领', 11);
#裙长初始化
insert into attrValue(attrv_id, attrValue, attrn_id) values(111,'中长款', 12);
insert into attrValue(attrv_id, attrValue, attrn_id) values(112,'中裙', 12);
insert into attrValue(attrv_id, attrValue, attrn_id) values(113,'长裙', 12);
insert into attrValue(attrv_id, attrValue, attrn_id) values(114,'短裙', 12);
insert into attrValue(attrv_id, attrValue, attrn_id) values(115,'超短裙', 12);


#project 初始化
insert into project(pro_id, pro_name) values(1, 'London 春季走秀');
insert into project(pro_id, pro_name) values(2, 'NewYork 夏季走秀');
insert into project(pro_id, pro_name) values(3, 'Shanghai 春季走秀');


#pictures 初始化
insert into pictures(pic_id, pic_path, pro_id) values(1, 'home/w2w/pic1', 1);
insert into pictures(pic_id, pic_path, pro_id) values(2, 'home/w2w/pic2', 1);
insert into pictures(pic_id, pic_path, pro_id) values(3, 'home/w2w/pic3', 2);
insert into pictures(pic_id, pic_path, pro_id) values(4, 'home/w2w/pic4', 3);
insert into pictures(pic_id, pic_path, pro_id) values(5, 'home/w2w/pic5', 3);


#items 初始化
#插入item属于类型‘21’（衬衫），对应的图片是‘1’号图片， ID为自动增量生成，createTime 这里暂时没管
insert into items(ID, item_name, cata_id) values('1', '好看的衣服', '23');  
insert into items(ID, item_name, cata_id) values('2', '好看的衣服', '41');  
insert into items(ID, item_name, cata_id) values('3', '好看的衣服', '27');  
insert into items(ID, item_name, cata_id) values('4', '好看的衣服', '22');  
insert into items(ID, item_name, cata_id) values('5', '好看的衣服', '27');  
#插入item属于类型‘31’（西裤），对应的图片是‘1’号图片， 与之前为1的为同一张图片
insert into items(ID, item_name, cata_id) values('11', '好看的衣服', '33'); 
insert into items(ID, item_name, cata_id) values('12', '好看的衣服', '39');  
insert into items(ID, item_name, cata_id) values('13', '好看的衣服', '39');  
insert into items(ID, item_name, cata_id) values('14', '好看的衣服', '39');  
insert into items(ID, item_name, cata_id) values('15', '好看的衣服', '39');

#pictures_items_relation init
insert into pictures_items_relation(ID, pic_id) values(1, 1);
insert into pictures_items_relation(ID, pic_id) values(2, 2);
insert into pictures_items_relation(ID, pic_id) values(3, 3);
insert into pictures_items_relation(ID, pic_id) values(4, 4);
insert into pictures_items_relation(ID, pic_id) values(5, 5);
insert into pictures_items_relation(ID, pic_id) values(11, 1);
insert into pictures_items_relation(ID, pic_id) values(12, 3);
insert into pictures_items_relation(ID, pic_id) values(13, 4);
insert into pictures_items_relation(ID, pic_id) values(14, 4);
insert into pictures_items_relation(ID, pic_id) values(15, 5);

#attrTable初始化
#完成第1件商品的标注
#第1件商品(ID=1)的颜色属性(attrn_id=1)为黑色(attrv_id=1)
insert into attrTable(ID, attrn_id, attrv_id) values(1, 1, 1);
insert into attrTable(ID, attrn_id, attrv_id) values(1, 2, 11);
insert into attrTable(ID, attrn_id, attrv_id) values(1, 3, 21);
insert into attrTable(ID, attrn_id, attrv_id) values(1, 4, 34);
insert into attrTable(ID, attrn_id, attrv_id) values(1, 5, 43);
insert into attrTable(ID, attrn_id, attrv_id) values(1, 6, 51);
#第2件商品（连衣裙）
insert into attrTable(ID, attrn_id, attrv_id) values(2, 1, 10);
insert into attrTable(ID, attrn_id, attrv_id) values(2, 2, 13);
insert into attrTable(ID, attrn_id, attrv_id) values(2, 3, 26);
insert into attrTable(ID, attrn_id, attrv_id) values(2, 9, 82);
insert into attrTable(ID, attrn_id, attrv_id) values(2, 10, 91);
insert into attrTable(ID, attrn_id, attrv_id) values(2, 11, 101);
#之后还有几件就先不标了。。

#sales初始化
insert into sales(ID, region_id, channel,agegroup) values(1, 1, '线上','青少年');
insert into sales(ID, region_id, channel,agegroup) values(2, 2, '线上','中年');
insert into sales(ID, region_id, channel,agegroup) values(3, 2, '线上','儿童');
insert into sales(ID, region_id, channel,agegroup) values(4, 3, '线上','青少年');
insert into sales(ID, region_id, channel,agegroup) values(5, 4, '线下','中年');

insert into annualsales(ID,year,amount)values(1,2017,10000);
insert into annualsales(ID,year,amount)values(1,2016,10600);
insert into annualsales(ID,year,amount)values(1,2015,10100);
insert into annualsales(ID,year,amount)values(1,2014,9000);
insert into annualsales(ID,year,amount)values(1,2013,12000);
insert into annualsales(ID,year,amount)values(2,2017,20000);
insert into annualsales(ID,year,amount)values(2,2016,20400);
insert into annualsales(ID,year,amount)values(3,2017,15000);
insert into annualsales(ID,year,amount)values(3,2016,15300);
insert into annualsales(ID,year,amount)values(4,2017,40000);
insert into annualsales(ID,year,amount)values(4,2016,40200);
insert into annualsales(ID,year,amount)values(5,2017,20000);
insert into annualsales(ID,year,amount)values(5,2016,20100);


insert into monthlysales(ID,month,amount)values(1,1,2000);
insert into monthlysales(ID,month,amount)values(1,2,1000);
insert into monthlysales(ID,month,amount)values(1,3,2030);
insert into monthlysales(ID,month,amount)values(1,4,4000);
insert into monthlysales(ID,month,amount)values(1,5,2100);
insert into monthlysales(ID,month,amount)values(1,6,5000);
insert into monthlysales(ID,month,amount)values(1,7,200);
insert into monthlysales(ID,month,amount)values(1,8,123);
insert into monthlysales(ID,month,amount)values(1,9,432);
insert into monthlysales(ID,month,amount)values(1,10,342);
insert into monthlysales(ID,month,amount)values(1,11,234);
insert into monthlysales(ID,month,amount)values(1,12,543);
insert into monthlysales(ID,month,amount)values(2,1,1000);
insert into monthlysales(ID,month,amount)values(3,1,1500);
insert into monthlysales(ID,month,amount)values(4,1,4000);
insert into monthlysales(ID,month,amount)values(5,1,2000);
