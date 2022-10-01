/*
 * Date: 06/09/2019
 * Actualizado: 09/09/2019
 * Funciones generales y especificas de javascript
 */

var singarantiaEnf;
var singarantiaMed;
var singarantiaAle;
var crtSalvar = 0;

$(document).ready(function(){

  //para mostrar edad en la carga
  setEdad();

  var indice = ($("#hidd_proceso").val() == 0) ? 1 : $("#hidd_proceso").val();

  // Imp. 30/06/20
  // Solo aplica para el terapeuta
  var idRol = $("#idRol").val();
  // console.log(idRol);
  // console.log(indice);
  if(indice==4 && idRol==5){
    indice=3;
    $("#btn_salvar_prospecto").text("Aceptar");
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
    //Fecha del
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
    }

    //Jair 11/Ago/2020 Saber cuando se cambia de tab para mostrar/ocultar boton de guardar datos basicos
    if($(this).attr("id") == 'tab_list_1'){
      $("#btnActualiazarDatosBasicos").show();
    }else{
      $("#btnActualiazarDatosBasicos").hide();
    }
    
    // console.log($(this).attr("id"));
    $("#btn_salvar_proceso").show();
  });

  //ocultar boton submit (btn Aceptar)
  $('.ocultarBtnSubmit').on('click', function(e) {
    e.preventDefault();
    // console.log($(this).attr("id"));
    $("#cont_btn_salvar").hide();
    $("#cont_btns_propuesta").show();
  });

  // Salvar el prospecto
  $("#btn_salvar_prospecto").click(function(){
    salvarProspecto();
  });

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

  $("#dp_fototipos").change(function(){
    //console.log($(this).val());
    $("#dp_ids_fototipos").val($(this).val());
  });
  $("#dp_enfermedades").change(function(){
    //console.log($(this).val());
    $("#dp_ids_enfermedades").val($(this).val());

    //jair 16/6/2020 alertas
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
  $("#dp_alergias").change(function(){
    //console.log($(this).val());
    $("#dp_ids_alergias").val($(this).val());

    //jair 16/6/2020 alertas
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
    if($(this).val() != ""){
      $("#rowAlertFotosensibilidad").show();
    }else{
      $("#rowAlertFotosensibilidad").hide();
    }

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

    html += '<div class="row">';
      html += '<div class="col-md-4 text-right"><label>Lugar:</label></div>';
      html += '<div class="col-md-8"><input type="text" name="dp_lugar_'+cout+'" id="dp_lugar_'+cout+'" value="" class="form-control "></div>';
    html += '</div>';
    html += '<div class="row">';
      html += '<div class="col-md-12">';
        html += '<div class="col-md-4 text-right"><label>M&eacute;todos:</label></div>';
        html += '<div class="col-md-7 form-group">';
          html += '<select name="dp_metodos_'+cout+'" id="dp_metodos_'+cout+'" multiple class="selector">'
          //html += '<option value="" disabled selected>--Seleccionar--</option>'
          html += '</select> <input type="hidden" name="dp_ids_metodos_'+cout+'" id="dp_ids_metodos_'+cout+'" value="">';
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


    $(".cont_tratamiento").append(html);
    //console.log("entre agregar más tratamientos");
    $("#dp_tratamiento_total").val(cout);
  });


/*Script para mostrar y ocultar las divisiones de diagnostico */
  $("fieldset").hide();
  $("fieldset.1").show();

  $("div#1 a").addClass("active");
  $(".idPartesCuerpo").click(function(){
    var parte = $(this).attr("id");
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
    //console.log($(this).val());
  })


  //Mostrar si la edad es menos a 18
  $("#dp_edad").on("change", function(){
    var edad = accounting.unformat($(this).val());
    console.log(edad);

    $(".cont_padretutor").hide();
    $("#dp_padretutor").removeClass("required");
    if(edad < 18){
      $(".cont_padretutor").show();
      $("#dp_padretutor").addClass("required");
    }
  });

  // Opciones preguntas
  $('input[name=\"t2_pregunta1_opc\"]').click(function() {
    var v = accounting.unformat($(this).val());
    // console.log(v);

    // $(this).prop('checked', false);
    // $(this).removeAttr('checked');
    $("#cont_t2_pregunta1_text").hide();
    if(v==1){
      $("#cont_t2_pregunta1_text").show();
      // $(this).prop('checked', true);
    }else{
      $("#t2_pregunta1_text").val("");
    }
  });

  $('input[name=\"t2_pregunta2_opc\"]').click(function() {
    var v = accounting.unformat($(this).val());
    // console.log(v);

    $("#cont_t2_pregunta2_text").hide();
    if(v==1){
      $("#cont_t2_pregunta2_text").show();
    }else{
      $("#t2_pregunta2_text").val("");
    }
  });

  $('input[name=\"t2_pregunta4_opc\"]').click(function() {
    var v = accounting.unformat($(this).val());
    // console.log(v);

    $("#cont_t2_pregunta4_text").hide();
    if(v==1){
      $("#cont_t2_pregunta4_text").show();
    }else{
      $("#t2_pregunta4_text").val("");
    }
  });

  $('input[name=\"t2_pregunta5_opc\"]').click(function() {
    var v = accounting.unformat($(this).val());
    // console.log(v);

    $("#cont_t2_pregunta5_text").hide();
    if(v==1){
      $("#cont_t2_pregunta5_text").show();
    }else{
      $("#t2_pregunta5_text").val("");
    }
  });

   $('input[name=\"t2_pregunta7_opc\"]').click(function() {
    var v = accounting.unformat($(this).val());
    // console.log(v);

    $("#cont_t2_pregunta7_text").hide();
    if(v==1){
      $("#cont_t2_pregunta7_text").show();
    }else{
      $("#t2_pregunta7_text").val("");
    }
  });
  // Fin opciones preguntas


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


  /*$("#nuevaSesion").click(function(){
    $("#formularioSesiont2").toggleClass('ocultar');
    $("#btn_salvar_expclientet2").toggleClass('ocultar');
    $("#gridSesiones").toggleClass('ocultar');

    $("#regresar").hide();
    $("#regresarSesion").show();
    $("#btnRest").hide();
  });*/

  $("#formExpclientet2").change(function(){
    if (crtSalvar == 0 && $("#idExpSesion").val() == 0){
      var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarSesionest2';
      var formElement = document.getElementById("formExpclientet2");
      var data = new FormData(formElement);
      ajaxDataImg(urlDel, data, function(data){
        console.log(data);
        if(data.firma != "" && data.firma != "{\"lines\":[]}"){
          $("#btnRest").show();
        }

        if(data.success){
          $("#idExpSesion").val(data.idSesion);
          $('.mensaje_ok').toggle(2000, function() {
            $('.mensaje_ok').hide();
          });
        }else{
          setInterval($(".mensaje_error").show("slow"), 2000);
        }
      });
    }else if(crtSalvar == 0 && $("#idExpSesion").val() > 0){
      var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarSesionest2';
      var formElement = document.getElementById("formExpclientet2");
      var data = new FormData(formElement);
      ajaxDataImg(urlDel, data, function(data){
        console.log(data);
        if(data.firma != "" && data.firma != "{\"lines\":[]}"){
          $("#btnRest").show();
        }

        if(data.success){
          $("#idExpSesion").val(data.idSesion);
          $('.mensaje_ok').toggle(2000, function() {
            $('.mensaje_ok').hide();
          });
        }else{
          setInterval($(".mensaje_error").show("slow"), 2000);
        }
      });
    }else if(crtSalvar > 0 && $("#idExpSesion").val() > 0){
      var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarSesionest2';
      var formElement = document.getElementById("formExpclientet2");
      var data = new FormData(formElement);
      ajaxDataImg(urlDel, data, function(data){
        console.log(data);
        if(data.firma != "" && data.firma != "{\"lines\":[]}"){
          $("#btnRest").show();
        }

        if(data.success){
          $("#idExpSesion").val(data.idSesion);
          $('.mensaje_ok').toggle(2000, function() {
            $('.mensaje_ok').hide();
          });
        }else{
          setInterval($(".mensaje_error").show("slow"), 2000);
        }
      });
    }
  });

  // Salvar el expediente del cliente
  $("#btn_salvar_expclientet2").click(function(){
    salvarExpClientet2();
  });



  // Salvar Encuesta del cliente
  $("#btn_salvar_encuesta").click(function(){
    salvarEncuestaExpClienteT2();
  });

  /*$("#canvasFirma").show();
  $("#redrawSignature").hide();*/


  //Resetear firma
  $("#resetFirma").click(function(){
    if($("#ds_firma").val() != "{\"lines\":[]}"){
      $('#canvasFirma').signature('clear'); 
    }

    $("#canvasFirma").show();
    $("#redrawSignature").hide();
  });

}); //Cierre de $(document).ready

