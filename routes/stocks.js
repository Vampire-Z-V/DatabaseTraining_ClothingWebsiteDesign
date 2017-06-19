var stocks = function (router, model) {
    router.get("/stocks", function (req, res) {
        if (!req.session.user) {
            req.session.error = "请先登录";
            res.redirect('/index');
        }
        
        var data = [];
        var Stocks = model.stocks;
        var Items = model.items;
        var Pictures = model.pictures;
        Stocks.findAll()
            .then(stocks=>{
                stocks.forEach(function(stock){
                    var temp={};
                    temp.stocks_id = stock.stocks_id;
                    temp.stocks_num = stock.stocks_num;
                    var ID = stock.ID;
                    Items.findOne({where:{ID: ID}})
                        .then(item=>{
                            temp.name = item.item_name;
                            Picture.findOne({where:{pic_id: item.pic_id}})
                                .then(picture=>{
                                    temp.path = picture.pic_path;
                                    data.push(temp);
                                })
                                .catch(err1=>{
                                    console.log(err1);
                                });
                        })
                        .catch(err2=>{
                            console.log(err2);
                        });
                });
            })
            .then(function(){
                res.render('stocks', {
                    stocks: data
                });
            })
            .catch(err3=>{
                console.log(err3);
            });
    });
};

module.exports = stocks;