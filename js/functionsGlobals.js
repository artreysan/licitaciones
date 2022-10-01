/*
 * Date: 06/09/2019
 * Actualizado: 27/05/2020
 * Funciones generales y especificas de javascript
 */
var parentData = {};

$(document).ready(function(){
  //Para todas las vistas que tengan fechas con kool agregar atributo readonly
  //$("#fechaDel").attr("readonly", "readonly");
  //$("#fechaAl").attr("readonly", "readonly");


  $('input[name=\"activo\"]').click(function() {
    var v = $(this).val();
    var value = (v == 1) ? '0' : '1';
    $('#activo').val(value);
  });

  // Denfine las notificaciones
  if(typeof tieneAlertify !== "undefined"){
    defineAlertify();
  }

  //initialize all modals
    $('.modal').modal({
        dismissible: false,
    });

  // Para los listbox
  if($(".duallb").length){
    $(".duallb").bootstrapDualListbox({
        // nonSelectedListLabel: 'Non-selected',
        // selectedListLabel: 'Selected',
        nonSelectedListLabel: 'No seleccionados',
        selectedListLabel: 'Seleccionados',
        preserveSelectionOnMove: 'movido',
        moveOnSelect: false,
    });
  }

  // Fancy para las ayudas
  if($("#btnAyudaweb").length){
    $("#btnAyudaweb").fancybox({
       autoDimensions: false,
       padding : 30,
       width : 900,
       height : 900,
       autoScale : true,
       closeBtn : true,
       closeClick  : false,
       helpers : {
           overlay : {closeClick: true}
       },
       beforeLoad: function() {
       }
    });
  }

  // Inicializa fancybox
  if($(".btnFancy").length){
    $(".btnFancy").fancybox({
       autoDimensions: false,
       padding : 30,
       width : 900,
       height : 900,
       autoScale : true,
       closeBtn : true,
       closeClick  : false,
       helpers : {
           overlay : {closeClick: true}
       },
       beforeLoad: function() {
         console.log($(this.element));
        parentData.nameid       = $(this.element).data("nameid");
        parentData.originalname = $(this.element).data("originalname");
       },
       afterShow: function () {
        
      },
      afterClose: function () {
          // validate the eTarget variable 
          // console.log(this.element.context.id);    
          console.log(parentData);
      }
    });
  }

  // Inicializa selectores
  $(".selector").formSelect();

  // ===================
  // ===================

  //Cambio de rol
  $('#idRol').change(function() {
    var idRol = accounting.unformat($(this).val());
    if(idRol==1 || idRol==6){
      $("#sucursalU").removeClass("required");
    }else{
      $("#sucursalU").addClass("required");
    }
  });
  if($("#idRol").length){
    $("#idRol").trigger("change");
  }


  //Calendarios de rango de fecha
  if($("#from").length){
    console.log("comunicados");
    var dateFormat = "dd/mm/yy",
        from = $( "#from" )
          .datepicker({
            // minDate: "+0d",
            defaultDate: "+0d",
            changeMonth: true,
            changeYear: true,
            numberOfMonths: 1,
            buttonImage: '../images/calendar.gif',
            changeYear: true,
          })
          .on( "change", function() {
            to.datepicker( "option", "minDate", getDate( this ) );
          }),
        to = $( "#to" ).datepicker({
          // minDate: "+0d",
          defaultDate: "+1w",
          changeMonth: true,
          changeYear: true,
          numberOfMonths: 1,
          buttonImage: '../images/calendar.gif',
          changeYear: true,
        })
        .on( "change", function() {
          from.datepicker( "option", "maxDate", getDate( this ) );
        });
   
      function getDate( element ) {
        var date;
        try {
          date = $.datepicker.parseDate( dateFormat, element.value );
        } catch( error ) {
          date = null;
        }
   
        return date;
      }
  }


}); //Cierre de $(document).ready


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>METODOS ESPECIFICOS FUERA DEL $(document).ready<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function inicializaFancyGral(){
  if($(".btnFancyBox").length){
    $(".btnFancyBox").fancybox({
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
     }
   });
  }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>METODOS GENERALES>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Opciones del editor tinymce
