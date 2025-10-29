const express = require('express');
const authenticate  = require('../middlewares/auth');
const { readUsers } = require('../utils/userUtils'); // 引入工具函数
const paginate = require('../utils/paginate'); // 引入分页工具函数

const router = express.Router();

// 用户信息查询接口
router.get('/users', authenticate(), (req, res) => {
    const { page = 1, limit = 10 } = req.query; // 获取分页参数
    const users = readUsers();

    if (req.user.role === 'admin') {
        // admin 查询所有用户
        const paginatedUsers = paginate(users, page, limit);
        return res.success(paginatedUsers, '查询成功');
    } else if (req.user.role === 'user') {
        // user 查询自己的信息
        const user = users.find(u => u.username === req.user.username);
        return res.success({ user }, '查询成功');
    } else {
        return res.fail('权限不足', 403);
    }
});

module.exports = router;