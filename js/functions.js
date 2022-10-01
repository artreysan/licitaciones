/*
 * Date: 06/09/2019
 * Actualizado: 09/09/2019
 * Funciones generales y especificas de javascript
 */

var singarantiaEnf;
var singarantiaMed;
var singarantiaAle;
var crtSalvar = localStorage.setItem("crtSalvar", 0);
var ctrSaveImg = localStorage.setItem("ctrSaveImg", 0);

$(document).ready(function(){

  //para mostrar edad en la carga
  setEdad();
  
  //Validar formulario filtro
  if($("#frmFilProcesos").length){    
    $("#frmFilProcesos").validate({
      submitHandler: function(form) {           
          form.submit();
        }
    });
  }


  var indice = ($("#hidd_proceso").val() == 0) ? 1 : $("#hidd_proceso").val();

  // Imp. 30/06/20
  // Solo aplica para el terapeuta
  var idRol = $("#idRol").val();
  // console.log(idRol);
  // console.log(indice);
  if(indice==4 && idRol==5){
    indice=3;
    $("#btn_salvar_proceso").text("Aceptar");
  }

  if(indice==4 && idRol!=5){
    $("#cont_btn_salvar").hide();
    setTimeout(function(){
      $("#cont_btns_propuesta").show();
    },500);
  }

  // Imp. 09/07/20
  // Para mostrar el tab de sesiones despues de crear el contrato
  var id_tab = accounting.unformat($("#id_tab").val());
  if(id_tab==5){
    setTimeout(function(){
      $("#tab_list_5").trigger("click");
    },300);
  }


  //para la seccion de tabs
  if($(".tabs_proceso").length){
    $(".tabs_proceso").champ({
      active_tab : indice
    });
  }  

  //remover el atributo title del contenedor 
  $(".tab_content").removeAttr("title");


  if($(".dp_fechacita").length){
      //JAIR 04/6/2020 Fecha con hora
      $(".dp_fechacita").datetimepicker({
        timeFormat: 'HH:mm',
          showOn: "button",
          buttonImage: '../images/calendar.gif',
          buttonImageOnly: true,
          buttonText: "Select date",
          closeText: "Aceptar",
          timeText: "Horario",
          hourText: "Hora",
          minuteText: "Minuto",
          currentText: "Ahora",
          stepMinute: 5,
          hourMin: 9,
          hourMax: 20,
        // changeMonth: true,
        // changeYear: true,
        // maxDate: "+1D",
        // minDate: ($("#fPeticionPet").val() != "")?sumarDiasFechaTexto($("#fPeticionPet").val(),0):"0",
        yearRange: "-10:+1",
        defaultDate: $("#fechaHoy").val(),
        onSelect: function(dateText, inst){
          $("#dp_fechacita").val($(this).val());
        },
        onClose : function(dateText, inst){
        },
        viewMode: "months",
        minViewMode: "months",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        showOnFocus: false
      });
  }

  if($(".inputfecha").length){
      //Fecha del
      $(".inputfecha").datepicker({
            showOn: "button",
            buttonImage: '../images/calendar.gif',
            buttonImageOnly: true,
            buttonText: "Select date",
            changeMonth: true,
            changeYear: true,
            // maxDate: "+1D",
            // minDate: ($("#fPeticionPet").val() != "")?sumarDiasFechaTexto($("#fPeticionPet").val(),0):"0",
            yearRange: "1950:2020",
            // defaultDate: $("#fechaHoy").val(),
            onSelect: function(dateText, inst){              
            },
            onClose : function(dateText, inst){
              //JAIR 04/6/2020
              //Si es el input de cumpleaños, calcular edad
              //console.log($(this).attr("id"));
              if($(this).attr("id") == "dp_nacimiento"){
                var edad = calcularEdad($(this).val());
                $("#dp_edad").val(edad);
              }
            },
            viewMode: "months",
            minViewMode: "months",
            keyboardNavigation: false,
            forceParse: false,
            autoclose: true,
            showOnFocus: false,
      });
  }


  // Cambio usuario director
  $('#dir_soliautorizacion').change(function() {
    var cel = $(this).val();
    // console.log(cel);
    if(cel!=""){
      $("#cel_soliautorizacion").val(cel);
    }else{
      $("#cel_soliautorizacion").val("");
    }
  });


  //duallb departamentos en vista usuarios
  $('#departamento').change(function() {
    if($(this).val()!=null){
      $("#idsDeptos").val($(this).val());            
    }else{
      $("#idsDeptos").val("");
    }
  });

  if($(".mostrarBtnSubmit").length){
    $("#cont_btn_generarpropuesta").hide();
    $("#cont_btns_propuesta").hide();
  }

  //Mostrar boton submit (btn Aceptar)
  $('.mostrarBtnSubmit').on('click', function(e) {
    e.preventDefault();

    switch($(this).attr("id")){
      case "tab_list_1": 
      case "tab_list_2": $("#cont_btn_salvar").show(); $("#cont_btn_generarpropuesta").hide(); $("#cont_btns_propuesta").hide(); break;
      case "tab_list_3": $("#cont_btn_salvar").show(); $("#cont_btn_generarpropuesta").show(); $("#cont_btns_propuesta").hide(); break;
      case "tab_list_4": 
      console.log("tab 4");
       // $("#pop_app_tecnologias").trigger("click");  
      break;
    }

    console.log($(this).attr("id"));

    //Jair 11/Ago/2020 Saber cuando se cambia de tab para mostrar/ocultar boton de guardar datos basicos
    if($(this).attr("id") == 'tab_list_1'){
      $("#btnActualiazarDatosBasicos").show();
    }else{
      $("#btnActualiazarDatosBasicos").hide();
    }

    $("#btn_salvar_proceso").show();
  });  
  //ocultar boton submit (btn Aceptar)
  $('.ocultarBtnSubmit').on('click', function(e) {
    e.preventDefault();

    console.log("ocultarBtnSubmit");
    switch($(this).attr("id")){
      case "tab_list_4": 
      console.log("tab 4");
        //$("#pop_app_tecnologias").trigger("click");  
      break;
    }

    console.log($(this).attr("id"));

    //$("#btn_salvar_proceso").show();
  });  

  //ocultar boton submit (btn Aceptar)
  $('.ocultarBtnSubmit').on('click', function(e) {
    e.preventDefault();
    // console.log($(this).attr("id"));
    $("#cont_btn_salvar").hide();
    $("#cont_btns_propuesta").show();
  });


  // Salvar el prospecto
  $("#btn_salvar_proceso").click(function(){
    salvarProceso();
    /*//Verifica para mandar alerta    
    checkEstatusAprobado(function(data){
      // console.log(data);
      if(data.result==false){
        alertify.confirm("Si desea continuar se realizar&aacute; una nueva versi&oacute;n del proceso, &iquest;Esta seguro?", function(){
          salvarProceso();
        },function(){
        }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
      }else{
        salvarProceso();
      }
    });    */
  });

  $("#btn_salvar_contacto_temp").click(function(){
    //console.log("voy a guardar");
    salvarContactoTemprano();
  });

  // Salvar el expediente del cliente
  $("#btn_salvar_expcliente").click(function(){
    salvarExpCliente();
  });

    
  //Para la descripcion del tap 2
  if($("#dp_descripcion").length){
     var params = {selector:"#dp_descripcion", height:"350", btnImg:true};
     opcionesTinymce(params);
  }


  // Validar la subida del archivo
  $("#btn_subirdocumento").click(function(){
    //Verifica para mandar alerta    
    checkEstatusAprobado(function(data){
      // console.log(data);
      if(data.result==false){
        alertify.confirm("Si desea continuar se realizar&aacute; una nueva versi&oacute;n del proceso, &iquest;Esta seguro?", function(){
          subirDocumento();
        },function(){
        }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
      }else{
        subirDocumento();
      }
    });
  });
  //>>>> Fin subir documentos


  //>>>> Subir diagrama 
  //Activar modal para subir documento
  $("#btn_agregar_diagrama").click(function(){
    $('#formSubirDiagrama')[0].reset();
    $('#modalSubirDiagrama').modal('show');
  });

   // Validar la subida del archivo
  $("#btn_subirdiagrama").click(function(){
    //Verifica para mandar alerta    
    checkEstatusAprobado(function(data){
      // console.log(data);
      if(data.result==false){
        alertify.confirm("Si desea continuar se realizar&aacute; una nueva versi&oacute;n del proceso, &iquest;Esta seguro?", function(){
          subirDiagrama();
        },function(){
        }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
      }else{
        subirDiagrama();
      }
    });  
  });
  //>>>> Fin subir diagrama
  
  
$(".partos").hide();
$("#dp_hijos").change(function(){
  var hijos = $("#dp_hijos").val();
  //console.log(hijos);
  if(hijos > 0) {
    $(".partos").show();
    $("#slt_tipo_parto").addClass("required");
  }else{
    $(".partos").hide();
    $("#slt_tipo_parto").removeClass("required");
    $("#slt_tipo_parto").val("");
  }

});



$("#dp_enfermedades").change(function(){
  //console.log($(this).val());
  $("#dp_ids_enfermedades").val($(this).val());
  // var ids = $(this).val();
  // //var arrIds = ids.split(",");
  // //console.log(ids.indexOf("7"));
  // var renalIndex = ids.indexOf("7");
  // var hepatIndex = ids.indexOf("8");

  // if(renalIndex != -1 || hepatIndex != -1){
  //   //console.log("if");
  //   alertify.error("No apto para tratamiento ");
  // }else{
  //   //console.log("else");
  // }

  var noapto = false;
  var singarantia = false;
  var msjNoApto = '';
  var msjSingar = '';
  var msj = '';

  //Revisar todos los elementos seleccionados
  $('#dp_enfermedades').children('option:selected').each( function() {
      var $this = $(this);
      var opcid = $this.attr('data-opcid');
      var opcinfo = $this.attr('data-opcinfo');

      //console.log("alertas: "+opcid+" "+opcinfo);
      //Guardar si alguno no tiene garantia
      if(opcid == 1){
        singarantia = true;
        msjSingar = opcinfo;
      }
      //Guardar si alguno no es apto
      if(opcid == 2){
        noapto = true;
        msjNoApto = opcinfo;
      }

      //Guardar si tiene algun mensaje
      if(opcinfo != '' && opcid == 0){
        msj += ' '+opcinfo;
      }
  });

  //Mostrar mensajes que correspondan y otras condiciones que aplica en cada opcion
  if(singarantia){
    alertify.warning(msjSingar);
    singarantiaEnf = true;
    $("#pro_final_cont").trigger("change");
  }else{
    singarantiaEnf = false;
    $("#pro_final_cont").trigger("change");
  }
  if(noapto){
    alertify.error(msjNoApto);
    $("#btn_salvar_proceso").attr("disabled", true);
  }else{
    $("#btn_salvar_proceso").attr("disabled", false);
  }

  if(msj != ''){
    alertify.notify(msj);

  }
});
$("#dp_alergias").change(function(){
  //console.log($(this).val());
  $("#dp_ids_alergias").val($(this).val());

  var ids = $(this).val();
  //var arrIds = ids.split(",");
  //console.log(ids.indexOf("7"));
  var noapto = false;
  var singarantia = false;
  var msjNoApto = '';
  var msjSingar = '';
  var msj = '';

  //Revisar todos los elementos seleccionados
  $('#dp_alergias').children('option:selected').each( function() {
      var $this = $(this);
      var opcid = $this.attr('data-opcid');
      var opcinfo = $this.attr('data-opcinfo');

      //console.log("alertas: "+opcid+" "+opcinfo);
      //Guardar si alguno no tiene garantia
      if(opcid == 1){
        singarantia = true;
        msjSingar = opcinfo;
      }
      //Guardar si alguno no es apto
      if(opcid == 2){
        noapto = true;
        msjNoApto = opcinfo;
      }

      //Guardar si tiene algun mensaje
      if(opcinfo != '' && opcid == 0){
        msj += ' '+opcinfo;
      }

      // 2/7/2020 Jair Abrir popup alergias
      if($(this).val() == 3){
        $("#rowSubOpciones").show();
        // $("#btnVerAlergiasProspecto").click();
      }else{
        $("#rowSubOpciones").hide();
      }
  });

  //Mostrar mensajes que correspondan y otras condiciones que aplica en cada opcion
  if(singarantia){
    alertify.warning(msjSingar);
    singarantiaAle = true;
    $("#pro_final_cont").trigger("change");
  }else{
    singarantiaAle = false;
    $("#pro_final_cont").trigger("change");
  }
  if(noapto){
    alertify.error(msjNoApto);
    $("#btn_salvar_proceso").attr("disabled", true);
  }else{
    $("#btn_salvar_proceso").attr("disabled", false);
  }

  if(msj != ''){
    alertify.notify(msj);

  }
});
$("#dp_medicamentos").change(function(){
  //console.log($(this).val());
  $("#dp_ids_medicamentos").val($(this).val());
  
  // Pasar al tratamiento de foto sensibles
  /* if($(this).val() != ""){
    $("#rowAlertFotosensibilidad").show();
  }else{
    $("#rowAlertFotosensibilidad").hide();
  } */

  // JAIR 18/6/2020 logica alertas
  var noapto = false;
  var singarantia = false;
  var msjNoApto = '';
  var msjSingar = '';
  var msj = '';

  //Revisar todos los elementos seleccionados
  $('#dp_medicamentos').children('option:selected').each( function() {
      var $this = $(this);
      var opcid = $this.attr('data-opcid');
      var opcinfo = $this.attr('data-opcinfo');

      //console.log("alertas: "+opcid+" "+opcinfo);
      //Guardar si alguno no tiene garantia
      if(opcid == 1){
        singarantia = true;
        msjSingar = opcinfo;
      }
      //Guardar si alguno no es apto
      if(opcid == 2){
        noapto = true;
        msjNoApto = opcinfo;
      }

      //Guardar si tiene algun mensaje
      if(opcinfo != '' && opcid == 0){
        msj += ' '+opcinfo;
      }
  });

  //Mostrar mensajes que correspondan y otras condiciones que aplica en cada opcion
  if(singarantia){
    alertify.warning(msjSingar);
    singarantiaMed = true;
    $("#pro_final_cont").trigger("change");
  }else{
    singarantiaMed = false;
    $("#pro_final_cont").trigger("change");
  }
  if(noapto){
    alertify.error(msjNoApto);
    $("#btn_salvar_proceso").attr("disabled", true);
  }else{
    $("#btn_salvar_proceso").attr("disabled", false);
  }

  if(msj != ''){
    alertify.notify(msj);

  }


});
$("#dp_cirugias").change(function(){
  //console.log($(this).val());
  $("#dp_ids_cirugias").val($(this).val());
});
$("#dp_metodos_1").change(function(){
  //console.log($(this).val());
  $("#dp_ids_metodos_1").val($(this).val());
});

$("#dp_subopciones").change(function(){
  //console.log($(this).val());
  $("#dp_ids_opciones").val($(this).val());
});

//Agregar más tipos de parto
count = 1;
$("#add_tippart").click(function(){
  count = count+1;
  html = "";
  htmlOption = '';
  var params = {
    funct: 'obtTiposParto'
  };
  ajaxData(params, function(data){
    //console.log(data.success);
    if(data.success){
      total = data.tiposParto.length;
      htmlOption += '<option>--Selecciona--</option>';
      $.each(data.tiposParto, function (ind, elem) { 
        htmlOption += '<option value="'+data.tiposParto[ind].idTipoParto+'">'+data.tiposParto[ind].nombre+'</option>';
      }); 
      $("#slt_tipo_parto_"+count).append(htmlOption);
    }
  });

  //console.log("Voy agregra más tipos de parto");
  html += '<div class="row">';
    html += '<div class="col-md-12">';
      html += '<div class="col-md-4 text-right"><label>T. Parto:</label></div>';
      html += '<div class="col-md-5">';
      html += '<select name="slt_tipo_parto_'+count+'" id="slt_tipo_parto_'+count+'" class="form-control">'
      html += '</select>';
      html += '</div>';
    html += '</div>';
  html += '</div>';

  $(".partos").append(html);
  $("#total_hijos").val(count);
});

cout = 1;
$("#add_otrostran").click(function(){
  cout = cout+1;
  html = "";
  htmlOption = '';
  var params = {
    funct: 'obtAllMetodos'
  };
  ajaxData(params, function(data){
    //console.log(data.success);
    if(data.success){
      //console.log(data);
      total = data.metodos.length;
      htmlOption += '<option value="" disabled selected>--Selecciona--</option>';
      $.each(data.metodos, function (ind, elem) { 
        htmlOption += '<option value="'+data.metodos[ind].idMetodo+'">'+data.metodos[ind].nombre+'</option>';
      }); 
      //console.log(htmlOption);
      $("#dp_metodos_"+cout).append(htmlOption);
      $(".selector").formSelect();
    }
  });
  html += '<div id="divRow_'+cout+'">';
  html += '<div class="row">';
    html += '<div class="col-md-4 text-right"></div>';
    html += '<div class="col-md-8"> <input type="button" id="quitar_otrostran" class="btn btn-primary" value="-" onclick="quitarOtrosTran('+cout+')"></div>';
  html += '</div>';
  html += '<div class="row">';
    html += '<div class="col-md-4 text-right"><label>Lugar:</label></div>';
    html += '<div class="col-md-8"><input type="text" name="dp_lugar_'+cout+'" id="dp_lugar_'+cout+'" value="" class="form-control "></div>';
  html += '</div>';
  html += '<div class="row">';
    html += '<div class="col-md-12">';
      html += '<div class="col-md-4 text-right"><label>M&eacute;todos:</label></div>';
      html += '<div class="col-md-6 form-group">';
        html += '<select name="dp_metodos_'+cout+'" id="dp_metodos_'+cout+'" multiple class="selector dp_metodos">'
        //html += '<option value="" disabled selected>--Seleccionar--</option>'
        html += '</select> <input type="hidden" name="dp_ids_metodos_'+cout+'" id="dp_ids_metodos_'+cout+'" value="">';
      //2/7/2020 Jair Boton para agregar nuevos metodos al catalogo
      html += '</div>';
      html += '<div class="col-md-1">';
        html += '<a class="tbEdit btnRegPet" href="#fancyAddMetodo" onclick="registroCatalogo(\'metodos\',0, 1)"><img src="../images/icon_agregar.png"></a>';
      html += '</div>';
    html += '</div>';
  html += '</div>';
  html += '<div class="row">';
    html += '<div class="col-md-12">';
      html += '<div class="row">';
        html += '<div class="col-md-4 text-right"><label>Tiempo invertido:</label></div>';
        html += '<div class="col-md-5"><input type="text" name="dp_tinvertido_'+cout+'" id="dp_tinvertido_'+cout+'" value="" class="form-control "></div>';
      html += '</div>';
    html += '</div>';
    html += '<div class="col-md-6">';
      html += '<div class="row">';
        html += '<div class="col-md-12 right">';
          html += '<select id="dp_dias_'+cout+'" name="dp_dias_'+cout+'" class=" form-control" style="width: 100%"><option value="1">D&iacute;as</option><option value="2">Semanas</option><option value="3">Meses</option></select>';
        html += '</div>';
      html += '</div>';
    html += '</div>';
  html += '</div>';
  html += '<div class="row element-fin">';
    html += '<div class="col-md-4 text-right"><label>Resultados:</label></div>';
    html += '<div class="col-md-5"><input type="text" name="dp_resultado_'+cout+'" id="dp_resultado_'+cout+'" value="" class="form-control "></div>';
  html += '</div>';
  html += '</div>';


  $(".cont_tratamiento").append(html);
  //console.log("entre agregar más tratamientos");
  $("#dp_tratamiento_total").val(cout);

  // 2/7/2020 Jair Evento para el boton agregar
  if($(".btnRegPet").length){
    $(".btnRegPet").fancybox({
      autoDimensions: false,
      padding : 30,
      width : 900,
      height : 900,
      autoScale : true,
      closeBtn : true,
      closeClick  : false,
      helpers : {
       overlay : {closeClick: false}
     },
     beforeLoad: function() {
      // $("#divTablaBuscar").html("");
     }
   });
  }

  

});


/*Script para mostrar y ocultar las divisiones de diagnostico */
  $("fieldset").hide();
  $("fieldset.1").show();

  $("div#1 a").addClass("active");
  $(".idPartesCuerpo").click(function(){
    
    var parte = $(this).attr("id");
    // console.log("si lo intenta " + parte);
    $("div#"+parte+" a").toggleClass("active");
    $('fieldset.'+parte).slideToggle();
  });
/* Termina script para mostrar y ocultar las divisiones de diagnostico */

/*Pregunta si ha tenido otros tratamientos*/
  $("#chek_otros_tratamientos").click(function(){
    check = $('#chek_otros_tratamientos').is(':checked');
    if(check == true){
      $(".cont_otros_tratamientos").show();
    }else if(check == false){
      $(".cont_otros_tratamientos").hide();
    }
    //console.log(check);
  });
/*Termina pregunta si ha tenido otros tratamientos*/


/*Inicia script para cachar el id del grado de flacidez y/o celulitis*/
  var flacidez = 1;
  var celulitis = 2;
  $("#brazo_cel_grado").change(function(){
    mostrarInfoGrad(celulitis,$(this).val(), 'brazos');
  });
  $("#brazo_fla_grado").change(function(){
    mostrarInfoGrad(flacidez,$(this).val(), 'brazos');
  });
  $("#abdomen_fla_grado").change(function(){
    mostrarInfoGrad(flacidez,$(this).val(), 'abdomen');
  });
  $("#abdomen_cel_grado").change(function(){
    mostrarInfoGrad(celulitis,$(this).val(), 'abdomen');
  });
  $("#espalda_fla_grado").change(function(){
    mostrarInfoGrad(flacidez,$(this).val(), 'espalda');
  });
  $("#espalda_cel_grado").change(function(){
    mostrarInfoGrad(celulitis,$(this).val(), 'espalda');
  });
  $("#piernas_fla_grado").change(function(){
    mostrarInfoGrad(flacidez,$(this).val(), 'piernas');
  });
  $("#piernas_cel_grado").change(function(){
    mostrarInfoGrad(celulitis,$(this).val(), 'piernas');
  });
  $("#gluteos_fla_grado").change(function(){
    mostrarInfoGrad(flacidez,$(this).val(), 'gluteos');
  });
  $("#gluteos_cel_grado").change(function(){
    mostrarInfoGrad(celulitis,$(this).val(), 'gluteos');
  });
/*Termina script para cachar el id del grado de flacidez y/o celulitis*/







/* 
    *************************************************
-------- Inicia código para el registro de sesiones en cada expediente ---------
    **************************************************
*/

// para abrir galeria de imagenes cargadas en las sesiones
  $(".fancybox").fancybox({
    openEffect  : 'none',
    closeEffect : 'none'
  });

//$("#subirImagenes").hide();
//$("#divImagenes").hide();
//$("#encuestaExterna").hide();
/*$("#nuevaSesion").click(function(){
  $("#formularioSesion").toggleClass('ocultar');
  $("#btn_salvar_expcliente").toggleClass('ocultar');
  $("#gridSesiones").toggleClass('ocultar');

  $("#regresar").hide();
  $("#regresarSesion").show();
  $("#btnRest").hide();

  noSesionNew = $("#ds_sesion").val();
  noSesionEdit = "";
  imagenes = "";
  mostrarCtrlsExt(noSesionNew, noSesionEdit, imagenes);
});*/


ctrSaveImg = localStorage.getItem("ctrSaveImg");
console.log("ctrSaveImg: " + ctrSaveImg);
    console.log("Entre a guardar y crear una nueva sesion");
  //Script para guardar via ajax la información de sesiones//
    var ul = $('#formExpcliente ul.imgLis');

    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

  if(ctrSaveImg == 0 && $("#idExpSesion").val() == 0){
    // Initialize the jQuery File Upload plugin
      $('#formExpcliente').fileupload({
          url: '../ajaxcall/ajaxFunctions.php?funct=guardarSesiones',
          // This element will accept file drag/drop uploading
          dropZone: $('#drop'),

          // This function is called when a file is added to the queue;
          // either via the browse button, or via drag/drop:
          add: function (e, data) {
          console.log(e);
          console.log(data);

              var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
                  ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

              // Append the file name and file size
              tpl.find('p').text(data.files[0].name).append('<i>' + formatFileSize(data.files[0].size) + '</i>');
              // Add the HTML to the UL element
              data.context = tpl.appendTo(ul);
              // Initialize the knob plugin
              tpl.find('input').knob();
              // Listen for clicks on the cancel icon
              tpl.find('span').click(function(){
                  if(tpl.hasClass('working')){
                      jqXHR.abort();
                  }
                  tpl.fadeOut(function(){
                      tpl.remove();
                  });
              });

              // Automatically upload the file once it is added to the queue
              var jqXHR = data.submit();
          },

          progress: function(e, data){
              // Calculate the completion percentage of the upload
              var progress = parseInt(data.loaded / data.total * 100, 10);

              // Update the hidden input field and trigger a change
              // so that the jQuery knob plugin knows to update the dial
              data.context.find('input').val(progress).change();
              if(progress == 100){
                  data.context.removeClass('working');
                  ctrSaveImg = parseInt(ctrSaveImg)+1;
                  localStorage.setItem("ctrSaveImg", ctrSaveImg);
              }
          },

          fail:function(e, data){
              // Something has gone wrong!
              data.context.addClass('error');
          }
      });

  }else if(ctrSaveImg == 0 && $("#idExpSesion").val() > 0){
    console.log("Entre a editar la sesión 1");
    //Script para guardar via ajax la información de sesiones//
    var ul = $('#formExpcliente ul.imgLis');

    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
      $('#formExpcliente').fileupload({
          url: '../ajaxcall/ajaxFunctions.php?funct=guardarSesiones',
          // This element will accept file drag/drop uploading
          dropZone: $('#drop'),

          // This function is called when a file is added to the queue;
          // either via the browse button, or via drag/drop:
          add: function (e, data) {
          /*console.log(e);
          console.log(data);*/

              var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
                  ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

              // Append the file name and file size
              tpl.find('p').text(data.files[0].name)
                           .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

              // Add the HTML to the UL element
              data.context = tpl.appendTo(ul);

              // Initialize the knob plugin
              tpl.find('input').knob();

              // Listen for clicks on the cancel icon
              tpl.find('span').click(function(){

                  if(tpl.hasClass('working')){
                      jqXHR.abort();
                  }

                  tpl.fadeOut(function(){
                      tpl.remove();
                  });

              });

              // Automatically upload the file once it is added to the queue
              var jqXHR = data.submit();
          },

          progress: function(e, data){

              // Calculate the completion percentage of the upload
              var progress = parseInt(data.loaded / data.total * 100, 10);

              // Update the hidden input field and trigger a change
              // so that the jQuery knob plugin knows to update the dial
              data.context.find('input').val(progress).change();

              if(progress == 100){
                  data.context.removeClass('working');
              }
          },

          fail:function(e, data){
              // Something has gone wrong!
              data.context.addClass('error');
          }

      });
  }else if(ctrSaveImg > 0 && $("#idExpSesion").val() > 0){
    console.log("Entre a editar la sesión 2");
    //Script para guardar via ajax la información de sesiones//
    var ul = $('#formExpcliente ul.imgLis');

    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
      $('#formExpcliente').fileupload({
          url: '../ajaxcall/ajaxFunctions.php?funct=guardarSesiones',
          // This element will accept file drag/drop uploading
          dropZone: $('#drop'),

          // This function is called when a file is added to the queue;
          // either via the browse button, or via drag/drop:
          add: function (e, data) {
          /*console.log(e);
          console.log(data);*/

              var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
                  ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

              // Append the file name and file size
              tpl.find('p').text(data.files[0].name)
                           .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

              // Add the HTML to the UL element
              data.context = tpl.appendTo(ul);

              // Initialize the knob plugin
              tpl.find('input').knob();

              // Listen for clicks on the cancel icon
              tpl.find('span').click(function(){

                  if(tpl.hasClass('working')){
                      jqXHR.abort();
                  }

                  tpl.fadeOut(function(){
                      tpl.remove();
                  });

              });

              // Automatically upload the file once it is added to the queue
              var jqXHR = data.submit();
          },

          progress: function(e, data){

              // Calculate the completion percentage of the upload
              var progress = parseInt(data.loaded / data.total * 100, 10);

              // Update the hidden input field and trigger a change
              // so that the jQuery knob plugin knows to update the dial
              data.context.find('input').val(progress).change();

              if(progress == 100){
                  data.context.removeClass('working');
              }
          },

          fail:function(e, data){
              // Something has gone wrong!
              data.context.addClass('error');
          }

      });
  }

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }


  $("#formExpcliente").change(function(){

    //Ponemos una variable Global First
console.log(crtSalvar);    
    
    if (crtSalvar == 0 && $("#idExpSesion").val() == 0){
      //return true;
      calcularAvance();
      var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarSesiones';
      var formElement = document.getElementById("formExpcliente");
      var data = new FormData(formElement);
      ajaxDataImg(urlDel, data, function(data){
        console.log(data);
        if(data.firma != "" && data.firma != "{\"lines\":[]}"){
          $("#btnRest").show();
        }

        if(data.success){
        $("#idExpSesion").val(data.idSesion);//Aactualizamos la sesión 
          $('.mensaje_ok').toggle(1500, function() {
            $('.mensaje_ok').hide();
          });
        }else{
          setInterval($(".mensaje_error").show("slow"), 1500);
        }
      });
      crtSalvar = crtSalvar+1;
    }else if(crtSalvar == 0 && $("#idExpSesion").val() > 0){
      calcularAvance();
      var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarSesiones';
      var formElement = document.getElementById("formExpcliente");
      var data = new FormData(formElement);
      ajaxDataImg(urlDel, data, function(data){
        console.log(data);
        if(data.firma != "" && data.firma != "{\"lines\":[]}"){
          $("#btnRest").show();
        }

        if(data.success){
          $("#idExpSesion").val(data.idSesion);
          $('.mensaje_ok').toggle(1500, function() {
            $('.mensaje_ok').hide();
          });
        }else{
          setInterval($(".mensaje_error").show("slow"), 1500);
        }
      });
    }else if(crtSalvar > 0 && $("#idExpSesion").val() > 0){
      calcularAvance();
      var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarSesiones';
      var formElement = document.getElementById("formExpcliente");
      var data = new FormData(formElement);
      ajaxDataImg(urlDel, data, function(data){
        console.log(data);
        if(data.firma != "" && data.firma != "{\"lines\":[]}"){
          $("#btnRest").show();
        }

        if(data.success){
          $("#idExpSesion").val(data.idSesion);
          $('.mensaje_ok').toggle(1500, function() {
            $('.mensaje_ok').hide();
          });
        }else{
          setInterval($(".mensaje_error").show("slow"), 1500);
        }
      });
    }
  })

  // Prevent the default action when a file is dropped on the window
  $(document).on('drop dragover', function (e) {
      e.preventDefault();
  });

  // Helper function that formats the file sizes
  function formatFileSize(bytes) {
      if (typeof bytes !== 'number') {
          return '';
      }

      if (bytes >= 1000000000) {
          return (bytes / 1000000000).toFixed(2) + ' GB';
      }

      if (bytes >= 1000000) {
          return (bytes / 1000000).toFixed(2) + ' MB';
      }

      return (bytes / 1000).toFixed(2) + ' KB';
  }

// Salvar Encuesta del cliente
  $("#btn_salvar_encuesta").click(function(){
    salvarEncuestaExpCliente();
  });


  sexoP = $('input[name=dp_sexo]:checked').val();
  imc = $('#dp_imc').val();
  $("input[name=dp_sexo]").change(function(){
    sexoP = $(this).val();
    //console.log($(this).val());
    mostrarImgIMC(sexoP, imc);
  });

  $("#dp_imc").change(function(){
    imc = $(this).val();
    if(imc >= 17.5){
      mostrarImgIMC(sexoP, imc);
    }else{
      //alert("Debe de indicar un Indice de Masa Corporal más alto");
      alertify.error("Debe de indicar un Indice de Masa Corporal m&aacute;s alto");
    }

  });

  mostrarImgIMC(sexoP, imc);

  $("#dp_metalcuerpo").click(function(){
    metal = $('input[name=dp_metalcuerpo]:checked').val();
    /*console.log(metal);*/
    if(metal == 0){
      $('#modalTipoMetal').modal('open');
    }
  })

  $("#dp_tipometal").on("change", function(){
    // JAIR 18/6/2020
    var tipoMetal = $(this).val();
    if(tipoMetal == 5 || tipoMetal == 1){
      //console.log($(this).val());
      alertify.error("Por el tipo de metal no es posible continuar con el tratamiento.");
      $("#btn_salvar_genera_contrato").hide();
    }
  })

  $("#pop_app_movil").click(function(){
    //console.log("Entre al app movil");
    $('#modalAppMovil').modal('open');
  });

  $("#pop_app_tecnologias").click(function(){
    //console.log("Entre al app movil");
    $('#modalTecnologias').modal('open');
  });
  

  //$("#canvasFirma").show();
  //$("#redrawSignature").hide();


  //Resetear firma
  $("#resetFirma").click(function(){
    if($("#ds_firma").val() != "{\"lines\":[]}"){
      $('#canvasFirma').signature('clear'); 
    }

    $("#canvasFirma").show();
    $("#redrawSignature").hide();
  });

}); //Cierre de $(document).ready

//Función para mostrar la imagen correspondiente para la sección de Diagnostico
function mostrarImgIMC(sexo, imc){
  indImc = "";
  indSexo = "";
  if(imc >= 17.5 && imc <= 18.4){
    indImc = "175";
  }else if(imc >= 18.5 && imc <= 21.9){
    indImc = "185";    
  }else if(imc >= 20.0 && imc <= 24.8){
    indImc = "220";
  }else if(imc >= 24.9 && imc <= 29.9){
    indImc = "249";
  }else if(imc >= 30 && imc <= 39.9){
    indImc = "300";
  }else if(imc >= 40){
    indImc = "400";
  }

  if(sexo == 0){
    indSexo = "M";
  }else if(sexo == 1){
    indSexo = "H";
  }

  if(indImc != "" && indSexo != ""){
    img = "../images/imc/"+indImc + indSexo + ".jpg";
    $("#imgMasaCorporal").attr("src", img);
    //console.log(indImc + indSexo);
  }
}

if($(".btnRegPet").length){
    $(".btnRegPet").fancybox({
      autoDimensions: false,
      padding : 30,
      width : 900,
      height : 900,
      autoScale : true,
      closeBtn : true,
      closeClick  : false,
      helpers : {
       overlay : {closeClick: false}
     },
     beforeLoad: function() {
      // $("#divTablaBuscar").html("");
     }
   });
  }

function cambiarEstatus(idProspecto){
  console.log(idProspecto);
  alertify.confirm("<strong>&iquest;Desea pasar este registro a prospecto?</strong>", function(){
    console.log(idProspecto);
    //console.log(usuarioId);
    //if (idExterno) {
      //console.log(idExterno);
    //}
    var params = {
      funct: 'cambiarEstatusaProspecto',
        idProspecto:idProspecto
    };
    ajaxData(params, function(data){
      console.log(data);
      if (data.success) {
        alertify.success("Se ha cambiado correctamente el registro ahora es un <b>Prospecto</b>");
        //window.location.href = 'servicios.php';
        setTimeout(function(){
          location.reload();
        },500);
      }else {
        alertify.error("Ocurrio un error al realizar la actualización del registro, intente mas tarde");
      }
    });
  },function(){
  }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});

}

