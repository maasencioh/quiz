'use strict';

var path = require('path');

// Postgres: postgres://user:passwd@host:port/database
// SQLite: sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DBname = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBD SQLite
var sequelize = new Sequelize(null, null, null, {
    dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage,
    omitNull: true
});

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function () {
    // then(..) ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function (count) {
        if (count === 0) {
            Quiz.create({
                pregunta: 'Capital de Italia',
                respuesta: 'Roma'
            }).then(function () {
                console.log('Base de datos inicializada');
            });
        }
    })
});