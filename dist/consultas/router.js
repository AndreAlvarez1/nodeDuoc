"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../classes/server");
var https = require('https');
const router = express_1.Router();
///// ============================================= /////
///// ============================================= /////
///// =================== GETS ==================== /////
///// ============================================= /////
///// ============================================= /////
router.get('/generales/:tabla', function (req, res) {
    const query = "SELECT * FROM " + req.params.tabla + " WHERE status > 0 ";
    console.log('get from', req.params.tabla, query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/general/:tabla/:id', function (req, res) {
    const query = "SELECT * FROM " + req.params.tabla + " WHERE id = " + req.params.id + " ";
    console.log('get from', req.params.tabla, query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/generalesXtienda/:tabla/:tiendaid', function (req, res) {
    const query = "SELECT * FROM " + req.params.tabla + " WHERE id = " + req.params.tiendaid + " AND status > 0 ";
    console.log('get from', req.params.tabla, query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/userId/:id', function (req, res) {
    const query = "SELECT * FROM USUARIOS WHERE CLAVE = '" + req.params.id + "'  ";
    console.log('busco usuario por CLAVE', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
    });
});
// 
router.get('/requerimientos/:status', function (req, res) {
    const query = "SELECT E.id, E.ASIGNATURAID, A.ASIGNATURA, E.TIENDAID, T.tienda, E.NUMSEMANA, E.status, E.reg_date, E.USERID, U.NOMBRE as PROFE FROM ENCREQ E LEFT JOIN USUARIOS U ON E.USERID = U.CODIGO LEFT JOIN ASIGNATURAS A ON E.ASIGNATURAID = A.id  LEFT JOIN TIENDAS T ON E.TIENDAID = T.id WHERE E.status > " + req.params.status + " ";
    console.log('get reqs', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/requerimiento/:id', function (req, res) {
    const query = "SELECT E.id, E.ASIGNATURAID, A.ASIGNATURA, E.TIENDAID, T.tienda, E.NUMSEMANA, E.status, E.reg_date, E.USERID, U.NOMBRE as PROFE FROM ENCREQ E LEFT JOIN USUARIOS U ON E.USERID = U.CODIGO LEFT JOIN ASIGNATURAS A ON E.ASIGNATURAID = A.id  LEFT JOIN TIENDAS T ON E.TIENDAID = T.id WHERE E.id > " + req.params.id + " ";
    console.log('get reqs', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/productos/:tiendaid', function (req, res) {
    const query = "SELECT * FROM PRODUCTOS WHERE TIENDAID = " + req.params.tiendaid + " AND status > 0";
    console.log('get cotenidos', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
///// ============================================= /////
///// ============================================= /////
///// =================== POSTS ==================== /////
///// ============================================= /////
///// ============================================= /////
router.post('/post/ENCREQ/:tarea', function (req, res) {
    console.log('tarea', req.params.tarea);
    let query = '';
    if (req.params.tarea === 'insert') {
        console.log('body de insert', req.body);
        query = "INSERT INTO ENCREQ ( ASIGNATURAID, TIENDAID, NUMSEMANA, USERID, status)  VALUES (" + req.body.ASIGNATURAID + ", " + req.body.TIENDAID + ", " + req.body.NUMSEMANA + ", " + req.body.USERID + " , 1 )";
    }
    else if (req.params.tarea === 'update') {
        query = "UPDATE ENCREQ SET ASIGNATURAID =  " + req.body.ASIGNATURAID + ", TIENDAID = " + req.body.TIENDAID + ", NUMSEMANA = " + req.body.NUMSEMANA + ", USERID = " + req.body.USERID + ", status = " + req.body.status + " WHERE id = " + req.body.id + "  ";
    }
    else if (req.params.tarea === 'borrar') {
        query = "UPDATE ENCREQ SET status = 0 WHERE id = " + req.body.id + " ";
    }
    else {
        return;
    }
    console.log('query ->', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
    });
});
router.post('/update/DETREQ', function (req, res) {
    let query = "UPDATE DETREQ SET ENCREQID =  " + req.body.ENCREQID + ", CODIGO = '" + req.body.CODIGO + "', CANTIDAD = " + req.body.CANTIDAD + ", status = " + req.body.status + " WHERE id = " + req.body.id + " ";
    console.log('query ->', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
    });
});
router.post('/insert/DETREQ', function (req, res) {
    console.log("Grabo productos", req.body);
    let DATOS = '';
    for (let x in req.body) {
        DATOS += "( " + req.body[x].ENCREQID + ",'" + req.body[x].CODIGO + "'," + req.body[x].CANTIDAD + ", 1),";
    }
    DATOS = DATOS.slice(0, -1);
    // console.log('productos', DATOS)
    const query = "INSERT INTO DETREQ ( ENCREQID, CODIGO, CANTIDAD, status ) VALUES" + DATOS;
    console.log('query ->', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
    });
});
router.post('/insert/DETREQ', function (req, res) {
    console.log("Grabo productos", req.body);
    let DATOS = '';
    for (let x in req.body) {
        DATOS += "( " + req.body[x].ENCREQID + ",'" + req.body[x].CODIGO + "'," + req.body[x].CANTIDAD + ", 1),";
    }
    DATOS = DATOS.slice(0, -1);
    // console.log('productos', DATOS)
    const query = "INSERT INTO DETREQ ( ENCREQID, CODIGO, CANTIDAD, status ) VALUES" + DATOS;
    console.log('query ->', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
    });
});
exports.default = router;
