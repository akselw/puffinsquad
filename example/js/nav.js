

$(document).ready(function() {
    selectSearch();
});

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
<li class="list-group-item">Search result 7</li>\
<li class="list-group-item">Search result 8</li>\
</ul>\
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
<div class="form-group">\
<label for="sel1">Belongs to set:</label>\
<select class="form-control" id="sel1">\
<option >---------</option>\
<option>Org unit set 1</option>\
<option>Org unit set 2</option>\
<option>Org unit set 3</option>\
<option>Org unit set 4</option>\
<option>Org unit set 5</option>\
<option>Org unit set 6</option>\
</select>\
</div>\
<button type="submit" class="btn btn-primary navbar-right">Save</button> \
</div>';
    $('#panel-body').html(html);
}

// document.getElementById('map-canvas').onclick = function () {
//     selectNewOrg();
// };

document.getElementById('new-link').onclick = function () {
    selectNewOrg();
};

document.getElementById('search-link').onclick = function () {
    selectSearch();
};