function muestraAccion(id){
  $("#tituloRegFancyAcciones").html("Agregar Acci&oacute;n");
  console.log(id);
  //Si es nuevo comentario inicializar todo
  if(id == 0){
    //reseteaFormulario('formAcciones');
    $("#idProspectoAccion").val(0);
    $("#btnGuardarAccion").show();
  }
  else{

      var params = {
        funct: 'muestraAccion',
        //Obtener el id de la cotizacion actual o si no el id de la orden
        idAP: id
      };
      ajaxData(params, function(data){
        //console.log(data);
        console.log(data.datos);
        //console.log(data.datos['idAccionPros']);
        accionId = data.datos['accionId'];
          $("#idAccionPros").val(id);
          $("#idUsuarioAccion").val( data.datos['usuarioId'] );//id usuario sesion
          $("#fechaAccion").val( data.datos['fechaCreacion'] );
          $("#slt_accion option[value="+ accionId +"]").attr("selected",true);
          //$("#slt_accion").val(data.datos['accionId']);
          $("#accionComentario").val(data.datos['comentario']);

      });
    }
}

function guardarAccion(idP){
  //console.log("Prospecto: " + idP);
  if(idP == 0){
    //Entrar a guardar el prospecto general via ajax
    //console.log("Entre a guardar el prospecto inicial");
    var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarContactoInicial';
    var formElement = document.getElementById("formProspectoTemp");
    var data = new FormData(formElement);
    ajaxDataImg(urlDel, data, function(data){
      console.log(data);
      if(data.success){
        $("#idProspecto").val(data.idProspecto);

        guardarAccion(data.idProspecto);

      }
    });    
  }else{
    //console.log("Entrar a guardar solo acciones");
    $.validator.setDefaults({
      debug: true,
      success: "valid"
    });


    if($("#formAcciones").valid()){
      var htmlOriginal = showLoading('btnGuardarAccion');
      var params = {
        funct: 'guardarAccion',
        //tipo: $("#tipo_comentario").val(),
        //Si no es cotizacion se obtiene el id de la orden de compra
        idAccionPros: ($("#idAccionPros").val() == "") ? 0 : $("#idAccionPros").val(),
        idAccion: $("#slt_accion").val(),
        idProspecto: idP,
        idUsuario: $("#idUsuarioAccion").val(),
        comentario: $("#accionComentario").val(),
        fecha: $("#fechaAccion").val()
      };

      ajaxData(params, function(data){
        //console.log(data);
        hideLoading('btnGuardarAccion',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //Si se agrego el registro
          console.log(data.add);
          if(data.add > 0){
              alertify.success('Acci&oacute;n agregada y guardada correctamente');
              var htmlTr = data.htmlTR;
              tablaAccionesProspecto.row.add( $(htmlTr)[0] ).draw(false);
              //tablaAccionesProspecto.row( $(htmlTr)[0] ).draw(false);
              setTimeout(function(){
                  // $('[data-toggle="tooltip"]').tooltip({html:true});
                  $('.dropdown-toggle').dropdown();
                  inicializaFancyGral();
              }, 3000);

          }

          var cell;  
          var cell2;  
          if(data.res > 0){
            alertify.success('Acci&oacute; editada y guardado correctamente');

            cell = tablaAccionesProspecto.cell('#tablaAccionesProspecto_td_1_'+$("#idAccionPros").val());
            cell2 = tablaAccionesProspecto.cell('#tablaAccionesProspecto_td_2_'+$("#idAccionPros").val());
            cell.data( $("#slt_accion").val()).draw(false);
            cell2.data( $("#accionComentario").val()).draw(false);

            if(data.res == 0 && data.add == 0){
              alertify.success('No hay cambios que guardar');
            }
          }
          
          
          setTimeout(function(){
              // $('[data-toggle="tooltip"]').tooltip({html:true});
              $('.datable_bootstrap').dropdown();
              inicializaFancyGral();
          }, 3000);
        }
      });
    }

  }
  
}



function mostrarInfoGrad(cat, idGrado, parte){
  //console.log(idGrado);
  if(cat == 1){
    var params = {
      funct: 'consultarInfoGradoFlacidez',
      idGrado: idGrado
      //parteCuerpo: idGrado
    };
    ajaxData(params, function(data){
      //console.log(data);
      console.log(data.datos['descripcion']);
      desc = data.datos['descripcion'];
      if(parte == 'brazos'){
        $("#grados_flacidez_brazos").attr('title', desc);
        $("#grados_flacidez_brazos").attr('alt', desc);
      }else if(parte == 'abdomen'){
        $("#grados_flacidez_abdomen").attr('title', desc);
        $("#grados_flacidez_abdomen").attr('alt', desc);
      }else if(parte == 'espalda'){
        $("#grados_flacidez_espalda").attr('title', desc);
        $("#grados_flacidez_espalda").attr('alt', desc);
      }else if(parte == 'piernas'){
        $("#grados_flacidez_piernas").attr('title', desc);
        $("#grados_flacidez_piernas").attr('alt', desc);
      }else if(parte == 'gluteos'){
        $("#grados_flacidez_gluteos").attr('title', desc);
        $("#grados_flacidez_gluteos").attr('alt', desc);
      }
      
    });
  }else if(cat == 2){
    var params = {
      funct: 'consultarInfoGradoCelulitis',
      idGrado: idGrado
      //parteCuerpo: idGrado
    };
    ajaxData(params, function(data){
      //console.log(data);
      console.log(data.datos['descripcion']);
      desc = data.datos['descripcion'];
      if(parte == 'brazos'){
        $("#grados_celulitis_brazos").attr('title', desc);
        $("#grados_celulitis_brazos").attr('alt', desc);
      }else if(parte == 'abdomen'){
        $("#grados_celulitis_abdomen").attr('title', desc);
        $("#grados_celulitis_abdomen").attr('alt', desc);
      }else if(parte == 'espalda'){
        $("#grados_celulitis_espalda").attr('title', desc);
        $("#grados_celulitis_espalda").attr('alt', desc);
      }else if(parte == 'piernas'){
        $("#grados_celulitis_piernas").attr('title', desc);
        $("#grados_celulitis_piernas").attr('alt', desc);
      }else if(parte == 'gluteos'){
        $("#grados_celulitis_gluteos").attr('title', desc);
        $("#grados_celulitis_gluteos").attr('alt', desc);
      }
    });
  }
}


function muestrarInfo(parteC, grado, tipo){
  //console.log(parteC+" "+grado+" "+tipo)
  info="";
  switch (parteC){
    case 'brazos':
      if(tipo == 1){
        $("#tituloRegFancyInfo").html("Flacidez");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/flacidez-'+grado+'.png" heigh="200px">':'';
          //console.log(imagen);
          info = $("#grados_flacidez_brazos").attr('alt')+imagen;
        }
      }else if(tipo == 2){
        $("#tituloRegFancyInfo").html("Celulitis");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/celulits-'+grado+'.png" heigh="200px">':'';
          //console.log(imagen);
          info = $("#grados_celulitis_brazos").attr('alt')+imagen;
        }
      }
    break;
    case 'abdomen':
      if(tipo == 1){
        $("#tituloRegFancyInfo").html("Flacidez ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/flacidez-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_flacidez_abdomen").attr('alt')+imagen;
        }
      }else if(tipo == 2){
        $("#tituloRegFancyInfo").html("Celulitis");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/celulits-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_celulitis_abdomen").attr('alt')+imagen;
        }
      }
    break;
    case 'espalda':
      if(tipo == 1){
        $("#tituloRegFancyInfo").html("Flacidez ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/flacidez-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_flacidez_espalda").attr('alt')+imagen;
        }
      }else if(tipo == 2){
        $("#tituloRegFancyInfo").html("Celulitis ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/celulits-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_celulitis_espalda").attr('alt')+imagen;
        }
      }
    break;
    case 'piernas':
      if(tipo == 1){
        $("#tituloRegFancyInfo").html("Flacidez ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/flacidez-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_flacidez_piernas").attr('alt')+imagen;
        }
      }else if(tipo == 2){
        $("#tituloRegFancyInfo").html("Celulitis ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/celulits-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_celulitis_piernas").attr('alt')+imagen;
        }
      }
    break;
    case 'gluteos':
      if(tipo == 1){
        $("#tituloRegFancyInfo").html("Flacidez ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/flacidez-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_flacidez_gluteos").attr('alt')+imagen;
        }
      }else if(tipo == 2){
        $("#tituloRegFancyInfo").html("Celulitis ");
        if(typeof grado !== "undefined"){
          var imagen = (typeof grado !== "undefined")?'<br><img src="../images/imc/celulits-'+grado+'.png" heigh="200px">':'';
          info = $("#grados_celulitis_gluteos").attr('alt')+imagen;
        }
      }
    break;

  }

  $('#info').html(info);
}