function opcionesTinymce(params){
  // console.log(params.btnImg);
  if(params.btnImg==true){
      tinymce.init({
      forced_root_block : '',
      selector: params.selector,
      height : params.height,
      // theme: "modern",
      menu: {
        // file: {title: 'File', items:'newdocument restoredraft | preview | print '},
        edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
        insert: {title: 'Insert', items: 'link media | image '},
        view: {title: 'View', items: 'preview'},
        format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
        table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
        tools: {title: 'Tools', items: 'code'},
      },
      toolbar: 'undo redo |  formatselect | bold italic forecolor backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | link image',
      plugins: [
        ["textcolor advlist autolink link image lists preview code save contextmenu directionality emoticons paste print "]
      ],
      file_picker_types: 'image',
      image_title: true,
      automatic_uploads: true,
      file_browser_callback_types: 'image',
      file_browser_callback: function(field_name, url, type, win) {
        win.document.getElementById(field_name).value = 'my browser value';
      },
      file_picker_callback: function(callback, value, meta) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = function() {
          var file = this.files[0];
          var reader = new FileReader();
          reader.onload = function () {
            // console.log(file);
            var data = new FormData();
            data.append('file', file);
            $.ajax({
              type: "POST",
              url: '../uploadfiles.php?funct=uploadImagesTinymce',
              data: data,
              cache: false,
              contentType: false,
              processData: false,
              success: function (rponse) {
                // console.log(rponse);
                objJson = JSON.parse(rponse);
                if(objJson.resp==true){
                  // console.log(objJson);
                  callback(objJson.ruta, {alt: ""});
                }
              }
            });
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
    });
  }else{
    tinymce.init({
      forced_root_block : '',
      selector: params.selector,
      height : params.height,
      // theme: "modern",
      menu: {
        file: {title: 'File'},
        edit: {title: 'Edit', items: 'undo redo | cut copy paste pastetext | selectall'},
        insert: {title: 'Insert', items: 'link media '},
        view: {title: 'View', items: 'preview'},
        format: {title: 'Format', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
        table: {title: 'Table', items: 'inserttable tableprops deletetable | cell row column'},
        tools: {title: 'Tools', items: 'spellchecker code'}
      },
      plugins: [
        ["advlist autolink link lists preview"],
        ["code "],
        ["save contextmenu directionality emoticons paste"]
      ],
      onchange_callback: function(editor) {
      tinyMCE.triggerSave();
      $("#" + editor.id).valid();
    }
    });
  }
}

//metodo para obtener datos por ajax
function ajaxData(data, response){
  $.ajax({
      type: 'GET',
      dataType: 'jsonp',
      data: data,
      jsonp: 'callback',
      url: '../ajaxcall/ajaxFunctions.php',
      beforeSend: function () {
          //$("#imgLoadSave").show();
      },
      complete: function () {
      },
      success: function (data) {
          //console.log(data);
          response(data);
      },
      error: function () {
      }
  });
}

//metodo para subir imagenes y esperar el collback
function ajaxDataPost(url, data, response){
  $.ajax({
    type: "POST",
    url: url,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (rponse) {
      response(JSON.parse(rponse));
    },
    error: function () {
      console.log("Error");
      parent.$.fancybox.close();
    }
  });
}

//metodo para subir imagenes y esperar el collback
function ajaxDataImg(url, data, response){
  $.ajax({
    type: "POST",
    url: url,
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    success: function (rponse) {
      // console.log(rponse);
      response(JSON.parse(rponse));
    },
    error: function () {
      console.log("Error");
    }
  });
}


//sirve para redirecionar y tomar el filtro correspondiente
function obtenervalorfiltro(control){
  var value = control.value;
  if(value!='')
     location.href="catalogos.php?catalog="+value+"";
}

//sirve para redirecionar y tomar el filtro correspondiente
function obtenervalorfiltroCal(control, opcPopup){
  var value = accounting.unformat(control.value);
  var idSuc = accounting.unformat($("#selectSuc").val());
  var opcPopup = accounting.unformat(opcPopup);
  // console.log(opcPopup);

  if(opcPopup>0){
    location.href="calendarioPopup.php?idSuc="+idSuc+"&idP="+value;
  }else{
    if(value!='')
      // location.href="calendario.php?idP="+value+"";
      location.href="calendario.php?idSuc="+idSuc+"&idP="+value;
  }
}

//sirve para redirecionar y tomar el filtro correspondiente
function obtenervalorfiltroSuc(control, opcPopup){
  var value = accounting.unformat(control.value);
  var idCliente = 0;//accounting.unformat($("#selectProsCliente").val());
  var opcPopup = accounting.unformat(opcPopup);
  // console.log(opcPopup);

  if(opcPopup>0){
    location.href="calendarioPopup.php?idSuc="+value+"&idP="+idCliente;
  }else{
    location.href="calendario.php?idSuc="+value+"&idP="+idCliente;
  }
}

//mostrar loading
function loadingAjax(target){
  html = '<div class="loadImg"><img src="../images/loading.gif" height="16" /></div>';
  $("#"+target).html(html);
}

//Formatea el campo
function muestraValorMoneda(idInput, valor){
    $("#"+idInput).val(accounting.formatColumn([valor], "$"));
}

//metodo para agregar un post dinamico
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

//Metodo para agregar campos hidden al post
function agregarInput(target, params){
    $.each(params, function(i,param){
      var input = $("<input>")
               .attr("type", "hidden")
               .attr("name", param.name).val(param.value);
      $(target).append($(input));
    });
}

//mostrar loading
function loadingAjax(target){
  html = '<div class="loadImg"><img src="../images/loading.gif" height="16" /></div>';
  $("#"+target).html(html);
}
function stopLoading(target){
  $("#"+target).html("");
}
//Metodo para poner loading cuando se presionan los botones que hacen accion sobre la DB
function showLoading(target){
  htmlOriginal = $("#"+target).parent().html();
  html = '<div class="loadImg"><img src="../images/loading.gif" height="16" /></div>';
  $("#"+target).hide();
  $("#"+target).parent().append(html);
    //Se retorna el html original para poder ocultar el loading mas tarde
    return htmlOriginal;
}

//Funcion para ocultar loading. Parametros target=id del elemento con loading, htmlOriginal=html obtenido de showLoading
function hideLoading(target, htmlOriginal){
  //Se agrega el html al padre del elemento target
  $("#"+target).parent().html(htmlOriginal);
}

//Funcion para ocultar loading. Parametros target=id del elemento con loading, htmlOriginal=html obtenido de showLoading
function hideLoading2(target){
  $("#"+target).show();
  $(".loadImg").remove();
}

function mostrarOjo(id){
  if($("#"+id).val())
    $("#eye-"+id).show();
  else
    $("#eye-"+id).hide();
}

function mostrarPassword(id){
  // console.log("pika");
  // $("#"+id).attr('type','text');
  $("#"+id).removeClass('password');
}

function ocultarPassword(id){
  // $("#"+id).attr('type','password');
  $("#"+id).removeClass('password');
  $("#"+id).addClass('password');
}

//Obtener extension de un archivo
function getFileExtension(filename) {
  return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

//Obtener parametro dada una url
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//Configuracion especial de alertify
function defineAlertify(){
    alertify.defaults = {
        // dialogs defaults
        autoReset:true,
        basic:false,
        closable:true,
        closableByDimmer:true,
        frameless:false,
        maintainFocus:true, // <== global default not per instance, applies to all dialogs
        maximizable:true,
        modal:true,
        movable:true,
        moveBounded:false,
        overflow:true,
        padding: true,
        pinnable:true,
        pinned:true,
        preventBodyShift:false, // <== global default not per instance, applies to all dialogs
        resizable:true,
        startMaximized:false,
        transition:'zoom',
        // notifier defaults
        notifier:{
            // auto-dismiss wait time (in seconds)
            delay:4,
            // default position
            position:'top-center',
            // adds a close button to notifier messages
            closeButton: false
          },
        // language resources
        glossary:{
            // dialogs default title
            title:'',
            // ok button text
            ok: 'OK',
            // cancel button text
            cancel: 'Cancelar'
          },
        // theme settings
        theme:{
            // class name attached to prompt dialog input textbox.
            input:'ajs-input',
            // class name attached to ok button
            ok:'ajs-ok',
            // class name attached to cancel button
            cancel:'ajs-cancel'
          }
        };
  }
//Mostrar alerta de mensajes personalizados
function msgAlertify(msj, msjPer, tipo){
  if(msj!=""){
    msj = msj;
  }else{
    msj = msjPer;
  }
  switch (tipo) {
      case 1: alertify.success(msj); break;
      case 2: alertify.error(msj); break;
      case 3: alertify.warning(msj);break;
  }
}

function reseteaFormulario(idForm){
    $("label.error").hide();
    $("label.valid").hide();

    $("input").removeClass("error");
    $("select").removeClass("error");
    $("textarea").removeClass("error");
    $('#'+idForm)[0].reset();
}

//obtener la fecha actual con formato (d/m/Y)
function getCurrentDate(ctr){
    var d = new Date();

    var month = d.getMonth()+1;
    var day = d.getDate();

    var horas= (d.getHours()>=10) ?d.getHours() :'0'+d.getHours();
    var minutos = (d.getMinutes()>=10) ?d.getMinutes() :'0'+d.getMinutes();
    var segundos = d.getSeconds()

    var dateCurrent = ((''+day).length<2 ? '0' : '') + day +'/'+ ((''+month).length<2 ? '0' : '') + month + '/' + d.getFullYear();
    var tiempo = horas + ":" + minutos;// + ":" + segundos;

    if(ctr==1){
      return dateCurrent;
    }
    if(ctr==2){
      return dateCurrent+" "+tiempo;
    }
}

//function para descargar el archivo
function descargarArchivo(rutaArchivo,nivel){
   if(nivel==1){
       filephp = "../download_file.php?pathfile="+rutaArchivo;
   }
   window.open(filephp, "_blank");
   // location.href=filephp;
}

function agregarClaseActive(){
  var menuObt = getParameterByName("menu");
  if(menuObt != null && menuObt != ""){
    localStorage.setItem("menu",menuObt);
    $("li").removeClass("activemenu");
    $("#btnmenu_"+menuObt).addClass("activemenu");
  }
  else{
    if(localStorage.getItem("menu") != "" && localStorage.getItem("menu") != null){
      $("li").removeClass("activemenu");
      $("#btnmenu_"+localStorage.getItem("menu")).addClass("activemenu");
    }
    else{
        $("li").removeClass("activemenu");
        $("#btnmenu_index").addClass("activemenu");
    }
  }
}

function cerrarSesion(){
  localStorage.setItem("menu","");
  location.href = "../admin/logout.php";
}

//funcion para inicializar el grid bootstrap correctamente
function initGridBT(){
   $('#grid_bootstrap').DataTable({
        searching: false,
        dom: 'Bfrtip',
        bInfo : true,
        responsive: true,
        "language": {
            "url": "../js/Spanish.json"
        },
        aaSorting: []
    });
}

function limpiaUrl(url){
  var res = url.replace("https://", "");
  res = res.replace("http://", "");
  res = res.replace("'", "");
  res = res.replace("\"", "");

  return res;
}

function limpiaFieldUrl(input){
  var url = input.value;
  var res = url.replace("https://", "");
  res = res.replace("http://", "");
  $("#"+input.id).val(res);
}

//Recarga la misma pagina pero sin parametros
function limpiarBusqueda(){
  var link = location.protocol+'//'+location.host+location.pathname;
  location.href=link;
}

function limpiarBusquedaHist(){
  var link = location.protocol+'//'+location.host+location.pathname;
  var idRaiz=$("#idRaiz").val();
  link=link+"?idRaiz="+idRaiz;
  location.href=link;
}

var valorConfig = "";
function abrirEditarConfig(idConfig, nombre){
  $("#idConfiguracion").val(idConfig);
  valorConfig = nombre;

  tinymce.remove('#valorConfig');
  var params = {funct: 'obtDatosConfiguracion', idConfiguracion:idConfig};

  ajaxData(params, function(data){
    // console.log(data);
    if(data.success){
      $("#divTextAreaConfig").html('<textarea class="form-control required" id="valorConfig" name="valorConfig">'+data.datosConf.valor+'</textarea>');

      setTimeout(function(){
        var params = {selector:"#valorConfig", height:"230", btnImg:false};
        opcionesTinymce(params);
        // hideLoading('btnGuardarConfig', htmlOriginal);
      }, 1000);
    }
  });
}

function guardarConfiguracion(){
    tinyMCE.triggerSave();

    if(tinyMCE.get('valorConfig').getContent() != ""){
        var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarConfiguracion';
        var data = new FormData();

        // console.log($("#idConfiguracion").val());
        // console.log(valorConfig);
        // console.log(tinyMCE.get('valorConfig').getContent());
        // return false;

        var contenido = tinyMCE.get('valorConfig').getContent();
        contenido = $.base64.encode(contenido);
        data.append('idConfiguracion', $("#idConfiguracion").val());
        data.append('nombreConf', valorConfig);
        data.append('valor',  contenido);
        ajaxDataPost(urlDel, data, function(data){
          parent.$.fancybox.close();
          // console.log(data);
             if(data.success){
                if(data.res > 0){
                  alertify.success("Se han guardado los cambios");
                  configsGrid.refresh();
                  configsGrid.commit();
              //inicializaFancyGral();
              location.reload();
                }
                else{
                  alertify.warning('No hay cambios que guardar');
                }
             }
        });
    }
    else{
      parent.$.fancybox.close();
      alertify.error('Debe escribir un valor para la configuracion');
    }
}

function editarAyuda(vista){
    if(vista != ""){
         var params = {
          funct: 'mostrarAyuda',
          alias:  vista,
        };

        var htmlOriginal = showLoading('btnGuardarAyuda');
         ajaxData(params, function(data){
          // console.log(data);
            if(data.success){
              var htmltextarea = '<textarea name="contenidoAyuda" id="contenidoAyuda" rows="6" class="form-control contenidoAyuda" required="">'+data.descripcion+'</textarea>';

              $("#divContenidoAyuda").html(htmltextarea);
              $("#contenidoAyuda").val(data.descripcion);
               console.log(data.descripcion);
               var params = {selector:".contenidoAyuda", height:"230", btnImg:true};
               opcionesTinymce(params);
            }
            hideLoading('btnGuardarAyuda', htmlOriginal);
         });
    }
    else{
        // var htmltextarea = '<textarea class="form-control" id="contenidoAyuda"></textarea>';

        // $("#divContenidoAyuda").html(htmltextarea);
        alertify.error("Por favor seleccione una ayuda.");
    }
}

function guardarAyuda(){
    tinymce.triggerSave();
    $('#question_html').val(tinyMCE.get('contenidoAyuda').getContent());

    if( $("#ayudas").val() != "" &&  tinyMCE.get('contenidoAyuda').getContent() != ""){
        // var params = {
        //   funct: 'guardarAyuda',
        //   alias:  $("#ayudas").val(),
        //   contenido: tinyMCE.get('contenidoAyuda').getContent()
        // };
        var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarAyuda';
        var formElement = document.getElementById("formPorCotizar");
        var data = new FormData();
        data.append('alias', $("#ayudas").val());
        data.append('contenido', tinyMCE.get('contenidoAyuda').getContent());
        var htmlOriginal = showLoading('btnGuardarAyuda');

        ajaxDataPost(urlDel, data, function(data){
          hideLoading('btnGuardarAyuda', htmlOriginal);
          if(data.success){
            alertify.success("Cambios guardados correctamente");
          }
          else{
            alertify.success("No hay cambios que guardar");
          }
        });
    }
    else{
      alertify.error("Por favor seleccione una ayuda y escriba su contenido.");
    }
}

function mostrarAyuda(vista){
    //Obtener ayuda
    //PENDIENTE

    var params = {
          funct: 'mostrarAyuda',
          alias:  vista,
        };

         ajaxData(params, function(data){
            console.log(data);
              if(data.success){
                  var tituloAyuda = data.titulo;
                  var contenidoAyuda = data.descripcion;
                  console.log(tituloAyuda);
                  console.log(contenidoAyuda);
                  //Mostrar ayuda
                  $("#tituloAyuda").html("<img src='../images/icon_ayuda.png' width='25px'>Ayuda "+tituloAyuda);
                  $("#contenidoAyudaM").html(data.descripcion);
              }
              else{
                $("#tituloAyuda").html("Error");
                $("#contenidoAyudaM").html("No es posible cargar la ayuda en este momento");
              }
        });
}

function sumarDiasFechaTexto(dateText, numDias){
  // console.log(dateText);
  arrFecha = dateText.split(" ");
  arrFecha2 = arrFecha[0].split("/");
  var fecha = arrFecha2[2]+"-"+arrFecha2[1]+"-"+arrFecha2[0]+" "+arrFecha[1];
  // console.log(fechaPet);
  var fechaObj = new Date(fecha);
  fechaObj.setDate(fechaObj.getDate() + (numDias+1));
  // console.log(frevision);

  return fechaObj;
}

//Funcion para generar una contraseña aleatoria a un input por su id
function generarPassword(idInput){
    console.log(idInput);
    var params = {
          funct: 'generarPasswordUsuario',
      };

    ajaxData(params, function(data){
        console.log(data);
          if(data.success){
              alertify.success("Contrase&ntilde;a generada");
              $("#"+idInput).val(data.password);
          }
          else{
            alertify.error("No es posible generar contrase&ntilde;a en este momento, intente mas tarde");
          }
    });
}

function getDateR( element ) {
  var dateFormat = "dd/mm/yy";
  var date;
  try {
    console.log("try");
    date = $.datepicker.parseDate( dateFormat, element.value );
  } catch( error ) {
    console.log("catch");
    date = null;
  }

  return date;
}


// Metodo que codifica todas las variables name a base64 (tema mod_security)
function submitNameAbase64(form){
  var datosForm = $(form).serializeJSON();
  console.log(datosForm);

  var cont=0;
  var arrParams = [];
  $.each(datosForm, function(i,v){
    arrParams[cont] = {"name":i, "val":$.base64.encode(v)};
    cont++;
  });

  return arrParams;
}

//funcion para inicializar el grid bootstrap correctamente
function initGridBTListas(idTabla){
   var gridBT = $('#'+idTabla).DataTable({
        searching: false,
        dom: 'Bfrtip',
        bInfo : true,
        responsive: true,
        "language": {
            "url": "../js/Spanish.json"
        },
        aaSorting: []
    });

   return gridBT;
}

function paramsB64(params){
  var paramsB64 = {};
  $.each(params, function(i,v){
    paramsB64[i] = $.base64.encode(v);
  });

  return paramsB64;
}

function convertHTMLEntity(text){
  const span = document.createElement('span');

  return text.replace(/&[#A-Za-z0-9]+;/gi, (entity,position,text)=> {
    span.innerHTML = entity;
    return span.innerText;
  });
}

// ========================================================
// ========================================================
// ========================================================



// Metodo para verificar si el estatus es aprobado = 3
function checkEstatusAprobado(response){
  if(accounting.unformat($("#dp_estatus").val())==3){ //Descomentar
  // if(accounting.unformat($("#dp_estatus").val())==2){ //Comentar
    response({result:false});
  }else{
    response({result:true});
  }
}

function verificaUsoTabla(nombreTabla, idRegistro){
  console.log(nombreTabla);
  console.log(idRegistro);

  var params = {
    funct: 'verificaUsoTabla',
    nombreTabla:  nombreTabla,
    idRegistro: idRegistro,
  };

  var htmlOriginal = showLoading('btnElimReg');
  ajaxData(params, function(data){
    hideLoading('btnElimReg', htmlOriginal);
    // console.log(data);
    if(data.success){
      $("#tituloElim").html("Eliminar "+data.palabrasTabla.singularMinus);
      $("#contenidoElim").html(data.texto);
      if(!data.sePuedeEliminar){
        $("#btnElimReg").hide();
        $("#warningNoElim").show();
        $("#elimRegId").val(0);
        $("#elimTipo").val('');
      }else{
        $("#btnElimReg").show();
        $("#warningNoElim").hide();
        $("#elimRegId").val(idRegistro);
        $("#elimTipo").val(nombreTabla);
      }
    }
  });
}

function eliminarRegCatalogo(grid){
  var params = {
        funct: 'eliminarRegCatalogo',
        elimTipo:  $("#elimTipo").val(),
        elimRegId: $("#elimRegId").val(),
      };

  var htmlOriginal = showLoading('btnElimReg');
  ajaxData(params, function(data){
    hideLoading('btnElimReg', htmlOriginal);
    // console.log(data);
      if(data.success){
        if(data.res > 0){
          alertify.success("Registro eliminado correctamente.");
          parent.$.fancybox.close();

          switch ($("#elimTipo").val()) {
            case 'usuarios':
              usuariosGrid.refresh();
              usuariosGrid.commit();
            break;

            case 'clasificaciones':
              clasificacionesGrid.refresh();
              clasificacionesGrid.commit();
            break;

            case 'categorias':
              categoriasGrid.refresh();
              categoriasGrid.commit();
            break;

            case 'canales':
              canalesGrid.refresh();
              canalesGrid.commit();
            break;

            case 'programas':
              programasGrid.refresh();
              programasGrid.commit();
            break;

            default:break;
          }
        }
      }
   });
}

function selectoresPrograma(valor){
  recargaSelector('tipoPrograma', 'categoriaPrograma', 'categorias', valor);
  recargaSelector('tipoPrograma', 'clasificacionPrograma', 'clasificaciones', valor);
  recargaSelector('tipoPrograma', 'canalPrograma', 'canales', valor);
}


function guardarComunicado(){
  tinyMCE.triggerSave();
  $('#contenido').val(tinyMCE.get('contenido').getContent());
  var valorAviso = $("#contenido").val();
  // $("#valorAviso").val("");
  $("#contenidoHd").val($.base64.encode(valorAviso));

  $('#formComunicado').validate({
    ignore: ':hidden:not(.required)',
  });

  if($("#formComunicado").valid()){
    $('#contenido').val("");
    var urlDel = '../ajaxcall/ajaxFunctions.php?funct=guardarComunicado';
    var formElement = document.getElementById("formComunicado");
    var data = new FormData(formElement);
    var file1 = $('input#imgComunicado')[0].files[0];
    if(typeof file1 !== 'undefined'){
      data.append('file', file1);
    }

    var htmlOriginal = showLoading('btnGuardarComunicado');
    console.log(data);
    ajaxDataPost(urlDel, data, function(data){
      hideLoading('btnGuardarComunicado', htmlOriginal);
      console.log(data);

      if(data.opc == "add"){
        if(data.add > 0){
          alertify.success("Se ha agregado el nuevo comunicado");
          $("#idComunicado").val(data.add);
          setTimeout(function(){
            window.location.replace(window.location.href+"?id="+data.add);
          }, 3000);

        }else{
          alertify.warning("No se ha guardado el nuevo comunicado");
        }
      }else{
        if(data.res > 0){
          alertify.success("Se han guardado los cambios correctamente.");
        }else{
          alertify.warning("No hay cambios que guardar.");
        }
      }

      if(data.imgComunicado != ""){
        $("#rowImgComunicado").removeClass('oculto2');
        $("#showImgComunicado").attr("src", "../upload/comunicados/"+data.imgComunicado);
      }
    });
  }
}

function edicionGrid(grid, id){
  console.log(grid);
  console.log(id);

  if(grid=="comunicados"){
    location.href="frmcomunicado.php?id="+id;
  }
}

// Envio de mensajes push
function enviarMesanjeClientesMultiple(){
  $.validator.setDefaults({
    success: "valid"
  });

  if ($("#listaUsuarios").val() !== null) {
    if( $("#formEnviarMensaje").valid() ){
     var htmlOriginal = showLoading('sendMes');

     var params = {
        funct: 'enviarMesanjeClientesMultiple',
        idUsuarios: $("#listaUsuarios").val().toString(),
        tipo: $("#tipoMensaje").val(),
        creador: $("#idUsuarioCbm").val(),
        titulo: $("#tituloMensaje").val(),
        contenido: $("#contenidoMensaje").val()
      };

      ajaxData(params, function(data){
        hideLoading('sendMes', htmlOriginal);
        if(data.success){
          if(data.res > 0){
            alertify.success("Se env&iacute;o mensaje");
            setTimeout(function(){              
              location.href="mensajes.php";
            }, 500);
          }
          else{
            alertify.error("No se env&iacute;o el mensaje.");
          }

        }
        else{
          alertify.error("No se pudo realizar esta accion, intente mas tarde");
        }
      });
    }
  }else {
   alertify.error("Debe seleccionar almenos un usuario");
  }
}




/*function cambiaCheckActivo(check){
  var params = {
    funct: 'cambiaCheckActivo',
    programacionId:  $(check).attr("data-idprogramacion"),
    activo: $(check).attr("data-activo"),
  };
  ajaxData(params, function(data){
      if(data.success){
        if(data.res > 0){
          alertify.success("Cambios guardados.");
          $("#activo_"+$(check).attr("data-idprogramacion")).attr("data-activo", data.activo);
        }
      }
  });
}*/

/*var sliderHorario;
function muestraProgramacionEdit(idProgramacion){
  reseteaFormulario('formProgramacion');
  var params = {
    funct: 'muestraProgramacionEdit',
    programacionId:  idProgramacion,
  };
  var htmlOriginal = showLoading('btnGuardarProgramacion');
  ajaxData(params, function(data){
    hideLoading('btnGuardarProgramacion', htmlOriginal);
      if(data.success){
        $("#programacionId").val(data.idsProg);
        $("#programaId").val(data.programacion.programaId);
        $("#inicioTransmision").val(data.fechaInicioTransmision);
        $("#finTransmision").val(data.fechaFinTransmision);

        var horaInicio = data.programacion.horaInicio;
        var horaFin = data.programacion.horaFin;
        var horaInicioSplit = horaInicio.split(":");
        var horaFinSplit = horaFin.split(":");

        $(".slider-time").html(horaInicioSplit[0]+":"+horaInicioSplit[1]);
        $(".slider-time2").html(horaFinSplit[0]+":"+horaFinSplit[1]);

        $("#horaInicio").val(horaInicio);
        $("#horaFin").val(horaFin);

        var inicio = parseInt(horaInicioSplit[0])*60+parseInt(horaInicioSplit[1]);
        var fin = parseInt(horaFinSplit[0])*60+parseInt(horaFinSplit[1]);

        sliderHorario.slider("option", "values", [inicio, fin]); // Colocado estatico
        // $slide.slider("value", $slide.slider("value")); // forzamos el refreco

        $('input[name="dias[]"]').prop("checked", false);
        $('input[name="dias[]"]').click(function() {
             return false;
             // ^-- missing #
        });  // <-- missing );
        $("#programaId").attr("disabled", true);

        data.arrDias.forEach(function(element) {
          $("#dia_"+element).prop("checked", true);
        });

        $(".divCheckDia").removeClass('fondoGris');
        $(".divCheckDia").addClass('fondoGris');
      }
  });
}*/

/*// Guardar banner
function guardarBanner(){
  var validator = $("#formBanner").validate({ });
  //Validar formulario
  if($("#formBanner").valid()){
    var htmlOriginal = showLoading('btnGuardarBanner');

    var datosForm = $("#formBanner").serializeJSON();
    console.log(datosForm);

    var urlDel = '../ajaxcall/ajaxFunctions.php?funct=funcionPrueba';
    var data = new FormData();
    $.each(datosForm, function(i,v){
      data.append(i, (v!="")?$.base64.encode(v):"");
    });
    data.append('imagen_banner', $('input#imagen_banner')[0].files[0]);

    ajaxDataPost(urlDel, data, function(data){
      hideLoading('btnGuardarAyuda', htmlOriginal);
      console.log(data);
    });
  }else{
    validator.focusInvalid();
    return false;
  }
}*/


//Recargar un selector dependiendo de la seleccion de otro
//Parametros:
//*selectorOrigen: id del selector origen (de donde se obtiene el valor)
//*selectorDestino: id del selector destino (selector que se recargara)
//*tabla: para saber de donde se realizara
//*idConsulta: id de la consulta
function recargaSelector(selectorOrigen, selectorDestino, tabla, idConsulta){
   var params = {
        funct: 'recargaSelector',
        selectorOrigen:  selectorOrigen,
        selectorDestino: selectorDestino,
        tabla: tabla,
        idConsulta: idConsulta,
      };

      var htmlOriginal = showLoading(selectorDestino);
      ajaxData(params, function(data){
        setTimeout(function(){
          hideLoading(selectorDestino, htmlOriginal);
        }, 500);
        console.log(data.html);
        if(data.success){
          setTimeout(function(){
            $("#"+selectorDestino).html(data.html);
          }, 600);
        }
      });
}

function validateMail(){
    $("#guardarFrmUsuario").removeAttr("disabled");
    correo = $("#emailU").val();
    var params = {
          funct: 'verificaExisteEmail',
          email: correo
      };//Parametros ajax
    ajaxData(params, function(data){
       console.log(data);
      if(data.idUsuario!=0)
      {
          $("#msgCorreo").show();
          $("#correo").focus();
          $("#correo").val("");
          $(window).scrollTop(0);
          $("#btnGuardarUsuario").hide();
      }else {
        $("#msgCorreo").hide();
        $("#btnGuardarUsuario").show();
      }
    });
}

function validateClave(clave){
  $("#msgCaracter").hide();
  $("#msgDigito").hide();
  $("#msgLong").hide();
  var division = Array.from(clave.value);
  if (division.length==5) {
  var letras="abcdefghijklmnñopqrstuvwxyz";
  var letrasMay="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
  for (var i = 0; i < division.length; i++) {
    if (i>1) {
      if (isNaN(division[i])) {//si no es numero
          $("#btn_salvar_proceso").hide();
          $("#msgCaracter").hide();
          $("#msgDigito").show();
          break;
        }else {//si es numero
            if (i==4) {
              $("#btn_salvar_proceso").show();
            }
        }
      }else {// caracteres
        if (letras.indexOf(division[i],0)<0 && letrasMay.indexOf(division[i],0)<0) {//No es Caracter
          $("#msgCaracter").show();
          $("#msgDigito").hide();
          $("#btn_salvar_proceso").hide();
          break;
        }
      }
    }
  }else {
    $("#msgLong").show();
    $("#btn_salvar_proceso").hide();
  }
}

function guardarFrmUsuario(){
  if($("#formUsuario").valid()){
    $("#formUsuario").submit();
  }
}

$(document).ready(function(){
  $('#grid_ejemplo tbody').on('click', 'tr', function() {
    var data = gridBT.row(this).data();
    console.log(data);
  });

  /*//Inicio tabla de revisiones
  $(document).on("change", "#estatus_Revicion", function (e) {
    e.preventDefault();
    var estatus_Revicion = accounting.unformat($(this).val());
    if(estatus_Revicion==2){
      $("#cometario_revisiones").addClass("required");
    }else{
      $("#cometario_revisiones").removeClass("required");
    }
  });*/
  //Fin tabla de revisiones
});


function registroCatalogo(tipo, id, idT){
  //console.log(tipo);
  //console.log(id);
  //console.log(idT);
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
    $("#tratamientoIdEnfermedadForm").val(idT);
    $("#btnGuardarEnfermedad").show();
  }else if(tipo == 'alergia'){
    reseteaFormulario('formAlergia');
    $("#btnGuardarAlergia").show();
  }else if(tipo == 'medicamentos'){
    reseteaFormulario('formMedicamentos');
    $("#tratamientoId").val(idT);
    $("#btnGuardarMedicamentos").show();
  }else if(tipo == 'cirugias'){
    reseteaFormulario('formCirugia');
    $("#btnGuardarCirugias").show();
  }
  else if(tipo == 'fuentes'){
    reseteaFormulario('formFuente');
    $("#btnGuardarFunte").show();
  }
  else if(tipo == 'metodos'){
    reseteaFormulario('formMetodo');
    $("#btnGuardarMetodo").show();
    $("#tratamientoIdMetodo").val(idT);
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
      var accion = $('input[name=opciones]:checked').val();
      var alerta = $("#alertaEnfermedad").val();
      var htmlOriginal = showLoading('btnGuardarEnfermedad');
      var params = {
        funct: 'salvarEnfermedad',
        enfermedad: $("#nombreEnfermedad").val(),
        accion: $('input[name=opciones]:checked').val(),
        tratamientoId: $('#tratamientoIdEnfermedadForm').val(),
        activo: $('input[name=chck_activo]:checked').val(),
        fecha: $("#fechaRegistro").val(),
        alerta: $("#alertaEnfermedad").val(),
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarEnfermedad',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.enfermedad).attr("data-opcid",accion).attr("data-opcinfo",alerta)
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
        tratamientoId: $('#tratamientoId').val(),
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
  }else if(tipo == 5){
    if($("#formFuente").valid()){
      var htmlOriginal = showLoading('btnGuardarFuente');
      var params = {
        funct: 'salvarFuente',
        nombre: $("#nombreFuente").val(),
        activo: $('input[name=chck_activofuente]:checked').val(),
        fecha: $("#fechaRegistro").val()
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarFuente',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.nombre)
          $("#dp_fuente").append(newOpt);
          $(".selector").formSelect();
          
        }
      });
    }
  }else if(tipo == 6){
    if($("#formMetodo").valid()){
      var htmlOriginal = showLoading('btnGuardarMetodo');
      var params = {
        funct: 'salvarMetodo',
        nombre: $("#nombreMetodo").val(),
        activo: $('input[name=chck_activometodo]:checked').val(),
        fecha: $("#fechaRegistroMetodo").val(),
        tratamientoId: $('#tratamientoIdMetodo').val(),
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnGuardarMetodo',htmlOriginal);
        console.log(data.success);
        if(data.success){
          parent.$.fancybox.close();

          //agregamos el nuevo registro a los option del selector
          var newOpt = $("<option>").attr("value",data.id).text(data.nombre);
          //2/7/2020 Jair Agrgar el option a todos los selectores de la clase
          $(".dp_metodos").append(newOpt);
          $(".selector").formSelect();
          
        }
      });
    }
  }
  
}

function revisaRadioAlerta(opc, input){
  /* if(opc == 'enfermedades'){
    if ($('apto').is(':checked')) {
      $("#alertaEnfermedad").val("");
    }
    if ($('sin_garantia').is(':checked')) {
      $("#alertaEnfermedad").val("Sin garantia");
    }
    if ($('no_apto').is(':checked')) {
      $("#alertaEnfermedad").val("No apto");
    }
    


  } */
}

function calcularEdad(fecha) {
  // console.log(fecha);
  if(typeof fecha !== "undefined"){
    var n = fecha.search("/");
    if(n > -1){
      var arrFecha = fecha.split("/");
      fecha = arrFecha[2]+"-"+arrFecha[1]+"-"+arrFecha[0];
    }
    var hoy = new Date();
    var cumpleanos = new Date(fecha);
  // console.log(cumpleanos);
    var edad = hoy.getFullYear() - cumpleanos.getFullYear();
    var m = hoy.getMonth() - cumpleanos.getMonth();
  
    if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
        edad--;
    }
  
    edad = (isNaN(edad))?0:edad;
  }else{
    edad = 0;
  }

  return edad;
}
//JGP 07/06/2020
//coloca la edad calculada del campo fecha nacimiento
function setEdad(){
  var edad = calcularEdad($("#dp_nacimiento").val());
  // console.log("edad "+edad);  
  $("#dp_edad").val(edad);
}

