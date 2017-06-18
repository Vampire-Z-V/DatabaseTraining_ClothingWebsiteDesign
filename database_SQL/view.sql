#drop view if exists item_labels ;
#create view item_labels as
#select pic_id,ID,attrn_id,attrValue
#from items natural join attrtable  natural join attrvalue 
#order by ID;attributesattributesattributesattributes

drop view if exists items_catagory_subview;
create view items_catagory_subview as 
select item_name,ID, cata_id, cata_name, parent_id
from items natural join catagory;
    
drop view if exists items_catagory_view ;
create view items_catagory_view as (
select T.item_name,T.ID, T.cata_name as type, catagory.cata_name as group_name
from items_catagory_subview as T, catagory
where T.parent_id = catagory.cata_id
);

drop view if exists items_sales_view ;
create view items_sales_view as (
select *
from items_catagory_view natural join sales
);

drop view if exists items_attributes_view ;
create view items_attributes_view as
select ID,attrName,attrValue 
from attrTable natural join attrName natural join attrValue;

drop view if exists attributes_view ;
create view attributes_view as
select cata_id,cata_name,attrn_id,attrName,attrv_id,attrValue,parent_id,multi
from attrName natural join catagory natural join attrValue;