// >>>>>>>>>>
// Validar al de cliente
// Metodo para salvar el expediente del cliente
function salvarExpClientet2(){
  $.validator.setDefaults({
    ignore: []
  });

  var validator = $("#formExpclientet2").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
  tinymce.triggerSave();
  //guardarCanvas();
  //Validar formulario
  if($("#formExpclientet2").valid()){
    var firma = $("#ds_firma").val();
    if(firma === "{\"lines\":[]}"){
      return false;
    }else{

      var url = window.location.href;

      //obtener valores multiples
      //$("#dp_enfermedades_hid").val($('#dp_enfermedades').val().join());
      //$("#dp_alergias_hid").val($('#dp_alergias').val().join());
      //$("#dp_medicamentos_hid").val($('#dp_medicamentos').val().join());
      //$("#dp_cirugias_hid").val($('#dp_cirugias').val().join());
      //Metodos
      //$("#ddp_metodos_hid_1").val($('#dp_metodos_1').val().join());

      // Mandar post
      var arrParams = submitNameAbase64("#formExpclientet2");
      // console.log(arrParams);
      postDinamico(url, arrParams, "");
    }
  }else{
    validator.focusInvalid();
    return false;
  }
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
      console.log(data.infoSesion);
      datos = data.infoSesion['datosJson'];
      //console.log(data.infoSesion['datosJson']);
      infoTotal = JSON.parse(data.infoSesion['datosJson']);
      arrPotencia = infoTotal["potencia"];
      arrPulsos = infoTotal["pulsos"];
      arrPmanipulo = infoTotal["pmanipulo"];
      //console.log(arrPotencia);
      //console.log(arrPulsos);
      //console.log(arrPmanipulo);
      
      //Setear datos en la tabla para potencia
      $.each(arrPotencia, function (ind, elem) { 
        $("#"+ind).val(elem);
        if(data.infoSesion['estatus'] == 1){
          $("#"+ind).attr("readonly", "readonly");
        }
      }); 

      //Setear datos en la tabla para pulsos pulsos
      $.each(arrPulsos, function (ind, elem) { 
        $("#"+ind).val(elem);
        if(data.infoSesion['estatus'] == 1){
          $("#"+ind).attr("readonly", "readonly");
        }
      }); 
      
      //Setear datos en la tabla para pulsos manipulo
      $.each(arrPmanipulo, function (ind, elem) { 
        $("#"+ind).val(elem);
        if(data.infoSesion['estatus'] == 1){
          $("#"+ind).attr("readonly", "readonly");
        }
      }); 

      calificacion = JSON.parse(data.infoSesion['calificacion']);
      datosJson = JSON.parse(data.infoSesion['datosJson']);
      $("#idExpSesion").val(data.infoSesion['idExpSesion']);
      $("#ds_sesion").val(data.infoSesion['noSesion']);
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


      $("#btnRest").show();
      $("#ds_fechacita").val(data.fechaM);
      $("#ds_observaciones").val(data.infoSesion['observaciones']);
      if(data.infoSesion['estatus'] == 1){
        $("#ds_observaciones").attr("readonly", "readonly");
        $("#btn_salvar_expclientet2").hide();
        $("#btnRest").hide();
      }
      $('input:radio[name="ds_atencion"][value='+calificacion['ds_atencion']+']').attr('checked', 'checked');
      $('input:radio[name="ds_actitud"][value='+calificacion['ds_actitud']+']').attr('checked', 'checked');
      $('input:radio[name="ds_limpieza"][value='+calificacion['ds_limpieza']+']').attr('checked', 'checked');
        
      $("#formularioSesiont2").toggleClass('ocultar');
      $("#btn_salvar_expclientet2").toggleClass('ocultar');
      $("#gridSesiones").toggleClass('ocultar');
      $("#regresar").hide();
      $("#regresarSesion").show();
    });
  }
}*/

function registroCatalogo(tipo, id){
  //console.log(tipo);
  //console.log(id);
  switch(tipo) {
    case 'enfermedades':
      $("#tituloRegFancyEnfermedades").html("Registrar Enfermedad");
    break;
    case 'alergia':
      $("#tituloRegFancyAlergias").html("Registrar Alergia");
    break;
    case 'medicamentos':
      $("#tituloRegFancyMedicamentos").html("Registrar Medicamentos");
    break;
    case 'cirugias':
      $("#tituloRegFancyCirugias").html("Registrar Cirugia");
    break;
  }

  if(tipo == 'enfermedades'){
    reseteaFormulario('formEnfermedad');
    $("#btnGuardarEnfermedad").show();
  }else if(tipo == 'alergia'){
    reseteaFormulario('formAlergia');
    $("#btnGuardarAlergia").show();
  }else if(tipo == 'medicamentos'){
    reseteaFormulario('formMedicamentos');
    $("#btnGuardarMedicamentos").show();
  }else if(tipo == 'cirugias'){
    reseteaFormulario('formCirugia');
    $("#btnGuardarCirugias").show();
  }
}