// JAIR 25/6/2020 Guardar solo datos basicos
function soloBasicoChange(){
  if ($('#soloBasico').is(':checked')) {
    $("#dp_paterno").removeClass("required");
    $("#dp_materno").removeClass("required");
    $("#dp_email").removeClass("required");
    $("#dp_nacimiento").removeClass("required");
    $("#dp_ocupacion").removeClass("required");
    dp_ocupacion
  }else{
    $("#dp_paterno").removeClass("required");
    $("#dp_materno").removeClass("required");
    $("#dp_email").removeClass("required");
    $("#dp_nacimiento").removeClass("required");
    $("#dp_ocupacion").removeClass("required");

    $("#dp_paterno").addClass("required");
    $("#dp_materno").addClass("required");
    $("#dp_email").addClass("required");
    $("#dp_nacimiento").addClass("required");
    $("#dp_ocupacion").addClass("required");
  }
}

function trimemail(input){
  var str = $("#"+input).val();
  // alert(str.trim());
  $("#"+input).val(str.trim());
}

function guardarAlergiasPros(){
    var htmlOriginal = showLoading('btnGuardarAlergiaPros');
    var params = {
      funct: 'guardarAlergiasPros',
      dp_ids_opciones: $("#dp_ids_opciones").val(),
      idProspecto: $('#idProspecto').val(),
      
    };
    ajaxData(params, function(data){
      console.log(data);
      hideLoading('btnGuardarAlergiaPros',htmlOriginal);
      console.log(data.success);
      if(data.success){
        parent.$.fancybox.close();
        alertify.success("Alimentos guardados");
      }
    });
}