/*function editarExpSesion(idExpSesion){
  console.log(idExpSesion);
  if(idExpSesion > 0){
    var params = {
      funct: 'obtInfoExpedienteSesion',
      //Obtener el id de la cotizacion actual o si no el id de la orden
      idExpSesion: idExpSesion
    };
    ajaxData(params, function(data){
      //console.log(data.infoSesion);
      infoCuerpo = JSON.parse(data.infoSesion['trabajoDeCuerpo']);
      calificacion = JSON.parse(data.infoSesion['calificacion']);
      imagenes = data.infoSesion['imagenes'];
      imgseparadas =  (typeof(imagenes) != "undefined" && imagenes !== null) ? imagenes.split(",") : "";

      //console.log(calificacion);
      //console.log(data.infoSesion['firma']);
      //console.log(infoCuerpo['ds_brazos']);
      //console.log(calificacion['ds_atencion']);
      //console.log(imgseparadas);
      //console.log(data.infoSesion['imagenes']);
      
      $("#idExpSesion").val(data.infoSesion['idExpSesion']);
      $("#ds_sesion").val(data.infoSesion['noSesion']);
      $("#ds_peso").val(data.infoSesion['peso']);
      $("#ds_tcm").val(data.infoSesion['tcm']);
      $("#ds_imc").val(data.infoSesion['imc']);
      $("#ds_grasa").val(data.infoSesion['imcGrasa']);
      $("#ds_musculo").val(data.infoSesion['musculo']);
      $("#ds_gv").val(data.infoSesion['gv']);

      $("#ds_brazoizquierdo").val(infoCuerpo['ds_brazoizquierdo']);
      $("#ds_brazoderecho").val(infoCuerpo['ds_brazoderecho']);
      $("#ds_bajobusto").val(infoCuerpo['ds_bajobusto']);
      $("#ds_cintura").val(infoCuerpo['ds_cintura']);
      $("#ds_abdomen").val(infoCuerpo['ds_abdomen']);
      $("#ds_cadera").val(infoCuerpo['ds_cadera']);
      $("#ds_gluteos").val(infoCuerpo['ds_gluteos']);
      $("#ds_musloizquierdo").val(infoCuerpo['ds_musloizquierdo']);
      $("#ds_musloderecho").val(infoCuerpo['ds_musloderecho']);

      signatureJSON = data.infoSesion['firma'];
      if(typeof(signatureJSON) != "undefined" && signatureJSON !== null){
        if(data.infoSesion['firma'] == '{"lines":[]}'){
          $("#canvasFirma").show();
          $("#redrawSignature").hide();
          $('#redrawSignature').signature({disabled: true}); 
        }
        else{
          $("#canvasFirma").hide();
          $("#redrawSignature").show();

          $('#redrawSignature').signature('enable'). 
            signature('draw', signatureJSON). 
            signature('disable'); 
        }
      }else{
        $("#canvasFirma").show();
        $("#redrawSignature").hide();
      }

      noSesionNew = "";
      noSesionEdit = data.infoSesion['noSesion'];
      mostrarCtrlsExt(noSesionNew, noSesionEdit, imagenes);

      $("#btnRest").show();
      $("#ds_fechacita").val(data.fechaM);
      $("#ds_observaciones").val(data.infoSesion['observaciones']);
      $('input:radio[name="ds_atencion"][value='+calificacion['ds_atencion']+']').attr('checked', 'checked');
      $('input:radio[name="ds_actitud"][value='+calificacion['ds_actitud']+']').attr('checked', 'checked');
      $('input:radio[name="ds_limpieza"][value='+calificacion['ds_limpieza']+']').attr('checked', 'checked');
      if(data.infoSesion['estatus'] == 1){
        $("#ds_peso").attr("readonly", "readonly");
        $("#ds_imc").attr("readonly", "readonly");
        $("#ds_gv").attr("readonly", "readonly");
        $("#ds_grasa").attr("readonly", "readonly");
        $("#ds_musculo").attr("readonly", "readonly");
        $("#ds_brazoizquierdo").attr("readonly", "readonly");
        $("#ds_brazoderecho").attr("readonly", "readonly");
        $("#ds_bajobusto").attr("readonly", "readonly");
        $("#ds_cintura").attr("readonly", "readonly");
        $("#ds_abdomen").attr("readonly", "readonly");
        $("#ds_cadera").attr("readonly", "readonly");
        $("#ds_gluteos").attr("readonly", "readonly");
        $("#ds_musloizquierdo").attr("readonly", "readonly");
        $("#ds_musloderecho").attr("readonly", "readonly");
        $("#ds_observaciones").attr("readonly", "readonly");
        $("#btn_salvar_expcliente").hide();
        $("#btnRest").hide();
      }

      html = '';
      if(typeof(imagenes) != "undefined" && imagenes !== null){
        $.each(imgseparadas, function (ind, elem) { 
          html += '<li><img src="../uploads/'+elem+'" width="200px"></li>';
        }); 
      }

      $(".imgLis").html(html);
        
      //$("#formularioSesion").toggleClass('ocultar');
      $("#btn_salvar_expcliente").toggleClass('ocultar');
      //$("#gridSesiones").toggleClass('ocultar');
      //$("#regresar").hide();
      //$("#regresarSesion").show();
      calcularAvance();
    });

  }
}*/

/*function mostrarCtrlsExt(noSesionNew, noSesionEdit, imagenes){
  var arraySesiones = ['0','6','12','18','24','30','36','42','48','54','60','66','72','78','84','90','96','102'];
  $.each(arraySesiones, function (ind, elem) { 
    //Si es sesion nueva entrara a esta validación
    if(noSesionNew == elem){
      $("#subirImagenes").show();
      $("#divImagenes").hide();
      $("#encuestaExterna").show();
    }

    //Si es sesion editada 
    if(noSesionEdit == elem){
      idExpSesion = $("#idExpSesion").val();
      console.log("Es sesion editada: " + elem);
      console.log("Id sesion editada: " + idExpSesion);

      var params = {
        funct: 'obtInfoExpedienteSesion',
        //Obtener el id de la cotizacion actual o si no el id de la orden
        idExpSesion: idExpSesion
      };
      ajaxData(params, function(data){
        imagenesExt = data.infoSesion['imagenes'];
        //console.log("imagenes en sesion editada : " + imagenesExt);

        if(imagenesExt == null || imagenesExt == ""){
          $("#subirImagenes").show();
          $("#divImagenes").hide();
        }else{
          imagesSplit = imagenesExt.split(",");
          //console.log(imagesSplit);
          html='';
          $.each(imagesSplit, function (ind, elem) { 
            console.log(ind);
            console.log(elem);
            if(elem != ""){
              html += '<a class="fancybox" rel="gallery1" href="../uploads/'+elem+'" ><img src="../uploads/'+elem+'" width="100px"></a>';
            }
          });
          $("#divImagenes").show();
          $("#subirImagenes").hide();
          $("#divImagenes").html(html);

          $(".fancybox").fancybox({
            openEffect  : 'none',
            closeEffect : 'none'
          });
        }
      });

      $("#encuestaExterna").show();
    }
  });

}*/




// >>>>>>
//>>>>>>>Configuracion de la propuesta
// >>>>>>
$(function(){
    // Por cada cambio realizar la logica para obtener la propuesta
    $(".obtProp").change(function(){
      obtPropuestaTrat();
    });

    //initialize all modals
    $('.modal').modal({
        dismissible: false,
    });

    // Seleccionar el tipo de pago
    $(".sel_tipopago").change(function(){
      var idPago = accounting.unformat($(this).val());

      // contado = 0
      // plan de pagos = 1
      // MSI = 2
      // por sesion = 3

      //Imp. 19/06/20
      //Setear la cantidad del descuento, por el tipo de pago
      $("#pro_condpago_desc").val( obtDescPorConpagos(idPago) );

      switch(idPago){
        case 0:
            $("#cont_plan_de_pagos").hide();
            $("#cont_por_sesion").hide();
            $("#cont_meses_sin_interes").hide();
            // $("#pro_condpago_desc").val(20);
          break;
        case 2:
            $("#cont_plan_de_pagos").hide();
            $("#cont_por_sesion").hide();
            $("#cont_meses_sin_interes").show();
            // $("#pro_condpago_desc").val(10);
            // Revisa el tipo de pago
            setTipoPago();
          break;
        case 1:
            $("#cont_plan_de_pagos").show();
            $("#cont_por_sesion").hide();
            $("#cont_meses_sin_interes").hide();
            // $("#pro_condpago_desc").val(0);
          break;
        case 3:
          $("#cont_plan_de_pagos").hide();
          $("#cont_por_sesion").show();
          $("#cont_meses_sin_interes").hide();
          // $("#pro_condpago_desc").val(0);
          // Revisa el tipo de pago
          setTipoPago();
        break;
      }
      calculaTotalDescuento(0);
    });

    // Calcular cada vez que cambia la cantidad del aparato
    $(".accAparato").change(function(){
      calcularPagoPorSesion();
    });

    $("#pro_planpago_periodo").change(function(){
      // setParcialPP();
      opcPeriodo();
    });

    $('input[name=\"cf_fotosrostro\"]').click(function() {
      var v = $(this).val();
      var value = (v == 1) ? '0' : '1';
      $('#cf_fotosrostro').val(value);
    });

    $('input[name=\"cf_fotosrostro2\"]').click(function() {
      var v = $(this).val();
      var value = (v == 1) ? '0' : '1';
      $('#cf_fotosrostro2').val(value);
    });
    // Por cada cambio realizar calculo para obtener el pago parcial
    $(".calPagoParcial").change(function(){
      // pagosPorOpcPlanPlagos();
      pagosPorOpcPlanPlagos2();
    });
});

// Imp. 03/08/20
function selTodosEtapasPDA(){
  let idParamPro = accounting.unformat($("#idParamPro").val());

  if(idParamPro==0){
    $("#etapa_pago_1").prop('checked', true);
    $("#etapa_pago_2").prop('checked', true);
    $("#etapa_pago_3").prop('checked', true);
  }else{
    console.log("Existe propuesta");
  }
}

var rangoSesiones = [];
rangoSesiones[1] = "15 sesiones";
rangoSesiones[2] = "21 sesiones";
rangoSesiones[3] = "27 sesiones";
rangoSesiones[4] = "36 sesiones";
rangoSesiones[5] = "41 sesiones";

var sesionesPorPeso = [];
sesionesPorPeso[1] = "10 a 15 sesiones | 15";
sesionesPorPeso[2] = "15 a 21 sesiones | 21";
sesionesPorPeso[3] = "21 a 27 sesiones | 27";
sesionesPorPeso[4] = "27 a 36 sesiones | 36";
var gradosCelulitis = [];
gradosCelulitis[1] = "";
gradosCelulitis[2] = "18 a 21 sesiones | 21";
gradosCelulitis[3] = "21 a 28 sesiones | 28";
gradosCelulitis[4] = "28 a 36 sesiones | 36";
var gradosFlacidez = [];
// gradosFlacidez[1] = "12 a 18 sesiones | 18 | Reducci&oacute;n de hasta el 95%";
// gradosFlacidez[2] = "18 a 24 sesiones | 24 | Reducci&oacute;n de hasta el 85%";
// gradosFlacidez[3] = "24 a 30 sesiones | 30 | Reducci&oacute;n de hasta el 75%";
// gradosFlacidez[4] = "30 a 36 sesiones | 36 | Reducci&oacute;n de hasta el 60%";
gradosFlacidez[1] = "12 a 18 sesiones | 18 | 95";
gradosFlacidez[2] = "18 a 24 sesiones | 24 | 85";
gradosFlacidez[3] = "24 a 30 sesiones | 30 | 75";
gradosFlacidez[4] = "30 a 36 sesiones | 36 | 60";
gradosFlacidez[5] = "30 a 36 sesiones | 36 | 60";

var rangoPesosT1 = [];
rangoPesosT1[1] = "0 a 6";
rangoPesosT1[2] = "6 a 9";
rangoPesosT1[3] = "9 a 12";
rangoPesosT1[4] = "12 a 15";
var tratamiento = "";
var tipoTratamiento = 0;
// Datos del cuerpo
var arrPCuerpo = [];
var arrTextoPCuerpo = [];
var totalPCuerpo = 0;
var textoGradoFlacidez = "";
var esMenor10kilos = 0;

// Obtener propuesta
function obtPropuestaTrat() {
  var factorEdadMax = 40;
  var pesoRangoMax = 0;
  var totalSesiones = 0;
  var arrValCelulitis = [];
  var gradoCelulitisRangoMax = 0;
  var gradoCelulitis = 0;
  var arrValFlacidez = [];
  var gradoFlacidezRangoMax = 0;
  var gradoFlacidez = 0;
  var rangoSesion = "";
  var rangoPeso = "";

  // Datos medicamento, enfermedad, peso
  var factorMedicamento = $("#dp_enfermedades").val().length;
  var factorEnfermedad = $("#dp_medicamentos").val().length;
  var dp_peso = accounting.unformat($("#dp_peso_real").val()); //peso real
  var dp_pesodeseado = accounting.unformat($("#dp_pesodeseado").val());
  var pesoDif = (dp_peso>0)?Math.abs(dp_peso-dp_pesodeseado):0;
  console.log("difPeso: "+pesoDif);
  var edad = accounting.unformat($("#dp_edad").val());

  //setear en datos diagnosticos
  // $("#pro_peso").val($("#dp_peso").val());
  $("#pro_peso").val($("#dp_peso_real").val());
  $("#pro_pesodeseado").val($("#dp_pesodeseado").val());
  $("#pro_talla").val($("#dp_talla").val());
  $("#pro_talladeseada").val($("#dp_talladeseada").val());
  $("#pro_imc").val($("#dp_imc").val());
  $("#pro_grasa").val($("#dp_grasa").val());
  $("#pro_gv").val($("#dp_gv").val());
  $("#pro_musculo").val($("#dp_musculo").val());


  // Obtener datos brazo
  arrPCuerpo = [];
  arrTextoPCuerpo = [];
  $("#brazo_reduccion").prop('checked', false);
  $("#brazo_flacidez").prop('checked', false);
  $("#brazo_celulitis").prop('checked', false);

  var htmlZona = "";
  htmlZona += '<table class="table table-bordered">';
  htmlZona += '    <thead>';
  htmlZona += '        <tr>';
  htmlZona += '            <td>Zona</td>';
  htmlZona += '            <td>Afecci&oacute;n</td>';
  htmlZona += '        </tr>';
  htmlZona += '    </thead>';
  htmlZona += '    <tbody>';

  if($("#brazo_red_grasa").val()!="" || $("#brazo_fla_grado").val()!="" || $("#brazo_cel_grado").val()!=""){
    var brazo_reduccion = ($("#brazo_red_grasa").val()!="") ?1 :0;
    if(brazo_reduccion>0){ $("#brazo_reduccion").prop('checked', true); }
    var brazo_red_grasa = $("#brazo_red_grasa").val();

    var brazo_flacidez = ($("#brazo_fla_grado").val()!="") ?1 :0;
    if(brazo_flacidez>0){$("#brazo_flacidez").prop('checked', true);}
    var brazo_fla_grado = $("#brazo_fla_grado").val();

    var brazo_celulitis = ($("#brazo_cel_grado").val()!="") ?1 :0;
    if(brazo_celulitis>0){$("#brazo_celulitis").prop('checked', true);}
    var brazo_cel_grado = $("#brazo_cel_grado").val();

    var paramsPCuerpo = {brazo_reduccion:brazo_reduccion, brazo_red_grasa:brazo_red_grasa,
                         brazo_flacidez:brazo_flacidez, brazo_fla_grado:brazo_fla_grado,
                         brazo_celulitis:brazo_celulitis, brazo_cel_grado:brazo_cel_grado};
    arrPCuerpo.push(paramsPCuerpo);
    arrTextoPCuerpo[1] = "Brazos";

    var arrZonasDiag = [];
    // if(brazo_reduccion>0){ arrZonasDiag.push("Reducci&oacute;n"); }
    if(brazo_flacidez>0){ arrZonasDiag.push("Flacidez"); }
    if(brazo_celulitis>0){ arrZonasDiag.push("Celulitis"); }

    htmlZona += '<tr>';
    htmlZona += '    <td>Brazos</td>';
    htmlZona += '    <td>';
    htmlZona +=      arrZonasDiag.join(" | ");
    htmlZona += '    </td>';
    htmlZona += '</tr>';
  }

  $("#abdomen_reduccion").prop('checked', false);
  $("#abdomen_flacidez").prop('checked', false);
  $("#abdomen_celulitis").prop('checked', false);
  if($("#abdomen_red_grasa").val()!="" || $("#abdomen_fla_grado").val()!="" || $("#abdomen_cel_grado").val()!=""){
    var abdomen_reduccion = ($("#abdomen_red_grasa").val()!="") ?1 :0;
    if(abdomen_reduccion>0){ $("#abdomen_reduccion").prop('checked', true); }
    var abdomen_red_grasa = $("#abdomen_red_grasa").val();

    var abdomen_flacidez = ($("#abdomen_fla_grado").val()!="") ?1 :0;
    if(abdomen_flacidez>0){$("#abdomen_flacidez").prop('checked', true);}
    var abdomen_fla_grado = $("#abdomen_fla_grado").val();

    var abdomen_celulitis = ($("#abdomen_cel_grado").val()!="") ?1 :0;
    if(abdomen_celulitis>0){$("#abdomen_celulitis").prop('checked', true);}
    var abdomen_cel_grado = $("#abdomen_cel_grado").val();

    var paramsPCuerpo = {abdomen_reduccion:abdomen_reduccion, abdomen_red_grasa:abdomen_red_grasa,
                         abdomen_flacidez:abdomen_flacidez, abdomen_fla_grado:abdomen_fla_grado,
                         abdomen_celulitis:abdomen_celulitis, abdomen_cel_grado:abdomen_cel_grado};
    arrPCuerpo.push(paramsPCuerpo);
    arrTextoPCuerpo[2] = "Abdomen";

    var arrZonasDiag = [];
    // if(abdomen_reduccion>0){ arrZonasDiag.push("Reducci&oacute;n"); }
    if(abdomen_flacidez>0){ arrZonasDiag.push("Flacidez"); }
    if(abdomen_celulitis>0){ arrZonasDiag.push("Celulitis"); }

    htmlZona += '<tr>';
    htmlZona += '    <td>Abdomen</td>';
    htmlZona += '    <td>';
    htmlZona +=      arrZonasDiag.join(" | ");
    htmlZona += '    </td>';
    htmlZona += '</tr>';
  }

  $("#espalda_reduccion").prop('checked', false);
  $("#espalda_flacidez").prop('checked', false);
  $("#espalda_celulitis").prop('checked', false);
  if($("#espalda_red_grasa").val()!="" || $("#espalda_fla_grado").val()!="" || $("#espalda_cel_grado").val()!=""){
    var espalda_reduccion = ($("#espalda_red_grasa").val()!="") ?1 :0;
    if(espalda_reduccion>0){ $("#espalda_reduccion").prop('checked', true); }
    var espalda_red_grasa = $("#espalda_red_grasa").val();

    var espalda_flacidez = ($("#espalda_fla_grado").val()!="") ?1 :0;
    if(espalda_flacidez>0){$("#espalda_flacidez").prop('checked', true);}
    var espalda_fla_grado = $("#espalda_fla_grado").val();

    var espalda_celulitis = ($("#espalda_cel_grado").val()!="") ?1 :0;
    if(espalda_celulitis>0){$("#espalda_celulitis").prop('checked', true);}
    var espalda_cel_grado = $("#espalda_cel_grado").val();

    var paramsPCuerpo = {espalda_reduccion:espalda_reduccion, espalda_red_grasa:espalda_red_grasa,
                         espalda_flacidez:espalda_flacidez, espalda_fla_grado:espalda_fla_grado,
                         espalda_celulitis:espalda_celulitis, espalda_cel_grado:espalda_cel_grado};
    arrPCuerpo.push(paramsPCuerpo);
    arrTextoPCuerpo[3] = "Espalda";

    var arrZonasDiag = [];
    // if(espalda_reduccion>0){ arrZonasDiag.push("Reducci&oacute;n"); }
    if(espalda_flacidez>0){ arrZonasDiag.push("Flacidez"); }
    if(espalda_celulitis>0){ arrZonasDiag.push("Celulitis"); }

    htmlZona += '<tr>';
    htmlZona += '    <td>Espalda</td>';
    htmlZona += '    <td>';
    htmlZona +=      arrZonasDiag.join(" | ");
    htmlZona += '    </td>';
    htmlZona += '</tr>';
  }

  $("#piernas_reduccion").prop('checked', false);
  $("#piernas_flacidez").prop('checked', false);
  $("#piernas_celulitis").prop('checked', false);
  if($("#piernas_red_grasa").val()!="" || $("#piernas_fla_grado").val()!="" || $("#piernas_cel_grado").val()!=""){
    var piernas_reduccion = ($("#piernas_red_grasa").val()!="") ?1 :0;
    if(piernas_reduccion>0){ $("#piernas_reduccion").prop('checked', true); }
    var piernas_red_grasa = $("#piernas_red_grasa").val();

    var piernas_flacidez = ($("#piernas_fla_grado").val()!="") ?1 :0;
    if(piernas_flacidez>0){$("#piernas_flacidez").prop('checked', true);}
    var piernas_fla_grado = $("#piernas_fla_grado").val();

    var piernas_celulitis = ($("#piernas_cel_grado").val()!="") ?1 :0;
    if(piernas_celulitis>0){$("#piernas_celulitis").prop('checked', true);}
    var piernas_cel_grado = $("#piernas_cel_grado").val();

    var paramsPCuerpo = {piernas_reduccion:piernas_reduccion, piernas_red_grasa:piernas_red_grasa,
                         piernas_flacidez:piernas_flacidez, piernas_fla_grado:piernas_fla_grado,
                         piernas_celulitis:piernas_celulitis, piernas_cel_grado:piernas_cel_grado};
    arrPCuerpo.push(paramsPCuerpo);
    arrTextoPCuerpo[4] = "Piernas";

    var arrZonasDiag = [];
    // if(piernas_reduccion>0){ arrZonasDiag.push("Reducci&oacute;n"); }
    if(piernas_flacidez>0){ arrZonasDiag.push("Flacidez"); }
    if(piernas_celulitis>0){ arrZonasDiag.push("Celulitis"); }

    htmlZona += '<tr>';
    htmlZona += '    <td>Piernas</td>';
    htmlZona += '    <td>';
    htmlZona +=      arrZonasDiag.join(" | ");
    htmlZona += '    </td>';
    htmlZona += '</tr>';
  }

  $("#gluteos_reduccion").prop('checked', false);
  $("#gluteos_flacidez").prop('checked', false);
  $("#gluteos_celulitis").prop('checked', false);
  $("#gluteos_aummod").prop('checked', false);
  if($("#gluteos_red_grasa").val()!="" || $("#gluteos_fla_grado").val()!="" || $("#gluteos_cel_grado").val()!="" || $("#gluteos_porc").val()!=""){
    var gluteos_reduccion = ($("#gluteos_red_grasa").val()!="") ?1 :0;
    if(gluteos_reduccion>0){ $("#gluteos_reduccion").prop('checked', true); }
    var gluteos_red_grasa = $("#gluteos_red_grasa").val();

    var gluteos_flacidez = ($("#gluteos_fla_grado").val()!="") ?1 :0;
    if(gluteos_flacidez>0){$("#gluteos_flacidez").prop('checked', true);}
    var gluteos_fla_grado = $("#gluteos_fla_grado").val();

    var gluteos_celulitis = ($("#gluteos_cel_grado").val()!="") ?1 :0;
    if(gluteos_celulitis>0){$("#gluteos_celulitis").prop('checked', true);}
    var gluteos_cel_grado = $("#gluteos_cel_grado").val();

    var gluteos_aummod = ($("#gluteos_porc").val()!="") ?1 :0;
    if(gluteos_aummod>0){$("#gluteos_aummod").prop('checked', true);}
    var gluteos_porc = $("#gluteos_porc").val();

    var paramsPCuerpo = {gluteos_reduccion:gluteos_reduccion, gluteos_red_grasa:gluteos_red_grasa,
                         gluteos_flacidez:gluteos_flacidez, gluteos_fla_grado:gluteos_fla_grado,
                         gluteos_celulitis:gluteos_celulitis, gluteos_cel_grado:gluteos_cel_grado,
                         gluteos_aummod:gluteos_aummod, gluteos_porc:gluteos_porc};
    arrPCuerpo.push(paramsPCuerpo);
    arrTextoPCuerpo[5] = "Gl&uacute;teos";
    // arrTextoPCuerpo[5] = "Glúteos";

    var arrZonasDiag = [];
    // if(gluteos_reduccion>0){ arrZonasDiag.push("Reducci&oacute;n"); }
    if(gluteos_flacidez>0){ arrZonasDiag.push("Flacidez"); }
    if(gluteos_celulitis>0){ arrZonasDiag.push("Celulitis"); }

    htmlZona += '<tr>';
    htmlZona += '    <td>Gl&uacute;teos</td>';
    htmlZona += '    <td>';
    htmlZona +=      arrZonasDiag.join(" | ");
    htmlZona += '    </td>';
    htmlZona += '</tr>';
  }
  totalPCuerpo = arrPCuerpo.length;

  htmlZona += '    </tbody>';
  htmlZona += '</table>';
  $("#cont_zonaafeccion").html(htmlZona); //Agregar tabla de zonas tratamiento 1
  $("#cont_zonaafeccion2").html(htmlZona); //Agregar tabla de zonas tratamiento 2

  console.log("totalPCuerpo: "+totalPCuerpo);
  // console.log(arrPCuerpo);
  // console.log(arrTextoPCuerpo);


  // Regla menor a 10
  if(pesoDif<10){
    esMenor10kilos = 1;
    // alertify.error("No se tiene tratamiento menores a 10 kilos");
    // return false;
  }else{
    esMenor10kilos = 0;
  }

  // Reglas mayores a 10kg
  // Obtener tratamiento segun peso
  // if(pesoDif>=10 && pesoDif<=15){
  if(pesoDif>=0 && pesoDif<=15){ //Imp. 04/06/20 Por la regla menos de 10kg
    tipoTratamiento = 1;
    tratamiento = "Lipoescultura Sin Cirugia";

    // if(pesoDif>=3 && pesoDif<=6){
    if(pesoDif>=0 && pesoDif<=6){  //Imp. 04/06/20 Por la regla menos de 10kg
      pesoRangoMax = sesionesPorPeso[1].split("|");
      totalSesiones = accounting.unformat(pesoRangoMax[1].trim());
    }
    if(pesoDif>6 && pesoDif<=9){
      pesoRangoMax = sesionesPorPeso[2].split("|");
      totalSesiones = pesoRangoMax[1].trim();
    }
    if(pesoDif>9 && pesoDif<=12){
      pesoRangoMax = sesionesPorPeso[3].split("|");
      totalSesiones = accounting.unformat(pesoRangoMax[1].trim());
    }
    if(pesoDif>12 && pesoDif<=15){
      pesoRangoMax = sesionesPorPeso[4].split("|");
      totalSesiones = accounting.unformat(pesoRangoMax[1].trim());
    }
    totalSesiones = accounting.unformat(totalSesiones); //No debe ser string, Imp. 05/06/20
    console.log(totalSesiones);


    //Script para obtener el grado mayor de celulitis de cada parte del cuerpo
    $(".obtCelu").each(function(i,v){
        arrValCelulitis.push(accounting.unformat($(v).val()));
    });
    gradoCelulitis = Math.max.apply(Math, arrValCelulitis);
    // console.log(gradoCelulitis);

    if(gradoCelulitis>1){
      console.log("Grado Celulitis");
      gradoCelulitisRangoMax = gradosCelulitis[gradoCelulitis].split("|");
      gradoCelulitisRangoMax = accounting.unformat(gradoCelulitisRangoMax[1].trim());
      // console.log(gradoCelulitisRangoMax);

      if(gradoCelulitisRangoMax>totalSesiones){
        totalSesiones = gradoCelulitisRangoMax;
      }
    }

    //Script para obtener el grado mayor de celulitis de cada parte del cuerpo
    $(".obtFla").each(function(i,v){
        arrValFlacidez.push(accounting.unformat($(v).val()));
    });
    gradoFlacidez = Math.max.apply(Math, arrValFlacidez);
    // console.log(gradoFlacidez);

    if(gradoFlacidez>0){
      console.log("Grado Flacidez");
      gradoFlacidezRangoMax = gradosFlacidez[gradoFlacidez].split("|");
      gradoFlacidezRangoMax = accounting.unformat(gradoFlacidezRangoMax[1].trim());
      // console.log(gradoFlacidezRangoMax);

      if(gradoFlacidezRangoMax>totalSesiones){
        totalSesiones = gradoFlacidezRangoMax;
      }

      // Obtener el texto del grado flacidez, imp. 13/05/20
      if(gradoFlacidez>4){
        var textoGradoFlacidezRangoMax = gradosFlacidez[4].split("|");
      }else{
        var textoGradoFlacidezRangoMax = gradosFlacidez[gradoFlacidez].split("|");
      }
      textoGradoFlacidez = textoGradoFlacidezRangoMax[2].trim();
      console.log(textoGradoFlacidez);
      $("#opcFlacidezReduccion").val(textoGradoFlacidez);
    }

    // factor riesgo
    // // if(esMenor10kilos == 0){ //Imp. 04/06/20
    //   if(edad>factorEdadMax || factorEnfermedad>0 || factorMedicamento>0){
    //     console.log("Factor riesgo");
    //     totalSesiones = 5+totalSesiones;
    //   }
    // }
    console.log(totalSesiones);


    // Setear Zonas tratamiento 1
    var zonaTrat1 = '';
    $(arrTextoPCuerpo).each(function(i,v){
      if(typeof v !== 'undefined'){
        zonaTrat1 +='<div class="row">';
          zonaTrat1 +='<div class="col-md-offset-1 col-md-3 checkbox">';
            zonaTrat1 +='<label><input type="checkbox" checked style="opacity:1;" value="1" name="zonaCuerpo_'+i+'" id="zonaCuerpo_'+i+'" class="zonaCuerpoT1" onchange="zonaCuerpoT1('+i+')">'+v+'</label>';
          zonaTrat1 +='</div>';
        zonaTrat1 +='</div>';
      }
    });
    $("#cont_zona_trat_1").html(zonaTrat1);

    // console.log("total sesiones: "+totalSesiones);

    // Obt rango de sesion
    // if(totalSesiones>=10 && totalSesiones<=15){
    //   rangoSesion = rangoSesiones[1];
    //   rangoPeso = rangoPesosT1[1];
    //   totalSesiones = accounting.unformat(rangoSesion);
    // }
    // if(totalSesiones>=16 && totalSesiones<=21){
    //   rangoSesion = rangoSesiones[2];
    //   rangoPeso = rangoPesosT1[2];
    //   totalSesiones = accounting.unformat(rangoSesion);
    // }
    // if(totalSesiones>=22 && totalSesiones<=27){
    //   rangoSesion = rangoSesiones[3];
    //   rangoPeso = rangoPesosT1[3];
    //   totalSesiones = accounting.unformat(rangoSesion);
    // }
    // if(totalSesiones>=28 && totalSesiones<=36){
    //   rangoSesion = rangoSesiones[4];
    //   rangoPeso = rangoPesosT1[4];
    //   totalSesiones = accounting.unformat(rangoSesion);
    // }
    // if(totalSesiones>=37 && totalSesiones<=41){
    //   rangoSesion = rangoSesiones[5];
    //   rangoPeso = rangoPesosT1[4];
    //   totalSesiones = accounting.unformat(rangoSesion);
    // }

    //Setear rango sesion
    rangoSesion = totalSesiones+" sesiones";
    // factor riesgo
    if(edad>factorEdadMax || factorEnfermedad>0 || factorMedicamento>0){
      // console.log("Factor riesgo");
      totalSesiones = 5+totalSesiones;
      rangoSesion = totalSesiones+" sesiones";
    }

    //Imp. 15/06/20
    // console.log("rango sesion: "+rangoSesion);
    // console.log("rango peso: "+rangoPeso);
    // console.log("totalSesiones: "+totalSesiones);
  }

  // tratamiento por etapas
  if(pesoDif>15){
    tipoTratamiento = 2;
    tratamiento = "Tratamiento por etapas (perdida de peso acelerada)";

    //Script para obtener el grado mayor de celulitis de cada parte del cuerpo
    $(".obtFla").each(function(i,v){
        arrValFlacidez.push(accounting.unformat($(v).val()));
    });
    gradoFlacidez = Math.max.apply(Math, arrValFlacidez);
    // console.log(gradoFlacidez);

    if(gradoFlacidez>0){
      console.log("Grado Flacidez");
      gradoFlacidezRangoMax = gradosFlacidez[gradoFlacidez].split("|");
      gradoFlacidezRangoMax = accounting.unformat(gradoFlacidezRangoMax[1].trim());
      // console.log(gradoFlacidezRangoMax);

      if(gradoFlacidezRangoMax>totalSesiones){
        totalSesiones = gradoFlacidezRangoMax;
      }

      // Obtener el texto del grado flacidez, imp. 13/05/20
      if(gradoFlacidez>4){
        var textoGradoFlacidezRangoMax = gradosFlacidez[4].split("|");
      }else{
        var textoGradoFlacidezRangoMax = gradosFlacidez[gradoFlacidez].split("|");
      }
      textoGradoFlacidez = textoGradoFlacidezRangoMax[2].trim();
      console.log(textoGradoFlacidez);
      $("#opcFlacidezReduccion").val(textoGradoFlacidez);
    }
  }

  //>>>
  //>>>Resultados
  //>>>
  // Setear id del tratamiento
  $("#idTipoTratamiento").val(tipoTratamiento);
console.log("tratamiento tipo:" + tipoTratamiento);
  // tratamientos
  if(tipoTratamiento==1){
    console.log("sesTotal: "+totalSesiones);
    console.log("rango sesion: "+rangoSesion);
    console.log(accounting.unformat(rangoSesion));

    // Setear tratamiento recomendado
    $("#pro_tratamiento").val(tratamiento);
    $("#pro_duracion").val(rangoSesion);
    var costoTotal = obtCostoTotalPorSesiones(totalSesiones);
    $("#pro_costo").val(accounting.formatMoney(costoTotal));
    $("#pro_kilosperder_t1").val(pesoDif.toFixed(2));
    // if(esMenor10kilos == 1){
    //   $("#pro_kilosperder_t1").val(pesoDif);
    // }else{
    //   $("#pro_kilosperder_t1").val(rangoPeso);
    // }
    // console.log("DiffPesoReal: "+pesoDif);

    // Setear tratamiento a contratar
    $("#pro_duracion_cont").val(totalSesiones);
    console.log("pro_final_cont: "+$("#pro_final_cont").val());
    var finalSesiones = ($("#pro_final_cont").val() !="")?$("#pro_final_cont").val():totalSesiones;
    var costoTotal = obtCostoTotalPorSesiones(finalSesiones);
    $("#pro_final_cont").val(finalSesiones);
    $("#pro_presupuesto_cont").val(accounting.formatMoney(costoTotal));
    // JAIR 25/06/2020 Validar sin garantia
    if(!singarantiaEnf && !singarantiaMed && !singarantiaAle){
      $("#pro_garantia_final").prop('checked', true);
      $("#pro_garantia_final").val(1);
      //return false;
    }else{
      $("#pro_garantia_final").prop('checked', false);
      $("#pro_garantia_final").val(0);
    }

    $(".cont_tratamiento_sesiones").show();
    $(".cont_tratamiento_estapas").hide();
    $(".cont_condiciones_pago").show();

    // Revisa el tipo de pago
    setTipoPago();
    //Calcular descuento
    calculaTotalDescuento(0);
  }

  if(tipoTratamiento==2){
    //Imp. 03/08/20
    selTodosEtapasPDA();

    // Setear tratamiento recomendado
    $("#pro_tratamiento_etapa").val(tratamiento);
    $("#pro_kilosperder_etapa_sl").val(pesoDif.toFixed(2)); //JGP To fixed para redendear a dos decimales

    // var kiloAPerder = $("#pro_kilosperder_etapa").val();
    var kiloAPerder = $("#pro_kilosperder_etapa_sl").val();
    pesoDif = (kiloAPerder!="")?kiloAPerder:pesoDif;
    // console.log(pesoDif);

    //Imp. 03/08/20
    // Combprobar si existe en db
    var idParamPro = accounting.unformat($("#idParamPro").val());
    if(idParamPro>0){
      pesoDif = accounting.unformat( $("#pro_kilosperder_etapa").val());
    }

    $("#pro_kilosperder_etapa").val(pesoDif);
    $("#hidd_pro_kilosperder_etapa").val(pesoDif); //Agregarlo en copia

    var resEstapas = obtCostoTotalPorEtapas(pesoDif);
    // console.log(resEstapas);

    //Calcula primera etapa
    $("#numMesE1").html('<b>'+resEstapas.numMes+'</b>');
    $("#costoMesesE1").html(accounting.formatMoney(resEstapas.costoE1));
    $("#kilosMesE1").html('<b>'+resEstapas.kilosE1R1+'</b>'+'-'+'<b>'+resEstapas.kilosE1R2+'</b>');
    $("#hidd_numMesE1").val(resEstapas.numMes);

    //Calcula segunta etapa
    $("#numMesE2").html('<b>'+resEstapas.numMes+'</b>');
    $("#costoMesesE2").html(accounting.formatMoney(resEstapas.costoE2));
    $("#kilosMesE2").html('<b>'+resEstapas.kilosE2R1+'</b>'+'-'+'<b>'+resEstapas.kilosE2R2+'</b>');
    $("#hidd_numMesE2").val(resEstapas.numMes);

    //tercera etapa
    $("#numMesE3").html('<b>1</b>');
    $("#costoMesesE3").html(accounting.formatMoney(resEstapas.costoE3));

    // Costo total
    $("#pro_costo_etapa").val(accounting.formatMoney(resEstapas.costoTotal));
    $("#pro_presupuesto_etapa").val(accounting.formatMoney(resEstapas.costoTotal));
    // $("#costoTotalEtapaTmp").html(accounting.formatMoney(resEstapas.costoTotal));
    $("#costoTotalEtapaTmp").html(accounting.formatMoney(sumPagosEtapas())); //Imp. 03/08/20
    // $("#costoTotalEtapaTmpGral").html(accounting.formatMoney(resEstapas.costoTotal));

    $(".cont_tratamiento_estapas").show();
    $(".cont_tratamiento_sesiones").hide();
    $(".cont_condiciones_pago").show();

    // Revisa el tipo de pago
    setTipoPago();
    //Calcular descuento
    calculaTotalDescuento(0);
  }
}