function guardarRegistro(tipo){
  $.validator.setDefaults({
    debug: true,
    success: "valid"
  });
  //console.log("Entre a guardar el registro de enfermedades");
  if(tipo == 1){
    if($("#formEnfermedad").valid()){
      var htmlOriginal = showLoading('btnGuardarEnfermedad');
      var params = {
        funct: 'salvarEnfermedad',
        enfermedad: $("#nombreEnfermedad").val(),
        accion: $('input[name=opciones]:checked').val(),
        activo: $('input[name=chck_activo]:checked').val(),
        fecha: $("#fechaRegistro").val()
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarEnfermedad',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.enfermedad)
          $("#dp_enfermedades").append(newOpt);
          $(".selector").formSelect();

        }
      });
    }
  }else if(tipo == 2){
    if($("#formAlergia").valid()){
      var htmlOriginal = showLoading('btnGuardarAlergia');
      var params = {
        funct: 'salvarAlergia',
        alergia: $("#nombreAlergia").val(),
        activo: $('input[name=chck_activo]:checked').val(),
        fecha: $("#fechaRegistro").val()
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarAlergia',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.alergia)
          $("#dp_alergias").append(newOpt);
          $(".selector").formSelect();

        }
      });
    }
  }else if(tipo == 3){
    if($("#formMedicamentos").valid()){
      var htmlOriginal = showLoading('btnGuardarMedicamentos');
      var params = {
        funct: 'salvarMedicamento',
        medicamento: $("#nombreMedicamento").val(),
        activo: $('input[name=chck_activo]:checked').val(),
        opciones: $('input[name=opciones]:checked').val(),
        fecha: $("#fechaRegistro").val()
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarMedicamentos',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.medicamento)
          $("#dp_medicamentos").append(newOpt);
          $(".selector").formSelect();

        }
      });
    }
  }else if(tipo == 4){
    if($("#formCirugia").valid()){
      var htmlOriginal = showLoading('btnGuardarCirugias');
      var params = {
        funct: 'salvarCirugia',
        cirugia: $("#nombreCirugia").val(),
        activo: $('input[name=chck_activo]:checked').val(),
        fecha: $("#fechaRegistro").val()
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarCirugias',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.cirugia)
          $("#dp_cirugias").append(newOpt);
          $(".selector").formSelect();

        }
      });
    }
  }
}

// >>>>>>
//>>>>>>>INICIO DE CONFIGURACION
//>>>>>>>Configuracion de la propuesta
// >>>>>>
var sexoGral = -1;
var costoZonas = 0;
$(function(){
  //initialize all modals
  $('.modal').modal({
      dismissible: false,
  });

  $("input[name=dp_sexo]").change(function(){
    tratRecFotodepilacion();
  });

  // Por cada cambio realizar la logica para obtener la propuesta
  $(".obtProp").change(function(){
    tratRecFotodepilacion();
  });

  // Seleccionar el tipo de pago
  $(".sel_tipopago").change(function(){
    setTipoPago();
  });

  // Cuando cambia el pediodo semana, quincenal
  $("#pro_planpago_periodo").change(function(){
    // setParcialPP();
    opcPeriodo();
  });

  // Por cada cambio realizar calculo para obtener el pago parcial
  $(".calPagoParcial").change(function(){
    // pagosPorOpcPlanPlagos();
    pagosPorOpcPlanPlagos2();
  });
});

function tratRecFotodepilacion(){
  var sexo = accounting.unformat($('input[name=dp_sexo]:checked').val());
  sexoGral = sexo;
  // console.log(sexoGral);

  // $("#pro_tratamiento").val("Fotodepilaci&oacute;n");

  if(sexoGral==0){
    $("#pro_duracion").val("10 sesiones");
    $("#pro_duracion_cont").val("10");
    $("#pro_final_cont").val( ($("#pro_final_cont").val() !="")?$("#pro_final_cont").val():10 );
  }
  if(sexoGral==1){
    $("#pro_duracion").val("12 sesiones");
    $("#pro_duracion_cont").val("12");
    $("#pro_final_cont").val( ($("#pro_final_cont").val() !="")?$("#pro_final_cont").val():12 );
  }

  // Obtener todas las zonas seleccionadas
  costoZonas = obtCostoTotalZonaDiag();
  console.log(costoZonas);

  // Setear costo
  $("#costoXsesion").val(costoZonas);

  var duracion = accounting.unformat($("#pro_duracion_cont").val());
  var costoXSesion = obtCostoTotalPorSesiones(duracion);
  // console.log(costoXSesion);
  $("#pro_costo").val(accounting.formatMoney(costoXSesion)); //Costo trat recomendado
  var costoXSesion = obtCostoTotalPorSesiones( accounting.unformat($("#pro_final_cont").val()) );
  $("#pro_presupuesto_cont").val(accounting.formatMoney(costoXSesion)); //Costo trat a contratar
  $(".cont_condiciones_pago").show();

  //Calcular descuento
  calculaTotalDescuento(0);
}


// Obt total de zonas
function obtCostoTotalZonaDiag(){
  var inputDiagIds = [];

  var precio = 0;
  $(".accZona").each(function(i,v){
    if($(v).is(':checked')){
      precio += accounting.unformat($(v).attr("precio"));
      // console.log(precio);

      //obtener el id del chequeado
      var id = $(v).attr("id");
      var label = $('label[for="' + id + '"]').html();
      label = label.replace(":", "");
      if(inputDiagIds.indexOf(label+"|"+id) == -1){
        inputDiagIds.push(label+"|"+id);
      }
    }
  });
  // console.log(precio);

  //Agregar las zonas seleccionadas
  // console.log(inputDiagIds);
  var zonaTrat = '';
  if(inputDiagIds.length>0){
    zonaTrat +='<div class="row">';
    $(inputDiagIds).each(function(i,v){
      if(typeof v !== 'undefined'){
        // console.log(v);
        var arrFila = v.split("|");
        var idDiag = "'"+ arrFila[1] +"'";
          zonaTrat +='<div class="col-md-4 checkbox">';
            zonaTrat +='<label><input type="checkbox" checked style="opacity:1;" name="zonaDiag_'+arrFila[1]+'" id="zonaDiag_'+arrFila[1]+'" class="zonaDiagnostico" onchange="zonaDiagnostico('+idDiag+')">'+arrFila[0]+'</label>';
          zonaTrat +='</div>';
      }
    });
    zonaTrat +='</div>';
  }
  $("#zonasActivasDiag").html(zonaTrat);

  return precio;
}

// Activar o desactivar zonas del diagnostico
function zonaDiagnostico(id){
  console.log(id);
  // $("#zonaDiag_"+id).prop('checked', false);
  // $("#zonaDiag_"+id).removeAttr("checked");
  $("#"+id).trigger("click");

  // if($(id).is(':checked')){
  //   console.log(1);
  // }else{
  //   console.log(0);
  // }
}


