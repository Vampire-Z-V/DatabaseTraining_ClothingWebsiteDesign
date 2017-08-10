select * from catagory;
select * from attrName;
select * from attrValue;
select * from items;
select * from pictures;
select * from project;
select * from attrTable;
select * from sales;

-- 查询示例
#查询一个类别的所有直接相连子类
set @c_id = 2;
select cata_id, cata_name
from catagory
where parent_id= @c_id;

#查询一个类别的所有专属属性
set @c_id = 3;
select attrn_id, attrName
from attrName
where cata_id = @c_id;

#查询一个类别的所有属性
#其中2为c_id的父类， 1为父类的父类。 
#本来准备通过递归查询来查找所有的父类，但是如果是一级一级选下来的话就没有必要了
set @c_id = 21;
select attrn_id, attrName
from attrName
where cata_id in (@c_id, 2, 1);

#查询一个item的所有属性和对应的属性值
set @t_id = 2;
select T.attrn_id, N.attrName, T.attrv_id, V.attrValue
from attrTable as T, attrValue as V, attrName as N
where T.ID = @t_id and T.attrn_id = N.attrn_id and T.attrv_id = V.attrv_id