// Imp. 22/05/20
function obtTotalZonasSel(){
  var numZonas = 0;
  //obtener el numero total de zonas
  $(".zonaCuerpoT1").each(function(i,v){
     // console.log($(v).val());
     if( accounting.unformat($(v).val()) > 0){
      numZonas += 1;
     }
  });
  return numZonas;
}

// Imp. 22/05/20
function preciosLista(numZonas){
  // tomar precios de lista
  let precioXZona = accounting.unformat(arrJsonConfiguracion[5]); // 1 Zona = 2395
  if(numZonas>1){
    precioXZona = accounting.unformat(arrJsonConfiguracion[6]); // 2 Zonas o mas = 3493
  }

  var pro_presupuesto_cont = accounting.unformat( $("#pro_presupuesto_cont").val() );
  var pro_final_cont = accounting.unformat( $("#pro_final_cont").val() );
  $("#pro_precioxsesion_sl").val( accounting.formatMoney(pro_presupuesto_cont/pro_final_cont) );
  $("#pro_preciolista_sl").val( accounting.formatMoney(precioXZona) );
  $("#pro_totalplista_sl").val( accounting.formatMoney(precioXZona*pro_final_cont) );
}

// Imp. 15/05/20
function preciosListaPorEtapas(numZonas){
  var numZonas = (numZonas>0)?numZonas:1; //Se toma del total de zonas a trabajar de diagnostico
  console.log(numZonas);
  // tomar precios de lista
  let precioXZona = accounting.unformat(arrJsonConfiguracion[5]); // 1 Zona = 2395
  if(numZonas>1){
    precioXZona = accounting.unformat(arrJsonConfiguracion[6]); // 2 Zonas o mas = 3493
  }

  var pro_presupuesto_cont = accounting.unformat($("#costoTotalEtapaTmp").text());
  //obtener numero de sesiones
  var sesionesXSem = 3;//accounting.unformat($("#dp_diasdedicar").val());
  var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
  var noMesEtapa2  = accounting.unformat($("#numMesE2").text());
  // noMesEtapa1 = sesionesXSem*(noMesEtapa1*4);
  // noMesEtapa2 = sesionesXSem*(noMesEtapa2*4);
  // noMesEtapa3 = sesionesXSem*4;
  noMesEtapa1 = 3*(noMesEtapa1*4);
  noMesEtapa2 = 2*(noMesEtapa2*4);
  noMesEtapa3 = 1*4;
  var pro_final_cont = noMesEtapa1+noMesEtapa2+noMesEtapa3;
  // console.log("sesiones: "+pro_final_cont);

  // $("#pro_te_precioxsesion_sl").val( accounting.formatMoney(pro_presupuesto_cont/pro_final_cont) );
  $("#pro_te_precioxsesion_sl").val( accounting.formatMoney(1165) );
  $("#pro_te_preciolista_sl").val( accounting.formatMoney(precioXZona) );
}

// Obtener costo total por sesiones
function obtCostoTotalPorSesiones(totalSesiones) {
  var numZonas = obtTotalZonasSel();
  /*//obtener el numero total de zonas
  $(".zonaCuerpoT1").each(function(i,v){
      // console.log($(v).val());
     if( accounting.unformat($(v).val()) > 0){
      numZonas += 1;
     }
  });*/
  console.log(numZonas);
  // console.log("total zonas: "+totalPCuerpo);
  // var numZonas = (typeof totalPCuerpo !== 'undefined')?totalPCuerpo:0;

  var costoSesion = 0;
  var costoTotal = 0;

  // Costo por sesion
  if(numZonas>1){
    costoSesion = 1499;
  }else{
    costoSesion = 1099;
  }

  //Costo total
  return totalSesiones*costoSesion;
}

function reCalculaPorSesiones(target){
  var final_sesiones = accounting.unformat($(target).val());
  var costoTotal = obtCostoTotalPorSesiones(final_sesiones);

  var pro_duracion_cont = accounting.unformat($("#pro_duracion_cont").val());
  if(final_sesiones > pro_duracion_cont){
    alertify.error("No se permite un n&uacute;mero m&aacute;s alto que la duraci&oacute;n de sesiones");
    $("#pro_final_cont").val($("#pro_duracion_cont").val());
    //JAIR 25/06/2020 Validar sin garantia
    if(!singarantiaEnf && !singarantiaMed && !singarantiaAle){
      $("#pro_garantia_final").prop('checked', true);
      $("#pro_garantia_final").val(1);
      return false;
    }else{
      $("#pro_garantia_final").prop('checked', false);
      $("#pro_garantia_final").val(0);
      return false;
    }
  }

  // Setear valores
  $("#pro_presupuesto_cont").val(accounting.formatMoney(costoTotal));
  //Calcular descuento
  calculaTotalDescuento(0);

  if($("#pro_duracion_cont").val() == final_sesiones){
    //JAIR 25/06/2020 Validar sin garantia
     if(!singarantiaEnf && !singarantiaMed && !singarantiaAle){
       $("#pro_garantia_final").prop('checked', true);
       $("#pro_garantia_final").val(1);
     }else{
      $("#pro_garantia_final").prop('checked', false);
      $("#pro_garantia_final").val(0);
     }
  }else{
    $("#pro_garantia_final").prop('checked', false);
    $("#pro_garantia_final").val(0);
  }
}

function zonaCuerpoT1(ctr){
  var v = $("#zonaCuerpo_"+ctr).val();
  var value = (v == 1) ? '0' : '1';
  $("#zonaCuerpo_"+ctr).val(value);

  $("#pro_final_cont").trigger("change");
}


// >>>>>>>>>>>>
// >>>>>>>>>>>>
// Obtener costo total por estapas
function obtCostoTotalPorEtapas(pesoDif) {
  var factorSobrepaso = 0.5;
  var precioEtapa1 = 13990;
  var precioEtapa2 = 8400;
  var precioEtapa3 = 4800;
  var costototalE1 = 0;
  var costototalE2 = 0;
  var costototalE3 = 0;

  var numMes = (pesoDif*factorSobrepaso)/6; //obtener numero de meses
  numMes = Math.ceil(numMes); //redondear hacia arriba

  costoE1 = numMes*precioEtapa1;
  costoE2 = numMes*precioEtapa2;
  costoE3 = precioEtapa3;
  costoTotal = costoE1+costoE2+costoE3;
  //Retornar los kilos por meses
  // etapa 1
  var kilosE1R1 = Math.ceil(pesoDif*0.5);
  var kilosE1R2 = Math.ceil(pesoDif*0.7);
  // etapa 2
  var kilosE2R1 = Math.ceil(pesoDif*0.7);
  var kilosE2R2 = Math.ceil(pesoDif*1);

  var res = {numMes:numMes, costoE1:costoE1, costoE2:costoE2, costoE3:costoE3, costoTotal:costoTotal,
             kilosE1R1:kilosE1R1, kilosE1R2:kilosE1R2, kilosE2R1:kilosE2R1, kilosE2R2:kilosE2R2};

  return res;
}

