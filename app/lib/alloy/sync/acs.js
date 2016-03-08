function S4() {
	return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
}

function guid() {
	return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

function InitAdapter(config) {
	Cloud = require("ti.cloud");
	Cloud.debug = !0;
	config.Cloud = Cloud;
}

function Sync(model, method, opts) {
	// Will be filled in later!!
}

var _ = require("alloy/underscore")._;

module.exports.sync = Sync;

module.exports.beforeModelCreate = function(config) {
	config = config || {};
	config.data = {};
	InitAdapter(config);
	return config;
};

module.exports.afterModelCreate = function(Model) {
	Model = Model || {};
	Model.prototype.config.Model = Model;
	return Model;
};

function Sync(method, model, options) {
	var object_name = model.config.adapter.collection_name;

	if (object_name === "photos") {
		processACSPhotos(model, method, options);
	} else if (object_name === "users") {
		processACSUsers(model, method, options);
	} else if (object_name === "reviews") {
		processACSComments(model, method, options);
	}
}

/**
 * this is a separate handler for when the object being processed
 * is an ACS Photo
 */
function processACSPhotos(model, method, options) {
	switch (method) {
	case "create":
		// include attributes into the params for ACS
		Cloud.Photos.create(model.toJSON(), function(e) {
			if (e.success) {

				// save the meta data with object
				model.meta = e.meta;

				// return the individual photo object found
				options.success(e.photos[0]);

				// trigger fetch for UI updates
				model.trigger("fetch");
			} else {
				Ti.API.error("Photos.create " + e.message);
				options.error(e.error && e.message || e);
			}
		});
		break;
	case "read":
		model.id && (options.data.photo_id = model.id);

		var method = model.id ? Cloud.Photos.show : Cloud.Photos.query;

		method((options.data || {}), function(e) {
			if (e.success) {
				model.meta = e.meta;
				if (e.photos.length === 1) {
					options.success(e.photos[0]);
				} else {
					options.success(e.photos);
				}
				model.trigger("fetch");
				return;
			} else {
				Ti.API.error("Cloud.Photos.query error in acs.js " + e.message);
				options.error(e.error && e.message || e);
			}
		});
		break;
	case "update":
	case "delete":
		// Not currently implemented, let the user know
		alert("Not Implemented Yet");
		break;
	}
}

function processACSComments(model, method, opts) {

	switch (method) {
	case "create":
		var params = model.toJSON();

		Cloud.Reviews.create(params, function(e) {
			if (e.success) {
				model.meta = e.meta;
				opts.success && opts.success(e.reviews[0]);
				model.trigger("fetch");
			} else {
				Ti.API.error("Comments.create " + e.message);
				opts.error && opts.error(e.message || e);
			}
		});
		break;

	case "read":
		Cloud.Reviews.query((opts.data || {}), function(e) {
			Ti.API.info("opts.data: " + JSON.stringify(opts.data || {}));
			//
			if (e.success) {
				Ti.API.info("e: " + JSON.stringify(e));
				//
				model.meta = e.meta;
				if (e.reviews.length === 1) {
					opts.success && opts.success(e.reviews[0]);
					//opts.success(e.reviews[0]); //
					//Ti.API.info("opts.success,e.reviews.length === 1: " + JSON.stringify(opts.success)); //
					//Ti.API.info("opts.success,e.reviews.length === 1: " + JSON.stringify(opts.success(e.reviews[0]))); //
				} else {
					opts.success && opts.success(e.reviews);
					//opts.success(e.reviews); //
					Ti.API.info("opts.success,e.reviews.length !== 1: " + JSON.stringify(opts.success));
					//
					Ti.API.info("opts.success,e.reviews.length !== 1: " + JSON.stringify(opts.success(e.reviews)));
					//
				}
				Ti.API.info("Reviews: " + JSON.stringify(e));
				//
				model.trigger("fetch");
				return;
			} else {
				Ti.API.error("Reviews.query " + e.message);
				opts.error && opts.error(e.message || e);
			}
		});
		break;
	case "update":
	case "delete":
		var params = {};

		// look for the review id in opts or on model
		params.review_id = model.id || (opts.data && opts.data.id);

		// get the id of the associated photo
		params.photo_id = opts.data && opts.data.photo_id;

		Cloud.Reviews.remove(params, function(e) {
			if (e.success) {
				model.meta = e.meta;
				opts.success && opts.success(model.attributes);
				model.trigger("fetch");
				return;
			}
			Ti.API.error(e);
			opts.error && opts.error(e.error && e.message || e);
		});
		break;

	}
}

function processACSUsers(model, method, options) {
  switch (method) {
    case "update":
      var params = model.toJSON();
      Cloud.Users.update(params, function(e) {
        if (e.success) {
          model.meta = e.meta;
          options.success && options.success(e.users[0]);
          model.trigger("fetch");
        } else {
          Ti.API.error("Cloud.Users.update " + e.message);
          options.error && 
                  options.error(e.error && e.message || e);
        }
      });
      break;

  }
}
