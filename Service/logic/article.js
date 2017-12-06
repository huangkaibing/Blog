var mongoose = require('mongoose');
var Q = require('q');
var uuidv4 = require('uuid/v4');
var moment = require('moment');
mongoose.Promise = Q.Promise;

var ARTICLE_BO = require('../bo/article');
var CLASSIFY_BO = require('../bo/classify');
var TAG_BO = require('../bo/tag');
var ARTICLETAGSLINK_BO = require('../bo/articletagslink');

//文章新增
function addArticles(req, res) {
    var obj = mongoose.model('article', ARTICLE_BO);
    var bean = req.body;
    var article_id = uuidv4().replace(/-/g, "");
    if (bean.id) {
        article_id = bean.id;
    }

    var eb = new obj({
        _id: article_id,
        title: bean.title,
        markdown: bean.markdown,
        previewedHTML: bean.previewedHTML,
        viewnum: '0',
        author: 'huangkb',
        ispublished: bean.ispublished,
        classify_name: bean.classify_name,
        classify_id: bean.classify_id,
        lives: moment().year() + "-" + (moment().month() + 1)
    });
    if (bean.id) {
        var updates = {
            $set: {
                title: bean.title,
                markdown: bean.markdown,
                previewedHTML: bean.previewedHTML,
                classify_name: bean.classify_name,
                classify_id: bean.classify_id
            }
        };
        obj.update({"_id": bean.id}, updates, function (err) {
            if (err) console.warn(err);
            console.log('article update success');
        });
    } else {
        eb.save(function (err, result) {
            if (err) console.warn(err);
            console.log('article save success');
        })
    }

    //标签新增
    var tags = bean.tags;
    var arrtag = tags.split(",");
    for (var i = 0; i < arrtag.length; i++) {
        if (arrtag[i]) {
            addTags(arrtag[i]).then(function (result) {
                addArticleTagsLink(result, article_id).then(function (result) {

                });
            });
        }
    }
    res.send(article_id);
}

//标签新增
function addTags(name) {
    var p = Q.defer();
    var obj = mongoose.model('tag', TAG_BO);
    getTagsSingle(name).then(function (result) {
        if (result === null || result.length === 0) {
            var tag_id = uuidv4().replace(/-/g, "");
            var eb = new obj({
                _id: tag_id,
                name: name
            });
            eb.save(function (err, result) {
                if (err) console.warn(err);
                console.log('tags save success');
                p.resolve(tag_id);
            })
        } else {
            p.resolve(result[0]._id);
        }
    });
    return p.promise;
}

//关联表新增
function addArticleTagsLink(tag_id, article_id) {
    var p = Q.defer();
    var obj = mongoose.model('articletagslink', ARTICLETAGSLINK_BO);
    var eb = new obj({
        tag_id: tag_id,
        article_id: article_id
    });
    //查询
    obj.find({"tag_id": tag_id, "article_id": article_id}, function (err, result) {
        if (err) {
            console.warn("关联表新增查询失败");
            p.resolve("zuihou");
        }
        if (result === null || result.length === 0) {
            eb.save(function (err, result) {
                if (err) console.warn(err);
                console.log('articletagslink save success');
                p.resolve("zuihou");
            })
        }
    });
    return p.promise;
}

//单一标签查询
function getTagsSingle(name) {
    var p = Q.defer();
    var obj = mongoose.model('tag', TAG_BO);
    obj.find({"name": name}, function (err, result) {
        if (err) console.warn(err);
        p.resolve(result);
    });
    return p.promise;
}

//全部标签查询
function getTags(erq, res) {
    var obj = mongoose.model('articletagslink', ARTICLETAGSLINK_BO);
    var obj1 = mongoose.model('tag', TAG_BO);

    obj.aggregate(
        {$group: {_id: "$tag_id", "count": {$sum: 1}}},
        {$sort: {"count": -1}}, function (err, result) {
            //处理tag_name
            var map = {};
            var len = result.length;
            var n = 0;
            for (var i = 0; i < len; i++) {
                map[result[i]._id] = result[i];
                obj1.find({'_id': result[i]._id}, function (err, result) {
                    n++;
                    map[result[0]._id].name = result[0].name;
                    map[result[0]._id]._id = result[0]._id;
                    if (n === len) {
                        res.send(map);
                    }
                });
            }
        });
}