// recalcular por etapas
function reCalculaPorEtapas(target){
  var kilosPerder = $(target).val();

  // Reglas
  if(kilosPerder<10){
    alertify.error("No se tiene tratamiento menores a 10 kilos");
    return false;
  }

  if(kilosPerder>15){
    var resEstapas = obtCostoTotalPorEtapas(kilosPerder);
    console.log(resEstapas);

    //Calcula primera etapa
    $("#numMesE1").html('<b>'+resEstapas.numMes+'</b>');
    $("#costoMesesE1").html(accounting.formatMoney(resEstapas.costoE1));
    $("#hidd_numMesE1").val(resEstapas.numMes);

    //Calcula segunta etapa
    $("#numMesE2").html('<b>'+resEstapas.numMes+'</b>');
    $("#costoMesesE2").html(accounting.formatMoney(resEstapas.costoE2));
    $("#hidd_numMesE2").val(resEstapas.numMes);

    //tercera etapa
    $("#numMesE3").html('<b>1</b>');
    $("#costoMesesE3").html(accounting.formatMoney(resEstapas.costoE3));

    // Costo total
    // $("#pro_costo_etapa").val(accounting.formatMoney(resEstapas.costoTotal));
    // $("#costoTotalEtapaTmp").html(accounting.formatMoney(resEstapas.costoTotal));
    $("#costoTotalEtapaTmp").html(accounting.formatMoney(sumPagosEtapas())); //Imp. 03/08/20

    $(".cont_tratamiento_estapas").show();
    $(".cont_tratamiento_sesiones").hide();

  }else{
    var msg = "Se detecto que los kilos a perder es candidato a lipoescultura, &iquest;Desea cambiar de tratamiento?";
    alertify.confirm("<strong>"+msg+ "</strong>", function(){
      //obt kilos deseados
      // var kilosDeseados = accounting.unformat($("#dp_peso").val()) - accounting.unformat(kilosPerder);
      var kilosDeseados = accounting.unformat($("#dp_peso_real").val()) - accounting.unformat(kilosPerder);
      $("#dp_pesodeseado").val(kilosDeseados);
      obtPropuestaTrat(); // Ejecutar
    },function(){
      $("#pro_kilosperder_etapa").val($("#hidd_pro_kilosperder_etapa").val());  //Regresa los kilos reales
    }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
  }

  //Calcular descuento
  calculaTotalDescuento(0);
}

// recalcular por etapas seleccionadas
function reCalculaPorEtapasChecked(){
  var kilosPerder = accounting.unformat($("#pro_kilosperder_etapa").val());

  var resEstapas = obtCostoTotalPorEtapas(kilosPerder);

  //Calcula primera etapa
  $("#numMesE1").html('<b>'+resEstapas.numMes+'</b>');
  $("#costoMesesE1").html(accounting.formatMoney(resEstapas.costoE1));
  $("#hidd_numMesE1").val(resEstapas.numMes);

  //Calcula segunta etapa
  $("#numMesE2").html('<b>'+resEstapas.numMes+'</b>');
  $("#costoMesesE2").html(accounting.formatMoney(resEstapas.costoE2));
  $("#hidd_numMesE2").val(resEstapas.numMes);

  //tercera etapa
  $("#numMesE3").html('<b>1</b>');
  $("#costoMesesE3").html(accounting.formatMoney(resEstapas.costoE3));

  // Costo total
  // $("#costoTotalEtapaTmp").html(accounting.formatMoney(resEstapas.costoTotal));
  $("#costoTotalEtapaTmp").html(accounting.formatMoney(sumPagosEtapas())); //Imp. 03/08/20

  $(".cont_tratamiento_estapas").show();
  $(".cont_tratamiento_sesiones").hide();

  //Calcular descuento
  calculaTotalDescuento(0);
}


// Revisar el tipo de pago
function setTipoPago(){
  var idParamPro = accounting.unformat($("#idParamPro").val());
  // var tipoPago = accounting.unformat($('input:radio[name="pro_condpago"]:checked').val());
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  console.log("tipoPago: "+tipoPago);

  // contado = 0
  // plan de pagos = 1
  // MSI = 2
  // por sesion = 3

  switch(tipoPago){
    case 0:
    case 4:
        $("#cont_plan_de_pagos").hide();
        $("#cont_por_sesion").hide();
        $("#cont_meses_sin_interes").hide();
        $("#contenido_cantfecha").html(""); //Imp. 03/08/20
      break;
    case 2:
        $("#cont_plan_de_pagos").hide();
        $("#cont_por_sesion").hide();
        $("#cont_meses_sin_interes").show();
        $("#contenido_cantfecha").html(""); //Imp. 03/08/20
        tiposPagoInicial(tipoPago);
      break;
    case 1:
        $("#cont_plan_de_pagos").show();
        $("#cont_por_sesion").hide();
        $("#cont_meses_sin_interes").hide();
        tiposPagoInicial(tipoPago);
      break;
    case 3:
      $("#cont_plan_de_pagos").hide();
      $("#cont_por_sesion").show();
      $("#cont_meses_sin_interes").hide();
      $("#contenido_cantfecha").html(""); //Imp. 03/08/20
      tiposPagoInicial(tipoPago);
    break;
  }
}

function tiposPagoInicial(idPago){
  // Por sesion
  if(idPago==3){
    //obtener el numero de sesiones
    var tratamientoId = accounting.unformat($("#idTipoTratamiento").val());
    if(tratamientoId==1){ //lipoescultura
      var sesionesXSem = accounting.unformat($("#pro_sesionsemana_cont").val());
      // var finalSesiones = accounting.unformat($("#pro_final_cont").val());
    }
    if(tratamientoId==2){  //por etapas
      var sesionesXSem = accounting.unformat($("#dp_diasdedicar").val());
      var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
      var noMesEtapa2  = accounting.unformat($("#numMesE2").text());

      // noMesEtapa1 = sesionesXSem*(noMesEtapa1*4);
      // noMesEtapa2 = sesionesXSem*(noMesEtapa2*4);
      // noMesEtapa3 = sesionesXSem*4;
      /*noMesEtapa1 = 3*(noMesEtapa1*4);
      noMesEtapa2 = 2*(noMesEtapa2*4);
      noMesEtapa3 = 1*4;
      var finalSesiones = noMesEtapa1+noMesEtapa2+noMesEtapa3;
      console.log(finalSesiones);*/
    }
    // var valDefectoAparato = finalSesiones;
    var valDefectoAparato = 0; //Imp. 10/06/20

    $("#pro_porsesion_vendas_frias").val( ($("#param_vendasFrias").val())?$("#param_vendasFrias").val():valDefectoAparato );
    $("#pro_porsesion_vibroterapia").val( ($("#param_vibroterapia").val())?$("#param_vibroterapia").val():valDefectoAparato );
    $("#pro_porsesion_cavitacion").val( ($("#param_cavitacion").val())?$("#param_cavitacion").val():valDefectoAparato );
    $("#pro_porsesion_radiofrecuencia").val( ($("#param_radiofrecuencia").val())?$("#param_radiofrecuencia").val():valDefectoAparato );
    $("#pro_porsesion_vacumterapia").val( ($("#param_vacumterapia").val())?$("#param_vacumterapia").val():valDefectoAparato );
    $("#pro_porsesion_gimnasia_pasiva").val( ($("#param_gimnasiaPasiva").val())?$("#param_gimnasiaPasiva").val():valDefectoAparato );
    $("#pro_porsesion_presoterapia").val( ($("#param_presoterapia").val())?$("#param_presoterapia").val():valDefectoAparato );
    $("#pro_porsesion_laser_lipolitico").val( ($("#param_laserLipolitico").val())?$("#param_laserLipolitico").val():valDefectoAparato );

    // Setear el numero total de zonas
    // $("#pro_porsesion_totalzonas").val(totalPCuerpo);
    // console.log("total zonas: "+totalPCuerpo);

    calcularPagoPorSesion();
  }

  // Plan de pagos
  if(idPago==1){
    calcularPlanDePagos();
  }

  // Meses sin intereses
  if(idPago==2){
    // 12,000 - 18,000 3 MSI
    // 19,000 - 25,000 3 Y 6 MSI
    // 26,000 - 34,000 3 , 6 Y 9 MSI
    // 35,000 - …  3, 6, 9 Y 12 MSI

    // $('#pro_msi_mes').val(1);
    $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
    $('#pro_msi_mes option[value="2"]').removeAttr('disabled');
    $('#pro_msi_mes option[value="3"]').removeAttr('disabled');
    $('#pro_msi_mes option[value="4"]').removeAttr('disabled');

    var totalConDescuento = accounting.unformat($("#pro_condpago_total").val()); //Tomado del que ya tiene un descuento
    console.log(totalConDescuento);

    if(totalConDescuento>0 && totalConDescuento<=18000){ //3 msi
      $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="2"]').attr('disabled','disabled');
      $('#pro_msi_mes option[value="3"]').attr('disabled','disabled');
      $('#pro_msi_mes option[value="4"]').attr('disabled','disabled');
    }
    if(totalConDescuento>18000 && totalConDescuento<=25000){ //3,6 msi
      $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="2"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="3"]').attr('disabled','disabled');
      $('#pro_msi_mes option[value="4"]').attr('disabled','disabled');
    }
    if(totalConDescuento>25000 && totalConDescuento<=34000){ //3,6,9 msi
      $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="2"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="3"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="4"]').attr('disabled','disabled');
    }
    if(totalConDescuento>34000){ //3,6,9,12 msi
      //Aplica la configuracion inicial
    }

    // Imp. 03/07/20
    // Calcula la mensualidad
    calcularMensualidad();
  }
}

function calcularPagoPorSesion(){
  var tratamientoId = accounting.unformat($("#idTipoTratamiento").val());
  if(tratamientoId==1){ //lipoescultura
    var totalZonas = (obtTotalZonasSel() >0 )?obtTotalZonasSel():1;
  }
  if(tratamientoId==2){ //por etapas
    // var totalZonas = accounting.unformat($("#pro_porsesion_totalzonas").val()); //TODO: Como se tomara este dato
    var totalZonas = (totalPCuerpo>0)?totalPCuerpo:1; //Se toma del total de zonas a trabajar de diagnostico
  }
  $("#pro_porsesion_totalzonas").val(totalZonas);
  console.log(totalZonas);

  var total=0;

  $(".accAparato").each(function(i,v){
    var val = accounting.unformat($(v).val());
    var precio = accounting.unformat($(v).attr("precio"));
    var id = $(v).attr("id").replace("pro_porsesion_", "");

    var operacion = (val*totalZonas)*precio;
    $("#pro_porsesion_monto_"+id).val( accounting.formatMoney(operacion) );
    total += operacion;
  });

  //Obtener el numero de sesiones
  var finalSesiones = 0;
  if(tratamientoId==1){ //lipoescultura
    var sesionesXSem = accounting.unformat($("#pro_sesionsemana_cont").val());
    // finalSesiones = accounting.unformat($("#pro_final_cont").val());
  }
  if(tratamientoId==2){  //por etapas
    var sesionesXSem = accounting.unformat($("#dp_diasdedicar").val());
    var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
    var noMesEtapa2  = accounting.unformat($("#numMesE2").text());

    // noMesEtapa1 = sesionesXSem*(noMesEtapa1*4);
    // noMesEtapa2 = sesionesXSem*(noMesEtapa2*4);
    // noMesEtapa3 = sesionesXSem*4;
    /*noMesEtapa1 = 3*(noMesEtapa1*4);
    noMesEtapa2 = 2*(noMesEtapa2*4);
    noMesEtapa3 = 1*4;
    finalSesiones = noMesEtapa1+noMesEtapa2+noMesEtapa3;*/
  }
  // console.log(finalSesiones);
  console.log(total);
  // Setear el total x la sesion
  // $("#pro_porsesion_total").val( accounting.formatMoney(total/finalSesiones) );
  $("#pro_porsesion_total").val( accounting.formatMoney(total) ); //Imp. 15/06/20
}

function calcularPlanDePagos(){
  /*setTimeout(function(){
    var finalSesiones = 0;
    var tratamientoId = accounting.unformat($("#idTipoTratamiento").val());
    var totalConDescuento = accounting.unformat($("#pro_condpago_total").val()); //Tomado del que ya tiene un descuento
    var descuento = accounting.unformat($("#pro_condpago_desc").val());
    console.log("descuento: "+descuento);
    console.log("totalConDescuento: "+totalConDescuento);
    var porDescuento = descuento/100;
    var sesionesXSem = 3; //Siempre seran 3

    if(tratamientoId==1){ //lipoescultura
      // var sesionesXSem = accounting.unformat($("#pro_sesionsemana_cont").val());
      finalSesiones = accounting.unformat($("#pro_final_cont").val());
    }
    if(tratamientoId==2){  //por etapas
      // var sesionesXSem = accounting.unformat($("#dp_diasdedicar").val());
      var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
      var noMesEtapa2  = accounting.unformat($("#numMesE2").text());

      noMesEtapa1 = sesionesXSem*(noMesEtapa1*4);
      noMesEtapa2 = sesionesXSem*(noMesEtapa2*4);
      noMesEtapa3 = sesionesXSem*4;
      finalSesiones = noMesEtapa1+noMesEtapa2+noMesEtapa3;
    }
    // console.log("finalSesiones: "+finalSesiones);
    // console.log(Math.ceil(0.6));

    var costoSesion = totalConDescuento/finalSesiones;
    // console.log(costoSesion);

    // Imp. 19/05/20
    // if(descuento>0){ //Escenario 2
    //   // Pago inicial es de $45,000- 10% = $40,553 * .20 = $8,110.60
    //   var pagoInicial = totalConDescuento*0.2
    // }else{ //Escenario 1
    //   var pagoInicial = totalConDescuento*0.2
    // }
    var pagoInicial = totalConDescuento*0.2

    // var pagoInicial = (porDescuento>0)?Math.ceil((finalSesiones*porDescuento)) *costoSesion :costoSesion;
    var sesionesRestantes = finalSesiones- Math.ceil(finalSesiones*porDescuento);
    var semanasRestante = Math.ceil(sesionesRestantes/sesionesXSem);
    //Imp. se deshabilito por la regla de solo tomar a 2 meses todo
    // var quincenasRestante = Math.ceil(sesionesRestantes/(sesionesXSem*2));
    // var mesesRestante = Math.ceil(sesionesRestantes/(sesionesXSem*4));
    // // console.log(Math.ceil(2.416666666666667));
    // var montoRestante = totalConDescuento-pagoInicial;
    // var parcialSemanal = montoRestante/semanasRestante;
    // var parcialQuincenal = montoRestante/quincenasRestante;
    // var parcialMensual = montoRestante/mesesRestante;

    //Si semanas es mayor a 8 (es decir es mayor a 2 meses entonces aplicamos la otra opcion)
    // Imp. 08/06/20
    if(accounting.unformat(semanasRestante)>8){
      var semanasRestante = 8;
      var quincenasRestante = 4;
      var mesesRestante = 2;
      // console.log(Math.ceil(2.416666666666667));
      var montoRestante = totalConDescuento-pagoInicial;
      var parcialSemanal = montoRestante/semanasRestante;
      var parcialQuincenal = montoRestante/quincenasRestante;
      var parcialMensual = montoRestante/mesesRestante;
    }else{
      var quincenasRestante = Math.ceil(sesionesRestantes/(sesionesXSem*2));
      var mesesRestante = Math.ceil(sesionesRestantes/(sesionesXSem*4));
      // console.log(Math.ceil(2.416666666666667));
      var montoRestante = totalConDescuento-pagoInicial;
      var parcialSemanal = montoRestante/semanasRestante;
      var parcialQuincenal = montoRestante/quincenasRestante;
      var parcialMensual = montoRestante/mesesRestante;
    }


    $("#pro_planpago_pagoinicial").val(accounting.formatMoney(pagoInicial) );
    $("#pp_semanal").val(parcialSemanal);
    $("#pp_quincenal").val(parcialQuincenal);
    $("#pp_mensual").val(parcialMensual);
    // Setear pagos restantes
    $("#ppres_semanal").val(semanasRestante);
    $("#ppres_quincenal").val(quincenasRestante);
    $("#ppres_mensual").val(mesesRestante);
    setParcialPP();

    // console.log(pagoInicial);
    console.log("sesionesXSem: "+sesionesXSem);
    console.log(sesionesRestantes);
    console.log("semanasRestante: "+semanasRestante);
    console.log("quincenasRestante: "+quincenasRestante);
    console.log("mesesRestante: "+mesesRestante);
    // console.log(montoRestante);
    // console.log(parcialSemanal);
    // console.log(parcialQuincenal);
    // console.log(parcialMensual);
  },500);*/

  // Imp. 17/06/20
  opcPeriodo();
  setTimeout(function(){
    // pagosPorOpcPlanPlagos();
    pagosPorOpcPlanPlagos2();
  },500);
}

// muestra opciones plan pagos
function opcPeriodo(){
  var valPer = accounting.unformat( $('#pro_planpago_periodo').val() );
  // console.log(valPer);

  ////Revisa lo de la db  y Limpiar
  $("#pro_planpago_parcial").val( accounting.formatMoney(0) );
  $("#cont_dia").hide();
  // $("#pro_planpago_periodo_dia").val("");
  $("#cont_semanas").hide();
  // $("#pro_planpago_periodo_semana").val("");
  $("#cont_quincenas").hide();
  // $("#pro_planpago_periodo_quincena").val("");
  $("#cont_meses").hide();
  // $("#pro_planpago_periodo_mes").val("");

  if(valPer>-1){

    if(valPer==4){
      $("#cont_dia").show();
      var pro_planpago_periodo_dia = ($("#pro_planpago_periodo_dia").val()!="")?$("#pro_planpago_periodo_dia").val():"";
      $("#pro_planpago_periodo_dia").val(pro_planpago_periodo_dia);
    }
    if(valPer==1){
      $("#cont_semanas").show();
      var pro_planpago_periodo_semana = ($("#pro_planpago_periodo_semana").val()!="")?$("#pro_planpago_periodo_semana").val():"";
      $("#pro_planpago_periodo_semana").val(pro_planpago_periodo_semana);
    }
    if(valPer==2){
      $("#cont_quincenas").show();
      var pro_planpago_periodo_quincena = ($("#pro_planpago_periodo_quincena").val()!="")?$("#pro_planpago_periodo_quincena").val():"";
      $("#pro_planpago_periodo_quincena").val(pro_planpago_periodo_quincena);
    }
    if(valPer==3){
      $("#cont_meses").show();
      var pro_planpago_periodo_mes = ($("#pro_planpago_periodo_mes").val()!="")?$("#pro_planpago_periodo_mes").val():"";
      $("#pro_planpago_periodo_mes").val(pro_planpago_periodo_mes);
    }
  }
}

//Calcular pagos de plan de pagos por periodo
function pagosPorOpcPlanPlagos(){
  var pro_planpago_pagoinicial = accounting.unformat($("#pro_planpago_pagoinicial").val() );
  $("#pro_planpago_pagoinicial").val( accounting.formatMoney(pro_planpago_pagoinicial) );

  var periodo = accounting.unformat($("#pro_planpago_periodo").val());
  // console.log(pro_planpago_pagoinicial);
  // console.log(periodo);
  var pro_condpago_total = accounting.unformat($("#pro_condpago_total").val()); //Total con descuento
  var periodoH = 0;

  if(periodo==4){
    periodoH = accounting.unformat( $("#pro_planpago_periodo_dia").val() );
  }
  if(periodo==1){
    periodoH = accounting.unformat( $("#pro_planpago_periodo_semana").val() );
  }
  if(periodo==2){
    periodoH = accounting.unformat( $("#pro_planpago_periodo_quincena").val() );
  }
  if(periodo==3){
    periodoH = accounting.unformat( $("#pro_planpago_periodo_mes").val() );
  }
  console.log("periodoH: "+periodoH);

  // Continua
  if(periodo>0 && periodoH>0){
    var restoPago = pro_condpago_total-pro_planpago_pagoinicial;
    //Resto sobre el numero de la opcion del periodo
    restoPago = restoPago/periodoH;
    console.log(restoPago);
    $("#pro_planpago_parcial").val( accounting.formatMoney(restoPago) );
  }else{
    $("#pro_planpago_parcial").val( accounting.formatMoney(0) );
  }
}

//Calcular pagos de plan de pagos por periodo
function pagosPorOpcPlanPlagos2(){
  // checkEtapaspagosPP();
  // Calcula pago restante
  checkPagoRestante();
}

// Imp. 03/08/20
// Comprobar total de sesiones tratamiento perdida de peso acelerada
function checkSesionesPDA(){
  var sesionesXSem = accounting.unformat($("#dp_diasdedicar").val());
  var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
  var noMesEtapa2  = accounting.unformat($("#numMesE2").text());
  let finalSesiones = 0;

  noMesEtapa1 = 3*(noMesEtapa1*4);
  noMesEtapa2 = 2*(noMesEtapa2*4);
  noMesEtapa3 = 1*4;

  if($('#etapa_pago_1').is(':checked')){
    finalSesiones += noMesEtapa1;
  }
  if($('#etapa_pago_2').is(':checked')){
    finalSesiones += noMesEtapa2;
  }
  if($('#etapa_pago_3').is(':checked')){
    finalSesiones += noMesEtapa3;
  }
  return finalSesiones;
}

// Devuelve las etapas contratadas
function etapasPorContratarPDA(){
  var arr = [];
  if($('#etapa_pago_1').is(':checked')){
    arr.push("Etapa 1");
  }
  if($('#etapa_pago_2').is(':checked')){
    arr.push("Etapa 2");
  }
  if($('#etapa_pago_3').is(':checked')){
    arr.push("Etapa 3");
  }
  return arr.join();
}



function setParcialPP(){
  var periodo = accounting.unformat($("#pro_planpago_periodo").val());
  // console.log(periodo);
  switch(periodo){
    case 1:
      $("#pro_planpago_parcial").val( accounting.formatMoney($("#pp_semanal").val()) );
      $("#pro_planpago_restantes").val( accounting.unformat($("#ppres_semanal").val()) );
    break;
    case 2:
      $("#pro_planpago_parcial").val( accounting.formatMoney($("#pp_quincenal").val()) );
      $("#pro_planpago_restantes").val( accounting.unformat($("#ppres_quincenal").val()) );
    break;
    case 3:
      $("#pro_planpago_parcial").val( accounting.formatMoney($("#pp_mensual").val()) );
      $("#pro_planpago_restantes").val( accounting.unformat($("#ppres_mensual").val()) );
    break;
  }
}

// Calendario pagos parciales
function calPagosParciales(){
  //Reinicializar para uso de las fechas
  $('.inputfechaPP').datepicker({
      showOn: "button",
      buttonImage: '../images/calendar.gif',
      buttonImageOnly: true,
      buttonText: "Select date",
      autoclose: true,
      minDate: getCurrentDate(1),
      maxDate: "+2M"
  });
}
calPagosParciales();

// Imp. 30/07/20
// Agregar pagos parciales (Plan de pagos)
function addpp_pagoparcial(){
  let pro_planpago_pagorestante = accounting.unformat( $("#pro_planpago_pagorestante").val() );

  if(pro_planpago_pagorestante<=0){
    alertify.warning("Ya no se permite agregar mas bloques porque ya se configuro los pagos parciales.");
    return false;
  }

  let ctr =  accounting.unformat($("#pp_ctr_pagoparcial").val());
  ctr = ctr+1;
  $("#pp_ctr_pagoparcial").val(ctr);
  // console.log(accounting.unformat($("#pp_ctr_pagoparcial").val()));

  let htmlElem = '';
  htmlElem += '<div class="row" id="contpp_cantfecha_'+ctr+'">';
  htmlElem += '    <div class="col-md-4">';
  htmlElem += '        <div class="row">';
  htmlElem += '            <div class="col-md-4 text-right">';
  htmlElem += '              <label>Parcial:</label>';
  htmlElem += '            </div>';
  htmlElem += '            <div class="col-md-8">';
  htmlElem += '               <input class="form-control required pagoppParcial" type="text" name="pp_cantidad_'+ctr+'" id="pp_cantidad_'+ctr+'" onchange="formatoMoneda(this);">';
  htmlElem += '            </div>';
  htmlElem += '        </div>';
  htmlElem += '    </div>';
  htmlElem += '    <div class="col-md-5">';
  htmlElem += '        <div class="col-md-3 text-right col_pp_fecha">';
  htmlElem += '          <label>Fecha:</label>';
  htmlElem += '        </div>';
  htmlElem += '        <div class="col-md-7">';
  htmlElem += '           <input class="form-control inputfechaPP required" type="text" name="pp_fecha_'+ctr+'" id="pp_fecha_'+ctr+'" value="'+getCurrentDate(1)+'"  style="width:82%;display:inline-block;" readonly>';
  htmlElem += '        </div>';
  // htmlElem += '        <div class="col-md-1">';
  // htmlElem += '            <a class="tbEdit btnRegPet" href="javascript:void(0);" onclick="quitarpp_pagoparcial('+ctr+');" title="Quitar pago parcial"><img src="../images/icon_delete.png"></a>';
  // htmlElem += '        </div>';
  htmlElem += '    </div>';
  htmlElem += '</div>';

  $("#contenido_cantfecha").append(htmlElem);
  calPagosParciales();
}

