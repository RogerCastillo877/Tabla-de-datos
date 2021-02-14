(function($) {
 
    $.widget( "custom.jgvJSONTable", {
       widgetEventPrefix:"jgv",
       options: {
                   data:{},
                   customClass:"sensorTable",
               },
               _create: function() {
           this.contenedor = this.element;
                       var widget = this;
                       
                       this._draw();
               },
               _draw: function(){
                       var _data = new Array();
                       var sensors = new Object();
                       sensors["Hora"] = "Hora";
                       for(var hour in this.options.data){
                           var obj = new Object();
                           obj["Hora"] = hour.replace("_", ":");
                           for(var name in this.options.data[hour]){
                               obj[name] = this.options.data[hour][name];
                               if(sensors[name] == undefined){
                                   sensors[name] = name;
                               }
                           }
                           _data.push(obj);
                       }
                       this.options.data = _data.reverse();
                       //ordeno los cabeceros
                       var sensorsOrdered = new Array();
                       for(var name in sensors){
                           sensorsOrdered.push(name);
                       }
                       
                       this.contenedor.html("");
                       var tabla = $("<table  data-tablesaw-mode='columntoggle' class='tablesaw " + this.options.customClass + "'></table>");
                       var tHead = $("<thead></thead>")
                       var tBody = $("<tbody></tbody>");
                       var tr = $("<tr></tr>")
                       var i = 0;
                       for(var name in sensors){
                           if(i==0){
                                tr.append("<th  scope='col' data-tablesaw-sortable-col  data-tablesaw-priority='persist'>" + name + "</th>");
                           }else{
                                tr.append("<th scope='col' data-tablesaw-sortable-col   data-tablesaw-priority='" + i + "'>" + name + "</th>");
                           }
                          i++;
                       }
                       tHead.append(tr);
                       tabla.append(tHead);
                       //console.debug(sensorsOrdered);
                       for(var i=0; i<this.options.data.length; i++){
                           var fila = $("<tr></tr>");
                           for(var is=0; is<sensorsOrdered.length; is++){
                               var val = this.options.data[i][sensorsOrdered[is]];
                               if(val == undefined){
                                   val = "";
                               }
                               fila.append("<td>" + val + "</td>");
                           }
                           tBody.append(fila);
                       }
                       tHead.find("th").css("width", Math.floor(100/sensorsOrdered.length)+"%");
                       tBody.find("td").css("width", Math.floor(100/sensorsOrdered.length)+"%");
                       tabla.append(tBody);
                       this.contenedor.append(tabla);
                 },
               reload: function(data){
                   
                   this.options.data = data;
                   
                   this._draw();
               }
       });
   
}(jQuery));