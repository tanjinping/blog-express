var express = require('express');
var router = express.Router();
const {getList, getDetail, newBlog, updateBlog, deleteBlog} = require('../controller/blog');
const {SuccessModel, ErrorModel} = require('../model/resModel');
const loginCheck = require('../middleware/loginCheck');

router.get('/list', function (req, res, next) {
    const keyword = req.query.keyword || "";
    let author = req.query.author || "";
    if (req.query.isadmin) {
        if (!req.session.username) {
            res.json(new ErrorModel("未登录"));
            return;
        }
        author = req.session.username;
    }
    // const loginCheckResult = loginCheck(req);
    // if (loginCheckResult) {
    //     return loginCheckResult
    // }
    const result = getList(author, keyword);
    return result.then(listData => {
        res.json(new SuccessModel(listData));
    })
});

router.get('/detail', function (req, res, next) {
    const result = getDetail(req.query.id);
    return result.then(data => {
        res.json(new SuccessModel(data));
    })
});

router.post('/new', loginCheck, function (req, res, next) {
    req.body.author = req.session.username;
    const blogData = req.body;
    const result = newBlog(blogData);
    return result.then(data => {
        res.json(new SuccessModel(data));
    });
});

router.post('/update', loginCheck, function (req, res, next) {
    const result = updateBlog(req.query.id, req.body);
    return result.then(val => {
        if (val) {
            res.json(new SuccessModel());
        } else {
            res.json(new ErrorModel("更新博客失败"));
        }
    });
});

router.post('/del', loginCheck, function (req, res, next) {
    const author = req.session.username;
    const result = deleteBlog(req.query.id, author);
    return result.then(value => {
        if (value) {
            res.json(new SuccessModel());
        }
        res.json(new ErrorModel("删除博客失败"));
    })
});

module.exports = router;