// Quitar pagos parciales (Plan de pagos)
function quitarpp_pagoparcial(ctr){
  alertify.confirm("<strong>&iquest;Esta seguro de borrar el pago parcial?</strong>", function(){
    $("#contpp_cantfecha_"+ctr).empty();
    checkPagoRestante();
    //Revisar cuantos bloques estan disponibles y reseteamos en contador
    let count = 0;
    $(".pagoppParcial").each(function(i,v){
        count += 1;
    });
    $("#pp_ctr_pagoparcial").val(count);
  },function(){
  }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
}


var idPagoParcialTmp = "";
function formatoMoneda(target){
  let id = target.id;
  $("#"+id).val(accounting.formatMoney(target.value));
  idPagoParcialTmp = id;
  checkPagoRestante();
}

function checkPagoRestante(){
  let total = 0;
  $(".pagoppParcial").each(function(i,v){
    total += accounting.unformat($(v).val());
  });
  // console.log(total);

  let pro_condpago_total = accounting.unformat( $("#pro_condpago_total").val() );
  let pro_planpago_pagoinicial = accounting.unformat( $("#pro_planpago_pagoinicial").val() );
  let pago = pro_planpago_pagoinicial+total;

  $("#pro_planpago_pagoinicial").val( accounting.formatMoney(pro_planpago_pagoinicial) );

  if(pago>pro_condpago_total){
    alertify.error("Esta cantidad no debe ser mayor a la del pago restante.");
    if(idPagoParcialTmp!=""){
      $("#"+idPagoParcialTmp).val(0);
    }

    return false;
  }
  $("#pro_planpago_pagorestante").val( accounting.formatMoney(pro_condpago_total-pago) );
}

// 05/08/20
// Suma de pagos parciales
function sumPagosParciales(){
  let total = 0;
  $(".pagoppParcial").each(function(i,v){
    total += accounting.unformat($(v).val());
  });
  return total;
}

// Imp. 31/07/20
//Sumar PagosPorEtapas
function sumPagosEtapas(){
  let pago = 0;

  if($('#etapa_pago_1').is(':checked')){
    pago += accounting.unformat($("#costoMesesE1").text());
  }
  if($('#etapa_pago_2').is(':checked')){
    pago += accounting.unformat($("#costoMesesE2").text());
  }
  if($('#etapa_pago_3').is(':checked')){
    pago += accounting.unformat($("#costoMesesE3").text());
  }
  return pago;
}

// Imp. 31/07/20
//Revisar etapas seleccionadas
function checkEtapaspagosPP(){
  let tratamientoId    = accounting.unformat($("#idTipoTratamiento").val());
  let tipoPagoId       = accounting.unformat($("#pro_condpago").val());

  if(tratamientoId==2 && tipoPagoId==1){
    $("#pro_planpago_pagoinicial").val( accounting.formatMoney(sumPagosEtapas()) );
  }
}


// Calcular descuento
function calculaTotalDescuento(ctr){
  var costoTotal = 0;
  var descuento = 0;

  // Verificar si el descuento es mas de 20%
  var pro_condpago_desc = accounting.unformat($("#pro_condpago_desc").val());
  var hid_pro_condpago_desc = accounting.unformat($("#hid_pro_condpago_desc").val());
  // var tipoPago = accounting.unformat($('input:radio[name="pro_condpago"]:checked').val());
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  // console.log("Tipo_pago: "+tipoPago);
  // console.log("pro_condpago_desc: "+pro_condpago_desc);
  // contado = 0,       %20
  // plan de pagos = 1, %0
  // MSI = 2,           %10
  // por sesion = 3,    $0

  //Setear descuentos default en caso
  if(pro_condpago_desc==0){
    //console.log(accounting.unformat($("#pro_condpago_desc").val()));
    if(ctr>0){
      $("#pro_condpago_desc").val( accounting.unformat($("#pro_condpago_desc").val()) );
    }else{
      $("#pro_condpago_desc").val( obtDescPorConpagos(tipoPago) );
    }
  }
  var pro_condpago_desc = accounting.unformat($("#pro_condpago_desc").val());
  console.log("pro_condpago_desc: "+pro_condpago_desc);

  if(ctr>0){
    let descMax = 0;
    if(tipoPago==0 || tipoPago==4){ descMax = 20; }
    if(tipoPago==1){ descMax = 0; }
    if(tipoPago==2){ descMax = 10; }
    if(tipoPago==3){ descMax = 0; }
    if(pro_condpago_desc>descMax){
      alertify.confirm("<strong>Esta acci&oacute;n debe ser autorizada</strong>", function(){
        $("#cont_formSoliAutorizacion").hide();
        $("#cont_formCodAutorizacion").hide();

        reseteaFormulario("formSoliAutorizacion");
        reseteaFormulario("formCodAutorizacion");
        $("#cont_formSoliAutorizacion").show();
        $('#modalSoliAutorizacion').modal('open');
        $("#dir_soliautorizacion").trigger("change");
      },function(){
        $("#pro_condpago_desc").val(hid_pro_condpago_desc);
      }).set({labels:{ok:'Continuar', cancel: 'Cancelar'}, padding: false});
      return false;
    }
  }

  var porDescuento = pro_condpago_desc/100;
  // console.log(tipoTratamiento);

  // sesiones
  if(tipoTratamiento==1){
    costoTotal = accounting.unformat($("#pro_presupuesto_cont").val());
    descuento = costoTotal*porDescuento;
    $("#pro_condpago_total").val(accounting.formatMoney(costoTotal-descuento));
    $("#hid_pro_condpago_desc").val($("#pro_condpago_desc").val());
    $("#pro_condpago_ahorro").val(accounting.formatMoney(costoTotal-(costoTotal-descuento)));

    // Imp.22/05/20
    //Mostrar precio de lista por total zonas del cuerpo
    preciosLista(obtTotalZonasSel());
  }

  // etapas
  if(tipoTratamiento==2){
    costoTotal = accounting.unformat($("#costoTotalEtapaTmp").text());
    descuento = costoTotal*porDescuento;
    $("#pro_condpago_total").val(accounting.formatMoney(costoTotal-descuento));
    $("#hid_pro_condpago_desc").val($("#pro_condpago_desc").val());
    $("#pro_condpago_ahorro").val(accounting.formatMoney(costoTotal-(costoTotal-descuento)));

    // Imp.15/06/20
    //Mostrar precio de lista por total zonas del cuerpo
    preciosListaPorEtapas(totalPCuerpo);
  }
  setearDescuento();
  setTipoPago(); //Hacer operaciones por el tipo de pago
}

// Imp. 19/06/20
function obtDescPorConpagos(tipoPago){
  let descMax=0;

  if(tipoPago==0 || tipoPago==4){ descMax = ( accounting.unformat($("#desc_contado").val()) >-1 )?accounting.unformat($("#desc_contado").val()):20; }
  if(tipoPago==1){ descMax = ( accounting.unformat($("#desc_planpago").val()) >-1 )?accounting.unformat($("#desc_planpago").val()):0; }
  if(tipoPago==2){ descMax = ( accounting.unformat($("#desc_msi").val()) >-1 )?accounting.unformat($("#desc_msi").val()):10; }
  if(tipoPago==3){ descMax = ( accounting.unformat($("#desc_xsesion").val()) >-1 )?accounting.unformat($("#desc_xsesion").val()):0; }

  return descMax;
}

// Imp. 19/06/20
function setearDescuento(){
  // var tipoPago = accounting.unformat($('input:radio[name="pro_condpago"]:checked').val());
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  var pro_condpago_desc = accounting.unformat($("#pro_condpago_desc").val());

  if(tipoPago==0 || tipoPago==4){
    // if(accounting.unformat($("#desc_contado").val()) == -1){ return false;}
    $("#desc_contado").val(pro_condpago_desc);
  }
  if(tipoPago==1){
    // if(accounting.unformat($("#desc_planpago").val()) == -1){ return false;}
    $("#desc_planpago").val(pro_condpago_desc);
  }
  if(tipoPago==2){
    // if(accounting.unformat($("#desc_msi").val()) == -1){ return false;}
    $("#desc_msi").val(pro_condpago_desc);
  }
  if(tipoPago==3){
    // if(accounting.unformat($("#desc_xsesion").val()) == -1){ return false;}
    $("#desc_xsesion").val(pro_condpago_desc);
  }
}


// Accion cuando cierra el modal
function cerrarModal(){
  var hid_pro_condpago_desc = accounting.unformat($("#hid_pro_condpago_desc").val());
  $("#pro_condpago_desc").val(hid_pro_condpago_desc);
  $("#cont_formSoliAutorizacion").hide();
  $("#cont_formCodAutorizacion").hide();
}

// Enviar mensaje para autorizar descuento
function btnAceptarSoliAut(){
  $.validator.setDefaults({
    ignore: []
  });

  var validator = $("#formSoliAutorizacion").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });

  //Validar formulario
  if($("#formSoliAutorizacion").valid()){
    showLoading("btnAceptarSoliAut");
    var params = {comentario:$("#comentario_soliautorizacion").val(), idP:$("#idProspecto").val(), 
                  celular:$("#cel_soliautorizacion").val(), sucursalId: $("#sucursalIdCreador").val()
                 };
    // console.log(params);
    // return false;
    params = paramsB64(params);
    params['funct'] = 'soliAutoriPorSMS';
    // console.log(params);

    ajaxData(params, function(datosResp){
      // console.log(datosResp); //COMENTAR EN SERVER
      hideLoading2("btnAceptarSoliAut");

      if(datosResp.success==true){
        $("#cont_formSoliAutorizacion").hide();
        $("#cont_formCodAutorizacion").show();
        alertify.success("Se ha enviado la solicitud, espere el c&oacute;digo de confirmaci&oacute;n.");
      }else{
        // $('.modal').modal();
        $('.modal').modal("close");
        cerrarModal();
        alertify.error("No se ha podido enviar la solicitud de autorizaci&oacute;n, intentar m&aacute;s tarde.");
      }
    });
  }else{
    validator.focusInvalid();
    return false;
  }
}

// Validar que el codigo sea correcto
function btnAceptarCodigoValAut(){
   var validator = $("#formCodAutorizacion").validate({errorClass: "invalid form-error", errorElement: 'div', errorPlacement: function(error, element) {error.appendTo(element.parent()); } });
    //Validar formulario
    if($("#formCodAutorizacion").valid()){
      showLoading("btnAceptarCodigoValAut");
        var params = {codigo:$("#codigo_val_aut").val(), idP:$("#idProspecto").val()};
        // console.log(params);
        // return false;

        params = paramsB64(params);
        params['funct'] = 'confirmarCodigoAut';
        // console.log(params);

        ajaxData(params, function(datosResp){
          // console.log(datosResp);
          hideLoading2("btnAceptarCodigoValAut");
          if(datosResp.success==true){
            $('.modal').modal("close");

            alertify.success("La solicitud de descuento se ha aplicado.");
            calculaTotalDescuento(0);
            $("#hid_pro_condpago_desc").val($("#pro_condpago_desc").val());
          }else{
            $("#codigo_val_aut").val("");
            alertify.error("El c&oacute;digo de confirmaci&oacute;n no es correcto, por favor verifiquelo.");
          }
      });
    }else{
      validator.focusInvalid();
      return false;
    }
}


// Ejecutar
// obtPropuestaTrat();


// >>>>>>>>>>>>
// >>>>>Salvar propuesta
// >>>>>>>>>>>>
function popupMotivoPropuesta(){
  // Imp. 05/08/20
  //Revisar si el tratamiento es perdida de peso acelerado
  let tratamientoId    = accounting.unformat($("#idTipoTratamiento").val());
  if(tratamientoId==2){
    if(sumPagosEtapas() <= 0){
      alertify.error("Debe seleccionar al menos una etapa.");
      return false;
    }
  }

  //Imp. 30/07/20
  //Si el pago es plan de pagos entonces verificar
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  if(tipoPago==1){
    let pp_ctr_pagoparcial = accounting.unformat( $("#pp_ctr_pagoparcial").val() ); //obt. control de pagos parciales
    // 05/08/20
    //obt. total de pagos parciales
    let pro_condpago_total = accounting.unformat($("#pro_condpago_total").val());
    let pro_planpago_pagoinicial = accounting.unformat($("#pro_planpago_pagoinicial").val());
    let pagosParcialesTmp = sumPagosParciales()+pro_planpago_pagoinicial;
    let checkPagosParciales = (pro_condpago_total==pagosParcialesTmp)?true:false;
    // console.log(pagosParcialesTmp);
    // console.log(checkPagosParciales);
    // return false;

    if(pp_ctr_pagoparcial==0 || checkPagosParciales==false){
      alertify.error("Debe de configurar los pagos parciales, presionar sobre el bot&oacute;n (+) para agregar bloque.");
      return false;
    }

    $.validator.setDefaults({ignore:[]});
    var validator = $("#formProspecto").validate({ errorClass: "invalid form-error", errorElement: 'div', errorPlacement: function(error, element) {error.appendTo(element.parent());} });

    //Validar formulario
    if($("#formProspecto").valid()){
      console.log("continuar");
    }else{
      return false;
    }
  }


  reseteaFormulario('formMotivoPropuesta');
  $('#modalMotivoPropuesta').modal('open');

  //JAIR 26/6/2020 Mostrar correo del prospecto
  $("#correousr_motivopro").val($("#dp_email").val());
}

// Savar datos datos en json
function obtTodosDatosProspecto(){
  //Ejemplo obtener datos
  var url = '../ajaxcall/ajaxFunctions.php?funct=salvarTodosDatosProspecto';
  var formElement = document.getElementById("formProspecto");
  var data = new FormData(formElement);
  ajaxDataPost(url, data, function(dataResp){
    console.log(dataResp);
  });
}

function guardarPropuesta(){
  //Agregar motivo
  $.validator.setDefaults({ignore:[]});

  var validator = $("#formMotivoPropuesta").validate({
      errorClass: "invalid form-error",
      errorElement: 'div',
      errorPlacement: function(error, element) {
        error.appendTo(element.parent());
      }
  });

  //Validar formulario
  if($("#formMotivoPropuesta").valid()){
    showLoading("btnGuardarPropuesta");

    //Datos motivo y generar resumen
    var id_motivopro = $("#id_motivopro").val();
    var comentario = $("#comentario_motivopro").val();
    var correoUsuario = $("#correousr_motivopro").val();

    var zonasTrabajar    = JSON.stringify(arrPCuerpo);
    // console.log(zonasTrabajar);
    // return false;

    //Datos propuesta
    var idParamPro       = accounting.unformat($("#idParamPro").val());
    var prospectoId      = $("#idProspecto").val();
    var expClienteId     = "";
    var expTratamientoId = "";
    var tratamientoId    = $("#idTipoTratamiento").val();
    // var duracionSesiones = $("#pro_duracion_cont").val();
    // var finalSesiones    = $("#pro_final_cont").val();
    var finalSesiones    = (tratamientoId==1)? $("#pro_final_cont").val() :checkSesionesPDA(); //Imp. 03/08/20
    var sesionesXSemT1   = $("#pro_sesionsemana_cont").val();
    var sesionesXSemT2   = $("#dp_diasdedicar").val();
    var tipoPagoId       = $("#pro_condpago").val(); //$('input:radio[name="pro_condpago"]:checked').val();
    var descuento        = $("#pro_condpago_desc").val();
    var periodo          = "";//$("#pro_planpago_periodo").val(); //Imp. 03/08/20
    var mesesSinInt      = $("#pro_msi_mes").val();
    var vendasFrias      = $("#pro_porsesion_vendas_frias").val();
    var vibroterapia     = $("#pro_porsesion_vibroterapia").val();
    var cavitacion       = $("#pro_porsesion_cavitacion").val();
    var radiofrecuencia  = $("#pro_porsesion_radiofrecuencia").val();
    var vacumterapia     = $("#pro_porsesion_vacumterapia").val();
    var gimnasiaPasiva   = $("#pro_porsesion_gimnasia_pasiva").val();
    var presoterapia     = $("#pro_porsesion_presoterapia").val();
    var laserLipolitico  = $("#pro_porsesion_laser_lipolitico").val();
    //Direfencia entre peso real y peso deseado t1, Imp. 20/05/20
    if(tratamientoId==1){
      var duracionSesiones = $("#pro_duracion_cont").val();
      var kilosAPerder     = Math.abs(accounting.unformat($("#pro_peso").val())-accounting.unformat($("#pro_pesodeseado").val()));
    }else{
      var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
      var noMesEtapa2  = accounting.unformat($("#numMesE2").text());
      noMesEtapa1 = 3*(noMesEtapa1*4);
      noMesEtapa2 = 2*(noMesEtapa2*4);
      noMesEtapa3 = 1*4;
      var duracionSesiones = noMesEtapa1+noMesEtapa2+noMesEtapa3;
      var kilosAPerder     = accounting.unformat($("#pro_kilosperder_etapa").val());
    }
    // console.log(kilosAPerder);
    // return false;
    // Tomar numero de meses
    var noMesEtapa1      = accounting.unformat($("#numMesE1").text());
    var noMesEtapa2      = accounting.unformat($("#numMesE2").text());


    //Salvar No. Pagos
    //Imp. 17/06/20
    var periodoTmp = accounting.unformat( periodo );
    var numPagosPeriodo = 0;
    if(periodoTmp>0){
      if(periodoTmp==4){
        numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_dia").val() );
      }
      if(periodoTmp==1){
        numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_semana").val() );
      }
      if(periodoTmp==2){
        numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_quincena").val() );
      }
      if(periodoTmp==3){
        numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_mes").val() );
      }
    }
    // console.log(periodoTmp);
    // console.log(numPagosPeriodo);
    // return false;
    var params = {idMotivo:id_motivopro, comentario:comentario, correoUsuario:correoUsuario, //Datos motivo y generar resumen
                  idParamPro:idParamPro, prospectoId:prospectoId, expClienteId:expClienteId, expTratamientoId:expTratamientoId, tratamientoId:tratamientoId,
                  duracionSesiones:duracionSesiones, finalSesiones:finalSesiones, sesionesXSemT1:sesionesXSemT1, sesionesXSemT2:sesionesXSemT2,
                  tipoPagoId:tipoPagoId, descuento:descuento, periodo:periodo, mesesSinInt:mesesSinInt,
                  vendasFrias:vendasFrias, vibroterapia:vibroterapia, cavitacion:cavitacion, radiofrecuencia:radiofrecuencia,
                  vacumterapia:vacumterapia, gimnasiaPasiva:gimnasiaPasiva, presoterapia:presoterapia, laserLipolitico:laserLipolitico,
                  kilosAPerder:kilosAPerder, noMesEtapa1:noMesEtapa1, noMesEtapa2:noMesEtapa2, urlContrato:"",
                  numPagosPeriodo:numPagosPeriodo
                };
    // console.log(params);
    // return false;

    params = paramsB64(params);
    params['zonasTrabajar'] = zonasTrabajar;
    params['funct'] = 'salvarParamsPropuesta';
    // console.log(params);
    ajaxData(params, function(datosResp){
      // console.log(datosResp);
      $('.modal').modal("close");
      hideLoading2("btnGuardarPropuesta");

      if(datosResp.success==true){
        $("#idParamPro").val(datosResp.idParamPropuesta);
        obtTodosDatosProspecto(); //Salvar todos los datos en json
        alertify.success("La propuesta se ha salvado correctamente");

        //Imp.17/06/20
        $(".overlayLoading").show();
        setTimeout(function(){
          //Imp. 25/08/20          
          let idProspecto = accounting.unformat($("#idProspecto").val());
          let dp_email = $("#correousr_motivopro").val();
          window.open('propuestat1.php?idP='+idProspecto+'&c='+dp_email, '_blank', 'height=' + screen.height + ',width=' + screen.width + ',menubar=no,toolbar=no');

          setTimeout(function(){
            location.reload();
          }, 5000);
        // }, 2000);
       }, 1500);
      }else{
        // cerrarModal();
        alertify.error("No se ha podido salvar la propuesta, intentar m&aacute;s tarde.");
      }
    });
  }else{
    validator.focusInvalid();
    return false;
  }
}

// >>>>>>>>>>>>
// >>>>>Generar contrato
// >>>>>>>>>>>>
var arrIdHorariosClieAgregados = []; //Ids de horarios agregados