//查询文章对应的所有标签
function getArticleTags(req, res) {
    var obj = mongoose.model('articletagslink', ARTICLETAGSLINK_BO);
    var obj1 = mongoose.model('tag', TAG_BO);

    obj.find({'article_id': req.params.articleid}, function (err, result) {
        var len = result.length;
        var n = 0;
        var tagstr = "";
        for (var i = 0; i < len; i++) {
            var tag_id = result[i].tag_id;
            obj1.find({'_id': tag_id}, function (err, result) {
                n++;
                tagstr += result[0].name + ",";
                if (n === len) {
                    res.send(tagstr);
                }
            });
        }
    });
}

//文章列表查询
function getArticles(req, res) {
    var obj = mongoose.model('article', ARTICLE_BO);
    obj.find(null, {
        createtime: 1,
        title: 1,
        viewnum: 1,
        classify_name: 1
    }, {sort: ({"createtime": -1})}, function (err, result) {
        res.send(result);
    });
}

//历程列表查询
function getArticlesLives(req, res) {
    var obj = mongoose.model('article', ARTICLE_BO);
    obj.aggregate(
        {$group: {_id: "$lives", "count": {$sum: 1}}},
        {$sort: {"count": -1}}, function (err, result) {
            res.send(result);
        });
}

//文章列表分类查询
function getArticleListByType(req, res) {
    var obj1 = mongoose.model('article', ARTICLE_BO);
    var obj2 = mongoose.model('articletagslink', ARTICLETAGSLINK_BO);

    var type = parseInt(req.params.type);

    //标签
    if (type === 1) {
        obj2.find({'tag_id': req.params.arg}, null, {sort: ({"createtime": -1})}, function (err, result) {
            var map = {};
            var len = result.length;
            var n = 0;
            for (var i = 0; i < len; i++) {
                var tmpid = result[i].article_id;
                map[tmpid] = result[i];
                obj1.find({'_id': tmpid}, function (err, result) {
                    n++;
                    map[result[0]._id] = result[0];
                    if (n === len) {
                        res.send(map);
                    }
                });
            }
        });
    }

    //历程
    if (type === 2) {
        obj1.find({'lives': req.params.arg}, null, {sort: ({"createtime": -1})}, function (err, result) {
            res.send(result);
        });
    }

    //详情上一篇/下一篇
    var bean = {};
    if (type === 3) {
        //上一篇
        obj1.find({"createtime": {"$lt": req.params.arg}}, {
            title: 1
        }, {
            sort: ({"createtime": -1}),
            limit: 1
        }, function (err, result) {
            bean.lastArticle = result[0];
            //下一篇
            obj1.find({"createtime": {"$gt": req.params.arg}}, {
                title: 1
            }, {
                sort: ({"createtime": 1}),
                limit: 1
            }, function (err, result) {
                bean.nextArticle = result[0];
                res.send(bean);
            });
        });
    }
}

//文章详情查询
function getArticlesDetails(req, res) {
    var obj = mongoose.model('article', ARTICLE_BO);
    obj.find({'_id': req.params.id}, {
        createtime: 1, title: 1, markdown: 1, author: 1, classify_name: 1
    }, function (err, result) {
        res.send(result);
    });
}

//文章分类查询
function getClassifys(req, res) {
    var obj = mongoose.model('classify', CLASSIFY_BO);
    obj.find(function (err, result) {
        res.send(result);
    });
}

//文章分类新增
function addClassifys(req, res) {
    var obj = mongoose.model('classify', CLASSIFY_BO);
    var eb = new obj({
        name: req.body.name
    });
    eb.save();
    res.send(req.body.name + "-->>新增成功！");
}

//更新单篇文章浏览量
function updateArticleViewnum(req, res) {
    var obj = mongoose.model('article', ARTICLE_BO);
    obj.update({'_id': req.params.id}, {'$inc': {"viewnum": 1}}, function () {
        res.send("");
    });
}

//删除文章
function deleteArticle(req, res) {
    var obj = mongoose.model('article', ARTICLE_BO);
    var obj2 = mongoose.model('articletagslink', ARTICLETAGSLINK_BO);
    //step1:删除文章对应的标签
    obj2.remove({'article_id': req.params.id}, function () {
        obj.remove({'_id': req.params.id}, function () {
            //step2:删除文章
            res.send(req.params.id + "-->>删除成功！");
        });
    });


}

module.exports.addArticles = addArticles;
module.exports.addClassifys = addClassifys;
module.exports.getClassifys = getClassifys;
module.exports.getArticles = getArticles;
module.exports.getTags = getTags;
module.exports.getArticlesDetails = getArticlesDetails;
module.exports.getArticleListByType = getArticleListByType;
module.exports.getArticlesLives = getArticlesLives;
module.exports.updateArticleViewnum = updateArticleViewnum;
module.exports.deleteArticle = deleteArticle;
module.exports.getArticleTags = getArticleTags;
