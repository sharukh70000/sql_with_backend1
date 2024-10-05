const { faker } = require('@faker-js/faker');
const mysql = require('mysql2'); 2
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override")

app.use(methodOverride("_method"))
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "/views"))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'backEnd_with_DB',
    password: 'sharukh@70000',
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),

    ];
};
//home route
app.get("/", (req, res) => {
    let q = `select count(*) from insta_user`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err

            let count = result[0]["count(*)"];
            res.render("home.ejs", { count });
        })
    } catch (err) {
        console.log(err)
        res.send('some error in DB');
    }
});

//show route
app.get("/user", (req, res) => {
    let q = `SELECT * FROM insta_user`;
    try {
        connection.query(q, (err, users) => {
            if (err) throw err

            res.render('show.ejs', { users })

        })
    } catch (err) {
        console.log(err)
        res.send('some error in DB');
    }
});

//edit routs
app.get("/user/:id/edit", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM insta_user where id='${id}'`;
    // res.render('edit.ejs')
    // console.log(id)
    try {
        connection.query(q, (err, result) => {
            if (err) throw err
            // console.log(result[0])
            let user = result[0];
            res.render('edit.ejs', { user })
            // res.send('user not found')
        })
    } catch (err) {
        console.log(err)
        res.send('some error in DB');
    }
});

// update(DB) route
app.patch("/user/:id", (req, res) => {
    // res.send("updated");
    let { id } = req.params;
    let { password: formpass, username: newUsername } = req.body;
    // formpass = formpass.trim();
    let q = `SELECT * FROM insta_user WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err
            let user = result[0];
            if (formpass != user.password) {
                res.send('wrong password')
            } else {
                let q2 = `UPDATE insta_user SET username='${newUsername}' WHERE id '${id}' `;
                connection.query(q2, (req, result) => {
                    if (err) throw err;
                    res.send(result);
                })
            }
            // res.send(user)
            // res.render('edit.ejs', { user })
            // res.send('user not found')
        })
    } catch (err) {
        console.log(err)
        res.send('some error in DB');
    }
})





app.listen("8080", () => {
    console.log('server is listing to 8080')
})
