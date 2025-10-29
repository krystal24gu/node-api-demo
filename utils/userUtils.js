const fs = require('fs');
const path = require('path');

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

module.exports = { readUsers, writeUsers };