// Obtener costo total por sesiones
function obtCostoTotalPorSesiones(totalSesiones) {
  var costoZonas = obtCostoTotalZonaDiag();
  // console.log(costoZonas);

  //Costo total
  return totalSesiones*costoZonas;
}

//Conocer si la sesion a contratar es menor a la sesion recomendada
function obtDiffSesionesRecCont(){
  var opcSesiones = false;
  var duracionRec = accounting.unformat($("#pro_duracion_cont").val());
  var final_sesiones = accounting.unformat($("#pro_final_cont").val());

  if(final_sesiones<duracionRec){
    opcSesiones = true;

    if(final_sesiones==1){
      soloUnaSesion();
    }
  }

  return opcSesiones;
}

//>>>>>>>>>>>>>>>>
// Revisar el tipo de pago
function setTipoPago(){
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
        if(obtDiffSesionesRecCont()){
          $("#pro_condpago_desc").val(0);
        }else{
          $("#pro_condpago_desc").val(20);
        }
      break;
    case 2:
        $("#cont_plan_de_pagos").hide();
        $("#cont_por_sesion").hide();
        $("#cont_meses_sin_interes").show();
        if(obtDiffSesionesRecCont()){
          $("#pro_condpago_desc").val(0);
        }else{
          $("#pro_condpago_desc").val(10);
        }
      break;
    case 1:
        $("#cont_plan_de_pagos").show();
        $("#cont_por_sesion").hide();
        $("#cont_meses_sin_interes").hide();
        $("#pro_condpago_desc").val(0);
        // tiposPagoInicial(tipoPago);
      break;
    // case 3:
    //   $("#cont_plan_de_pagos").hide();
    //   $("#cont_por_sesion").show();
    //   $("#cont_meses_sin_interes").hide();
    //   // tiposPagoInicial(tipoPago);
    // break;
  }
  calculaTotalDescuento(0);
  tiposPagoInicial(tipoPago);
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
  // contado = 0,       %20
  // plan de pagos = 1, %0
  // MSI = 2,           %10

  if(ctr>0){
    let descMax = 0;
    if(tipoPago==0 || tipoPago==4){ descMax = 20; }
    if(tipoPago==1){ descMax = 0; }
    if(tipoPago==2){ descMax = 10; }
    // if(tipoPago==3){ descMax = 0; }

    if(pro_condpago_desc>descMax){
      alertify.confirm("<strong>Esta acci&oacute;n debe ser autorizada</strong>", function(){
        $("#opc_modal_motivopropuesta").val(1);
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

  var porDescuento = pro_condpago_desc/100; //Obt. el porcentaje

  // setear en campos del costo a pagar
  costoTotal = accounting.unformat($("#pro_presupuesto_cont").val());
  descuento = costoTotal*porDescuento;
  $("#pro_condpago_total").val(accounting.formatMoney(costoTotal-descuento));
  $("#hid_pro_condpago_desc").val($("#pro_condpago_desc").val());
  $("#pro_condpago_ahorro").val(accounting.formatMoney(costoTotal-(costoTotal-descuento)));

  // Imp.22/05/20
  // //Mostrar precio de lista por total zonas del cuerpo
  // preciosLista(obtTotalZonasSel());

  // setTipoPago(); //Hacer operaciones por el tipo de pago
  tiposPagoInicial(tipoPago);
}

function tiposPagoInicial(idPago){
  // Plan de pagos
  if(idPago==1){
    $("#cont_plan_de_pagos").show();
    calcularPlanDePagos();
  }

  // Meses sin intereses
  if(idPago==2){
    $("#cont_meses_sin_interes").show();

    // 12,000 - 18,000 3 MSI
    // 19,000 - 25,000 3 Y 6 MSI
    // 26,000 - 34,000 3 , 6 Y 9 MSI
    // 35,000 - …  3, 6, 9 Y 12 MSI

    $('#pro_msi_mes').val(1);
    $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
    $('#pro_msi_mes option[value="2"]').removeAttr('disabled');
    $('#pro_msi_mes option[value="3"]').removeAttr('disabled');
    $('#pro_msi_mes option[value="4"]').removeAttr('disabled');

    var totalConDescuento = accounting.unformat($("#pro_condpago_total").val()); //Tomado del que ya tiene un descuento
    console.log(totalConDescuento);

    if(totalConDescuento>0 && totalConDescuento<=18000){ //3 msi
      $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="2"]').attr('disabled','disabled')
      $('#pro_msi_mes option[value="3"]').attr('disabled','disabled')
      $('#pro_msi_mes option[value="4"]').attr('disabled','disabled')
    }
    if(totalConDescuento>18000 && totalConDescuento<=25000){ //3,6 msi
      $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="2"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="3"]').attr('disabled','disabled')
      $('#pro_msi_mes option[value="4"]').attr('disabled','disabled')
    }
    if(totalConDescuento>25000 && totalConDescuento<=34000){ //3,6,9 msi
      $('#pro_msi_mes option[value="1"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="2"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="3"]').removeAttr('disabled');
      $('#pro_msi_mes option[value="4"]').attr('disabled','disabled')
    }
    if(totalConDescuento>34000){ //3,6,9,12 msi
      //Aplica la configuracion inicial
    }

    // Imp. 03/07/20
    // Calcula la mensualidad
    calcularMensualidad();
  }
}

function calcularPlanDePagos(){
  /*setTimeout(function(){
    var finalSesiones = 0;
    var totalConDescuento = accounting.unformat($("#pro_condpago_total").val()); //Tomado del que ya tiene un descuento
    var descuento = accounting.unformat($("#pro_condpago_desc").val());
    // console.log("descuento: "+descuento);
    // console.log("totalConDescuento: "+totalConDescuento);
    var porDescuento = descuento/100;
    // var sesionesXSem = 3; //Siempre seran 3

    finalSesiones = accounting.unformat($("#pro_final_cont").val());
    var costoSesion = totalConDescuento/finalSesiones;
    console.log(costoSesion);

    var pagoInicial = totalConDescuento*0.3 //30% pago inicial

    // var sesionesRestantes = finalSesiones- Math.ceil(finalSesiones*porDescuento);
    // var semanasRestante = Math.ceil(sesionesRestantes/sesionesXSem);
    // var quincenasRestante = Math.ceil(sesionesRestantes/(sesionesXSem*2));
    // var mesesRestante = Math.ceil(sesionesRestantes/(sesionesXSem*4));
    // // console.log(Math.ceil(2.416666666666667));
    // var montoRestante = totalConDescuento-pagoInicial;
    // var parcialSemanal = montoRestante/semanasRestante;
    // var parcialQuincenal = montoRestante/quincenasRestante;
    // var parcialMensual = montoRestante/mesesRestante;


    var montoRestante = totalConDescuento-pagoInicial;
    var parcialSemanal = montoRestante/3; //3 pagos semanales
    var parcialQuincenal = montoRestante/2; //2 pagos quincenales
    // pago inicial
    $("#pro_planpago_pagoinicial").val(accounting.formatMoney(pagoInicial) );

    $("#pp_semanal").val(parcialSemanal);
    $("#pp_quincenal").val(parcialQuincenal);
    // $("#pp_mensual").val(parcialMensual);
    // Setear pagos restantes
    $("#ppres_semanal").val(3); //3 pagos semanales
    $("#ppres_quincenal").val(2); //2 pagos quincenales
    // $("#ppres_mensual").val(mesesRestante);
    setParcialPP();

    // console.log(pagoInicial);
    // console.log("sesionesXSem: "+sesionesXSem);
    // console.log(sesionesRestantes);
    // console.log("semanasRestante: "+semanasRestante);
    // console.log("quincenasRestante: "+quincenasRestante);
    // console.log("mesesRestante: "+mesesRestante);
    // console.log(montoRestante);
    // console.log(parcialSemanal);
    // console.log(parcialQuincenal);
    // console.log(parcialMensual);
  },500);*/

  // Imp. 18/06/20
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
  // $("#cont_meses").hide();
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
    // if(valPer==3){
    //   $("#cont_meses").show();
    //   var pro_planpago_periodo_mes = ($("#pro_planpago_periodo_mes").val()!="")?$("#pro_planpago_periodo_mes").val():"";
    //   $("#pro_planpago_periodo_mes").val(pro_planpago_periodo_mes);
    // }
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
  // if(periodo==3){
  //   periodoH = accounting.unformat( $("#pro_planpago_periodo_mes").val() );
  // }
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

  // Calcula pago restante
  checkPagoRestante();
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
    // case 3:
    //   $("#pro_planpago_parcial").val( accounting.formatMoney($("#pp_mensual").val()) );
    //   $("#pro_planpago_restantes").val( accounting.unformat($("#ppres_mensual").val()) );
    // break;
  }
}

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
  htmlElem += '           <input class="form-control inputfecha required" type="text" name="pp_fecha_'+ctr+'" id="pp_fecha_'+ctr+'" value="'+getCurrentDate(1)+'"  style="width:82%;display:inline-block;" readonly>';
  htmlElem += '        </div>';
  // htmlElem += '        <div class="col-md-1">';
  // htmlElem += '            <a class="tbEdit btnRegPet" href="javascript:void(0);" onclick="quitarpp_pagoparcial('+ctr+');" title="Quitar pago parcial"><img src="../images/icon_delete.png"></a>';
  // htmlElem += '        </div>';
  htmlElem += '    </div>';
  htmlElem += '</div>';

  $("#contenido_cantfecha").append(htmlElem);

  //Reinicializar para uso de las fechas
  $(".inputfecha").datepicker({
    showOn: "button",
    buttonImage: '../images/calendar.gif',
    buttonImageOnly: true,
    buttonText: "Select date",
    changeMonth: true,
    changeYear: true,
    yearRange: "1950:2020",
    // defaultDate: $("#fechaHoy").val(),
    onSelect: function(dateText, inst){
    },
    onClose : function(dateText, inst){
    },
    viewMode: "months",
    minViewMode: "months",
    keyboardNavigation: false,
    forceParse: false,
    autoclose: true,
    showOnFocus: false,
  });
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