function actualizarDatosBasicos(opcMedEst){
  var idUsrMedEstetica = (typeof opcMedEst !== "undefined")?$("#idUsrMedEstetica").val():0;
  if($('#idProspecto').val() == 0){
    $("#soloBasico").attr("checked",true);
    $("#soloBasico").trigger("change");
    if($("#btn_salvar_proceso").length){
      $("#btn_salvar_proceso").click();
    }else{
      $("#btn_salvar_prospecto").click();
    }
  }else{
    var htmlOriginal = showLoading('btnActualiazarDatosBasicos');
      var params = {
        funct: 'actualizarDatosBasicos',
        idProspecto: $('#idProspecto').val(),
        dp_fechacita: $("#dp_fechacita").val(),
        dp_nombre: $('#dp_nombre').val(),
        dp_paterno: $("#dp_paterno").val(),
        dp_sexo: $("input[name='dp_sexo']:checked").val(),
        idUsrMedEstetica: idUsrMedEstetica,
        
      };
      ajaxData(params, function(data){
        console.log(data);
        hideLoading('btnActualiazarDatosBasicos',htmlOriginal);
        console.log(data.success);
        if(data.success){
          if(data.res > 0){
            alertify.success("Se han actualizado los datos basicos");
          }else{
            alertify.success("No hay cambios que guardar en datos basicos");
          }
        }
      });
  }
}

