const express = require('express');
const authenticate  = require('../middlewares/auth');
const { readUsers } = require('../utils/userUtils'); // 引入工具函数
const paginate = require('../utils/paginate'); // 引入分页工具函数
const redis = require('../redis'); // 引入 Redis 客户端

const router = express.Router();

// 用户信息查询接口
router.get('/users', authenticate(), async (req, res) => {
    try{
        const { page = 1, limit = 10 } = req.query; // 获取分页参数
        const users = readUsers();

        if (req.user.role === 'admin') {
            // 检查 Redis 是否有缓存
            const cacheKey = `users:page:${page}:limit:${limit}`;
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                return res.success(JSON.parse(cachedData), '查询成功');
            }

            // admin 查询所有用户
            const paginatedUsers = paginate(users, page, limit);

            // 存储到 Redis，并设置过期时间（如 60 秒）
            await redis.set(cacheKey, JSON.stringify(paginatedUsers), 'EX', 60);

            return res.success(paginatedUsers, '查询成功');
        } else if (req.user.role === 'user') {
            // user 查询自己的信息
            const cacheKey = `users:user:${req.user.username}`;
            const cachedData = await redis.get(cacheKey);

            if (cachedData) {
                return res.success(JSON.parse(cachedData), '查询成功');
            }

            const user = users.find(u => u.username === req.user.username);

            if (!user) {
                return res.fail('用户不存在', 404);
            }

            await redis.set(cacheKey, JSON.stringify({ user }), 'EX', 60);

            return res.success({ user }, '查询成功');
        } else {
            return res.fail('权限不足', 403);
        }
    } catch (error) {
        return res.fail('查询失败', 500);
    }
});

module.exports = router;