// Recalcular costos
function reCalculaPorSesiones(target){
  var final_sesiones = accounting.unformat($(target).val());
  var pro_duracion_cont = accounting.unformat($("#pro_duracion_cont").val());

  // Verifica si las sesiones son menores a 10 o 12
  // Abrir panel de autorizacion (Ya no aplica)
  // if(final_sesiones<pro_duracion_cont){
  //   alertify.confirm("<strong>Esta acci&oacute;n debe ser autorizada</strong>", function(){
  //     $("#opc_modal_motivopropuesta").val(0);
  //     $("#cont_formSoliAutorizacion").hide();
  //     $("#cont_formCodAutorizacion").hide();

  //     reseteaFormulario("formSoliAutorizacion");
  //     reseteaFormulario("formCodAutorizacion");
  //     $("#cont_formSoliAutorizacion").show();
  //     $('#modalSoliAutorizacion').modal('open');
  //   },function(){
  //     $("#pro_final_cont").val(pro_duracion_cont);
  //   }).set({labels:{ok:'Continuar', cancel: 'Cancelar'}, padding: false});
  //   return false;
  // }

  // reset radios
  // $("input[id^=pro_condpago_1]:radio").removeAttr('disabled');
  // $("input[id^=pro_condpago_2]:radio").removeAttr('disabled');
  $("#pro_condpago option[value=" + 1 + "]").removeAttr('disabled');
  $("#pro_condpago option[value=" + 2 + "]").removeAttr('disabled');
  $("#pro_condpago option[value=" + 4 + "]").removeAttr('disabled');

  /*var costoTotal = obtCostoTotalPorSesiones(final_sesiones);
  console.log(costoTotal);

  // Setear valores
  $("#pro_presupuesto_cont").val(accounting.formatMoney(costoTotal));*/

  // Calcular sesiones a contratar
  calculaSesionesContratar();
  //Revisa si el numero de sesiones a contratar es menor al numero de recomendadas
  if(obtDiffSesionesRecCont()){
    $("#pro_condpago_desc").val(0);
  }
  //Calcular descuento
  calculaTotalDescuento(0);


  /*var pro_duracion_cont = accounting.unformat($("#pro_duracion_cont").val());
  if(final_sesiones > pro_duracion_cont){
    alertify.error("No se permite un n&uacute;mero m&aacute;s alto que la duraci&oacute;n de sesiones");
    $("#pro_final_cont").val($("#pro_duracion_cont").val());
    $("#pro_garantia_final").prop('checked', true);
    $("#pro_garantia_final").val(1);
    return false;
  }
  */

  // // Seteo de garantia
  // if($("#pro_duracion_cont").val() == final_sesiones){
  //   $("#pro_garantia_final").prop('checked', true);
  //   $("#pro_garantia_final").val(1);
  // }else{
  //   $("#pro_garantia_final").prop('checked', false);
  //   $("#pro_garantia_final").val(0);
  // }
}

// Calculo sesiones a contratar
function calculaSesionesContratar(){
  var final_sesiones = accounting.unformat($("#pro_final_cont").val());
  var costoTotal = obtCostoTotalPorSesiones(final_sesiones);
  console.log(costoTotal);
  // Setear valores
  $("#pro_presupuesto_cont").val(accounting.formatMoney(costoTotal));
}

