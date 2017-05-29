var crypto = require('crypto');
var moment = require('moment');
var User = require("../../models/user");

/* login validation methods */

exports.autoLogin = function(email, password, callback) {
    User.findOne({
        email: email
    }, function(e, o) {
        if (o) {
            o.password == password ? callback(o) : callback(null);
        } else {
            callback(null);
        }
    });
}

exports.manualLogin = function(email, password, callback) {
    User.findOne({
        email: email
    }, function(e, o) {
        if (o == null) {
            callback('email-not-found');
        } else {
            validatePassword(password, o.password, function(err, res) {
                if (res) {
                    callback(null, o);
                } else {
                    callback('invalid-password');
                }
            });
        }
    });
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newUser, callback) {
        User.findOne({
                email: newUser.email
            }, function(e, o) {
                if (o) {
                    callback('email-taken');
                } else {
                    User.findOne({
                            user: newUser.user
                        }, function(e, o) {
                            if (o) {
                                callback('user-taken');
                            } else {
                                saltAndHash(newUser.password, function(hash) {
                                        newUser.password = hash;
                                        // append date stamp when record was created //
                                        newUser.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                                            var user = new User(newUser);
                                            user.save(function(e) {
                                                if (e){
																									callback('Someone fail'+e);
																									return false
																								} else {
																									callback('User was created'+e);
																									return true
																								}
                                            });
                                        });
                                }
                            });
                    }
                });
        }

        exports.updateAccount = function(newData, callback) {
            User.findOne({
                _id: getObjectId(newData.id)
            }, function(e, o) {
                o.name = newData.name;
                o.email = newData.email;
                o.country = newData.country;
                if (newData.password == '') {
                    User.save(o, {
                        safe: true
                    }, function(e) {
                        if (e) callback(e);
                        else callback(null, o);
                    });
                } else {
                    saltAndHash(newData.password, function(hash) {
                        o.password = hash;
                        User.save(o, {
                            safe: true
                        }, function(e) {
                            if (e) callback(e);
                            else callback(null, o);
                        });
                    });
                }
            });
        }

        exports.updatePassword = function(email, newPass, callback) {
            User.findOne({
                email: email
            }, function(e, o) {
                if (e) {
                    callback(e, null);
                } else {
                    saltAndHash(newPass, function(hash) {
                        o.password = hash;
                        User.save(o, {
                            safe: true
                        }, callback);
                    });
                }
            });
        }

        /* account lookup methods */

        exports.deleteAccount = function(id, callback) {
            User.remove({
                _id: getObjectId(id)
            }, callback);
        }

        exports.getAccountByEmail = function(email, callback) {
            User.findOne({
                email: email
            }, function(e, o) {
                callback(o);
            });
        }

        exports.validateResetLink = function(email, passwordHash, callback) {
            User.find({
                $and: [{
                    email: email,
                    password: passwordHash
                }]
            }, function(e, o) {
                callback(o ? 'ok' : null);
            });
        }

        exports.getAllRecords = function(callback) {
            User.find().toArray(
                function(e, res) {
                    if (e) callback(e)
                    else callback(null, res)
                });
        }

        exports.delAllRecords = function(callback) {
            User.remove({}, callback); // reset User collection for testing //
        }

        /* private encryption & validation methods */

        var generateSalt = function() {
            var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
            var salt = '';
            for (var i = 0; i < 10; i++) {
                var p = Math.floor(Math.random() * set.length);
                salt += set[p];
            }
            return salt;
        }

        var md5 = function(str) {
            return crypto.createHash('md5').update(str).digest('hex');
        }

        var saltAndHash = function(password, callback) {
            var salt = generateSalt();
            callback(salt + md5(password + salt));
        }

        var validatePassword = function(plainPass, hashedPass, callback) {
            var salt = hashedPass.substr(0, 10);
            var validHash = salt + md5(plainPass + salt);
            callback(null, hashedPass === validHash);
        }

        var getObjectId = function(id) {
            return new require('mongodb').ObjectID(id);
        }

        var findById = function(id, callback) {
            User.findOne({
                    _id: getObjectId(id)
                },
                function(e, res) {
                    if (e) callback(e)
                    else callback(null, res)
                });
        }

        var findByMultipleFields = function(a, callback) {
            // this takes an array of name/val pairs to search against {fieldName : 'value'} //
            User.find({
                $or: a
            }).toArray(
                function(e, results) {
                    if (e) callback(e)
                    else callback(null, results)
                });
        }