function muestraReporte(){
  var numReporte = $("#reporteNum").val();
  if($("#formReportes").valid()){
    var sucursalId = $("#sucursalId").val();
    var from = $("#from").val();
    var to = $("#to").val();
    if(numReporte == 7){
      window.open("reporteGerencialExcel.php?numReporte="+numReporte+"&sucursalId="+sucursalId+"&from="+from+"&to="+to, "_blank");
    }else{
      window.open("reportesExcel.php?numReporte="+numReporte+"&sucursalId="+sucursalId+"&from="+from+"&to="+to, "_blank");

    }
  }
}

function cambiaReporte(numReporte){
  // if(numReporte == 7){
    $("#rowRangoFechas").show();
  // }else{
    // $("#rowRangoFechas").hide();
  // }
}


// Imp. 21/07/20
function modalExcepAlergicas(){
  //initialize all modals
  $('.modal').modal({
      dismissible: false,
  });
  $('#modalListaExcepciones').modal('open');
}

function verTratamientos(idCliente){
  if(idCliente > 0){
    var params = {
      funct: 'consultarTratamientosByCliente',
      idC:  idCliente,
    };
    ajaxData(params, function(data){
      if(data.success){
       console.log(data);
        //$("#divTextAreaConfig").html('<textarea class="form-control required" id="valorConfig" name="valorConfig">'+data.datosConf.valor+'</textarea>');

        /*setTimeout(function(){
          var params = {selector:"#valorConfig", height:"230", btnImg:false};
          opcionesTinymce(params);
          // hideLoading('btnGuardarConfig', htmlOriginal);
        }, 1000);*/
      }
    });
  }

  $('#modalVerTratamientos').modal('open');
}

