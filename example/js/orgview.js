$(function() {
   var orgunits = [];

   $.getJSON('orgunits.json', function(data) {
       $.each(data, function(i) {
          var tblRow = "<tr>" + "<td>" + f.name + "</td>" +
           "<td>" + f.href + "</td>" + "<td>" + f.code + "</td>" + "</tr>"
           $(tblRow).appendTo("#userdata tbody");
     });

   });

});
