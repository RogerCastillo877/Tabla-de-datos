(function($) {
 
    $.widget( "custom.jgvJSONGraphic", {
       widgetEventPrefix:"jgv",
       options: {
                   data:{},
                   customClass:"sensorGraph",
                   prop:"",
                   margin:20,
                   customID: "jgvJSONGraphicCanvas",
               },
               _create: function() {
           this.contenedor = this.element;
                       var widget = this;
                       
                       this.mobileVersion = (window.screen.width) < 601;
                       
                       this.contenedor.append("<h2 class='h2_sensor_graph'></h2>");
                       
                       this.ancho = this.contenedor.width();
                       this.alto = this.contenedor.height();
                       
                       var _canvas = $("<canvas id='" + this.options.customID + "'></canvas>");
                       this.contenedor.append(_canvas);
                       this.canvas = _canvas.get(0);
                       this.canvas.width = this.ancho;
                       this.canvas.height = this.alto;
                       this.context = this.canvas.getContext("2d");
                       
                       this._draw();
                   },
               _draw: function(){
                       this.contenedor.find(".h2_sensor_graph").html("Datos del sensor " + this.options.prop);
                       
                       //pongo el fondo blanco, para cuando se descargan gráficas
                       this.context.beginPath();
                       this.context.fillStyle = "#ffffff";
                       this.context.fillRect(0, 0, this.ancho, this.alto);
                       
                       //recupero los valores de paso entre registros
                       var min = 0;
                       this.max = 0;
                       var _data = new Array();
                   
                       for(var hour in this.options.data){
                           if(this.max < Number(this.options.data[hour][this.options.prop])){
                               this.max = this.options.data[hour][this.options.prop]
                           }
                           _data.push({hour:hour.replace("_", ":"), value:this.options.data[hour][this.options.prop]});
                       }
                       this.options.data = _data;
                       var totales = this.options.data.length;
                       
                       var pasoHz = ((this.ancho - (this.options.margin*2)) / totales);
                       this.pasoVr = (this.alto  - (this.options.margin*2)) / this.max;
                       
                       //genero la tabla de fondo
                       this._drawBackgrond();
                       
                       //genero la gráfica
                       this.context.beginPath();
                       var lastX = this.options.margin;
                       var i = 0;
                       for(var i=0; i<this.options.data.length; i++){
                           if(i == 0){
                               this.context.moveTo(lastX, this.alto - this.options.margin - (this.pasoVr * this.options.data[i]["value"]));
                           }
                           lastX += pasoHz
                           this.context.lineTo(lastX, this.alto - this.options.margin - (this.pasoVr * this.options.data[i]["value"]));
                       }
                       this.context.strokeStyle = "#ff0000";
                       this.context.lineWidth = 2;
                       this.context.stroke();
       },
               _drawBackgrond: function(){
                   this.context.beginPath();
                   //eje y
                   var pasos = 10;
                   if(this.mobileVersion){
                       pasos = 8;
                   }
                   this.context.moveTo(this.options.margin, 0);
                   this.context.lineTo(this.options.margin, this.alto - this.options.margin);
                   this.context.strokeStyle = "#666";
                   this.context.lineWidth = 1;
                   this.context.stroke();
                   var posH = Math.floor(this.options.data.length/pasos);
                   var disH = (this.ancho - (this.options.margin * 2)) / pasos;
                   for(var i=0; i<pasos+1; i++){
                       //valores de hora eje X
                       this.context.fillStyle = '#666';
                       this.context.font = '11px sans-serif';
                       this.context.textBaseline = 'top';
                       if(this.options.data[i*posH] != undefined){
                           this.context.fillText (this.options.data[i*posH]["hour"], this.options.margin + (i * disH) - 10, this.alto - this.options.margin + 2);
                       }
                   }
                   
                   //ejes x
                   var pasos = 5;
                   var valorV = this.max / pasos;
                   var posV = (this.alto - this.options.margin*2) / pasos;
                   
                   for(var i=0; i<pasos+1; i++){
                       //valores del sensor en el eje y
                       this.context.fillStyle = '#666';
                       this.context.font = '11px sans-serif';
                       this.context.textBaseline = 'top';
                       this.context.fillText (Math.round(valorV * i), 0, this.alto - this.options.margin - (posV * i));
                       // ejes x
                       this.context.moveTo(this.options.margin, this.alto - this.options.margin - (posV * i));
                       this.context.lineTo(this.ancho, this.alto - this.options.margin - (posV * i));
                   }
                   this.context.strokeStyle = "#DDD";
                   this.context.lineWidth = 1;
                   this.context.stroke();
                   
                   
               },
               reload: function(_data){
                   this.options.data = _data;
                   this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                   this._draw();
               },
               changeProp: function(_prop, _data){
                   this.options.prop = _prop;
                   this.reload(_data);
               },
       });
   
}(jQuery));