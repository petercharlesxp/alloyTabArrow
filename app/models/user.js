exports.definition = {
	config: {

		adapter: {
			type: "acs",
			collection_name: "users"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			/**
             * log user in with username and password
             *
             * @param {Object} _login
             * @param {Object} _password
             * @param {Object} _callback
             */
            login : function(_login, _password, _callback) {
                var self = this;
                this.config.Cloud.Users.login({
                    login : _login,
                    password : _password
                }, function(e) {
                    if (e.success) {
                        var user = e.users[0];

                        // save session id
                        Ti.App.Properties.setString
                          ('sessionId', e.meta.session_id);
                        Ti.App.Properties.setString
                          ('user', JSON.stringify(user));
                        _callback && _callback({
                            success : true,
                            model : new model(user)
                        });
                    } else {
                        Ti.API.error(e);
                        _callback && _callback({
                            success : false,
                            model : null,
                            error : e
                        });
                    }
                });
            }
        // end extend
		});

		return Model;
	},
	extendCollection: function(Collection) {
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
		});

		return Collection;
	}
};