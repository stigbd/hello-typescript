"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var app = (0, express_1.default)();
var port = 3000;
app.use(express_1.default.json());
var animals = [
    { type: "cat", name: "Whiskers", age: 3, livesLeft: 7, speak: function () { return "Meow"; } },
    { type: "dog", name: "Buddy", age: 5, breed: "Labrador", speak: function () { return "Woof"; } },
];
app.get('/', function (req, res) {
    res.status(200).send('Hello, World!');
});
// GET /animals - list all animals
app.get('/animals', function (req, res) {
    // Remove the speak function from the response for serialization
    var animalsWithoutSpeak = animals.map(function (a) {
        var speak = a.speak, rest = __rest(a, ["speak"]);
        return rest;
    });
    res.json(animalsWithoutSpeak);
});
// GET /animals/:name - get animal by name
app.get('/animals/:name', function (req, res) {
    var name = req.params.name;
    var animal = animals.find(function (a) { return a.name === name; });
    if (animal) {
        var speak = animal.speak, rest = __rest(animal, ["speak"]);
        res.json(rest);
    }
    else {
        res.status(404).json({ error: "Animal not found" });
    }
});
// POST /animals - add a new animal (expects type: 'cat' or 'dog')
app.post('/animals', function (req, res) {
    var _a = req.body, type = _a.type, data = __rest(_a, ["type"]);
    var newAnimal = null;
    if (type === 'cat') {
        if (typeof data.name === 'string' && typeof data.age === 'number' && typeof data.livesLeft === 'number') {
            newAnimal = __assign(__assign({ type: 'cat' }, data), { speak: function () { return "Meow"; } });
        }
    }
    else if (type === 'dog') {
        if (typeof data.name === 'string' && typeof data.age === 'number' && typeof data.breed === 'string') {
            newAnimal = __assign(__assign({ type: 'dog' }, data), { speak: function () { return "Woof"; } });
        }
    }
    if (newAnimal) {
        animals.push(newAnimal);
        // Remove speak function before sending response
        var speak = newAnimal.speak, rest = __rest(newAnimal, ["speak"]);
        res.status(201).json(rest);
    }
    else {
        res.status(400).json({ error: "Invalid animal data" });
    }
});
app.listen(port, function () {
    console.log("Server is running at http://localhost:".concat(port));
});
