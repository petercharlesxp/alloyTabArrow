// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
//var args = $.args;

// Get the parameters passed into the controller
var parameters = arguments[0] || {};
var currentPhoto = parameters.photo || {};
var parentController = parameters.parentController || {};
Ti.API.info("currentPhoto id: " + currentPhoto.id);
var comments = Alloy.Collections.instance("comment");

function loadComments(_photo_id) {
	var params = {
		photo_id : currentPhoto.id,
		order : '-created_at',
		per_page : 100
	};

	var rows = [];

	comments.fetch({
		data : params,
		success : function(model, response) {
			comments.each(function(comment) {
				var commentRow = Alloy.createController("commentRow", comment);
				rows.push(commentRow.getView());
			});
			// set the table rows
			$.commentTable.data = rows;
			Ti.API.info(JSON.stringify(params));
		},
		error : function(error) {
			alert('Error loading comments ' + e.message);
			Ti.API.error(JSON.stringify(error));
		}
	});
}

$.initialize = function() {
	loadComments();
};

function doOpen() {
	if (OS_ANDROID) {
		var activity = $.getView().activity;
		var actionBar = activity.actionBar;

		activity.onCreateOptionsMenu = function(_event) {

			if (actionBar) {
				actionBar.displayHomeAsUp = true;
				actionBar.onHomeIconItemSelected = function() {
					$.getView().close();
				};
			} else {
				alert("No Action Bar Found");
			}

			// add the button/menu to the titlebar
			var menuItem = _event.menu.add({
				title : "New Comment",
				showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
				icon : Ti.Android.R.drawable.ic_menu_edit
			});

			// event listener
			menuItem.addEventListener("click", function(e) {
				handleNewCommentButtonClicked();
			});
		};
	}
}


OS_IOS && $.newCommentButton.addEventListener("click", handleNewCommentButtonClicked);

function handleNewCommentButtonClicked(_event) {
	// FILLED OUT LATER IN CHAPTER
}