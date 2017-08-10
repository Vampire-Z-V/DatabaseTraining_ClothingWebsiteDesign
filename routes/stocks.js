var stocks = function (router, model) {
    router.get("/stocks", function (req, res) {
        if (!req.session.user) {
            res.status(401).render('ejs/messege.ejs', { msg: "Please login first.", status: 401 }, function (error, string) {
                req.session.msg = string;
                res.redirect('/index');
            });
        }

        var data = [];
        var complete = 0;
        var stock_data;
        var Stocks = model.stocks;
        var Items = model.items;
        var Pictures = model.pictures;
        var pictures_items_relation = model.pictures_items_relation;

        Stocks.findAll()
            .then(stocks => {
                stock_data = stocks;
                stocks.forEach(function (stock) {
                    var temp = {};
                    temp.stocks_id = stock.stocks_id;
                    temp.stocks_num = stock.stocks_num;
                    var ID = stock.ID;

                    Items.findOne({where: {ID : ID}})
                        .then(item=>{
                            temp.name = item.item_name;
                        })
                        .catch(err=>{
                            console.log(err);
                        });

                    pictures_items_relation.findOne({ where: { ID: ID } })
                        .then(item => {
                            Pictures.findOne({ where: { pic_id: item.pic_id } })
                                .then(picture => {
                                    temp.path = picture.pic_path;
                                    data.push(temp);
                                    complete++;
                                     if(complete === stock_data.length){
                                        console.log(data.length);

                                        res.render('stocks', {
                                            stocks: data
                                        });
                                    }
                                    //console.log(data);
                                })
                                .catch(err1 => {
                                    console.log(err1);
                                });
                        })
                        .catch(err2 => {
                            console.log(err2);
                        });
                });

            })
            // .then(nu=> {
            //     console.log(complete);
            //     console.log(stock_data.length);
            //     if(complete === stock_data.length){
            //         console.log(data.length);

            //         res.render('stocks', {
            //             stocks: data
            //         });
            //     }
            // })
            .catch(err3 => {
                console.log(err3);
            });
    });
};

module.exports = stocks;