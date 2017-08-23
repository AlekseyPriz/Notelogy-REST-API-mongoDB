// Подключаемые модули
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;
const url = 'mongodb://127.0.0.1:27017/contacts';


app.use(bodyParser.urlencoded({ extended: true }));

// Метод получения всех контактов ====================================================
app.get('/v1/contacts', function(req, res) {
  mongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу mongoDB. Ошибка: ', err);
    } else {
      console.log('Соединение установлено для ', url);

      let collection = db.collection('contacts');

      collection.find({}).toArray( (err, result) => {
        if (err) {
          console.log(err);
        } else if (result.length) {
          console.log('Исходная коллекция: ', result);
          res.json(result);
        } else {
          console.log('Нет документов с данным условием поиска');
        }
      });
  }
    db.close();
  });
});

// Метод добавления одного контакта ====================================================
app.post('/v1/addcontact', function(req, res) {
  if (!req.body.name || !req.body.number || !req.body.lastName) {
    res.status(400);
    res.send({ error: 'Не все данные заполнены' });
  }
  mongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу mongoDB. Ошибка: ', err);
    } else {
      console.log('Соединение установлено для ', url);
      let collection = db.collection('contacts');
      console.log(req.body.lastName);

      collection.insert({
        name:     req.body.name,
        lastName: req.body.lastName,
        number:   req.body.number}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Добавлена запись: ', result);
          res.json(result);
        }
        db.close();
      });
    }
    db.close();
  });
});

// Метод поиска одного контакта или нескольких контактов ====================================================
app.post('/v1/searchcontact', function(req, res) {
  if (!req.body.name && !req.body.number && !req.body.lastName) {
    res.status(400);
    res.send({ error: 'Не заданы условия поиска' });
  }
  mongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу mongoDB. Ошибка: ', err);
    } else {
      console.log('Соединение установлено для ', url);
      let collection = db.collection('contacts');

      if (req.body.name && req.body.number && req.body.lastName) {
        collection.find({ name: req.body.name,
                          lastName: req.body.lastName,
                          number: req.body.number}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }
      if (req.body.name && req.body.number && !req.body.lastName) {
        collection.find({ name: req.body.name,
                          number: req.body.number}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }
      if (req.body.name && !req.body.number && req.body.lastName) {
        collection.find({ name: req.body.name,
                          lastName: req.body.lastName}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }      if (!req.body.name && req.body.number && req.body.lastName) {
        collection.find({ lastName: req.body.lastName,
                          number: req.body.number}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }
      if (req.body.name && !req.body.number && !req.body.lastName) {
        collection.find({ name: req.body.name}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }
      if (!req.body.name && req.body.number && !req.body.lastName) {
        collection.find({number: req.body.number}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }
      if (!req.body.name && !req.body.number && req.body.lastName) {
        collection.find({lastName: req.body.lastName}).toArray( (err, result) => {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Исходная коллекция: ', result);
            res.json(result);
          } else {
            console.log('Нет документов с данным условием поиска');
          }
        });
      }
    }
    db.close();
  });
});

// Метод изменения одного контакта ====================================================
app.put('/v1/updateContact', function(req, res) {
  if (!req.body.name && !req.body.newName &&
      !req.body.number && !req.body.newNumber &&
      !req.body.lastName && !req.body.newLastName) {
    res.status(404);
    res.send({ error: 'Нечего менять' });
  }

  mongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу mongoDB. Ошибка: ', err);
    } else {
      console.log('Соединение установлено для ', url);

      let collection = db.collection('contacts');

      if (req.body.name && req.body.newName) {
        collection.update({name: req.body.name}, {'$set': {name: req.body.newName}});
        res.send('Имя пользователя изменен');
      } else if (req.body.number && req.body.newNumber) {
        collection.update({number: req.body.number}, {'$set': {number: req.body.newNumber}});
        res.send('Телефон пользователя изменен');
      } else if (req.body.lastName && req.body.newLastName) {
        collection.update({lastName: req.body.lastName}, {'$set': {lastName: req.body.newLastName}});
        res.send('Фамилия пользователя изменена');
      } else {
        console.log('Данных недостаточно');
      }
    }
    db.close();
  });
});

// Метод удаления одного контакта ====================================================
app.delete('/v1/deleteContact', function (req, res){

  if (!req.body.name && !req.body.number && !req.body.lastName) {
    res.status(404);
    res.send({ error: 'Не задано имя или номер' });
  }

  mongoClient.connect(url, (err, db) => {
    if (err) {
      console.log('Невозможно подключиться к серверу mongoDB. Ошибка: ', err);
    } else {
      console.log('Соединение установлено для ', url);
      let collection = db.collection('contacts');
      collection.remove({ name: req.body.name,
                          lastName: req.body.lastName,
                          number: req.body.number}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send('Пользователь '+ req.body.name + ' удален');
        }
      });
    }
    db.close();
  });
});

app.use(function(req, res, next){
  res.status(404);
  res.send({ error: 'Not found' });
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
});

app.listen(3000, function () {
  console.log('Сервер запущен и слушает порт 3000!');
});