// Preguntar antes de salir
function cancelarContrato(){
  var msg = "Est&aacute; seguro de cancelar la generaci&oacute;n del contrato";
  alertify.confirm("<strong>&iquest;"+msg+ "?</strong>", function(){
    $('.modal').modal("close");
    hideLoading2("btn_continuarContrato1");
    hideLoading2("btn_continuarContrato2");

    if(arrIdHorariosClieAgregados.length > 0){
      // console.log(arrIdHorariosClieAgregados.join());
      var params = {funct:"limpiarHorariosAgregados", "idsHrsAgredados":arrIdHorariosClieAgregados.join()};

      ajaxData(params, function(datosResp){
        console.log(datosResp);
      });
    }
  },function(){
  }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
}

// Campos requerido segun vista
function camposGCRequeridos(ctr){
  if(ctr==1){
    $('#cf_nombre').addClass("required");
    $('#cf_parentesco').addClass("required");
    $('#cf_telefono').addClass("required");
  }
}

//obtener areas por trabajar
function areasTrabajar(response){
  var areasTrabajar = [];
  $.each(arrTextoPCuerpo, function(i,v) {
    if(typeof v !== 'undefined'){
      areasTrabajar.push(v);
    }
  });

  // response(areasTrabajar.join());
  // response(areasTrabajar);
  return areasTrabajar;
}

// Genera pdf contrato
function pdfContrato(){
  // Datos prospecto
  var idProspecto = $("#idProspecto").val();
  var nombreCompleto = $("#dp_nombre").val() +" "+ $("#dp_paterno").val() +" "+ $("#dp_materno").val();
  var correo = $("#dp_email").val();
  var edad = $("#dp_edad").val();
  var telefono = $("#dp_telefono").val();
  var celular = $("#dp_celular").val();
  var cp = $("#dp_cp").val();
  var ocupacion = $("#dp_ocupacion").val();

  //obtener enfermedades
  var arrEnfermedad = [];
  var enfermedades = $("#dp_enfermedades").val();
  $.each(enfermedades, function(i,v) {
    if(typeof v !== 'undefined'){
      arrEnfermedad.push(arrJsonEnfermedades[v])
    }
  });
  enfermedades = arrEnfermedad.join(", ");

  // obtener alergias
  var arrAlergia = [];
  var alergias = $("#dp_alergias").val();
  $.each(alergias, function(i,v) {
    if(typeof v !== 'undefined'){
      arrAlergia.push(arrJsonAlergias[v])
    }
  });
  alergias = arrAlergia.join(", ");

  // obtener medicamentos
  var arrMedicamento = [];
  var medicamentos = $("#dp_medicamentos").val();
  $.each(medicamentos, function(i,v) {
    if(typeof v !== 'undefined'){
      arrMedicamento.push(arrJsonMedicamentos[v])
    }
  });
  medicamentos = arrMedicamento.join(", ");

  // obtener cirugias
  var arrCirugia = [];
  var cirugias = $("#dp_cirugias").val();
  $.each(cirugias, function(i,v) {
    if(typeof v !== 'undefined'){
      arrCirugia.push(arrJsonCirugias[v])
    }
  });
  cirugias = arrCirugia.join(", ");

  // console.log(enfermedades);
  // console.log(alergias);
  // console.log(medicamentos);
  // console.log(cirugias);
  // return false;

  //Datos emergencia
  var cf_nombre = $("#cf_nombre").val();
  var cf_parentesco = $("#cf_parentesco").val();
  var cf_telefono = $("#cf_telefono").val();
  var cf_fotosrostro = $("#cf_fotosrostro").val();
  // console.log(cf_fotosrostro);

  //obtener el nombre del tratamiento
  var nombreTratamiento = (tipoTratamiento==1)?$("#pro_tratamiento").val():$("#pro_tratamiento_etapa").val();

  // var tratamientoId = accounting.unformat($("#idTipoTratamiento").val());
  var etapasContratadas = "";
  if(tipoTratamiento==1){ //lipoescultura
    var sesionesXSem = accounting.unformat($("#pro_sesionsemana_cont").val());
    var sesiones = accounting.unformat($("#pro_final_cont").val());
    var sesionesTratRec = accounting.unformat($("#pro_duracion").val());
    var kiloAPerder = $("#pro_kilosperder_t1").val();

    //Imp. 16/06/20, Carlos
    var pro_duracion_cont = accounting.unformat($("#pro_duracion_cont").val());
    var pro_final_cont = accounting.unformat($("#pro_final_cont").val());
    var opcResultados = 0;
    if(pro_duracion_cont==pro_final_cont){
      opcResultados=1;
    }
  }
  if(tipoTratamiento==2){  //por etapas
    var sesionesXSem = accounting.unformat($("#dp_diasdedicar").val());

    var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
    var noMesEtapa2  = accounting.unformat($("#numMesE2").text());

    noMesEtapa1 = 3*(noMesEtapa1*4);
    noMesEtapa2 = 2*(noMesEtapa2*4);
    noMesEtapa3 = 1*4;
    // var sesiones = noMesEtapa1+noMesEtapa2+noMesEtapa3;

    var sesiones = checkSesionesPDA(); //Imp. 03/08/20
    // var sesionesTratRec = sesiones;
    var sesionesTratRec = noMesEtapa1+noMesEtapa2+noMesEtapa3;
    var kiloAPerder = $("#pro_kilosperder_etapa_sl").val();

    //Imp. 16/06/20, Carlos
    var pro_costo_etapa = accounting.unformat($("#pro_costo_etapa").val());
    var costoTotalEtapaTmp = accounting.unformat($("#costoTotalEtapaTmp").text());
    var opcResultados = 0;
    if(pro_costo_etapa==costoTotalEtapaTmp){
      opcResultados=1;
    }

    //Obtener la etapas por contratar
    etapasContratadas = etapasPorContratarPDA();
  }
  console.log(sesionesTratRec);
  console.log(opcResultados);
  console.log(etapasContratadas);
  // return false;

  var peso = $("#dp_peso_real").val();
  var opcFlacidezReduccion = accounting.unformat($("#opcFlacidezReduccion").val()); //Imp. 13/05/20

  //obtener las areas
  // var areasTra = areasTrabajar(function(resp){ return resp.join(); });
  var areas = areasTrabajar().join();
  // -----------------

  var params = {idProspecto:idProspecto, nombreCompleto:nombreCompleto, correo:correo, edad:edad, telefono:telefono, celular:celular,
                cp:cp, ocupacion:ocupacion, enfermedades:enfermedades, alergias:alergias, medicamentos:medicamentos,
                cirugias:cirugias, cf_nombre:cf_nombre, cf_parentesco:cf_parentesco, cf_telefono:cf_telefono,
                cf_fotosrostro:cf_fotosrostro, nombreTratamiento:nombreTratamiento,
                sesionesXSem:sesionesXSem, sesiones:sesiones, peso:peso, areas:areas, sesionesTratRec:sesionesTratRec,
                kiloAPerder:kiloAPerder, opcFlacidezReduccion:opcFlacidezReduccion, opcResultados:opcResultados,
                tipoTratamiento:tipoTratamiento, etapasContratadas:etapasContratadas
              };
  // console.log(params);
  // return false;
  params = paramsB64(params);
  params['funct'] = 'generarContratoPDF';
  // console.log(params);
  ajaxData(params, function(datosResp){
    hideLoading2("btn_continuarContrato2");
    // console.log(datosResp);
    // return false;

    if(datosResp.success==true){
      $(".cont_gc_paso_1").hide();
      $(".cont_gc_paso_2").hide();
      $(".cont_gc_paso_3").show();
      //
      var archivoContrato = "";
      archivoContrato += '<div>Se ha generado el contrato, de click en el archivo <b><a href="'+datosResp.urlArchivo+'" target="_blank">'+datosResp.nombreArchivo+'</a></b> para que el usuario lo lea y firme el contrato, posterior a esto presionar sobre el bot&oacute;n de confirmar.</div>';
      archivoContrato += '<div>Aviso de privacidad, de click <b><a href="'+datosResp.urlAvisoP+'" target="_blank">aqu&iacute;.</a></b></div>';
      archivoContrato += '<input type="hidden" id="url_pdf_archivo" value="upload/pdfContratos/'+datosResp.nombreArchivo+'">';
      $("#cont_archivo_contrato").html(archivoContrato);
    }else{
      $('.modal').modal("close");
      alertify.error("No se ha podido generar el contrato, intentar nuevamente.");
    }
  });
}

//Imp. 24/07/20
// Validar que tenga el pago inicial
function validaPagoInicial(response){
  var resp = false;
  // var tipoPago = accounting.unformat($('input:radio[name="pro_condpago"]:checked').val());
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  if(tipoPago==1){
    var pro_planpago_pagoinicial = accounting.unformat( $("#pro_planpago_pagoinicial").val() );
    if(pro_planpago_pagoinicial<=0){
      resp = true;
    }
  }
  response(resp);
}

// Popup genera contrato
function popupGeneraContrato(){
  // Imp. 31/07/20
  //Revisar si el tratamiento es perdida de peso acelerado
  let tratamientoId    = accounting.unformat($("#idTipoTratamiento").val());
  if(tratamientoId==2){
    if(sumPagosEtapas() <= 0){
      alertify.error("Debe seleccionar al menos una etapa.");
      return false;
    }
  }

  //Imp. 30/07/20
  //Si el pago es plan de pagos entonces verificar
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  if(tipoPago==1){
    let pp_ctr_pagoparcial = accounting.unformat( $("#pp_ctr_pagoparcial").val() );

    // 05/08/20
    //obt. total de pagos parciales
    let pro_condpago_total = accounting.unformat($("#pro_condpago_total").val());
    let pro_planpago_pagoinicial = accounting.unformat($("#pro_planpago_pagoinicial").val());
    let pagosParcialesTmp = sumPagosParciales()+pro_planpago_pagoinicial;
    let checkPagosParciales = (pro_condpago_total==pagosParcialesTmp)?true:false;
    // console.log(pagosParcialesTmp);
    // console.log(checkPagosParciales);
    // return false;

    if(pp_ctr_pagoparcial==0 || checkPagosParciales==false){
      alertify.error("Debe de configurar los pagos parciales, presionar sobre el bot&oacute;n (+) para agregar bloque.");
      return false;
    }

    $.validator.setDefaults({ignore:[]});
    var validator = $("#formProspecto").validate({ errorClass: "invalid form-error", errorElement: 'div', errorPlacement: function(error, element) {error.appendTo(element.parent());} });

    //Validar formulario
    if($("#formProspecto").valid()){
      console.log("continuar");
    }else{
      return false;
    }
  }

  //Imp. 24/07/20
  //Verificar si tiene pago inicial solo en caso de ser Plan de pagos
  validaPagoInicial(function(datosResp){
    // console.log(datosResp);
    if(datosResp==true){
      alertify.error("Debe de ingresar un pago inicial mayor a 0.");
    }else{
      reseteaFormulario('formGenerarContrato');
      $('#modalGenerarContrato').modal('open');
      $(".cont_gc_paso_1").hide();
      $(".cont_gc_paso_2").hide();
      $(".cont_gc_paso_3").hide();
      // Muestra el primer contenedor
      $(".cont_gc_paso_1").show();
      camposGCRequeridos(1);
    }
  });
}

// continuar los pasos
function continuarContrato(ctr){
  ctr = ctr+1;
  // console.log(ctr);
  var validator = $("#formGenerarContrato").validate({ });

  if($("#formGenerarContrato").valid()){
    if(ctr==2){
      showLoading("btn_continuarContrato1");
      // $(".cont_gc_paso_1").hide();
      // $(".cont_gc_paso_2").show();

      // Cargar panel de reserva de bloques de horas por dia de la semana
      obtBloquesHorariosPorDia();

      // Imp. 04/08/20
      //Permitir seleccionar unicamente el numero escogido en los dias a dedicar segun tratamiento
      var totalBlockPerm = 0;
      if(tipoTratamiento==1){ totalBlockPerm = accounting.unformat($("#pro_sesionsemana_cont").val());
      }else{ totalBlockPerm = accounting.unformat($("#dp_diasdedicar").val()); }
      $("#selTotalBlockPerm").html("El n&uacute;mero permitido de bloques a seleccionar es: <b><u>&nbsp;"+totalBlockPerm+"&nbsp;</u></b>");
    }
    if(ctr==3){
      //Verificar que tenga al menos un horario por reservas
      if(arrIdHorariosClieAgregados.length > 0){
        // showLoading("btn_continuarContrato2");
        // $(".cont_gc_paso_1").hide();
        // $(".cont_gc_paso_2").hide();
        // $(".cont_gc_paso_3").show();

        // Imp. 04/08/20
      //Permitir seleccionar unicamente el numero escogido en los dias a dedicar segun tratamiento
        var totalBlockPerm = 0;
        if(tipoTratamiento==1){ totalBlockPerm = accounting.unformat($("#pro_sesionsemana_cont").val());
        }else{ totalBlockPerm = accounting.unformat($("#dp_diasdedicar").val()); }
        if(arrIdHorariosClieAgregados.length == totalBlockPerm){
          showLoading("btn_continuarContrato2");
          //genera contrato en pdf
          pdfContrato();
        }else{
          alertify.error("El n&uacute;mero permitido de bloques a seleccionar es "+ totalBlockPerm);
          return false;
        }
        // //genera contrato en pdf
        // pdfContrato();
      }else{
        // alertify.error("Para continuar debe seleccionar por lo menos un horario.");
        alertify.error("Para continuar debe seleccionar el(los) horario(s).");
      }
    }
  }else{
    validator.focusInvalid();
    return false;
  }
}

// Generar contrato
function generarContrato(){
  var urlContrato = $("#url_pdf_archivo").val(); //Imp.16/06/20 obt. url del contrato
  $('.modal').modal("close");
  showLoading("btn_generarContrato");
  $("#btn_guardar_propuesta").hide();
  $("#btn_salvar_genera_contrato").hide();

  //Datos motivo y generar resumen
  var id_motivopro = 0;
  var comentario = "";
  var correoUsuario = "";

  var zonasTrabajar    = JSON.stringify(arrPCuerpo);
  // console.log(zonasTrabajar);
  // return false;

  //Datos propuesta
  var idParamPro       = accounting.unformat($("#idParamPro").val());
  var prospectoId      = $("#idProspecto").val();
  var expClienteId     = "";
  var expTratamientoId = "";
  var tratamientoId    = $("#idTipoTratamiento").val();
  // var duracionSesiones = $("#pro_duracion_cont").val();
  // var finalSesiones    = $("#pro_final_cont").val();
  var finalSesiones    = (tratamientoId==1)? $("#pro_final_cont").val() :checkSesionesPDA(); //Imp. 03/08/20
  var sesionesXSemT1   = $("#pro_sesionsemana_cont").val();
  var sesionesXSemT2   = $("#dp_diasdedicar").val();
  var tipoPagoId       = $("#pro_condpago").val(); //$('input:radio[name="pro_condpago"]:checked').val();
  var descuento        = $("#pro_condpago_desc").val();
  var periodo          = ""; //$("#pro_planpago_periodo").val(); //Imp. 03/08/20
  var mesesSinInt      = $("#pro_msi_mes").val();
  var vendasFrias      = $("#pro_porsesion_vendas_frias").val();
  var vibroterapia     = $("#pro_porsesion_vibroterapia").val();
  var cavitacion       = $("#pro_porsesion_cavitacion").val();
  var radiofrecuencia  = $("#pro_porsesion_radiofrecuencia").val();
  var vacumterapia     = $("#pro_porsesion_vacumterapia").val();
  var gimnasiaPasiva   = $("#pro_porsesion_gimnasia_pasiva").val();
  var presoterapia     = $("#pro_porsesion_presoterapia").val();
  var laserLipolitico  = $("#pro_porsesion_laser_lipolitico").val();
  // var kilosAPerder     = $("#pro_kilosperder_etapa").val();
  //Direfencia entre peso real y peso deseado t1, Imp. 20/05/20
  if(tratamientoId==1){
    var duracionSesiones = $("#pro_duracion_cont").val();
    var kilosAPerder     = Math.abs(accounting.unformat($("#pro_peso").val())-accounting.unformat($("#pro_pesodeseado").val()));
  }else{
    var noMesEtapa1  = accounting.unformat($("#numMesE1").text());
    var noMesEtapa2  = accounting.unformat($("#numMesE2").text());
    noMesEtapa1 = 3*(noMesEtapa1*4);
    noMesEtapa2 = 2*(noMesEtapa2*4);
    noMesEtapa3 = 1*4;
    var duracionSesiones = noMesEtapa1+noMesEtapa2+noMesEtapa3;
    var kilosAPerder     = accounting.unformat($("#pro_kilosperder_etapa").val());
  }
  // console.log(kilosAPerder);
  // return false;

  // Tomar numero de meses
  var noMesEtapa1      = accounting.unformat($("#numMesE1").text());
  var noMesEtapa2      = accounting.unformat($("#numMesE2").text());
  //Imp. 14/05/20
  $("#idsHrsAgredados").val(arrIdHorariosClieAgregados.join());

  // Segun el tipo de pago obtener el monto del pago inicial
  // Imp. 25/05/20
  if(tipoPagoId==0 || tipoPagoId==2 || tipoPagoId==4){
    $("#montoPagoInicial").val( accounting.unformat($("#pro_condpago_total").val()) );
    // if(tratamientoId==2){
    //   $("#montoPagoInicial").val( accounting.unformat(sumPagosEtapas()) );
    //   // console.log("obtener pagos tipo 0-2-4:");
    // }else{
    //   $("#montoPagoInicial").val( accounting.unformat($("#pro_condpago_total").val()) );
    // }
  }
  if(tipoPagoId==1){
    if(tratamientoId==2){
      $("#montoPagoInicial").val( accounting.unformat(sumPagosEtapas()) );
      // console.log("obtener pagos tipo 1:");
    }else{
      $("#montoPagoInicial").val( accounting.unformat($("#pro_planpago_pagoinicial").val()) );
    }
  }
  if(tipoPagoId==3){
    if(tratamientoId==2){
      $("#montoPagoInicial").val( accounting.unformat(sumPagosEtapas()) );
      // console.log("obtener pagos tipo 3:");
    }else{
      $("#montoPagoInicial").val( accounting.unformat($("#pro_porsesion_total").val()) );
    }
  }

  // console.log($("#montoPagoInicial").val());
  // console.log(tratamientoId);
  // console.log(tipoPagoId);
  // return false;

  //Salvar No. Pagos
  //Imp. 17/06/20
  var periodoTmp = accounting.unformat( periodo );
  var numPagosPeriodo = 0;
  if(periodoTmp>0){
    if(periodoTmp==4){
      numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_dia").val() );
    }
    if(periodoTmp==1){
      numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_semana").val() );
    }
    if(periodoTmp==2){
      numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_quincena").val() );
    }
    if(periodoTmp==3){
      numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_mes").val() );
    }
  }
  // console.log(periodoTmp);
  // console.log(numPagosPeriodo);
  // return false;

  var params = {idMotivo:id_motivopro, comentario:comentario, correoUsuario:correoUsuario, //Datos motivo y generar resumen
                idParamPro:idParamPro, prospectoId:prospectoId, expClienteId:expClienteId, expTratamientoId:expTratamientoId, tratamientoId:tratamientoId,
                duracionSesiones:duracionSesiones, finalSesiones:finalSesiones, sesionesXSemT1:sesionesXSemT1, sesionesXSemT2:sesionesXSemT2,
                tipoPagoId:tipoPagoId, descuento:descuento, periodo:periodo, mesesSinInt:mesesSinInt,
                vendasFrias:vendasFrias, vibroterapia:vibroterapia, cavitacion:cavitacion, radiofrecuencia:radiofrecuencia,
                vacumterapia:vacumterapia, gimnasiaPasiva:gimnasiaPasiva, presoterapia:presoterapia, laserLipolitico:laserLipolitico,
                kilosAPerder:kilosAPerder, noMesEtapa1:noMesEtapa1, noMesEtapa2:noMesEtapa2, urlContrato:urlContrato,
                numPagosPeriodo:numPagosPeriodo
              };
  // console.log(params);
  // return false;
  params = paramsB64(params);
  params['zonasTrabajar'] = zonasTrabajar;
  params['funct'] = 'salvarParamsPropuesta';
  // console.log(params);
  ajaxData(params, function(datosResp){
    // console.log(datosResp);
    $('.modal').modal("close");
    hideLoading2("btn_generarContrato");

    if(datosResp.success==true){
      $(".overlayLoading").show();
      $("#idParamPro").val(datosResp.idParamPropuesta);
      obtTodosDatosProspecto(); //Salvar todos los datos en json

      console.log("Propuesta de contrato salvado correctamente");
      alertify.success("Procesando expediente, espere por favor...");

      setTimeout(function(){
        var url = window.location.href;
        var arrParams = submitNameAbase64("#formGenerarContrato");
        // console.log(arrParams);
        postDinamico(url, arrParams, "");
      }, 2000);
    }else{
      alertify.error("No se ha podido generar el contrato, intentar m&aacute;s tarde.");
      $("#btn_guardar_propuesta").show();
      $("#btn_salvar_genera_contrato").show();
    }
  });
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>
function obtBloquesHorariosPorDia(){
  arrIdHorariosClieAgregados = [];
  $("#cont_reservas_horas").html("");
  var html='';
  // showLoading("btnAceptarSoliAut");
  // JAIR 17/06/2020 Mandar el id de la sucursal del usuario
  var params = {funct:"obtBloquesHorariosPorDia", "sucursalIdCreador": $("#sucursalIdCreador").val()};
  // params = paramsB64(params);
  // params['funct'] = 'obtBloquesHorariosPorDia';
  // console.log(params);

  ajaxData(params, function(datosResp){
    // console.log(datosResp);
    $(".cont_gc_paso_1").hide();
    $(".cont_gc_paso_2").show();
    hideLoading2("btn_continuarContrato1");

    if(datosResp.success==true){
      var arrBloquesPorDia = datosResp.arrBloquesPorDia;
      $.each(arrBloquesPorDia, function(i,v) {
        var arrBloquesHoras = v.arrBloquesHoras;
        html += '<div class="cont_block_dia">';
          html += '<div><label>'+v.dia+'</label></div>';
          // Recorre rangos de horas por dias de la semana
          $.each(arrBloquesHoras, function(ii,vv) {
            var arrFila = vv.split("||");
            // var ocupado = (arrFila[2]==1) ?" btn-ocupado " :" btn-disponible ";
            var ocupado = (arrFila[2]==1) ?" disabled " :" active ";
            var onclick = (arrFila[2]==0) ?' onclick="agregarHorarioDia(this)" ' :'';
            // var claseReservarHorario = (ocupadoTmp==1) ?" " :" reservarHorario "; //Si ya esta ocupado ya no se podra utilizar el horario

            html +='<span class="cont_btn_hora"><button type="button" class="btn btn-sm '+ocupado+'" datos="'+arrFila[1]+'" diaNum="'+v.diaNum+'"  '+onclick+'>'+arrFila[0]+'</button></span>';
          });
          // html +='<span class="cont_btn_hora"><button type="button" class="btn btn-sm '+claseReservarHorario +ocupado+' " id="idHora_'+v.asesorId+'_'+v.dia+'_'+strHoraInicio+'_'+strHoraFin+'" datos="'+horaInicio+'|'+horaFin+'" >'+v.arrBloquesHoras[index]+' - '+v.arrBloquesHoras[index+1]+'</button></span>';
        html += '</div>';
      });
    }else{
      html +='<span>No fue posible cargar la reserva de horas por d&iacute;as de la semana.</span>';
    }
    $("#cont_reservas_horas").html(html);
    html="";
  });
}

// agrega bloque de horario por dia
function agregarHorarioDia(target){
  // Imp. 30/06/20
  //Permitir seleccionar unicamente el numero escogido en los dias a dedicar segun tratamiento
  var totalBlockPerm = 0;
  if(tipoTratamiento==1){ totalBlockPerm = accounting.unformat($("#pro_sesionsemana_cont").val());
  }else{ totalBlockPerm = accounting.unformat($("#dp_diasdedicar").val()); }
  // console.log(totalBlockPerm);
  // console.log(arrIdHorariosClieAgregados);
  // return false;

  if(arrIdHorariosClieAgregados.length < totalBlockPerm){
  }else{
    alertify.error("El n&uacute;mero permitido de bloques a seleccionar es "+ totalBlockPerm);
    return false;
  }


  var msg = "Est&aacute; seguro de agregar este horario.";

  alertify.confirm("<strong>"+msg+ "?</strong>", function(){
    let idProspecto = $("#idProspecto").val();
    let diaNum    = $(target).attr("diaNum");
    let rangoHora = $(target).attr("datos");
    // console.log(diaNum);
    // console.log(rangoHora);
    
    //jair 17/6/2020 sucursal id
    var sucursalId = $("#sucursalIdCreador").val();

    var params = {funct:"agregarHorarioPorDia", idProspecto:idProspecto, diaNum:diaNum, rangoHora:rangoHora, "sucursalId": sucursalId};
    // console.log(params);

    ajaxData(params, function(data){
      if(data.success==true){
        $(target).addClass("disabled");
        arrIdHorariosClieAgregados.push(data.idHorarioCliente);
        alertify.success("El horario se ha reservado.");
      }else{
        alertify.error("No se ha podido reservar el horario, intentar m&aacute;s tarde.");
      }
    });
  },function(){
  }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Salva y actualiza el horario para terauta
function guardarHorario(dia, arr){
  // console.log(arr);
  let idUsuario = $("#idUsuario").val();
  $.each(arr, function(i,v) {
    if(typeof v !== 'undefined'){
      console.log(v[0] +" - "+v[1]);
      let params = {funct: 'GuardarHorarioAgenda', usuarioId:idUsuario, dia:dia, horaInicio:v[0], horaFin:v[1]};
      ajaxData(params, function(data){
        console.log(data);
        if(data.success==true){
          // alertify.success("Horario guardado");
        }
      });
    }
  });
}

function obtenerHorario(idUsuario, dia, response){
  let params = {funct: 'obtenerHorarioAgenda', usuarioId:idUsuario, dia:dia};
  ajaxData(params, function(data){
    // console.log(data);
    if(data.success==true){
      response(data.horarios);
    }else{
      response([]);
    }
  });
}

// >>>>Imp. 15/10/20
// continuar los pasos generar contrato perdida de peso acelerado
function continuarContratoPAcelerado(ctr){
  var validator = $("#formGenerarContrato").validate({ });

  if($("#formGenerarContrato2").valid()){
    $('#cf_nombre2PA').val($('#cf_nombre2').val())
    $('#cf_parentesco2PA').val($('#cf_parentesco2').val())
    $('#cf_telefono2PA').val($('#cf_telefono2').val())
    $('#cf_fotosrostro2PA').val($('#cf_fotosrostro2').val())

    showLoading("btn_continuarContrato1");
    salvarPagoPorEtapas();
  }else{
    validator.focusInvalid();
    return false;
  }
}

// >>>>Imp. 15/10/20
//>>>>Mostrar popup para pagos por etapas
function popupPagoPorEtapas(){
  // Imp. 05/08/20
  //Revisar si el tratamiento es perdida de peso acelerado
  let tratamientoId    = accounting.unformat($("#idTipoTratamiento").val());
  if(tratamientoId==2){
    if(sumPagosEtapas() <= 0){
      alertify.error("Debe seleccionar al menos una etapa.");
      return false;
    }

    //Mostrar popup
    reseteaFormulario('formGenerarContrato2');
    $('#modalGenerarContratoPAcelerado').modal('open');
    $('#cf_nombre2').addClass("required");
    $('#cf_parentesco2').addClass("required");
    $('#cf_telefono2').addClass("required");
  }
}

// >>>>Imp. 06/08/20
//>>>>Salvar logica para pagos por etapas
function salvarPagoPorEtapas(){
  // Imp. 05/08/20
  //Revisar si el tratamiento es perdida de peso acelerado
  let tratamientoId    = accounting.unformat($("#idTipoTratamiento").val());
  if(tratamientoId==2){
    if(sumPagosEtapas() <= 0){
      alertify.error("Debe seleccionar al menos una etapa.");
      return false;
    }
  }

  //Imp. 30/07/20
  //Si el pago es plan de pagos entonces verificar
  var tipoPago = accounting.unformat($("#pro_condpago").val());
  if(tipoPago==1){
    let pp_ctr_pagoparcial = accounting.unformat( $("#pp_ctr_pagoparcial").val() ); //obt. control de pagos parciales
    // 05/08/20
    //obt. total de pagos parciales
    let pro_condpago_total = accounting.unformat($("#pro_condpago_total").val());
    let pro_planpago_pagoinicial = accounting.unformat($("#pro_planpago_pagoinicial").val());
    let pagosParcialesTmp = sumPagosParciales()+pro_planpago_pagoinicial;
    let checkPagosParciales = (pro_condpago_total==pagosParcialesTmp)?true:false;
    // console.log(pagosParcialesTmp);
    // console.log(checkPagosParciales);
    // return false;

    if(pp_ctr_pagoparcial==0 || checkPagosParciales==false){
      alertify.error("Debe de configurar los pagos parciales, presionar sobre el bot&oacute;n (+) para agregar bloque.");
      return false;
    }

    $.validator.setDefaults({ignore:[]});
    var validator = $("#formProspecto").validate({ errorClass: "invalid form-error", errorElement: 'div', errorPlacement: function(error, element) {error.appendTo(element.parent());} });

    //Validar formulario
    if($("#formProspecto").valid()){
      console.log("continuar");
    }else{
      return false;
    }
  }


  //total de sesiones
  let totalSesiones = checkSesionesPDA();
  $("#hidd_total_sesiones").val(totalSesiones);
  // console.log(totalSesiones);

  //Validar formulario
  // if($("#formProspecto").valid()){
  //   console.log("continuar");
  // }else{
  //   return false;
  // }

  var url = window.location.href;
  var arrParams = submitNameAbase64("#formProspecto");
  // console.log(arrParams);
  postDinamico(url, arrParams, "");
}



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>






// Metodo para salvar el proceso de los taps (datos proceso, descripcion)
function salvarProceso(){
  $.validator.setDefaults({
    ignore: []
  });

  var validator = $("#formProspecto").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
  tinymce.triggerSave();

  estatus = "";
    estatusDet = $('input:radio[name=dp_estatus]:checked').val();
    estatusSelect = $('#dp_estatus').val();
    if(typeof(estatusDet) === 'undefined'){
      estatus = estatusSelect; 
    }else if( typeof(estatusSelect) === 'undefined'){
      estatus = estatusDet;
    }

    //console.log(estatus);
    //Jair 11/Ago/2020 Si el estatus es 4, abrir modal
    if(estatus == 4 || estatus == 6){
      $("#estatusId").val(estatus);
      $('#modalMotivoDescartar').modal('open');
    }
    else{
      //Validar formulario
      if($("#formProspecto").valid()){
        //Validar que tenga algo la descripcion 
        /*var dp_descripcion = $("#dp_descripcion").val();
        if(dp_descripcion==""){
          alertify.error("Por favor llene la descripci&oacute;n");
          return false;  
        }*/
    
        
          var url = window.location.href; 
          var arrParams = submitNameAbase64("#formProspecto");
          // console.log(arrParams);
          postDinamico(url, arrParams, "");
      
      }else{
        alertify.warning("No se han llenado todos los campos requeridos, revisar todos los tabs");
        validator.focusInvalid();
        return false;
      }
    }
}

function salvarContactoTemprano(){
  $.validator.setDefaults({
    ignore: []
  });

  var validator = $("#formProspectoTemp").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
  tinymce.triggerSave();

  estatus = "";
  estatusDet = $('input:radio[name=dp_estatus]:checked').val();
  estatusSelect = $('#dp_estatus').val();
  console.log(estatusDet+" - "+estatusSelect);
  if(typeof(estatusDet) === 'undefined'){
  //   console.log("if");
    estatus = estatusSelect; 
  }else{
  //   console.log("else");
    estatus = estatusDet;
  }

  console.log(estatus);
  if(estatus == 2){
    $("#estatusId").val(estatus);
    $('#modalMotivoDescartar').modal('open');
  }else if(estatus == 3){
    if($("#formProspectoTemp").valid()){
      //Validar que tenga algo la descripcion   
      var url = window.location.href; 
      var arrParams = submitNameAbase64("#formProspectoTemp");
      // console.log(arrParams);
      postDinamico(url, arrParams, "");
      return true;
    }
    else{
      validator.focusInvalid();
      return false;
    }
  }else if(estatus == 1){
    if($("#formProspectoTemp").valid()){
      //Validar que tenga algo la descripcion   
      var url = window.location.href; 
      var arrParams = submitNameAbase64("#formProspectoTemp");
      // console.log(arrParams);
      postDinamico(url, arrParams, "");
      return true;
    }else{
      validator.focusInvalid();
      return false;
    }
  }else{
    validator.focusInvalid();
    return false;
  }
  
}

function guardarMotivoDescartar(){
  //Agregar motivo
  $.validator.setDefaults({ignore:[]});

  var validator = $("#formMotivoDescartar").validate({
      errorClass: "invalid form-error",
      errorElement: 'div',
      errorPlacement: function(error, element) {
        error.appendTo(element.parent());
      }
  });

  //Validar formulario
  if($("#formMotivoDescartar").valid()){
    showLoading("btnGuardarDescarte");

    //Datos motivo y generar resumen
    var idProspecto = $("#idProspecto").val();
    var comentario = $("#dp_motivo_descartar").val();
    var estatus = $("#estatusId").val();

    var params = {
      funct: 'guardarMotivoDescarte',
      //Obtener el id de la cotizacion actual o si no el id de la orden
      idProspecto: idProspecto, 
      comentario: comentario,
      estatus: estatus
    };
    // console.log(params);
    ajaxData(params, function(data){
       console.log(data);
      $('.modal').modal("close");
      hideLoading2("btnGuardarDescarte");

      if(data.success==true){
        alertify.success("Se ha descartado correctamente");
        if(estatus != 4 && estatus != 6){
          setTimeout(function(){
            location.href="contactoTem.php";
          }, 2000);
        }else{
          location.reload();
        }
      }else{
        // cerrarModal();
        alertify.error("No se ha podido guardar la informaci&oacute;n, intentar m&aacute;s tarde.");
      }
    });
  }else{
    validator.focusInvalid();
    return false;
  }
}

// >>>>>>>>>>
// Validar al de cliente
// Metodo para salvar el expediente del cliente
function salvarExpCliente(){
console.log("entre a salvar");  
  $.validator.setDefaults({
    ignore: []
  });
  
  //$('#btn_salvar_expcliente').prop( "disabled", true );

  var validator = $("#formExpcliente").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
  tinymce.triggerSave();
    
  //guardarCanvas();
  //Validar formulario
  if($("#formExpcliente").valid()){
console.log("Es valida voy a salvar");    
    var url = window.location.href;

    //obtener valores multiples
    /*$("#dp_enfermedades_hid").val($('#dp_enfermedades').val().join());
    $("#dp_alergias_hid").val($('#dp_alergias').val().join());
    $("#dp_medicamentos_hid").val($('#dp_medicamentos').val().join());
    $("#dp_cirugias_hid").val($('#dp_cirugias').val().join());
    //Metodos
    $("#ddp_metodos_hid_1").val($('#dp_metodos_1').val().join());
    $("#dp_ids_opciones").val($('#dp_subopciones').val().join());*/
    
    // Mandar post
    var arrParams = submitNameAbase64("#formExpcliente");
    // console.log(arrParams);
    postDinamico(url, arrParams, "");

    /*//Validar que tenga algo la descripcion 
    var dp_descripcion = $("#dp_descripcion").val();
    if(dp_descripcion==""){
      alertify.error("Por favor llene la descripci&oacute;n");
      return false;  
    }
  
    var url = window.location.href; 
    var arrParams = submitNameAbase64("#formProspecto");
    // console.log(arrParams);
    postDinamico(url, arrParams, "");*/
  }else{
    validator.focusInvalid();
    return false;
  }
}

function salvarEncuestaExpCliente(){
  $.validator.setDefaults({
    ignore: []
  });

  var validator = $("#formEncuestaExpSes").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
  tinymce.triggerSave();

  //Validar formulario
  if($("#formEncuestaExpSes").valid()){
    var url = window.location.href;
    // Mandar post
    var arrParams = submitNameAbase64("#formEncuestaExpSes");
    // console.log(arrParams);
    postDinamico(url, arrParams, "");

  }else{
    validator.focusInvalid();
    return false;
  }
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>METODOS ESPECIFICOS FUERA DEl $(document).ready<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


//Metodo para subir documento
function subirDocumento(){
  var dp_idProceso = accounting.unformat($("#dp_idProceso").val());
  var usuarioIdCreador = $("#usuarioIdCreador").val(); 

  if(dp_idProceso>0){
    var validator = $("#formSubirDocumento").validate({ });
    //Validar formulario
    if($("#formSubirDocumento").valid()){
      showLoading("btn_subirdocumento");

      var datosForm = $("#formSubirDocumento").serializeJSON(); //obtener los datos          

      var sd_idDoc = accounting.unformat($("#sd_idDoc").val());
      // console.log(sd_idDoc);
      
      //>>Subir doc en caso de existir      
      var file1 = $('input#sd_archivo')[0].files[0];
      var urlUplImg = '../uploadfiles.php?funct=uploadGeneralImages';
      // console.log(file1);

      //Edicion
      if(sd_idDoc>0){
         if(typeof file1 !== 'undefined'){  //actualiza nueva imagen
            var data = new FormData();
            data.append('file', file1);
            data.append('saveFolder', "upload/documentos/");
            ajaxDataPost(urlUplImg, data, function(dataResp){
              // $('#modalSubirDocumento').modal('hide');
              console.log(dataResp);
              //Actualizar la tabla correcta
              if(dataResp.resp==true){              
                //Salvar documento en la tabla                
                var params = {urlArchivo:dataResp.ruta, clave:datosForm.sd_clave, nombre:datosForm.sd_nombre, idProceso:dp_idProceso, idCreador:usuarioIdCreador, idDoc:sd_idDoc};
                // console.log(params);
                var params = paramsB64(params);
                params['funct'] = 'editarDocumento';
                console.log(params);

                ajaxData(params, function(dataDoc){
                  hideLoading2("btn_subirdocumento");

                  $('#modalSubirDocumento').modal('hide');
                  console.log(dataDoc);
                  if(dataDoc.success==true){
                    documentos.refresh(); 
                    documentos.commit();
                    alertify.success("El archivo se actualizo correctamente, intentar nuevamente.");
                  }else{                    
                    alertify.error("Los datos del archivo no se actualizar&oacute;n, intentar m&aacute;s tarde.");                    
                  }
                });
              }else{
                alertify.error("El archivo no se actualizo correctamente, intentar nuevamente.");
                hideLoading2("btn_subirdocumento");
              }
            });  
         }else{ //Actualiza solo datos
            //Salva solo los datos 
            var params = {urlArchivo:$("#sd_rutaarchivo").val(), clave:datosForm.sd_clave, nombre:datosForm.sd_nombre, idProceso:dp_idProceso, idCreador:usuarioIdCreador, idDoc:sd_idDoc};
            // console.log(params);
            var params = paramsB64(params);
            params['funct'] = 'editarDocumento';
            // console.log(params);
            ajaxData(params, function(dataDoc){
                hideLoading2("btn_subirdocumento");

                $('#modalSubirDocumento').modal('hide');
                console.log(dataDoc);                  
                if(dataDoc.success==true){
                  documentos.refresh(); 
                  documentos.commit();
                  alertify.success("Los datos del archivo se actualizar&oacute;n correctamente.");
                }else{
                  alertify.error("Los datos del archivo no se actualizar&oacute;n, intentar m&aacute;s tarde.");
                  hideLoading2("btn_subirdocumento");
                }
            });
         } 
      }else{ //Creacion
        if(typeof file1 !== 'undefined'){
          var data = new FormData();
          data.append('file', file1);
          data.append('saveFolder', "upload/documentos/");
          ajaxDataPost(urlUplImg, data, function(dataResp){
            $('#modalSubirDocumento').modal('hide');
            console.log(dataResp);
            //Actualizar la tabla correcta
            if(dataResp.resp==true){              
              //Salvar documento en la tabla                
              var params = {urlArchivo:dataResp.ruta, clave:datosForm.sd_clave, nombre:datosForm.sd_nombre, idProceso:dp_idProceso, idCreador:usuarioIdCreador};
              console.log(params);
              var params = paramsB64(params);
              params['funct'] = 'agregarDocumento'; 
              console.log(params);

              ajaxData(params, function(dataDoc){ 
                  hideLoading2("btn_subirdocumento"); 
                  
                  console.log(dataDoc);                  
                  if(dataDoc.success==true){
                    documentos.refresh(); 
                    documentos.commit();
                    alertify.success("Archivo subido correctamente");
                  }else{
                    alertify.error("Los datos del archivo no se guardaron correctamente, intentar m&aacute;s tarde");
                  }
              });
            }else{
              alertify.error("El archivo no se guardo correctamente, intentar nuevamente.");
              hideLoading2("btn_subirdocumento");
            }
          });      
        }
      }        
    }else{
      validator.focusInvalid();
      return false;
    }
  }else{
    alertify.error('Debe salvar primero los datos del tap "DATOS PROCESO"');
  }
}

//Metodo para subir diagrama
function subirDiagrama(){
  var dp_idProceso = accounting.unformat($("#dp_idProceso").val());
  var usuarioIdCreador = $("#usuarioIdCreador").val(); 

  if(dp_idProceso>0){
    var validator = $("#formSubirDiagrama").validate({ });
    //Validar formulario
    if($("#formSubirDiagrama").valid()){
      var datosForm = $("#formSubirDiagrama").serializeJSON(); //obtener los datos          

      //>>Subir imagen en caso de existir      
      var file1 = $('input#sdi_archivo')[0].files[0];
      var urlUplImg = '../uploadfiles.php?funct=uploadGeneralImages';
      // console.log(file1);

      if(typeof file1 !== 'undefined'){              
        var data = new FormData();
        data.append('file', file1);
        data.append('saveFolder', "upload/diagramas/");
        ajaxDataPost(urlUplImg, data, function(dataResp){
          $('#modalSubirDiagrama').modal('hide');
          console.log(dataResp);

          //Actualizar la tabla correcta
          if(dataResp.resp==true){
            //Salvar documento en la tabla
            var params = {urlArchivo:dataResp.ruta, idProceso:dp_idProceso, idCreador:usuarioIdCreador};
            // console.log(params);
            var params = paramsB64(params);
            params['funct'] = 'agregarDiagrama';
            // console.log(params);

            ajaxData(params, function(dataDoc){
                console.log(dataDoc);
                if(dataDoc.success==true){
                  alertify.success("Archivo subido correctamente");
                  $("#cont_diagrama").html('');
                  $("#cont_diagrama").html('<img src="'+dataResp.ruta+'" class="img_diagrama">');
                }else{
                  alertify.success("El archivo no se ha guardado correctamente, intentar m&aacute;s tarde");
                }
            });
          }else{
            alertify.error("El archivo no se guardo correctamente, intentar nuevamente.");
          }
        });      
      }
    }else{
      validator.focusInvalid();
      return false;
    }  
  }else{
    alertify.error('Debe salvar primero los datos del tap "DATOS PROCESO"');
  }  
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>METODOS GENERALES>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

$(document).ready(function(){
  //Inicio tabla de revisiones
  $(document).on("change", "#estatus_Revicion", function (e) {
    e.preventDefault();
    var estatus_Revicion = accounting.unformat($(this).val());
    if(estatus_Revicion==2){
      $("#cometario_revisiones").addClass("required");      
    }else{
      $("#cometario_revisiones").removeClass("required");
    }
  });
  
  //Fin tabla de revisiones 
});

function saveRevision(){
  var validator = $("#formRevisionesProceso").validate({});
  showLoading("btn_saverevision");

   if($("#formRevisionesProceso").valid()){
     var idProceso = $("#id_proceso_asociado").val();
     var comRevisiones = $("#cometario_revisiones").val();
     var estRevicion = $("#estatus_Revicion").val();
    var params = {
          funct: 'saveRevision',
          idProceso: idProceso,
          comRevisiones: comRevisiones,
          estRevicion: estRevicion
      };//Parametros ajax
     ajaxData(params, function(data){
       hideLoading2("btn_saverevision");
       console.log(data);
       if (data.success==true) {
          alertify.success("Se agreg&oacute; correctamente la revisi&oacute;n");
          $('#modalRevisiones').modal('hide');          
          
          // revisionesGrid.refresh();
          // revisionesGrid.commit(); 
          // $("#dp_estatus").val(data.estatusId);
          // $("#dp_estatus").change();

          setTimeout(function(){
            window.location.href = "procesos.php";
          }, 700);
       }else {
           alertify.error("No es posible agregar la revisi&oacute;n en este momento, intente m&aacute;s tarde");
           $('#modalRevisiones').modal('hide');
       }
     });
   }else{
      hideLoading2("btn_saverevision");
      validator.focusInvalid();
      return false;
   }
}


// Genera imagen de firma y la guarda
 /* function guardarCanvas() {
    imagen=document.getElementById("pizarra").toDataURL('image/png');
    $("#ds_firma").val(imagen);
    //console.log(imagen);

    var params = {
          funct: 'guardarImg',
          imagen: $("#ds_firma").val(),
          idC: $("#dp_idexpcliente").val(),
          idT: $("#dp_idexptratamiento").val(),
          idExpSesion: $("#idExpSesion").val()
      };//Parametros ajax
     ajaxData(params, function(data){
       console.log(data);
       console.log(data.firma);
       $(".imgFirma").show();
       $("#imgFirma").attr("src", "../firmas/"+data.firma)
       $(".canvasFirma").hide();
     })
  }*/


/*Termina script para canvas de firma*/

// Popup contestar encuesta
function popupContestarEncuesta(){
  reseteaFormulario('formEncuesta');
  $('#modalContestarEncuesta').modal('open');
}

function enviarEncuesta(){
  $('.modal').modal("close");
  showLoading("btn_enviarEncuesta");

}



/* JAIR 5/6/2020 */
function guardarTipoMetal(){
  var tipoMetal = $("#dp_tipometal").val();
  var params = {
    funct: 'guardarTipoMetal',
    tipoMetal: $("#dp_tipometal").val(),
    idProspecto: $("#idProspecto").val(),
  };
  var htmlOriginal = showLoading('btnGuardarDescarte');
  ajaxData(params, function(data){
    //console.log(data.success);
    hideLoading('btnGuardarDescarte', htmlOriginal);
    if(data.success){
      if(data.res > 0){
        alertify.success("Cambios guardados correctamente");
      }else{
        //alertify.warning("No hay cambios que guardar");
      }
    }
    $("#btnCerrarmodalTipoMetal").trigger("click");
    
    $(".idPartesCuerpo").removeClass("fondoGris");
    console.log("divPartesCuerpo"+tipoMetal);
    $("#divPartesCuerpo"+tipoMetal).addClass("fondoGris");

    if(tipoMetal == 5){
      $("#rowMsjBrazos").show();
    }else{
      $("#rowMsjBrazos").hide();
    }
  });
}

/* JAIR 10/6/2020 */
function quitarOtrosTran(cout){
  $("#divRow_"+cout).remove();
}



//calculo para las sesiones
function calcularAvance(){
  pInicial = $("#dt_peso_0").val();
  pActual = $("#ds_peso").val();
  imcInicial = $("#dt_imc_0").val();
  imcActual = $("#ds_imc").val();
  gvInicial = $("#dt_gv_0").val();
  gvActual = $("#ds_gv").val();
  grasaInicial = $("#dt_grasa_0").val();
  grasaActual = $("#ds_grasa").val();
  muscuInicial = $("#dt_musculo_0").val();
  muscuActual = $("#ds_musculo").val();

  braIzInicial = $("#dt_brazoiz_0").val();
  braIzActual = $("#ds_brazoizquierdo").val();
  braDeInicial = $("#dt_brazode_0").val();
  braDeActual = $("#ds_brazoderecho").val();
  bajoBuInicial = $("#dt_bajobusto").val();
  bajoBuActual = $("#ds_bajobusto").val();
  cinturaInicial = $("#dt_cintura").val();
  cinturaActual = $("#ds_cintura").val();
  abdomenInicial = $("#dt_abdomen").val();
  abdomenActual = $("#ds_abdomen").val();
  caderaInicial = $("#dt_cadera").val();
  caderaActual = $("#ds_cadera").val();
  gluteosInicial = $("#dt_gluteos").val();
  gluteosActual = $("#ds_gluteos").val();
  musloizInicial = $("#dt_musloiz").val();
  musloizActual = $("#ds_musloizquierdo").val();
  muslodeInicial = $("#dt_muslode").val();
  muslodeActual = $("#ds_musloderecho").val();

  pesoResult = (pActual != "") ? pActual - pInicial : 0 ;
  imcResult = (imcActual != "") ? imcActual - imcInicial : 0 ;
  gvResult = (gvActual != "") ? gvActual - gvInicial : 0 ;
  grasaResult = (grasaActual != "") ? grasaActual - grasaInicial : 0 ;
  muscuResult = (muscuActual != "") ? muscuActual - muscuInicial : 0 ;
  braizResult = (braIzActual != "") ? braIzActual - braIzInicial : 0 ;
  bradeResult = (braDeActual != "") ? braDeActual - braDeInicial : 0 ;
  bajoBuResult = (bajoBuActual != "") ? bajoBuActual - bajoBuInicial : 0 ;
  cinturaResult = (cinturaActual != "") ? cinturaActual - cinturaInicial : 0 ;
  abdomenResult = (abdomenActual != "") ? abdomenActual - abdomenInicial : 0 ;
  caderaResult = (caderaActual != "") ? caderaActual - caderaInicial : 0 ;
  gluteosResult = (gluteosActual != "") ? gluteosActual - gluteosInicial : 0 ;
  musloizResult = (musloizActual != "") ? musloizActual - musloizInicial : 0 ;
  muslodeResult = (muslodeActual != "") ? muslodeActual - muslodeInicial : 0 ;

  $("#dt_peso_result").val(pesoResult.toFixed(2));
  $("#dt_imc_result").val(imcResult.toFixed(2));
  $("#dt_gv_result").val(gvResult.toFixed(2));
  $("#dt_grasa_result").val(grasaResult.toFixed(2));
  $("#dt_musculo_result").val(muscuResult.toFixed(2));
  $("#dt_brazoiz_result").val(braizResult.toFixed(2));
  $("#dt_brazode_result").val(bradeResult.toFixed(2));
  $("#dt_bbusto_result").val(bajoBuResult.toFixed(2));
  $("#dt_cintura_result").val(cinturaResult.toFixed(2));
  $("#dt_abdomen_result").val(abdomenResult.toFixed(2));
  $("#dt_cadera_result").val(caderaResult.toFixed(2));
  $("#dt_gluteos_result").val(gluteosResult.toFixed(2));
  $("#dt_musloiz_result").val(musloizResult.toFixed(2));
  $("#dt_muslode_result").val(muslodeResult.toFixed(2));

  sumatoriatcm();
}

function sumatoriatcm(){
   var sum = 0;
   $(".cmResult").each(function(){
       sum += + $(this).val();
   });
   //console.log(sum);
   $("#ds_tcm").val(sum.toFixed(2));
}



