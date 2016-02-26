// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
//var args = $.args;

var model = arguments[0] || {};
var user = model.attributes.user;
var moment = require('alloy/moment');

if (user.photo && user.photo.urls) {
    $.avatar.image = user.photo.urls.square_75 || user.photo.urls.thumb_100 || user.photo.urls.original;
}

$.comment.text = model.attributes.content;

// check for first name last name...
$.userName.text = (user.first_name || "") + " " + (user.last_name || "");

// if no name then use the username
$.userName.text = $.userName.text.trim().length !== 0 ? $.userName.text.trim() : user.username;
$.date.text = moment(model.attributes.created_at).fromNow();


// save the model id for use later
$.row.comment_id = model.id || '';