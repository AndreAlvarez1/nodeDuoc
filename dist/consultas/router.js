"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../classes/server");
var https = require('https');
const router = (0, express_1.Router)();
///// ============================================= /////
///// ============================================= /////
///// =================== GETS ==================== /////
///// ============================================= /////
///// ============================================= /////
router.get('/generales/:tabla', function (req, res) {
    const query = "SELECT * FROM " + req.params.tabla + " WHERE status > 0 ";
    // console.log('get from', req.params.tabla, query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/general/:tabla/:id', function (req, res) {
    const query = "SELECT * FROM " + req.params.tabla + " WHERE id = " + req.params.id + " ";
    // console.log('get from', req.params.tabla, query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/generalesXtienda/:tabla/:tiendaid', function (req, res) {
    const query = "SELECT * FROM " + req.params.tabla + " WHERE TIENDAID = " + req.params.tiendaid + " AND status > 0 ";
    // console.log('get from', req.params.tabla, query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/userId/:id', function (req, res) {
    const query = "SELECT * FROM USUARIOS WHERE CLAVE = '" + req.params.id + "'  ";
    // console.log('busco usuario por CLAVE', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
    });
});
// order by semana
router.get('/requerimientos/:status', function (req, res) {
    const query = "SELECT E.id, E.ASIGNATURAID, A.ASIGNATURA, E.TIENDAID, T.tienda, E.NUMSEMANA, E.status, E.reg_date, E.USERID, U.NOMBRE, E.OBSER as PROFE FROM ENCREQ E LEFT JOIN USUARIOS U ON E.USERID = U.CODIGO LEFT JOIN ASIGNATURAS A ON E.ASIGNATURAID = A.id  LEFT JOIN TIENDAS T ON E.TIENDAID = T.id WHERE E.status > " + req.params.status + "  ORDER BY NUMSEMANA ASC";
    // console.log('get reqs', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/requerimiento/:id', function (req, res) {
    const query = "SELECT E.id, E.ASIGNATURAID, A.ASIGNATURA, E.TIENDAID, T.tienda, E.NUMSEMANA, E.status, E.reg_date, E.USERID, U.NOMBRE as PROFE, E.OBSER FROM ENCREQ E LEFT JOIN USUARIOS U ON E.USERID = U.CODIGO LEFT JOIN ASIGNATURAS A ON E.ASIGNATURAID = A.id  LEFT JOIN TIENDAS T ON E.TIENDAID = T.id WHERE E.id = " + req.params.id + " ";
    // console.log('get REQUERIMIENTO', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/productos/:tiendaid', function (req, res) {
    const query = "SELECT * FROM PRODUCTOS WHERE TIENDAID = " + req.params.tiendaid + " AND ELIMINADO != 1";
    console.log('get productos', query);
    server_1.conex.query(query, function (err, rows, fields) {
        if (err)
            throw err;
        res.json({ resultado: 'ok', datos: rows });
        // res.json({ resultado: 'ok', datos: rows[0].CODIGO });
    });
});
router.get('/detalle/:id', function (req, res) {
    const query = " SELECT D.id, D.ENCREQID, D.CODIGO, P.DESCRIPCIO, D.CANTIDAD, P.UNIDAD, D.status, D.reg_date, D.OBSER FROM DETREQ D LEFT JOIN PRODUCTOS P ON D.CODIGO = P.CODIGO WHERE D.ENCREQID = " + req.params.id + " AND D.status > 0 ";
    console.log('get detalle', query);
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
        query = "INSERT INTO ENCREQ ( ASIGNATURAID, TIENDAID, NUMSEMANA, USERID, OBSER, status)  VALUES (" + req.body.ASIGNATURAID + ", " + req.body.TIENDAID + ", " + req.body.NUMSEMANA + ", '" + req.body.USERID + "', '" + req.body.OBSER + "' , 1 )";
    }
    else if (req.params.tarea === 'update') {
        query = "UPDATE ENCREQ SET ASIGNATURAID =  " + req.body.ASIGNATURAID + ", TIENDAID = " + req.body.TIENDAID + ", NUMSEMANA = " + req.body.NUMSEMANA + ", USERID = '" + req.body.USERID + "', OBSER = '" + req.body.OBSER + "', status = " + req.body.status + " WHERE id = " + req.body.id + "  ";
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
router.post('/post/DETREQ/:tarea', function (req, res) {
    console.log('tarea', req.params.tarea);
    let query = '';
    if (req.params.tarea === 'insert') {
        console.log('body de insert', req.body);
        query = "INSERT INTO DETREQ ( ENCREQID, CODIGO, CANTIDAD, OBSER status)  VALUES (" + req.body.ENCREQID + ",'" + req.body.CODIGO + "'," + req.body.CANTIDAD + ", '" + req.body.OBSER + "', 1 )";
    }
    else if (req.params.tarea === 'update') {
        query = "UPDATE DETREQ SET ENCREQID =  " + req.body.ENCREQID + ", CODIGO = '" + req.body.CODIGO + "', CANTIDAD = " + req.body.CANTIDAD + ", OBSER = '" + req.body.OBSER + "', status = " + req.body.status + " WHERE id = " + req.body.id + " ";
    }
    else if (req.params.tarea === 'borrar') {
        query = "UPDATE DETREQ SET status = 0 WHERE id = " + req.body.id + " ";
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
router.post('/post/ASIGNATURA/:tarea', function (req, res) {
    console.log('tarea', req.params.tarea);
    let query = '';
    if (req.params.tarea === 'insert') {
        console.log('body de insert', req.body);
        query = "INSERT INTO ASIGNATURAS ( ASIGNATURA, TIENDAID, status)  VALUES ('" + req.body.ASIGNATURA + "', " + req.body.TIENDAID + ", 1 )";
    }
    else if (req.params.tarea === 'update') {
        query = "UPDATE ASIGNATURAS SET ASIGNATURA =  '" + req.body.ASIGNATURA + "', TIENDAID = " + req.body.TIENDAID + ",  status = " + req.body.status + " WHERE id = " + req.body.id + "  ";
    }
    else if (req.params.tarea === 'borrar') {
        query = "UPDATE ASIGNATURAS SET status = 0 WHERE id = " + req.body.id + " ";
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
router.get('/test', function (req, res) {
    res.json({ resultado: 'ok', datos: 'Modificado el Lunes 6 de Junio 2022' });
});
exports.default = router;
