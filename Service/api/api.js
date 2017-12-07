var express = require('express');
var router = express.Router();

var article = require('../logic/article');

//文章新增
router.post('/articles', function (req, res) {
    article.addArticles(req, res);
});

//分类新增
router.post('/classifys', function (req, res) {
    article.addClassifys(req, res);
});

//查询全部分类
router.get('/classifys', function (req, res) {
    article.getClassifys(req, res);
});

/*=====================================================web首页==================================================================*/
//查询全部文章
router.get('/articles', function (req, res) {
    article.getArticles(req, res);
});

//查询全部标签
router.get('/tags', function (req, res) {
    article.getTags(req, res);
});

//查询文章对应所有标签
router.get('/tags/:articleid', function (req, res) {
    article.getArticleTags(req, res);
});

//查询我的历程
router.get('/articles/lives', function (req, res) {
    article.getArticlesLives(req, res);
});

//通过类型查询文章列表
router.get('/articles/:type/:arg', function (req, res) {
    article.getArticleListByType(req, res);
});

/*=====================================================web详情页==================================================================*/
//查询单篇文章详情
router.get('/articles/:id', function (req, res) {
    article.getArticlesDetails(req, res);
});

//更新单篇文章浏览量
router.put('/articles/:id', function (req, res) {
    article.updateArticleViewnum(req, res);
});

//删除文章
router.delete('/articles/:id', function (req, res) {
    article.deleteArticle(req, res);
});

/*===================================================管理系登录=============================================================================*/
router.post('/user', function (req, res) {
    article.ms_login(req, res);
});

router.get('/user/:id', function (req, res) {
    article.ms_sUser(req, res);
});

module.exports = router;
