// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;

// EVENT LISTENERS
// on android, we need the change event not the click event
$.filter.addEventListener( OS_ANDROID ? 'change' : 'click', filterClicked);

$.friendsWindow.addEventListener("androidback", androidBackEventHandler);

/**
 * called when the back button is clicked, we will close the
 * window and stop event from bubbling up and closing the app
 *
 * @param {Object} _event
 */
function androidBackEventHandler(_event) {
	_event.cancelBubble = true;
	_event.bubbles = false;
	Ti.API.debug("androidback event");
	$.friendsWindow.removeEventListener("androidback", androidBackEventHandler);
	$.friendsWindow.close();
}

function filterClicked(_event) {
	var itemSelected;
	itemSelected = !OS_ANDROID ? _event.index : _event.rowIndex;

	// clear the ListView display
	$.section.deleteItemsAt(0, $.section.items.length);

	// call the appropriate function to update the display
	switch (itemSelected) {
	case 0 :
		getAllUsersExceptFriends();
		break;
	case 1 :
		loadFriends();
		break;
	}
}

function followBtnClicked(_event) {
}

function followingBtnClicked(_event) {
}

function initialize() {
	$.filter.index = 0;

	Alloy.Globals.PW.showIndicator("Loading...");

	updateFollowersFriendsLists(function() {
		Alloy.Globals.PW.hideIndicator();

		// get the users
		$.collectionType = "fullItem";

		getAllUsersExceptFriends();

	});
}

function updateFollowersFriendsLists(_callback) {
	var currentUser = Alloy.Globals.currentUser;

	// get the followers/friends id for the current user
	currentUser.getFollowers(function(_resp) {
		if (_resp.success) {
			$.followersIdList = _.pluck(_resp.collection.models, "id");

			// get the friends
			currentUser.getFriends(function(_resp) {
				if (_resp.success) {
					$.friendsIdList = _.pluck(_resp.collection.models, "id");
				} else {
					alert("Error updating friends and followers");
				}
				_callback();
			});
		} else {
			alert("Error updating friends and followers");
			_callback();
		}

	});
}

function getAllUsersExceptFriends() {
	var where_params = null;

	// which template to use when rendering listView
	$.collectionType = "fullItem";

	Alloy.Globals.PW.showIndicator("Loading Users...");

	// remove all items from the collection
	$.friendUserCollection.reset();

	if ($.friendsIdList.length) {
		// set up where parameters using the $.friendsIdList
		// from the updateFollowersFriendsLists function call
		var where_params = {
			"_id" : {
				"$nin" : $.friendsIdList, // means NOT IN
			},
		};
	}

	// set the where params on the query
	$.friendUserCollection.fetch({
		data : {
			per_page : 100,
			order : '-last_name',
			where : where_params && JSON.stringify(where_params),
		},
		success : function() {
			// user collection is updated into
			// $.friendUserCollection variable
			Alloy.Globals.PW.hideIndicator();
		},
		error : function() {
			Alloy.Globals.PW.hideIndicator();
			alert("Error Loading Users");
		}
	});
}

function doFilter(_collection) {
	return _collection.filter(function(_i) {
		var attrs = _i.attributes;
		return ((_i.id !== Alloy.Globals.currentUser.id) && (attrs.admin === "false" || !attrs.admin));
	});
}

function doTransform(model) {

    var displayName, image, user = model.toJSON();

    // get the photo
    if (user.photo && user.photo.urls) {
        image = user.photo.urls.square_75 ||
                user.photo.urls.thumb_100 ||
              user.photo.urls.original ||
              "missing.gif";
    } else {
        image = "missing.gif";
    }

    // get the display name
    if (user.first_name || user.last_name) {
        displayName = 
            (user.first_name || "") + " " + (user.last_name || "");
    } else {
        displayName = user.email;
    }

    // return the object
    var modelParams = {
        title : displayName,
        image : image,
        modelId : user.id,
        template : $.collectionType
    };

    return modelParams;

	/*
	 Cloud.Photos.show({
	 photo_id : user.photo_id
	 }, function(e) {
	 if (e.success) {
	 var photo = e.photos[0];
	 user.photo = photo;
	 // get the photo
	 if (user.photo && user.photo.urls) {
	 image = user.photo.urls.square_75 || user.photo.urls.thumb_100 || user.photo.urls.original || "missing.gif";
	 } else {
	 image = "missing.gif";
	 }

	 // get the display name
	 if (user.first_name || user.last_name) {
	 displayName = (user.first_name || "") + " " + (user.last_name || "");
	 } else {
	 displayName = user.email;
	 }

	 // return the object
	 var modelParams = {
	 title : displayName,
	 image : image,
	 modelId : user.id,
	 //template : $.collectionType
	 template : temp
	 };
	 Ti.API.info("modelParams in friends.js: " + JSON.stringify(modelParams))

	 return modelParams;

	 } else {
	 alert('Error:\n' + ((e.error && e.message) || JSON.stringify(e)));
	 Ti.API.info("modelParams error in friends.js: " + JSON.stringify(e));
	 return modelParams;
	 }
	 });
	 */

}

function loadFriends(_callback) {
	var user = Alloy.Globals.currentUser;

	Alloy.Globals.PW.showIndicator("Loading Friends...");

	user.getFriends(function(_resp) {
		if (_resp.success) {
			if (_resp.collection.models.length === 0) {
				$.friendUserCollection.reset();
			} else {
				$.collectionType = "friends";
				$.friendUserCollection.reset(_resp.collection.models);
				$.friendUserCollection.trigger("sync");
			}
		} else {
			alert("Error loading followers");
		}
		Alloy.Globals.PW.hideIndicator();
		_callback && _callback();
	});
}


$.getView().addEventListener("focus", function() {
	!$.initialized && initialize();
	$.initialized = true;
});
