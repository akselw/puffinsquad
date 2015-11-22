

$(document).ready(function() {
    selectSearch();
    initialize_map();
    
});

function script() {
    alert("I'm the ad");
    document.getElementById('panel-body');
};

function selectSearch() {

    $('#search-tab').addClass("active");
    $('#new-tab').removeClass("active");
    var html = '\
<div class="form-group">\
<label for="sel1">Filter results:</label>\
<select class="form-control" id="sel1">\
<option >Org unit</option>\
<option>Org unit Group</option>\
<option>Org unit Group Set</option>\
<option>Org unit Level</option>\
</select>\
</div>\
<label class="control-label" for="search">Search:</label>\
<div class="form-group" id="search">\
<input type="email" class="form-control" id="email" placeholder="Search for facility">\
<ul class="list-group">\
<li class="list-group-item">Search result 1</li>\
<li class="list-group-item">Search result 2</li>\
<li class="list-group-item">Search result 3</li>\
<li class="list-group-item">Search result 4</li>\
<li class="list-group-item">Search result 5</li>\
<li class="list-group-item">Search result 6</li>\
</div>';
    
    $('#panel-body').html(html);
}

function selectNewOrg() {

    $('#search-tab').removeClass("active");
    $('#new-tab').addClass("active");
    // $('#panel-body').load('file:///test.html');
    var html = '\
<div class="form-group"> \
<label class="control-label" for="new-org">New organisational unit:</label> \
\
<div class="form-group" id="new-org"> \
<input type="text" class="form-control" id="name" placeholder="Name"> \
</div> \
\
\
<div class="form-group" id="new-org"> \
<input type="text" class="form-control" id="latitude" placeholder="Latitude"> \
</div> \
\
\
<div class="form-group" id="new-org"> \
<input type="text" class="form-control" id="longitude" placeholder="Longitude"> \
</div> \
\
<button type="submit" class="btn btn-primary navbar-right">Save</button> \
</div>';
    $('#panel-body').html(html);
}



document.getElementById('new-link').onclick = function () {
    selectNewOrg();
};

document.getElementById('search-link').onclick = function () {
    selectSearch();
};


function getStudentData() {
    $.getJSON('/assignment2-gui/api/student', function(json) {
	populateStudentTable(json);
	populateStudentLocationForm(json);
    });
}

// This function gets called when you press the Set Location button
function get_location() {
    if (Modernizr.geolocation) {
	navigator.geolocation.getCurrentPosition(location_found);
    } else {
	// no native support; maybe try a fallback?
    }
}

// Call this function when you've succesfully obtained the location. 
function location_found(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var id = $( "#studentLocationTable option:selected" ).val();
    
    $.getJSON('/assignment2-gui/api/student/'+id+'/location?lat='+latitude+'&long='+longitude, function(json) {
	populateStudentTable(json);
    });
    // Extract latitude and longitude and save on the server using an AJAX call. 
    // When you've updated the location, call populateStudentTable(json); again
    // to put the new location next to the student on the page. . 
}

var map;
function initialize_map() {
    var mapOptions = {
        zoom : 10,
        mapTypeId : google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });
    } else {
        // Browser doesn't support Geolocation
        // Should really tell the user…
    }
}


// No need to change javascript below this line, unless you want to...

function populateStudentTable(json) {

    $('#studentTable').empty();

    for (var s = 0; s < json.length; s++) {
	var student = json[s];
	student = explodeJSON(student);
	var tableString = "<tr>";
	console.log('Student');
	console.log(student);
	// Name
	tableString += "<td>" + student.name + "</td>";

	// Courses
	tableString += "<td>";
	for (var c = 0; c < student.courses.length; c++) {
	    var course = student.courses[c];
	    course = explodeJSON(course);
	    tableString += course.courseCode + ' ';
	    /*
	     * tableString += '<a href="/assignment2-gui/student/' + student.id +
	     * '/unenrollcourse/' + course.id + '"><img
	     * src="/assignment2-gui/images/Button-Delete-icon.png"></a>';
	     */
	}
	tableString += '</td>';

	// Location
	if (student.latitude != null && student.longitude != null) {
	    tableString += '<td>' + student.latitude + ' ' + student.longitude
		+ '</td>';
	    var myLatlng = new google.maps.LatLng(student.latitude, student.longitude);                        
	    var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title: student.name
	    });
	} else {
	    tableString += '<td>No location</td>';
	}

	tableString += '</tr>';
	$('#studentTable').append(tableString);
    }

}

function populateStudentLocationForm(json) {
    var formString = '<tr><td><select id="selectedStudent" name="students">';
    for (var s = 0; s < json.length; s++) {
	var student = json[s];
	student = explodeJSON(student);
	formString += '<option value="' + student.id + '">' + student.name
	    + '</option>';
    }
    formString += '</select></td></tr>';
    // += '<tr><td><input class="btn btn-primary" type="submit" value="Set
    // location"></td></tr>';
    $('#studentLocationTable').append(formString);
}

$('#locationbtn').on('click', function(e) {
    e.preventDefault();
    get_location();
});


var objectStorage = new Object();

function explodeJSON(object) {
    if (object instanceof Object == true) {
	objectStorage[object['@id']] = object;
	console.log('Object is object');
    } else {
	console.log('Object is not object');
	object = objectStorage[object];
	console.log(object);
    }
    console.log(object);
    return object;
}
