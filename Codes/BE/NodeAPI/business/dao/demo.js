

class dao {
    static async getDemo(connection, params) {
        return new Promise(async (resolve, reject) => {
            connection.query("SELECT * FROM demo", [], (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        })
    }
}

module.exports = dao