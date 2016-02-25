function doOpen() {

   if (OS_ANDROID) {
      var activity = $.getView().activity;
      var menuItem = null;

      activity.onCreateOptionsMenu = function(e) {

      if ($.tabGroup.activeTab.title === "Feed") {

        menuItem = e.menu.add({
          //itemId : "PHOTO",
           title : "Take Photo",
           showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS,
           icon : Ti.Android.R.drawable.ic_menu_camera
         });

         menuItem.addEventListener("click", function(e) {
            $.feedController.cameraButtonClicked();
         });
      }
      };

      activity.invalidateOptionsMenu();

      // this forces the menu to update when the tab changes
      $.tabGroup.addEventListener('blur', function(_event) {
      $.getView().activity.invalidateOptionsMenu();
      });
   }
}

$.tabGroup.open();
//$.index.open();