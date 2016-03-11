exports.definition = {
	config : {

		adapter : {
			type : "acs",
			collection_name : "photos"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			 fetch: function(options) {
			 options = options ? _.clone(options) : {};
			 options.reset = true;
			 return Backbone.Collection.prototype.fetch.call(this, options);
			 }
			 */
			findMyPhotosAndWhoIFollow : function(_user, _options) {
				var collection = this;

				// get all of the current users friends
				Ti.API.info("_user in photo.js model: " + JSON.stringify(_user));
				Ti.API.info("Is _user instance of Model? "+ (_user instanceof Backbone.Model))
				_user.getFriends(function(_resp) {
					if (_resp.success) {

						// pluck the user ids and add current users id
						var idList = _.pluck(_resp.collection.models, "id");
						idList.push(_user.id);

						// set up where parameters using the user list
						var where_params = {
							"user_id" : {
								"$in" : idList
							},
							title : {
								"$exists" : true
							}
						};
						// set the where params on the query
						_options.data = _options.data || {};
						_options.data.order = '-created_at';
						_options.data.per_page = 25;
						_options.data.where = JSON.stringify(where_params);
						Ti.API.info("_options in photo.js: " + JSON.stringify(_options));
						
						// execute the query
						collection.fetch(_options);
						Ti.API.info("collection of findMyPhotosAndWhoIFollow in Photo.js: " + JSON.stringify(collection));
                        Collection = collection;
					} else {
						Ti.API.error('Error fetching friends');
						_options.error();
					}
				});
			}
		});

		return Collection;
	}
}; 