//Revisa si solo es una sesion
function soloUnaSesion(){
  var final_sesiones = accounting.unformat($("#pro_final_cont").val());
  console.log(final_sesiones);
  if(final_sesiones==1){
    // $("input:radio:first").prop("checked", true).trigger("click");
    // $("#pro_condpago_0 input[type='radio']:checked");

    // $('input[name="pro_condpago"]:radio:first').click();
    $("#pro_condpago").val(0);
    $("#pro_condpago_desc").val(0);
    calculaTotalDescuento(0);
    $("#cont_plan_de_pagos").hide();
    $("#cont_por_sesion").hide();
    $("#cont_meses_sin_interes").hide();

    // $("input[id^=pro_condpago_1]:radio").attr('disabled',true);
    // $("input[id^=pro_condpago_2]:radio").attr('disabled',true);
    $("#pro_condpago option[value=" + 1 + "]").attr('disabled',true);
    $("#pro_condpago option[value=" + 2 + "]").attr('disabled',true);
    $("#pro_condpago option[value=" + 4 + "]").attr('disabled',true);
  }else{
    // $("input[id^=pro_condpago_1]:radio").removeAttr('disabled');
    // $("input[id^=pro_condpago_2]:radio").removeAttr('disabled');
    $("#pro_condpago option[value=" + 1 + "]").removeAttr('disabled');
    $("#pro_condpago option[value=" + 2 + "]").removeAttr('disabled');
    $("#pro_condpago option[value=" + 4 + "]").removeAttr('disabled');
  }
}



// Accion cuando cierra el modal
function cerrarModal(){
  var opc_modal_motivopropuesta = accounting.unformat($("#opc_modal_motivopropuesta").val());
  console.log(opc_modal_motivopropuesta);

  if(opc_modal_motivopropuesta==0){
    var pro_duracion_cont = accounting.unformat($("#pro_duracion_cont").val());
    $("#pro_final_cont").val(pro_duracion_cont);
    $("#cont_formSoliAutorizacion").hide();
    $("#cont_formCodAutorizacion").hide();
  }

  if(opc_modal_motivopropuesta==1){
    var hid_pro_condpago_desc = accounting.unformat($("#hid_pro_condpago_desc").val());
    $("#pro_condpago_desc").val(hid_pro_condpago_desc);
    $("#cont_formSoliAutorizacion").hide();
    $("#cont_formCodAutorizacion").hide();
  }
}

// Enviar mensaje para autorizar descuento
function btnAceptarSoliAut(){
  $.validator.setDefaults({ ignore: [] });

  var validator = $("#formSoliAutorizacion").validate({errorClass: "invalid form-error", errorElement: 'div',
        errorPlacement: function(error, element) { error.appendTo(element.parent()); } });

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
      console.log(datosResp); //COMENTAR EN SERVER
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
  var opc_modal_motivopropuesta = accounting.unformat($("#opc_modal_motivopropuesta").val());

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

            if(opc_modal_motivopropuesta==0){
              calculaSesionesContratar();
              alertify.success("La solicitud de sesiones se ha aplicado.");
            }else{
              alertify.success("La solicitud de descuento se ha aplicado.");
              $("#hid_pro_condpago_desc").val($("#pro_condpago_desc").val());
            }

            // Revisar si solo es una sesion
            if(opc_modal_motivopropuesta==0){
              soloUnaSesion();
            }
            calculaTotalDescuento(0);
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


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>METODOS GENERALES>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Metodo para salvar el proceso de los taps (datos proceso, descripcion)
function salvarProspecto(){
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
  }else{
    //Validar formulario
    if($("#formProspecto").valid()){
      var url = window.location.href;
      var arrParams = submitNameAbase64("#formProspecto");
      // console.log(arrParams);
      postDinamico(url, arrParams, "");
    }
    else{
      alertify.warning("No se han llenado todos los campos requeridos, revisar todos los tabs");
      validator.focusInvalid();
      return false;
    }
  }
}



// >>>>>>>>>>>>
// >>>>>Salvar propuesta
// >>>>>>>>>>>>
// Obt zonas a trabajar
function obtZonaDiag(){
  var arrZonas = [];
  $(".accZona").each(function(i,v){
    if($(v).is(':checked')){
      var label = $('label[for="'+v.id+'"]').html();
      label = label.replace(":", "");
      // console.log(v);
      // console.log(v.id);
      // console.log(label);
      arrZonas.push(label);
    }
  });
  // console.log(arrZonas);
  return arrZonas;
}