function detenerVideo(){
  console.log("detener video");
  console.log(document.getElementById('videoMonzani'));
  document.getElementById('videoMonzani').pause();
  
}

function cerrarFancyVideo(){
  parent.$.fancybox.close();
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

function cambiaEstatusPros(){
  $("#btn_salvar_proceso").trigger("click");
}

function cerrarModalDescartar(){
  console.log("cerar descartar");
  $("#no_asistio").prop( "checked", false );
  $("#no_contrato").prop( "checked", false );
}


// Imp. 17/08/20
// Pupup de agenda
$(".agendaPupup").fancybox({
  maxWidth  : 800,
  maxHeight : 680,
  fitToView : false,
  width   : '100%',
  height    : 'auto',
  autoSize  : false,
  closeClick  : false,
  openEffect  : 'none',
  closeEffect : 'none',
  scrolling   : 'no',
});


// Imp. 19/08/20
// Sumar milisegundos a una fecha
function sumarTiempoFecha(fecha, tiempoMilis=0, opc=0){
  let fechaObj = new Date(fecha);
  let tiempoFechaObjMiliseg = fechaObj.getTime();

  var d = new Date(tiempoFechaObjMiliseg + tiempoMilis);
  var month = d.getMonth()+1;
  var day = d.getDate();
  var horas= (d.getHours()>=10) ?d.getHours() :'0'+d.getHours();
  var minutos = (d.getMinutes()>=10) ?d.getMinutes() :'0'+d.getMinutes();
  var segundos = "00";//d.getSeconds();

  //0000-00-00 0:00:00
  if(opc==0){
    var dateCurrent = d.getFullYear() +'-'+ ((''+month).length<2 ? '0' : '') + month +'-'+ ((''+day).length<2 ? '0' : '') + day;
  }
  //00/00/0000 0:00:00
  if(opc==1){
    var dateCurrent = ((''+day).length<2 ? '0' : '') + day +'/'+ ((''+month).length<2 ? '0' : '') + month + '/' + d.getFullYear();
  }
  var tiempo = horas + ":" + minutos + ":" + segundos;

  return dateCurrent+" "+tiempo;

  // return  new Date(tiempoFechaObjMiliseg + tiempoMilis);
}

// Reemplazar todo
function replaceTodo(string, find="", replace=""){
  var re;
  let findArr = find.split(",");

  findArr.forEach(function(entry){
    console.log(entry);
    re = new RegExp(entry, 'g');
    string = string.replace(re, replace);
  });

  return string;
}

//Imp. 14/09/20
// Ver detalles de pagos Microsip
function verDetallesPagos(expTratamientoId, cliente, tratamiento, fContrato, montoContrato, montoPagado, saldo){
  $("#dpms_idExpTra").html("<b>"+expTratamientoId+"</b>");
  $("#dpms_nombre").html("<b>"+cliente+"</b>");
  $("#dpms_tratamiento").html("<b>"+tratamiento+"</b>");
  $("#dpms_fContrato").html("<b>"+fContrato+"</b>");
  $("#dpms_montoContrato").html("<b>"+montoContrato+"</b>");
  // $("#dpms_montoPagado").html("<b>"+montoPagado+"</b>");
  $("#dpms_saldo").html("<b>"+saldo+"</b>");

  var params = {funct:'obtDetallePagoMS', expTratamientoId:expTratamientoId};
  ajaxData(params, function(data){
    console.log(data);
    $('#modalDetallesPagos').modal('open');
    if(data.success){
      let html = "";
      $.each(data.colDetallePAgos, function(i,v) {
          console.log(v);
          html += '<tr>';
            html += '<td>'+v.folio+'</td>';
            html += '<td>'+v.fechahc+'</td>';
            html += '<td>$'+v.importe2+'</td>';
            html += '<td>'+v.tipoPago+'</td>';
          html += '</tr>';
      });
      $("#cont_detallespagos").html(html);
    }
  });
}

// Genera pdf carta de bienvenida
function pdfCartaBienvenida(){
  // Datos prospecto
  var idExpTratamiento = $("#dp_idexptratamiento").val();
  var nombreCompleto = $("#dp_nombre").val() +" "+ $("#dp_paterno").val() +" "+ $("#dp_materno").val();

  var params = {idExpTratamiento:idExpTratamiento, nombreCompleto:nombreCompleto};
  //console.log(params);
  // return false;
  params = paramsB64(params);
  params['funct'] = 'generarCartaBienvenidaPDF';
  // console.log(params);
  ajaxData(params, function(datosResp){

    //console.log(datosResp);
    // return false;

    if(datosResp.result==true){
      //console.log(datosResp);
      $('<form target="_blank" action="' + datosResp.adjunto + '" method="get"></form>').appendTo('body').submit().remove();
    }else{
      alertify.error("No se ha podido generar la carta, intentar nuevamente.");
    }
  });
}

/*function initGridBTById(idTabla, parameters){
  var parametros = obtenerParametrosDataTable(idTabla, parameters);

  var gridBT = $('#'+idTabla).DataTable({
        scrollY: true,
        scrollX: true,
        scrollCollapse: true,
        searching: true,
        dom: 'Bfrtip',
        bInfo: true,
        responsive: true,
        paging: true,
        columnDefs: parametros["columnDefs"],
        fixedColumns:   parametros["fixedCol"],
        "processing": parametros["processing"],
        "serverSide": parametros["serverSide"],
        "ajax": parametros["ajax"],
        "pageLength": 10,
        lengthChange: parametros["lengthChange"],
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, "Todos"]],
        language: {
            "url": "../js/Spanish.json?upd=2"
        },
        aaSorting: [],
        "rowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        }
    });

  return gridBT;
}
*/


/*function loadModalRevisiones(){
  $('#formRevisionesProceso')[0].reset();
  $('#modalRevisiones').modal('show');
}*/

/*function saveRevision(){
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
}*/

/*function printProcess(){
  var idProceso = $('#dp_idProceso').val();
  // console.log(idProceso);
  window.open("../admin/pdfProceso.php?idProc="+idProceso, "_blank");
}*/

/*// Descarga de la imagen en pdf
function descargaDiagramaPdf(img){
  img = $.base64.encode(img);
  var arrParams = [];
  arrParams[0] = {"name":"urlDiagrama", "val":img};
  postDinamico("../admin/pdfDiagrama.php", arrParams, "_blank");
}*/

/*
function Handle_OnRowConfirmEdit(sender,args){
  var _row = args["Row"];
  console.log(sender.id);
  var tabla = "";
  if(sender.id == "versionPrecioGrid"){
    tabla = "version_precios";
  }
  if(sender.id == "usuariosGrid"){
    tabla = "usuarios";
  }
  if(tabla != "")
  {
    // console.log("hola2");
    params = {funct: 'updActualizacion', tabla:tabla};
    ajaxData(params, function(data){
      if(data.success){
        console.log("actualizado");
      }
    });
  }
}

function Handle_OnConfirmInsert(sender,args){
  console.log(sender.id);
  var tabla = "";
  if(sender.id == "versionPrecioGrid"){
    tabla = "version_precios";
  }
  if(sender.id == "usuariosGrid"){
    tabla = "usuarios";
  }
  if(tabla != ""){
    params = {funct: 'updActualizacion', tabla:tabla};
    ajaxData(params, function(data){
      if(data.success){
        console.log("actualizado");
      }
    });
  }
}
*/

/*//Acciones necesarias para cuando se muestra el fancy desactivar usuarios en catalogos
function muestraDesactivarUsuario(idUsuario, nombre, activo){
  console.log(idUsuario);
  $("#idUsuarioDesactivar").val(idUsuario);
  var opcion = "Desactivar";
  var opc = 0;
  if(activo == 0){
    opcion = "Activar";
    opc = 1;
  }
  $("#activoUsuario").val(opc);
  $("#btnDesactivarUsuario").val(opcion);
  $("#opcionUsuario").html(opcion);
  $("#nombreUsuarioText").html(nombre);
}
*/

/*//Metodo que elimina el registro desde un grid
function eliminar_reg(id, opc){
  console.log(id);
  console.log(opc);
  var msg = '&#191Est&aacute; seguro de eliminar esta fila';
  switch (opc){
    case 'gama_modelo':
      msg += ", si es asi se borraran las versiones que lo contengan";
      alertify.confirm("<strong>"+msg+ "?</strong>", function(){
      },function(){
      }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
    break;
    case 'version_modelo':
      msg += ", si es asi se borraran todo su contenido interior";
      alertify.confirm("<strong>"+msg+ "?</strong>", function(){
      },function(){
      }).set({labels:{ok:'Aceptar', cancel: 'Cancelar'}, padding: false});
    break;
  }
}
*/