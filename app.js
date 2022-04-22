const express = require("express");
const bodyParser = require("body-parser");
const { check, oneOf, validationResult } = require("express-validator");
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
const port = 3000;
app.get("/", (req, res) => {
  res.render("person");
});

app.post(
  "/",
  urlencodedParser,
  [
    check("name", "Name must me 5+ characters long")
      .exists()
      .isLength({ min: 5 }),
    check("email", "Enter a valid email").isEmail().normalizeEmail(),
    check("phone", "Enter a valid phone number.").exists().isMobilePhone(),
    //prints 'invalid values' if one of the gender is not selected.
    oneOf([
      check("male").exists(),
      check("female").exists(),
      check("other").exists(),
    ]),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const alert = errors.array();
      res.render("person", {
        alert,
      });
    } else {
      res.send(req.body);
    }
  }
);

// app.post("/", (req, res) => {
//   console.log(req.body);
//   const { name, phone, email, } = req.body
// });

// Listen on Port 3000
app.listen(port, () => console.info(`App listening on port ${port}`));
