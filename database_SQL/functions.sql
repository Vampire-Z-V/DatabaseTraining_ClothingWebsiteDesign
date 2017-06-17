drop function if exists cataid_of ;

delimiter $$
create function cataid_of(cataname varchar(20))
	returns integer
    begin
    declare id int;
		select cata_id into id
		from catagory
		where cata_name = cataname;
	return id;
	end$$
delimiter ;

#获得紧邻的类别子集
drop procedure if exists subcata_of;
delimiter $$
create procedure subcata_of(in cataname varchar(20))
	begin
    DROP TEMPORARY TABLE IF EXISTS temp;
	CREATE TEMPORARY TABLE temp
		select cata_id, cata_name
        from catagory
        where parent_id = (select cata_id from catagory where cataname = cata_name );
	end$$
delimiter ;

#获得所有的父种类
drop procedure if exists supercata_of;
delimiter $$
create procedure supercata_of(in cataname varchar(20))
	begin
    declare root_id int default (select cata_id from catagory where cata_name = cataname);
    DROP TEMPORARY TABLE IF EXISTS temp;
	CREATE TEMPORARY TABLE temp(
		cata_id int, cata_name varchar(20));
	call supercata_of_help(root_id);
	end$$
delimiter ;
#辅助递归查询父种类函数
drop procedure if exists supercata_of_help;
delimiter $$
create procedure supercata_of_help(in root_id int)
	begin
        declare pid int default (select parent_id from catagory where cata_id = root_id);
        declare supper_id int;
        declare supper_name varchar(20);
		declare done int default 0;
        #如果parent_id不是多值属性的话，那么supperset就只有一组值
        declare cataname varchar(20) default (select cata_name from catagory where cata_id = root_id);
        declare supperset cursor for select cata_id, cata_name from catagory where cata_id = pid; 
        declare continue handler for not found set done = 1;
		SET max_sp_recursion_depth=5;   
        select root_id, cataname;
        insert into temp values(root_id,  cataname);
		open supperset;
        fetch supperset into supper_id, supper_name;
        select supper_id, supper_name;
        while done = 0 do
			call supercata_of_help(supper_id);
            fetch supperset into supper_id, supper_name;
        end while;
        close supperset;
    end$$
delimiter ;

#create function attrid_of( varchar(20))
#	return int
 #   begin
 #   declare 
#		select
#		*/