exports.definition = {
	config : {
		adapter : {
			type : "acs",
			collection_name : "users"
		}
	},
	extendModel : function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			/**
			 * log user in with username and password
			 *
			 * @param {Object} _login
			 * @param {Object} _password
			 * @param {Object} _callback
			 */
			photo : null,
			login : function(_login, _password, _callback) {
				var self = this;
				this.config.Cloud.Users.login({
					login : _login,
					password : _password
				}, function(e) {
					if (e.success) {
						var user = e.users[0];

						// save session id
						Ti.App.Properties.setString('sessionId', e.meta.session_id);
						Ti.App.Properties.setString('user', JSON.stringify(user));
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
			},

			createAccount : function(_userInfo, _callback) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;

				// bad data so return to caller
				if (!_userInfo) {
					_callback && _callback({
						success : false,
						model : null
					});
				} else {
					cloud.Users.create(_userInfo, function(e) {
						if (e.success) {
							var user = e.users[0];
							TAP.setString("sessionId", e.meta.session_id);
							TAP.setString("user", JSON.stringify(user));

							// set this for ACS to track session connected
							cloud.sessionId = e.meta.session_id;

							// callback with newly created user
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
			},

			logout : function(_callback) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;

				cloud.Users.logout(function(e) {
					if (e.success) {
						var user = e.users[0];
						TAP.removeProperty("sessionId");
						TAP.removeProperty("user");

						// callback clearing out the user model
						_callback && _callback({
							success : true,
							model : null
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
			},

			authenticated : function() {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;

				if (TAP.hasProperty("sessionId")) {
					Ti.API.info("SESSION ID " + TAP.getString("sessionId"));
					cloud.sessionId = TAP.getString("sessionId");
					return true;
				}
				return false;
			},

			showMe : function(_callback) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;
				cloud.Users.showMe(function(e) {
					if (e.success) {
						var user = e.users[0];
						TAP.setString("sessionId", e.meta.session_id);
						TAP.setString("user", JSON.stringify(user));
						_callback && _callback({
							success : true,
							model : new model(user)
						});
					} else {
						Ti.API.error(e);

						TAP.removeProperty("sessionId");
						TAP.removeProperty("user");

						_callback && _callback({
							success : false,
							model : null,
							error : e
						});
					}
				});
			},

			getFollowers : function(_callback, _followers) {

				var followers = Alloy.createCollection("Friend");
				followers.fetch({
					data : {
						per_page : 100,
						q : " ",
						user_id : this.id,
						followers : _followers || "true"
					},
					success : function(_collection, _response) {
						_callback && _callback({
							success : true,
							collection : _collection
						});
					},
					error : function(_model, _response) { debugger;
						_callback && _callback({
							success : false,
							collection : {},
							error : _response
						});
					}
				});

			},

			getFriends : function(_callback) {
				this.getFollowers(_callback, false);
			},

			followUser : function(_userid, _callback) {
				// create properties for friend
				var friendItem = {
					"user_ids" : _userid,
					"approval_required" : "false"
				};

				var friendItemModel = Alloy.createModel('Friend');
				friendItemModel.save(friendItem, {
					success : function(_model, _response) {
						_callback({
							success : true
						});
					},

					error : function(_model, _response) {
						_callback({
							success : false
						});
					}
				});
			},

			unFollowUser : function(_userid, _callback) {

				var friendItemModel = Alloy.createModel('Friend');

				// MUST set the id so Backbone will trigger the delete event
				friendItemModel.id = _userid;

				// destroy/delete the model
				friendItemModel.destroy({
					data : {
						"user_ids" : [_userid]
					},

					success : function(_model, _response) {
						_callback({
							success : true
						});
					},
					error : function(_model, _response) {
						_callback({
							success : false
						});
					}
				});
			},

			updateFacebookLoginStatus : function(_accessToken, _opts) {
				var cloud = this.config.Cloud;
				var TAP = Ti.App.Properties;

				// if not logged into facebook, then exit function
				if (Alloy.Globals.FB.loggedIn == false) {
					_opts.error && _opts.error({
						success : false,
						model : null,
						error : "Not Logged into Facebook"
					});
					alert('Please Log Into Facebook first');
					return;
				}

				// we have Facebook  access token so we are good
				cloud.SocialIntegrations.externalAccountLogin({
					type : "facebook",
					token : _accessToken
				}, function(e) {
					if (e.success) {
						var user = e.users[0];
						TAP.setString("sessionId", e.meta.session_id);
						TAP.setString("user", JSON.stringify(user));

						// save how we logged in
						TAP.setString("loginType", "FACEBOOK");

						_opts.success && _opts.success({
							success : true,
							model : new model(user),
							error : null
						});
					} else {
						Ti.API.error(e);
						_opts.error && _opts.error({
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
		});

		return Collection;
	}
};
