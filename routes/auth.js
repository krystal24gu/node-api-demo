/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 用户认证相关接口
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const SECRET_KEY = 'login_demo_secret_key';

const usersFilePath = path.join(__dirname, '../static/users.json');

// 工具函数：读取用户数据
const readUsers = () => {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(data);
};

// 工具函数：写入用户数据
const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// 注册接口
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: 用户注册
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *               role:
 *                 type: string
 *                 description: 用户角色
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: 用户已存在
 */

router.post('/register', (req, res) => {
    const { username, password, role } = req.body;

    const users = readUsers();

    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
        return res.fail('用户已存在');
    }

    const newUser = {
        id: users.length + 1,
        username,
        password,
        role: role || 'user'
    };
    users.push(newUser);

    // 写入用户数据到文件
    writeUsers(users);

    // 生成 JWT token
     const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });

    res.success({token}, '注册成功');
});

// 登录接口
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: 用户名或密码错误
 */
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 检查用户是否存在
    const users = readUsers();

    const user = users.find(u => u.username === username);
    if (!user || user.password !== password) {
        return res.fail('用户名或密码错误');
    }

    // 生成 JWT token
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.success({ token }, '登录成功');
});

module.exports = router;