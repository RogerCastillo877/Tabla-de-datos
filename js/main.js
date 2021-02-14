var data;
var dataGraph, dataTable;
var sensorPreferido = "TEMPERATURA"
$(document).ready(function($){
   
   pideDatos(); 
    
    setInterval(function(){
        pideDatos();
    }, 60000
    );
    
    $("#boton_descarga_grafica").click(function(){
        var canvas = document.getElementById("jgvJSONGraphicCanvas")
        var dt = canvas.toDataURL('image/jpeg');
        $(this).get(0).href = dt;
    });
    
    $("#boton_descarga_csv").click(function(){
        descargaCSV();
    });
});

function pideDatos(){
    var obj = {
        type: "GET",
        url: "js/data.json",
        dataType: "json", 
        data: {}
    };
    $.ajax(obj)
        .done(function(datos){
            data = datos["valores"];
            redraw();
            resfrescaSensores();
        })
        .fail(function(jqXHR, error){
            alert("no se han podido cargar los datos: " + error);
        });
}

function redraw(){
    if(!dataGraph){
        dataGraph = $("#dataGraph").jgvJSONGraphic({data:data, customClass:"sensorGraph", prop:sensorPreferido, margin:25, customID:"jgvJSONGraphicCanvas"});
        dataTable = $("#dataTable").jgvJSONTable({data:data, customClass:"sensorTable"});
    }
   
    dataGraph.jgvJSONGraphic("reload", data);
    dataTable.jgvJSONTable("reload", data);
    
    $( ".sensorTable" ).table( "refresh" );
}

//recarga los radio button de los sensores
function resfrescaSensores(){
    $("#sensor_container").html("");
    //genero los radiobuttons para seleccionar sensor
    var sensors = new Object();
    for(var hour in data){
        for(var name in data[hour]){
            if(sensors[name] == undefined){
                sensors[name] = name;
                var sel = ""
                var classSel = "";
                if(name == sensorPreferido){
                    sel = " checked='checked'";
                    classSel = " selected"
                }
                var radio = $("<div class='radio_file" + classSel + "'><label for='" + name + "'>" + name + "</label><input type='radio' name='sensors' value='" + name + "' id='" + name + "'"+ sel +" /></div>");
                $("#sensor_container").append(radio);
            }
        }
    }
    // y preparo que cuando se cambie la selección, recargue la tabla
    $("input:radio[name=sensors]").change(function(e){
        dataGraph.jgvJSONGraphic("changeProp", $(this).val(), window.data);
        sensorPreferido = $(this).val();
        $(".radio_file.selected").removeClass("selected");
        $(this).parent().addClass("selected");
    });    
}

//descarga de archivo csv desde el servidor
function descargaCSV(){
    var csvContent = "";
    var texto = "";
    
    for (var item in data){
        for (var prop in data[item]){
            texto += data[item][prop] + ";";
        }
        texto += "\n";
    }
    
    var filename = "datos.csv";
     var blob = new Blob([texto], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
}
