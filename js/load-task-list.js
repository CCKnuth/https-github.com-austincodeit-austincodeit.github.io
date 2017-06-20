$(document).ready(function(){

  let openDataLink  = 'https://data.austintexas.gov/resource/x6vs-siqw.json';
  let openData;
  $.ajax({
      url: openDataLink,
      type: "GET",
      data: {
        "$limit" : 90,
        "$$app_token" : "n89g7s9iUyusfWDEHDHMtGcVT"
      }
  }).done(function(data) {

    			//get unique inspector names
    			var nameArray = _.chain(data).pluck('assigneduser').uniq().value();
          console.log(nameArray);
          //set up autocomplete w jquery ui plugin
          $( "#inspectorID" ).autocomplete({
            source: nameArray
          });
          //assign object to higher variable for search purposes...
          openData = data;
  });
  function dateFormatting(datestring){
    let _d = new Date(datestring);
    let yr = _d.getFullYear();
    let mth = _d.getMonth();
    let day = _d.getDate();
    if (isNaN(yr)){
      return '';
    } else {
      return mth + " " + day + ", " + yr;
    }
  }
  function nullCheck(string){
    if (string){
      return string;
    } else {
      return '';
    }
  }
  $("#loadTaskList").on('click', function(){
      //clear current list-group
      $("#availableAddresses").html("");
      //grab inspectorID
      let chosenName = $("#inspectorID").val();
      if ( $("#inspectorID").val().length >= 2 ){
        // var inspectorValue = $("#inspectorID").val();
        //getAddressesFromID(inspectorValue);
        $("#inspectorID").val('');
      }
      let filteredData = _.filter(openData, function(row){
          return row.assigneduser == chosenName;
      })
      console.log(filteredData);
      //loop through results and append data
      $(filteredData).each(function(i){


        $("#availableAddresses").append('<div class="list-group">'+
            '<a class="list-group-item ">'+
              '<h5 class="list-group-item-heading">'+nullCheck(filteredData[i].foldernumber) +' | ' +nullCheck(filteredData[i].foldername) +'</h5>'+
              '<table class="table table-condensed">'+
                '<tr>'+
                  '<th>Type</th>'+
                  '<td>'+nullCheck(filteredData[i].type) +'</td>'+
                  '<th>Sub Type</th>'+
                  '<td>'+nullCheck(filteredData[i].subtype) +'</td>'+
                '</tr>'+
                '<tr>'+
                  '<th>F.P</th>'+
                  '<td>'+nullCheck(filteredData[i].priority1) +'</td>'+
                  '<th>P.P.</th>'+
                  '<td>'+nullCheck(filteredData[i].priority2) +'</td>'+
                '</tr>'+
                '<tr>'+
                  '<th>Due to Start</th>'+
                  '<td>'+ dateFormatting(filteredData[i].duetostart) +'</td>'+
                  '<th>Due to End</th>'+
                  '<td>'+ dateFormatting(filteredData[i].duetoend) +'</td>'+
                '</tr>'+
                '<tr>'+
                  '<th>People and Location</th>'+
                  '<td colspan="3">'+nullCheck(filteredData[i].peoplename) +' | '+ nullCheck(filteredData[i].housenumber) +' '+ nullCheck(filteredData[i].streetname) +'</td>'+
                '</tr>'+
              '</table>'+
            '</a>'+
          '</div>');
      });

  });
  $(document).keypress(function(e) {
      //if user presses enter while focused on input field
      if(e.which == 13 && $("#inspectorID:focus").val()) {
            //if input value has contents greater than 5
            if ( $("#inspectorID:focus").val().length >= 2 ){
              //trigger addNewAddress click event
              $( "#loadTaskList" ).trigger( "click" );
            }
      }
  });

});
