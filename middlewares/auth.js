const jwt = require('jsonwebtoken');

module.exports = (roles = []) => (req, res, next) => {
    // 从请求头中获取 token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.fail('No token'); // 如果没有 token，返回错误
    }

    try {
        // 验证 token
        const payload = jwt.verify(token, 'login_demo_secret_key'); 
        req.user = payload; // 将解析后的用户信息存储到 req.user

        // 如果指定了角色，检查用户是否有权限
        if (roles.length && !roles.includes(payload.role)) {
            return res.fail('Permission denied', 403); // 如果角色不匹配，返回权限错误
        }

        next(); // 验证通过，继续执行下一个中间件或路由
    } catch (e) {
        res.fail('Invalid token', 401); // 如果 token 无效或过期，返回认证失败
    }
};