// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;

// EVENT LISTENERS
// on android, we need the change event not the click event
$.filter.addEventListener(OS_ANDROID ? 'change' : 'click', filterClicked);

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
    itemSelected = ! OS_ANDROID ? _event.index : _event.rowIndex;

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

function followBtnClicked(_event) {}
function followingBtnClicked(_event) {}