function popupMotivoPropuesta(){
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

  reseteaFormulario('formMotivoPropuesta');
  $('#modalMotivoPropuesta').modal('open');
  // obtTodosDatosProspecto(); //Salvar todos los datos en json
  // obtZonaDiag();

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

    var zonasTrabajar    = JSON.stringify(obtZonaDiag());
    // console.log(zonasTrabajar);
    // return false;

    //Datos propuesta
    var idParamPro       = accounting.unformat($("#idParamPro").val());
    var prospectoId      = $("#idProspecto").val();
    var expClienteId     = "";
    var expTratamientoId = "";
    var tratamientoId    = 3; //fotodepilacion
    var duracionSesiones = $("#pro_duracion_cont").val();
    var finalSesiones    = $("#pro_final_cont").val();
    var sesionesXSemT1   = 0;
    var sesionesXSemT2   = 0;
    var tipoPagoId       = $("#pro_condpago").val(); //$('input:radio[name="pro_condpago"]:checked').val();
    var descuento        = $("#pro_condpago_desc").val();
    var periodo          = $("#pro_planpago_periodo").val();
    var mesesSinInt      = $("#pro_msi_mes").val();
    var vendasFrias      = "";
    var vibroterapia     = "";
    var cavitacion       = "";
    var radiofrecuencia  = "";
    var vacumterapia     = "";
    var gimnasiaPasiva   = "";
    var presoterapia     = "";
    var laserLipolitico  = "";
    var kilosAPerder     = "";
    // var tratamientoOpc   = 2;

    // console.log(kilosAPerder);
    // return false;

    // Tomar numero de meses
    var noMesEtapa1      = 0;
    var noMesEtapa2      = 0;

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
      // if(periodoTmp==3){
      //   numPagosPeriodo = accounting.unformat( $("#pro_planpago_periodo_mes").val() );
      // }
    }
    // console.log(periodoTmp);
    // console.log(numPagosPeriodo);
    // return false;

  /*
    // >>>>>>> Imp. 20/05/20
    // >>>>>>> Datos para pdf de propuesta
    //Datos diagnostico
    var diag_peso         = $("#pro_peso").val();
    var diag_pesodeseado  = $("#pro_pesodeseado").val();
    var diag_talla        = $("#pro_talla").val();
    var diag_talladeseada = $("#pro_talladeseada").val();
    var diag_imc          = $("#pro_imc").val();
    var diag_grasa        = $("#pro_grasa").val();
    var diag_gv           = $("#pro_gv").val();
    var diag_musculo      = $("#pro_musculo").val();

    // Datos tratamiento recomendado
    // t1
    var trec_tratamiento_t1 = $("#pro_tratamiento").val();
    var trec_costo_t1       = $("#pro_costo").val();
    var trec_duracion_t1    = $("#pro_duracion").val();
    var trec_kilosperder_t1 = $("#pro_kilosperder_t1").val();
    // t2
    var trec_tratamiento_t2 = $("#pro_tratamiento_etapa").val();
    var trec_costo_t2       = $("#pro_costo_etapa").val();
    var trec_kilosperder_t2 = $("#pro_kilosperder_etapa_sl").val();

    // Zonas | Afeccion

    //tratamiento a contratar t1
    var tcon_presupuesto_cont_t1 = $("#pro_presupuesto_cont").val();
    var tcon_areas_t1 = areasTrabajar().join(); //Obtener zonas a trabajar
    // console.log(areas);
    var tcon_garantia_final_t1 = $("#pro_garantia_final").val();

    //tratamiento a contratar t2
    var tcon_kilosperder_etapa_t2 = $("#pro_kilosperder_etapa").val();
    // ----
    var kilosMesE1 = $("#kilosMesE1").text();
    var numMesE1 = $("#numMesE1").text();
    var costoMesesE1 = accounting.unformat($("#costoMesesE1").text());
    // ----
    var kilosMesE2 = $("#kilosMesE2").text();
    var numMesE2 = $("#numMesE2").text();
    var costoMesesE2 = accounting.unformat($("#costoMesesE2").text());
    // ----
    var costoMesesE3 = accounting.unformat($("#costoMesesE3").text());

    // condiciones de pago
    var pro_condpago_total       = $("#pro_condpago_total").val();
    var pro_condpago_ahorro      = $("#pro_condpago_ahorro").val();
    var pro_planpago_pagoinicial = $("#pro_planpago_pagoinicial").val();
    var pro_planpago_parcial     = $("#pro_planpago_parcial").val();
    var pro_porsesion_totalzonas = $("#pro_porsesion_totalzonas").val();
    //costos por sesion
    var costoVendasFrias         = accounting.unformat($("#costo_porsesion_vendas_frias").text());
    var costoVibroterapia        = accounting.unformat($("#costo_porsesion_vibroterapia").text());
    var costoCavitacion          = accounting.unformat($("#costo_porsesion_cavitacion").text());
    var costoRadiofrecuencia     = accounting.unformat($("#costo_porsesion_radiofrecuencia").text());
    var costoVacumterapia        = accounting.unformat($("#costo_porsesion_vacumterapia").text());
    var costoGimnasiaPasiva      = accounting.unformat($("#costo_porsesion_gimnasia_pasiva").text());
    var costoPresoterapia        = accounting.unformat($("#costo_porsesion_presoterapia").text());
    var costoLaserLipolitico     = accounting.unformat($("#costo_porsesion_laser_lipolitico").text());
    // return false;
    // >>>>>>> Fin de atos para pdf de propuesta
    // >>>>>>>
  */

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

        //Imp.18/06/20
        $(".overlayLoading").show();
        setTimeout(function(){
          //Imp. 26/08/20
          let idProspecto = accounting.unformat($("#idProspecto").val());
          let dp_email = $("#correousr_motivopro").val();
          window.open('propuestat2.php?idP='+idProspecto+'&c='+dp_email, '_blank', 'height=' + screen.height + ',width=' + screen.width + ',menubar=no,toolbar=no');

          setTimeout(function(){
            location.reload();
          }, 5000);
        // }, 2000);
        }, 2000);
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

// Campos requerido segun vista
function camposGCRequeridos(ctr){
  if(ctr==1){
    $('#cf_nombre').addClass("required");
    $('#cf_parentesco').addClass("required");
    $('#cf_telefono').addClass("required");
  }
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

// continuar los pasos
function continuarContrato(ctr){
  ctr = ctr+1;
  // console.log(ctr);
  var validator = $("#formGenerarContrato").validate({ });

  if($("#formGenerarContrato").valid()){
    if(ctr==2){
      showLoading("btn_continuarContrato1");

      // Cargar panel de reserva de bloques de horas por dia de la semana
      obtBloquesHorariosPorDia();
    }
    if(ctr==3){
      //Verificar que tenga al menos un horario por reservas
      if(arrIdHorariosClieAgregados.length > 0){
        showLoading("btn_continuarContrato2");
        // $(".cont_gc_paso_1").hide();
        // $(".cont_gc_paso_2").hide();
        // $(".cont_gc_paso_3").show();

        //genera contrato en pdf
        pdfContrato();
      }else{
        alertify.error("Para continuar debe seleccionar por lo menos un horario.");
      }
    }
  }else{
    validator.focusInvalid();
    return false;
  }
}

// >>>>>>>>>>>Logica de reserva de horarios
function obtBloquesHorariosPorDia(){
  arrIdHorariosClieAgregados = [];
  $("#cont_reservas_horas").html("");
  var html='';
  // showLoading("btnAceptarSoliAut");
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

            html +='<span class="cont_btn_hora"><button type="button" class="btn btn-sm '+ocupado+'" datos="'+arrFila[1]+'" diaNum="'+v.diaNum+'"  '+onclick+'>'+arrFila[0]+'</button></span>';
          });
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
  var totalBlockPerm = 1;
  // console.log(totalBlockPerm);
  // console.log(arrIdHorariosClieAgregados);

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
    // return false;

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
//>>>>>>>>>Fin de logica de reserva de horarios


