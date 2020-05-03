import {ErrorModel, SuccessModel} from "../model/resModel";

const {login} = require("../controller/user");

var express = require('express');
var router = express.Router();

router.post('/login', function (req, res, next) {
    const {username, password} = req.body;
    const result = login(username, password);
    return result.then(data => {
        if (data.username) {
            //设置session
            req.session.username = data.username;
            req.session.realname = data.realname;
            // set(req.sessionId, req.session);
            res.json(new SuccessModel());
            return;
        }
        res.json(new ErrorModel("登录失败"));
    });
});

module.exports = router;
