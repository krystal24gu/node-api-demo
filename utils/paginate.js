module.exports = function paginate(data, page = 1, limit = 10) {
    const start = (page - 1) * limit; // 计算起始索引
    return {
        total: data.length, // 数据总条数
        page: parseInt(page), // 当前页码
        limit: parseInt(limit), // 每页条数
        users: data.slice(start, start + limit) // 当前页的数据
    };
};