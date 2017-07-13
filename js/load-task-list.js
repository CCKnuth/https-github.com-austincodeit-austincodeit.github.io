$(document).ready(function() {
  /* at window open - a query is made to the open data portal.. */
  let openDataLink = 'https://data.austintexas.gov/resource/x6vs-siqw.json';
  let openData;
  $.ajax({
    url: openDataLink,
    type: "GET",
    data: {
      "$limit": 6000,
      "$$app_token": "n89g7s9iUyusfWDEHDHMtGcVT"
    }
  }).done(function(data) {
    //when the results are returned...
    //get inspector names by unique values
    let nameArray = _.chain(data).pluck('assigneduser').uniq().value();
    //set up autocomplete w jquery ui plugin
    $("#inspectorID").autocomplete({
      source: nameArray
    });
    //assign results object to higher variable for search purposes...
    openData = data;
  });

  //this function is for formatting date strings
  function dateFormatting(datestring) {
    let _d = new Date(datestring);
    let yr = _d.getFullYear();
    let mth = _d.getMonth() + 1; //january = 0, so we need to +1
    let day = _d.getDate();
    if (isNaN(yr)) {
      return '';
    } else {
      return mth + "/" + day + "/" + yr;
    }
  }
  //this function is to change undefined or N/A strings into blanks
  function nullCheck(string) {
    if (string) {
      return string;
    } else {
      return '';
    }
  }
  //when the user clicks the button#loadTaskList we will run this function
  $("#loadTaskList").on('click', function() {
    //clear current list-group
    $("#availableAddressRows").html("");
    //grab inspectorID
    let chosenName = $("#inspectorID").val();
    if ($("#inspectorID").val().length >= 2) {
      // var inspectorValue = $("#inspectorID").val();
      //getAddressesFromID(inspectorValue);
      $("#inspectorID").val('');
    }
    global_pdf.name = chosenName; //update global pdf object
    global_pdf.datestamp = dateFormatting(Date.now()); //set date to now
    global_pdf.timestamp = new Date().toLocaleTimeString(); //set time to now
    // console.log(global_pdf);
    let filteredData = _.filter(openData, function(row) { //filter the data returned by assignedUser
      return row.assigneduser == chosenName;
    })
    //loop through filtered results and append data to table#availableAddressRows
    $(filteredData).each(function(i) {

      $("#availableAddressRows").append('<tr>' +
        '<td class="first">' + nullCheck(filteredData[i].type) + '</td>' +
        '<td class="b">' + nullCheck(filteredData[i].subtype) + '</td>' +
        '<td class="b">' + nullCheck(filteredData[i].foldernumber) + '</td>' +
        '<td class="c" id="location">' + nullCheck(filteredData[i].foldername) + '</td>' +
        '<td class="a">' + nullCheck(filteredData[i].priority1) + '</td>' +
        '<td class="a">' + nullCheck(filteredData[i].priority2) + '</td>' +
        '<td class="a">' + dateFormatting(filteredData[i].duetostart) + '</td>' +
        '<td class="a">' + dateFormatting(filteredData[i].duetoend) + '</td>' +
        '<td class="c">' + nullCheck(filteredData[i].peoplename) + '</td>' +
        '<td class="c">' + nullCheck(filteredData[i].housenumber) + ' ' + nullCheck(filteredData[i].streetname) + '</td>' +
        '</tr>');

    });

    //a nod to the table sort to let it know to check itself
    $('#availableAddressTable').trigger('update');
    //in case we are in mobile we need to freeze the draggable rows and enable the button add.
    $window.trigger('resize');
    //if we are mobile, we need to add the mobileAdd button and class
    $('#availableAddressRows > tr').children("td.first").prepend('' +
      '<a type="button" class="btn btn-sm btn-default mobileAdd">' +
      '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>' +
      '</a>');
    validateAddButton();
  });
  //some users prefer "ENTER" instead of button click, this will trigger a button click
  $(document).keypress(function(e) {
    //if user presses enter while focused on input field
    if (e.which == 13 && $("#inspectorID:focus").val()) {
      //if input value has contents greater than 5
      if ($("#inspectorID:focus").val().length >= 2) {
        //trigger addNewAddress click event
        $("#loadTaskList").trigger("click");
      }
    }
  });

  //function needed for mobile changes
  let $window = $(window);

  //when the window is resized, if it is mobile sized width, we update the UI
  $window.resize(function resize() {
    $draggableTable1 = $('#availableAddressRows > tr');
    $draggableTable2 = $('#routableAddressRows > tr');
    $mobileAddButton = $('#availableAddressRows > tr > td.first > a');
    if ($window.width() < 768) {
      $mobileAddButton.addClass('mobileAdd');
      $draggableTable1.addClass('mobile');
      return $draggableTable2.addClass('mobile');
    }
    $mobileAddButton.removeClass('mobileAdd');
    $draggableTable1.removeClass('mobile');    $draggableTable2.removeClass('mobile');

  }).trigger('resize');

  //if you click the addMobile button it will pull the element attributes and push to table
  let validateAddButton = function() {
    //unbind and then bind bc the internet
    $("a.mobileAdd").unbind('click').bind('click', function(elem) {
      //for every element in the row...
      let $tableRow = $(this).parent().parent()[0];
      let newAddress = $($tableRow).children("td#location").text().trim() + ", Austin, TX";
      let popUpText = $($tableRow).children("td#location").text().trim();
      //get the element so we can add latlngs to it later
      $activeElement = $($tableRow).children("td#location");

      $("#routableAddressRows").append('<tr>' +
        '<td class="first"><span id="count"></span>' +
        '<button type="button" class="btn btn-sm btn-default removeAddress">' +
        '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' +
        '</button>' + $($tableRow).children("td:nth-child(1)").text() + '</td>' +
        '<td class="b">' + $($tableRow).children("td:nth-child(2)").text() + '</td>' +
        '<td class="b">' + $($tableRow).children("td:nth-child(3)").text() + '</td>' +
        '<td class="c" id="location">' + $($tableRow).children("td:nth-child(4)").text() + '</td>' +
        '<td class="a">' + $($tableRow).children("td:nth-child(5)").text() + '</td>' +
        '<td class="a">' + $($tableRow).children("td:nth-child(6)").text() + '</td>' +
        '<td class="a">' + $($tableRow).children("td:nth-child(7)").text() + '</td>' +
        '<td class="a">' + $($tableRow).children("td:nth-child(8)").text() + '</td>' +
        '<td class="c">' + $($tableRow).children("td:nth-child(9)").text() + '</td>' +
        '<td class="c">' + $($tableRow).children("td:nth-child(10)").text() + '</td>' +
        '</tr>');
      //grab the active element because we want to be able to append to it later...
      $activeElement = $("#routableAddressRows > tr:not(.placeholder):last-child").children("td#location");
      //theses functions help with updates
      global_func.validateRemoveButton();
      global_func.adjustRowCount();
      global_func.placeAddressOnMap(newAddress, popUpText, false);
    });
  };

});
