const knex = require('knex')({
    client: 'pg',
    connection: {
        host: 'ec2-3-214-136-47.compute-1.amazonaws.com',
        user: 'ofnxmnbbapgvew',
        password: '7022d4bfaa5daf8f10e398166b8b8130a4c8d5b770d4efeda54a3ceefa377a80',
        database: 'd8848fuabc46fp',
        ssl: {
            rejectUnauthorized: false
        }
    }
});

module.exports = knex;
