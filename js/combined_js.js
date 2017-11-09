let global_pdf={};let global_func={};let $activeElement;let mapTaskListItem;$(document).ready(function(){let map,directionsService,directionsDisplay,geocoder,addressMarkerArray=[],taskListMarkerArray=[],iconCount=0,timeOfDeparture;let labels='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';let snazzySyle=[{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#50a5d1"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":50}]}];let nightStyle=[{elementType:"geometry",stylers:[{color:"#242f3e"}]},{elementType:"labels.text.fill",stylers:[{color:"#746855"}]},{elementType:"labels.text.stroke",stylers:[{color:"#242f3e"}]},{featureType:"administrative.locality",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"poi",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#263c3f"}]},{featureType:"poi.park",elementType:"labels.text.fill",stylers:[{color:"#6b9a76"}]},{featureType:"road",elementType:"geometry",stylers:[{color:"#38414e"}]},{featureType:"road",elementType:"geometry.stroke",stylers:[{color:"#212a37"}]},{featureType:"road",elementType:"labels.text.fill",stylers:[{color:"#9ca5b3"}]},{featureType:"road.highway",elementType:"geometry",stylers:[{color:"#746855"}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#1f2835"}]},{featureType:"road.highway",elementType:"labels.text.fill",stylers:[{color:"#f3d19c"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#2f3948"}]},{featureType:"transit.station",elementType:"labels.text.fill",stylers:[{color:"#d59563"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#17263c"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{color:"#515c6d"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{color:"#17263c"}]}];let initialize=function(){if(typeof google!=='object'){setTimeout(function(){initialize();},1000)}
let myLatlng=new google.maps.LatLng(30.3344316,-97.6791038);let mapOptions={zoom:14,center:myLatlng,mapTypeControlOptions:{mapTypeIds:['roadmap','satellite','style_a','style_b']}
}
map=new google.maps.Map(document.getElementById('map'),mapOptions);geocoder=new google.maps.Geocoder();directionsService=new google.maps.DirectionsService;directionsDisplay=new google.maps.DirectionsRenderer({draggable:true,map:map});google.maps.event.addDomListener(window,"resize",function(){let center=map.getCenter();google.maps.event.trigger(map,"resize");map.setCenter(center);});directionsDisplay.addListener('directions_changed',function(){if(global_pdf.trip_dist){timeOfDeparture=new Date(Date.now()+1000);updateDirectionsDisplay(directionsDisplay.getDirections());}});let mapStyle1=new google.maps.StyledMapType(snazzySyle,{name:'Grey Scale'});let mapStyle2=new google.maps.StyledMapType(nightStyle,{name:'Night Mode'});map.mapTypes.set('style_a',mapStyle1);map.mapTypes.set('style_b',mapStyle2);map.setMapTypeId('style_a');}
function addMarker(location,popUpText,sort){let labelObject;if(iconCount==0){labelObject={color:'black',fontSize:'11px',fontWeight:'700',text:'START'};}else{labelObject={color:'black',fontSize:'11px',fontWeight:'700',text:labels[iconCount%labels.length]};}
let newMarker=new google.maps.Marker({position:location,label:labelObject,map:map,draggable:true})
let infowindow=new google.maps.InfoWindow({content:popUpText});newMarker.addListener('click',function(){infowindow.open(map,newMarker);});addressMarkerArray.push(newMarker);if(!$($activeElement).attr('val')){$($activeElement).attr('val',location);}
iconCount=iconCount+1;adjustMapBounds();if(sort){updateMarkerOrder(sort);}}
global_func.placeAddressOnMap=function(address,popUpText,sort){geocoder.geocode({'address':address},function(results,status){if(status==google.maps.GeocoderStatus.OK){addMarker(results[0].geometry.location,popUpText,sort);return true;}else{alert('Geocode was not successful for the following reason: '+status+'\nPlease manually enter the address.');$($activeElement).parent().remove();global_func.adjustRowCount();}});}
let adjustMapBounds=function(){if(addressMarkerArray.length<=1){map.setCenter(addressMarkerArray[0].getPosition());}else{let bounds=new google.maps.LatLngBounds();for(let i=0;i<addressMarkerArray.length;i++){bounds.extend(addressMarkerArray[i].getPosition());}
map.fitBounds(bounds);}}
let extractLATLNG=function(coords){let latitude=Number(coords.split(',')[0].trim().slice(1,coords.length));let longitude=Number(coords.split(',')[1].trim().slice(0,-1));return{lat:latitude,lng:longitude};}
let updateMarkerOrder=function(sort){if(sort){let $addressRowSelection=$("#routableAddressRows > tr:not(.placeholder)");for(let i=0;i<addressMarkerArray.length;i++){addressMarkerArray[i].setMap(null);}
addressMarkerArray=[];iconCount=0;$addressRowSelection.each(function(elem){let latLngObj=extractLATLNG($(this).children("td#location").attr('val'));let popUpText=$(this).children("td#location").text().trim();addMarker(latLngObj,popUpText)
});}else{for(let i=0;i<addressMarkerArray.length;i++){addressMarkerArray[i].setMap(null);}
for(let i=0;i<taskListMarkerArray.length;i++){taskListMarkerArray[i].setMap(null);}}}
let removeSpecificMarker=function(rowIndex){iconCount=iconCount-1;addressMarkerArray[rowIndex].setMap(null);addressMarkerArray.splice(rowIndex,1);}
let calculateAndDisplayRoute=function(){updateMarkerOrder(null);addressMarkerArray=[];global_pdf.route_stops=[];directionsDisplay.setMap(map);let waypts=[],start='',finish='',caseArray=[],locationArray=[],peopleArray=[],fpArray=[],ppArray=[];let $addressRowSelection=$("#routableAddressRows > tr:not(.placeholder)");let summaryPanel=document.getElementById('directions-panel');summaryPanel.innerHTML='';$addressRowSelection.each(function(i){let latLngObj=extractLATLNG($(this).children("td#location").attr('val'));caseArray.push($(this).children("td").eq(1).text());locationArray.push($(this).children("td#location").text().trim());peopleArray.push($(this).children("td").eq(7).text().trim());fpArray.push($(this).children("td").eq(3).text().trim());ppArray.push($(this).children("td").eq(4).text().trim());global_pdf.route_stops.push(latLngObj);if(i==0){start=new google.maps.LatLng(latLngObj.lat,latLngObj.lng);}else if(i==($addressRowSelection.length-1)){finish=new google.maps.LatLng(latLngObj.lat,latLngObj.lng);}else{waypts.push({location:new google.maps.LatLng(latLngObj.lat,latLngObj.lng),stopover:true});}});global_pdf.start=locationArray[0];global_pdf.end=locationArray[locationArray.length-1];global_pdf.tasks=[];timeOfDeparture=new Date(Date.now()+1000);directionsService.route({origin:start,destination:finish,waypoints:waypts,drivingOptions:{departureTime:timeOfDeparture,trafficModel:'bestguess'},travelMode:'DRIVING'},function(response,status){if(status==='OK'){console.log('driving directions updated....')
directionsDisplay.setDirections(response);let route=response.routes[0];global_pdf.route_path=response.routes[0].overview_polyline;let timeCalc=0,distanceCalc=0;for(let i=0;i<=route.legs.length;i++){let routeSegment=i-1;let legDistance,legDuration;if(i==0){legDistance=0;legDuration=0;summaryPanel.innerHTML+='<b>Start: '+locationArray[i]+' | '+caseArray[i]+'</b><br>';summaryPanel.innerHTML+='People: '+peopleArray[i]+'<br><hr><br>';}else{timeCalc+=Number(route.legs[routeSegment].duration.text.replace(/[a-z]+/g,'').trim());distanceCalc+=Number(route.legs[routeSegment].distance.text.replace(/[a-z]+/g,'').trim());legDistance=route.legs[routeSegment].distance.text;legDuration=route.legs[routeSegment].duration.text;summaryPanel.innerHTML+='<b>#'+i+'. '+locationArray[i]+' | '+caseArray[i]+'';summaryPanel.innerHTML+='<span id="routeTripTime" class="leg'+i+'"><b>Est. Trip:</b> '+legDuration+' | <b>Distance:</b> '+legDistance+'</span></b><br>';summaryPanel.innerHTML+='People: '+peopleArray[i]+'<br><hr><br>';}
global_pdf.tasks.push({folder:locationArray[i],folder_num:caseArray[i],fp:fpArray[i],pp:ppArray[i],people:peopleArray[i],leg_dist:legDistance,leg_time:legDuration});}
global_pdf.trip_dist=""+distanceCalc.toPrecision(2);global_pdf.trip_time=""+timeCalc.toPrecision(2);summaryPanel.innerHTML+='<span id="finalRouteStats"><b>Trip Time:</b> '+timeCalc.toPrecision(2)+' mins | <b>Trip Distance:</b> '+distanceCalc.toPrecision(2)+' mi</span>';global_pdf.map_center=String(map.getCenter().toUrlValue());global_pdf.map_zoom=String(map.getZoom());}else if(status==='MAX_WAYPOINTS_EXCEEDED'){window.alert('Directions request failed due to '+status+'\nThe limit is 22.');summaryPanel.innerHTML='';}else if(status==='OVER_QUERY_LIMIT'){window.alert('Directions request failed due to '+status+'\nToo many queries. Contact IT Code Support.');summaryPanel.innerHTML='';}else if(status==='UNKNOWN_ERROR'){window.alert(status+'\nRefresh page and try again!');summaryPanel.innerHTML='';}else{window.alert('Directions request failed due to '+status);summaryPanel.innerHTML='';}
$("#loading-route-overlay").hide('slow',function(){$("#loading-route-overlay").remove();});$("#createPDF").prop('disabled',false);$("#createPDF").addClass('btn-primary');$("#createPDF").removeClass('btn-default');$("#mobileApp").prop('disabled',false);$("#mobileApp").addClass('btn-primary');$("#mobileApp").removeClass('btn-default');});}
let updateDirectionsDisplay=function(response){console.log(response);let summaryPanel=document.getElementById('directions-panel');let route=response.routes[0];global_pdf.route_path=response.routes[0].overview_polyline;let timeCalc=0,distanceCalc=0;for(let i=0;i<=route.legs.length;i++){let routeSegment=i-1;let legDistance,legDuration;if(i==0){legDistance=0;legDuration=0;}else{timeCalc+=Number(route.legs[routeSegment].duration.text.replace(/[a-z]+/g,'').trim());distanceCalc+=Number(route.legs[routeSegment].distance.text.replace(/[a-z]+/g,'').trim());legDistance=route.legs[routeSegment].distance.text;legDuration=route.legs[routeSegment].duration.text;$(".leg"+i+"").html('<span id="routeTripTime"><b>Est. Trip:</b> '+legDuration+' | <b>Distance:</b> '+legDistance+'</span></b><br>');console.log('new leg??? '+legDuration);}
global_pdf.tasks[i].leg_dist=legDistance;global_pdf.tasks[i].leg_time=legDuration;}
global_pdf.trip_dist=""+distanceCalc.toPrecision(2);global_pdf.trip_time=""+timeCalc.toPrecision(2);$("#finalRouteStats").html('<span id="finalRouteStats"><b>Trip Time:</b> '+timeCalc.toPrecision(2)+' mins | <b>Trip Distance:</b> '+distanceCalc.toPrecision(2)+' mi</span>');global_pdf.map_center=String(map.getCenter().toUrlValue());global_pdf.map_zoom=String(map.getZoom());}
global_func.validateRemoveButton=function(){$(".removeAddress").unbind('click').bind('click',function(){let rowIndex=$(this).parents("tr:first")[0].rowIndex;removeSpecificMarker(rowIndex-1);$(this).parent().parent().remove();global_func.adjustRowCount();updateMarkerOrder(map);});}
let addAddressFromInput=function(address){$("#routableAddressRows").append('<tr>'+
'<td class="first"><span id="count"></span>'+
'<button type="button" class="btn btn-sm btn-default removeAddress">'+
'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
'</button>----</td>'+
'<td class="b">n/a</td>'+
'<td class="c">temp: ('+address+')</td>'+
'<td class="a">----</td>'+
'<td class="a">----</td>'+
'<td class="a">----</td>'+
'<td class="a">----</td>'+
'<td class="c">----</td>'+
'<td class="c" id="location">'+address+'</td>'+
'</tr>');$activeElement=$("#routableAddressRows > tr:not(.placeholder):last-child").children("td#location");global_func.validateRemoveButton();global_func.adjustRowCount();global_func.placeAddressOnMap(address,address,false);}
global_func.adjustRowCount=function(){$("#routableAddressRows > tr.placeholder").remove()
let $divGroup=$("#routableAddressRows > tr");let arrayLength=$("#routableAddressRows > tr:not(.placeholder) ").length;if(arrayLength>=2){$("#createRoute").prop('disabled',false);$("#createRoute").addClass('btn-primary');$("#createRoute").removeClass('btn-default');}else{$("#createRoute").prop('disabled',true);$("#createRoute").removeClass('btn-primary');$("#createRoute").addClass('btn-default');}
$divGroup.each(function(i){if(i==0){$(this).children("td").find("span#count").html('S');}else{$(this).children("td").find("span#count").html(i);}});addPlaceholderRows(arrayLength);}
let addPlaceholderRows=function(rowCount){for(let i=rowCount;i<10;i++){let newRow='<tr class="placeholder">';for(let j=0;j<9;j++){newRow+='<td id="no">&nbsp;</td>';}
newRow+='</tr>';$("#routableAddressRows").append(newRow);newRow='';}}
dragula([document.getElementById("availableAddressRows"),document.getElementById("routableAddressRows")],{copy:function(el,source){return source===document.getElementById("availableAddressRows")},accepts:function(el,target){return target!==document.getElementById("availableAddressRows")},moves:function(el,container,handle){return!el.classList.contains('mobile')},delay:100,removeOnSpill:false}).on('drop',function(el,target,sibling){if(target){if($(el).children("td").children("button").length){updateMarkerOrder(map);}else{$(el).children("td.first").prepend(''+'<span id="count"></span>'+
'<button type="button" class="btn btn-sm btn-default removeAddress">'+
'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
'</button>');let newAddress=$(el).children("td#location").text().trim()+", Austin, TX";let popUpText=$(el).children("td#location").text().trim();$activeElement=$(el).children("td#location");let tableLength=$(target).children("tr:not(.placeholder)").length-1;let dropIndex=$(target).children("tr.gu-transit")[0].rowIndex;let sort=false;if(dropIndex<=tableLength){sort=true;}
global_func.placeAddressOnMap(newAddress,popUpText,sort);}
global_func.validateRemoveButton();global_func.adjustRowCount();}else{console.log('missed');}}).on('drag',function(el){$(el).css('font-size','11px');$(el).css('background-color','white');$(el).css('border','1px #ddd solid');$(el).children().css('width','10%');}).on('remove',function(el){console.log('item removed...');global_func.adjustRowCount();});$("#dropdownChoice > li").on('click',function(){let addressValue=$(this).attr('val');addAddressFromInput(addressValue+", Austin, TX");});$("#addNewAddress").on('click',function(){if($("#addressInput").val().length>=5){let addressValue=$("#addressInput").val();addAddressFromInput(addressValue);$("#addressInput").val('');}});$(document).keypress(function(e){if(e.which==13&&$("#addressInput:focus").val()){if($("#addressInput:focus").val().length>=5){$("#addNewAddress").trigger("click");}}});$("#createRoute").on('click',function(){$("#map").prepend('<div id="loading-route-overlay">'+
'<section class="loaders">'+
'<span class="loader loader-route-quart"> </span> Generating Route...'+
'</section>'+
'</div>');calculateAndDisplayRoute();});$("#resetList").on('click',function(){$("#availableAddressRows").html("");$("#directions-panel").html("");let $divGroup=$("#routableAddressRows > tr:not(.placeholder)");$divGroup.each(function(i){$(this).remove()});global_func.adjustRowCount();updateMarkerOrder(null);directionsDisplay.setMap(null);$("#createPDF").prop('disabled',true);$("#createPDF").removeClass('btn-primary');$("#createPDF").addClass('btn-default');$("#mobileApp").prop('disabled',true);$("#mobileApp").removeClass('btn-primary');$("#mobileApp").addClass('btn-default');addressMarkerArray=[];iconCount=0;$(".header-row th").removeClass("headerSortUp");$(".header-row th").removeClass("headerSortDown");initialize();});addPlaceholderRows(0);initialize();$("#availableAddressTable").tablesorter({sortReset:true,sortRestart:true});let yek1='AIzaSyBXAnW9slEyfpkJKdHxnz_29kF8pn14MA0',yek2='AIzaSyALPWxESCeijSKpKHoduW0htKA6w0KIJnc',yek3='AIzaSyBbnhwYIXT-MBTVIaDxS9kzbqIOmoeqcRU',yek4='AIzaSyCRQEeXDjgRjRX7HVyGFLDQXCzlrty1NxI',yek5='AIzaSyDgR0LEtKMow--eiBeyiCbypLhDMAKCE8E',yek6='AIzaSyC6ag7eWl7tjpaLo94L3w2LYZO41vklZC8';let yeks=[yek1,yek2,yek3,yek4,yek5,yek6];let taskIcon={path:'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',fillColor:'#0CB',fillOpacity:0.8,scale:0.35,strokeColor:'#008C80',strokeWeight:1};tasklistComplete=function(){$("#progress-group").css("height","0px");}
mapTaskListItem=function(obj){let taskListTotal=obj.length;let progressNumber=0;$("#progress-group").css("height","20px");map.panTo(new google.maps.LatLng(30.2709246,-97.7481116));map.setZoom(12);let list=obj;let arrayPos=0;function addressLoop(){if(arrayPos>=list.length){tasklistComplete();return;}
progressNumber=Math.floor((arrayPos/taskListTotal)*100);$("#progress-bar").css("width",""+progressNumber+"%");$("#progress-value").html(""+progressNumber+"%");let addressSearch=list[arrayPos]['foldername'];if(addressSearch.length>1){selectedYek=yeks[Math.floor(Math.random()*6)]
let link='https://maps.googleapis.com/maps/api/geocode/json?address='+addressSearch+'+Austin,+TX&key='+selectedYek;$.ajax({url:link,type:"GET"}).done(function(data){if(typeof data.results[0]!='undefined'){let newTaskMarker=new google.maps.Marker({position:{lat:data['results'][0]['geometry']['location']['lat'],lng:data['results'][0]['geometry']['location']['lng']},icon:taskIcon,map:map,draggable:false});let popUpWindow="<div>Folder: "+list[arrayPos].foldernumber+"<br /> "+"Address: "+list[arrayPos].foldername+"</div>";let infowindow=new google.maps.InfoWindow({content:popUpWindow});newTaskMarker.addListener('click',function(){infowindow.open(map,newTaskMarker);});taskListMarkerArray.push(newTaskMarker);}
arrayPos++;addressLoop();});}else{arrayPos++;addressLoop();}}
if(arrayPos>=list.length){tasklistComplete();return;}else{addressLoop();}};});/*!
 * custom javascript script for github page
 */
$(document).ready(function(){'use strict';const DATE_STRING="May 2017";console.log("hi! welcome to austin code's github!!!");$("#footnoteInsert").html(''+
'<span class="label label-default">Last Update: '+
'<span id="dateString">'+DATE_STRING+'</span>'+
'</span>');$("#navbarInsert").html('<div class="container">'+
'<div class="navbar-header">'+
'<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">'+
'<span class="sr-only">Toggle navigation</span>'+
'<span class="icon-bar"></span>'+
'<span class="icon-bar"></span>'+
'<span class="icon-bar"></span>'+
'</button>'+
'<a class="navbar-brand" href="#">Austin Code</a>'+
'</div>'+
'<div id="navbar" class="navbar-collapse collapse">'+
'<ul class="nav navbar-nav">'+
'<li><a href="index.html">Home</a></li>'+
'<li><a href="about.html">About</a></li>'+
'<li class="active"><a href="resources.html">Resources</a></li>'+
'<li><a href="maps.html">Maps</a></li>'+
'<li><a href="demographics.html">Demographics</a></li>'+
'<li><a href="news.html">News</a></li>'+
'</ul>'+
'</div>'+
'<!--/.nav-collapse -->'+
'</div>)');});$(document).ready(function(){let openDataLink='https://data.austintexas.gov/resource/czdh-pagu.json';let openData;$.ajax({url:openDataLink,type:"GET",data:{"$limit":7000,"$$app_token":"AmHlGm0OHBl6r4hg0PLvAtJk7"}}).done(function(data){let nameArray=_.chain(data).pluck('assigneduser').uniq().value();let removeArray=['Todd Wilcox','Viola Ruiz','Marcus Elliott','Tammy Lewis','Kendrick Barnett',];let filterArray=nameArray.filter(function(name){if(removeArray.indexOf(name)<0){return name;}})
$("#inspectorID").autocomplete({source:filterArray});openData=data;});function dateFormatting(datestring){let _d=new Date(datestring);let yr=_d.getFullYear();let mth=_d.getMonth()+1;let day=_d.getDate();if(isNaN(yr)){return'';}else{return mth+"/"+day+"/"+yr;}}
function nullCheck(string){if(string){return string;}else{return'';}}
$("#loadTaskList").on('click',function(){$("#availableAddressRows").html("");let chosenName=$("#inspectorID").val();if($("#inspectorID").val().length>=2){$("#inspectorID").val('');}
global_pdf.name=chosenName;global_pdf.datestamp=dateFormatting(Date.now());global_pdf.timestamp=new Date().toLocaleTimeString();let filteredData=_.filter(openData,function(row){return row.assigneduser==chosenName;})
let uniqueAddressArray=[],filteredAddressArray=[],addCheck;$(filteredData).each(function(i){$("#availableAddressRows").append('<tr>'+
'<td class="first">'+nullCheck(filteredData[i].type)+'</td>'+
'<td class="b">'+nullCheck(filteredData[i].foldernumber)+'</td>'+
'<td class="c" id="location">'+nullCheck(filteredData[i].foldername)+'</td>'+
'<td class="a">'+nullCheck(filteredData[i].priority1)+'</td>'+
'<td class="a">'+nullCheck(filteredData[i].priority2)+'</td>'+
'<td class="a">'+dateFormatting(filteredData[i].duetostart)+'</td>'+
'<td class="a">'+dateFormatting(filteredData[i].duetoend)+'</td>'+
'<td class="c">'+nullCheck(filteredData[i].peoplename)+'</td>'+
'<td class="c">'+nullCheck(filteredData[i].housenumber)+' '+nullCheck(filteredData[i].streetname)+'</td>'+
'</tr>');addCheck=filteredData[i].foldername;if((nullCheck(addCheck).length>1)&&(uniqueAddressArray.indexOf(addCheck)<0)){uniqueAddressArray.push(addCheck);filteredAddressArray.push(filteredData[i])}});mapTaskListItem(filteredAddressArray);$('#availableAddressTable').trigger('update');$window.trigger('resize');$('#availableAddressRows > tr').children("td.first").prepend(''+
'<a type="button" class="btn btn-sm btn-default mobileAdd">'+
'<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>'+
'</a>');validateAddButton();});$(document).keypress(function(e){if(e.which==13&&$("#inspectorID:focus").val()){if($("#inspectorID:focus").val().length>=2){$("#loadTaskList").trigger("click");}}});let $window=$(window);$window.resize(function resize(){$draggableTable1=$('#availableAddressRows > tr');$draggableTable2=$('#routableAddressRows > tr');$mobileAddButton=$('#availableAddressRows > tr > td.first > a');if($window.width()<768){$mobileAddButton.addClass('mobileAdd');$draggableTable1.addClass('mobile');return $draggableTable2.addClass('mobile');}
$mobileAddButton.removeClass('mobileAdd');$draggableTable1.removeClass('mobile');$draggableTable2.removeClass('mobile');}).trigger('resize');let validateAddButton=function(){$("a.mobileAdd").unbind('click').bind('click',function(elem){let $tableRow=$(this).parent().parent()[0];let newAddress=$($tableRow).children("td#location").text().trim()+", Austin, TX";let popUpText=$($tableRow).children("td#location").text().trim();$activeElement=$($tableRow).children("td#location");$("#routableAddressRows").append('<tr>'+
'<td class="first"><span id="count"></span>'+
'<button type="button" class="btn btn-sm btn-default removeAddress">'+
'<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>'+
'</button>'+$($tableRow).children("td:nth-child(1)").text()+'</td>'+
'<td class="b">'+$($tableRow).children("td:nth-child(2)").text()+'</td>'+
'<td class="b">'+$($tableRow).children("td:nth-child(3)").text()+'</td>'+
'<td class="c" id="location">'+$($tableRow).children("td:nth-child(4)").text()+'</td>'+
'<td class="a">'+$($tableRow).children("td:nth-child(5)").text()+'</td>'+
'<td class="a">'+$($tableRow).children("td:nth-child(6)").text()+'</td>'+
'<td class="a">'+$($tableRow).children("td:nth-child(7)").text()+'</td>'+
'<td class="a">'+$($tableRow).children("td:nth-child(8)").text()+'</td>'+
'<td class="c">'+$($tableRow).children("td:nth-child(9)").text()+'</td>'+
'<td class="c">'+$($tableRow).children("td:nth-child(10)").text()+'</td>'+
'</tr>');$activeElement=$("#routableAddressRows > tr:not(.placeholder):last-child").children("td#location");global_func.validateRemoveButton();global_func.adjustRowCount();global_func.placeAddressOnMap(newAddress,popUpText,false);});};global_pdf.name='';global_pdf.datestamp=dateFormatting(Date.now());global_pdf.timestamp=new Date().toLocaleTimeString();});$(document).ready(function(){let createFinalPDF=function(){let $directionsText=$('#directions-panel')[0];let pdfOptions={orientation:"portrait",unit:"mm",format:"letter"};let pdf=new jsPDF(pdfOptions);pdf.setFont("helvetica");pdf.setTextColor(0,0,0);pdf.setLineWidth(0.5);let left_margin=16;const PAGE_HEIGHT=280;const PAGE_WIDTH=200;let content_margin=40;let page_count=1;let labels='ABCDEFGHIJKLMNOPQRSTUVWXYZ';let getRightMargin=function(obj){return PAGE_WIDTH-(obj.length*2);}
let createMarkerArray=function(markerArray){let finalString='';for(let i=0;i<markerArray.length;i++){if(i==markerArray.length-1){finalString+="&markers=color:green%7Clabel:"+labels[i%labels.length]+"%7C"+String(markerArray[i].lat)+","+String(markerArray[i].lng);}else{finalString+="&markers=color:red%7Clabel:"+labels[i%labels.length]+"%7C"+String(markerArray[i].lat)+","+String(markerArray[i].lng);}}
return finalString}
let addLine=function(lineType,yValue){if(lineType=="thin"){pdf.setLineWidth(0.25);pdf.setDrawColor(200,200,200);pdf.line(left_margin,yValue,PAGE_WIDTH,yValue);}else{pdf.setLineWidth(0.5);pdf.setDrawColor(15,15,15);pdf.line(left_margin,yValue,PAGE_WIDTH,yValue);}}
let addHeader=function(){pdf.setFontSize(14);pdf.text(left_margin,20,global_pdf.name);pdf.setFontSize(10);pdf.text(left_margin,27,''+global_pdf.start+' to '+global_pdf.end);pdf.text(getRightMargin(global_pdf.datestamp),20,""+global_pdf.datestamp);pdf.text(getRightMargin(global_pdf.timestamp),27,""+global_pdf.timestamp);addLine("header",30);pdf.addImage(codeImgURL,'JPEG',PAGE_WIDTH/2,5,18,18);addFooter();}
let addFooter=function(){pdf.setFontSize(8);pdf.setTextColor(70,70,70);let footerText='City of Austin | Open Data Portal | jsPDF | GitHub'
let footerMargin=PAGE_WIDTH/2-20;let footerHeight=PAGE_HEIGHT-18;pdf.text(footerMargin,footerHeight,footerText);pdf.text(PAGE_WIDTH,footerHeight,String(page_count));pdf.setFontType("normal");pdf.setFontSize(10);pdf.setTextColor(0,0,0);}
let $element=$('#sampleImg');let $mapElement=$('#map');let mapWidth=640
let mapHeight=400
let google_1="https://maps.googleapis.com/maps/api/staticmap";let google_2="?center="+global_pdf.map_center;let google_3="&zoom="+global_pdf.map_zoom;let google_4="&size=640x400";let google_5=createMarkerArray(global_pdf.route_stops);let google_6="&path=weight:4%7Ccolor:blue%7Cenc:"+global_pdf.route_path;let google_k="&key=AIzaSyCSjAnT5cJ03MwURghAT1nZrLz4InNRpP0";let pdfImgWidth=mapWidth*(184/mapWidth);let pdfImgHeight=mapHeight*(105/mapHeight);let picMarginX=10+PAGE_WIDTH/2;let picMarginY=content_margin-10;function addGoogleMapImage(){let $canvas=document.getElementById("canvasImg")
let ctx=$canvas.getContext('2d');;let img=new Image();img.onload=function(){$canvas.width=mapWidth;$canvas.height=mapHeight;ctx.drawImage(img,0,0,mapWidth,mapHeight);let dataUrl=$canvas.toDataURL('image/png',1.0);pdf.addImage(dataUrl,'JPEG',left_margin,content_margin-5,pdfImgWidth,pdfImgHeight);pdf.setFontType("bold");pdf.text(left_margin,content_margin+pdfImgHeight+20,'Trip Time: '+global_pdf.trip_time+" minutes");pdf.text(left_margin+80,content_margin+pdfImgHeight+20,'Trip Distance: '+global_pdf.trip_dist+" miles");pdf.setFontType("normal");page_count=page_count+1;addTaskContents();}
img.crossOrigin="anonymous";img.src=google_1+google_2+google_3+google_4+google_5+google_6+"&maptype=roadmap"+google_k;}
function addTaskContents(){pdf.addPage();addHeader();let tasklist=global_pdf.tasks;let inner_margin_A=left_margin+20;for(let i=0;i<global_pdf.tasks.length;i++){pdf.setLineWidth(0.5);pdf.setDrawColor(15,15,15);pdf.rect(left_margin,content_margin-3,5,5);pdf.text(left_margin+1,content_margin+1,labels[i%labels.length]);pdf.text(inner_margin_A,content_margin,tasklist[i].folder_num);pdf.text(inner_margin_A+60,content_margin,''+tasklist[i].folder);pdf.text(inner_margin_A,content_margin+5,''+tasklist[i].people);pdf.text(inner_margin_A,content_margin+10,'FP: '+tasklist[i].fp);pdf.text(inner_margin_A+60,content_margin+10,'PP: '+tasklist[i].pp);pdf.text(inner_margin_A,content_margin+15,'Time: '+tasklist[i].leg_time+'');pdf.text(inner_margin_A+60,content_margin+15,'Distance: '+tasklist[i].leg_dist+'');if(i==global_pdf.tasks.length-1){content_margin+=40;pdf.setFontType("bold");pdf.text(left_margin,content_margin,'Trip Time: '+global_pdf.trip_time+" minutes");pdf.text(left_margin+80,content_margin,'Trip Distance: '+global_pdf.trip_dist+" miles");}else if(content_margin>=PAGE_HEIGHT-80){pdf.addPage();page_count=page_count+1;addFooter()
content_margin=30;}else{addLine("thin",content_margin+18);content_margin+=27;}}
function callback(){alert("done!");}
pdf.output('datauri',{},callback);}
addHeader();addGoogleMapImage();}
$("#createPDF").on('click',function(){console.log('printing....');$("#loading-overlay").fadeIn("slow");createFinalPDF();});});