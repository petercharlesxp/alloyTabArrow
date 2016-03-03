// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
//var args = $.args;

var model = arguments[0] || {};
//Ti.API.info("model in commentRow.js: " + JSON.stringify(model));
//var user = model.attributes.user;
//Ti.API.info("model.attributes.user_id in commentRow.js: " + JSON.stringify(model.attributes.user_id));
var userid = model.attributes.user_id;
var user = {};
Cloud.Users.show({
	user_id : userid
}, function(e) {
	if (e.success) {
		user = e.users[0];

		Cloud.Photos.show({
			photo_id : user.photo_id
		}, function(e) {
			if (e.success) {
				var photo = e.photos[0];
				//alert('Success:\n' + 'id: ' + photo.id + '\n' + 'filename: ' + photo.filename + '\n' + 'updated_at: ' + photo.updated_at);
				//Ti.API.info("photo in commentRow.js: " + JSON.stringify(photo));
				//alert('Success:\n' + 'id: ' + user.id + '\n' + 'first name: ' + user.first_name + '\n' + 'last name: ' + user.last_name);
				var moment = require('alloy/moment');
				//Ti.API.info("model in commentRow.js: " + JSON.stringify(model));
				//Ti.API.info("user in commentRow.js: " + JSON.stringify(user));
				//Ti.API.info("model.attributes in commentRow.js: " + JSON.stringify(model.attributes));

				user.photo = photo;
				//Ti.API.info("user.photo in commentRs.js: " + JSON.stringify(user.photo));
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
			} else {
				alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
			}
		});
	} else {
		alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	}
});