// Genera pdf contrato
function pdfContrato(){
  var idProspecto = $("#idProspecto").val();
  var nombreCompleto = $("#dp_nombre").val() +" "+ $("#dp_paterno").val() +" "+ $("#dp_materno").val();
  var correo = $("#dp_email").val();
  var edad = $("#dp_edad").val();
  var telefono = $("#dp_telefono").val();
  var celular = $("#dp_celular").val();
  var cp = $("#dp_cp").val();
  var ocupacion = $("#dp_ocupacion").val();
  var peso = $("#dp_peso").val();

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

  //Datos emergencia
  var cf_nombre = $("#cf_nombre").val();
  var cf_parentesco = $("#cf_parentesco").val();
  var cf_telefono = $("#cf_telefono").val();
  // var cf_fotosrostro = $("#cf_fotosrostro").val();

  //var nombreTratamiento = (tipoTratamiento==1)?$("#pro_tratamiento").val():$("#pro_tratamiento_etapa").val();
  var nombreTratamiento = "Fotodepilaci&oacute;n";
  // var sesiones = accounting.unformat($("#pro_final_cont").val());
  var sesiones = accounting.unformat($("#pro_duracion_cont").val());
  /*if(tipoTratamiento==1){ //fotodepilacion
    var sesionesXSem = accounting.unformat($("#pro_sesionsemana_cont").val());
    var sesionesTratRec = accounting.unformat($("#pro_duracion").val());
    var kiloAPerder = $("#pro_kilosperder_t1").val();
  }*/

  //obtener las areas
  // var areasTra = areasTrabajar(function(resp){ return resp.join(); });
  //var areas = areasTrabajar().join();
  // -----------------
  var zonasTrabajar    = obtZonaDiag();
  var areas = zonasTrabajar.join(", ");

  var params = {idProspecto:idProspecto, nombreCompleto:nombreCompleto, correo:correo, edad:edad, telefono:telefono,            celular:celular,
                cp:cp, ocupacion:ocupacion, enfermedades:enfermedades, alergias:alergias, medicamentos:medicamentos,
                cirugias:cirugias, nombreTratamiento:nombreTratamiento, peso:peso,
                cf_nombre, areas:areas, sesiones:sesiones
              };
   // console.log(params);
   // return false;

  params = paramsB64(params);
  params['funct'] = 'generarConsentimientoT2PDF';

  ajaxData(params, function(datosResp){
    //hideLoading2("btn_continuarContrato2");
     // console.log(datosResp);
    // return false;

    if(datosResp.success==true){
      $(".cont_gc_paso_1").hide();
      $(".cont_gc_paso_2").hide();
      $(".cont_gc_paso_3").show();
      //
      var archivoContrato = "";
      archivoContrato += '<div>Se ha generado el consentimiento, de click en el archivo <b><a href="'+datosResp.urlArchivo+'" target="_blank">'+datosResp.nombreArchivo+'</a></b> para que el usuario lo lea y firme el consentimiento, posterior a esto presionar sobre el bot&oacute;n de confirmar.</div>';
      archivoContrato += '<div>Aviso de privacidad, de click <b><a href="'+datosResp.urlAvisoP+'" target="_blank">aqu&iacute;.</a></b></div>';
      archivoContrato += '<input type="hidden" id="url_pdf_archivo" value="upload/pdfContratos/'+datosResp.nombreArchivo+'">';
      $("#cont_archivo_contrato").html(archivoContrato);
    }else{
      $('.modal').modal("close");
      alertify.error("No se ha podido generar el consentimiento, intentar nuevamente.");
    }
  });
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

  var zonasTrabajar    = JSON.stringify(obtZonaDiag());
  // console.log(zonasTrabajar);
  // return false;

  //Datos propuesta
  var idParamPro       = accounting.unformat($("#idParamPro").val());
  var prospectoId      = $("#idProspecto").val();
  var expClienteId     = "";
  var expTratamientoId = "";
  var tratamientoId    = 3; //fotodepilacion
  var duracionSesiones = $("#pro_duracion_cont").val();
  var finalSesiones    = $("#pro_final_cont").val();
  var sesionesXSemT1   = 0;
  var sesionesXSemT2   = 0;
  var tipoPagoId       = $("#pro_condpago").val();//$('input:radio[name="pro_condpago"]:checked').val();
  var descuento        = $("#pro_condpago_desc").val();
  var periodo          = $("#pro_planpago_periodo").val();
  var mesesSinInt      = $("#pro_msi_mes").val();
  var vendasFrias      = "";
  var vibroterapia     = "";
  var cavitacion       = "";
  var radiofrecuencia  = "";
  var vacumterapia     = "";
  var gimnasiaPasiva   = "";
  var presoterapia     = "";
  var laserLipolitico  = "";
  var kilosAPerder     = "";
  // var tratamientoOpc   = 2;

  // console.log(kilosAPerder);
  // return false;

  // Tomar numero de meses
  var noMesEtapa1      = 0;
  var noMesEtapa2      = 0;

  //Imp. 14/05/20
  $("#idsHrsAgredados").val(arrIdHorariosClieAgregados.join());

  // Segun el tipo de pago obtener el monto del pago inicial
  // Imp. 25/05/20
  if(tipoPagoId==0 || tipoPagoId==2 || tipoPagoId==4){
    $("#montoPagoInicial").val( accounting.unformat($("#pro_condpago_total").val()) );
  }
  if(tipoPagoId==1){
    $("#montoPagoInicial").val( accounting.unformat($("#pro_planpago_pagoinicial").val()) );
  }
  if(tipoPagoId==3){
    $("#montoPagoInicial").val( accounting.unformat($("#pro_porsesion_total").val()) );
  }
  // console.log($("#montoPagoInicial").val());
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


// >>>>>>>>>>>>
// >>>>>Fin generar contrato
// >>>>>>>>>>>>
// pdfContrato(); //Habilitar para probar


// Genera pdf contrato ejemplo
function pdfContratoEjemplo(){
  setTimeout(function(){
    hideLoading2("btn_continuarContrato2");
    $(".cont_gc_paso_1").hide();
    $(".cont_gc_paso_2").hide();
    $(".cont_gc_paso_3").show();

    var archivoContrato = "";
    archivoContrato += '<div>Se ha generado el consentimiento, de click en el archivo <b><a href="../consentimiento_informado.pdf" target="_blank">Consentimiento</a></b> para que el usuario lo lea y lo firme, posterior a esto presionar sobre el bot&oacute;n de confirmar.</div>';
    archivoContrato += '<div>Aviso de privacidad, de click <b><a href="../aviso_de_privacidad.pdf" target="_blank">aqu&iacute;.</a></b></div>';
    // archivoContrato += '<div>Aviso de privacidad, de click <b><a href="'+datosResp.urlAvisoP+'" target="_blank">aqu&iacute;.</a></b></div>';
    $("#cont_archivo_contrato").html(archivoContrato);
  }, 1500);
}




//metodo para agregar un post dinamico
//==>>TODO: ESTE METODO YA EXISTE EN Globalfunctions ya no tienen que volverlo a declarar
function postDinamico(url, arrParams, target){
  var form = $('<form/></form>');
  form.attr("action", url);
  form.attr("method", "POST");
  form.attr("style", "display:none;");
  form.attr("enctype", "multipart/form-data");
  if(target!=""){
    form.attr("target", target);
  }

  if(arrParams.length>0){
    $.each(arrParams, function(i,v){
      // console.log(v);
      input = $("<input></input>").attr("type", "hidden").attr("name", v.name).val(v.val);
      form.append(input);
    });

    $("body").append(form);
    // submit form
    form.submit();
    form.remove();
  }
}


// cambios jair 16/6/2020

function changeEmbarazada(){
  if ($('#dp_embarazada').is(':checked')) {
    $("#btn_salvar_prospecto").attr("disabled", true);
  }else{
    $("#btn_salvar_prospecto").attr("disabled", false);
  }
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
    $("#divPartesCuerpo"+tipoMetal).addClass("fondoGris");
  });
}

function salvarEncuestaExpClienteT2(){
  $.validator.setDefaults({
    ignore: []
  });

  var validator = $("#formEncuestaExpSesT2").validate({
        errorClass: "invalid form-error",
        errorElement: 'div',
        errorPlacement: function(error, element) {
          error.appendTo(element.parent());
        }
      });
  tinymce.triggerSave();

  //Validar formulario
  if($("#formEncuestaExpSesT2").valid()){
    var url = window.location.href;
    // Mandar post
    var arrParams = submitNameAbase64("#formEncuestaExpSesT2");
    // console.log(arrParams);
    postDinamico(url, arrParams, "");

  }else{
    validator.focusInvalid();
    return false;
  }
}
