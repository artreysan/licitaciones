$(document).ready(function(){ 
    
    $("#list_gm").change(function (){              
        var contTotal = parseInt($("#countTotalImgs").val()); 
        if($(this).val() != ''){
            $("#idUpbtn").css("display","block");
        }else{
            $("#idUpbtn").css("display","none");
        }
                    
        if($(this).val()=='4'){
            if(contTotal>1){
                alert('Solo se permiten 1 imagen para el recorrido virtual');
                stopPropagation();
                preventDefault();
            }
        }
        
    });
    
    var config = {
	support : "image/jpg,image/png,image/jpeg,image/gif",		// Valid file formats
	form: "demoFiler",					// Form ID
	dragArea: "dragAndDropFiles",		// Upload Area ID
	uploadUrl: "../uploadfiles.php?funct=uploadImagesGM"				// Server side upload url                        
    };

  multiUploader(config); 
  
  $("#imagesGMContGrid_updatepanel_loading").css("top", "0px");
  $("#imagesGMContGrid_updatepanel_loading").css("width", "400px");        
  $("#imagesGMContGrid_updatepanel_loading").css("height", "100%");  
  
});

//logica para subir images al directorio de upload_files
function multiUploader(config){    
	this.config = config;
	this.items = "";
	this.all = [];
	var self = this;                               
    
	_init = function(){            
		if (window.File && window.FileReader && window.FileList && window.Blob) {											                         
			 var inputId = $("#"+this.config.form).find("input[type='file']").eq(0).attr("id"); 
                                                                           
			 document.getElementById(inputId).addEventListener("change", _read, false);
			 document.getElementById(this.config.dragArea).addEventListener("dragover", function(e){ e.stopPropagation(); e.preventDefault(); }, false);
			 document.getElementById(this.config.dragArea).addEventListener("drop", this._dropFiles, false);
			 document.getElementById(this.config.form).addEventListener("submit", this._submit, false);
		} else
			console.log("Browser supports failed");
	}        	
        
	_submit = function(e){                        
		e.stopPropagation(); e.preventDefault();
		_startUpload();                
	}
	
	_preview = function(data){            
                //console.log(data);
		this.items = data;                
		if(this.items.length > 0){
			var html = "";		
			var uId = "";
                        var totalImg = parseInt($("#countTotalImgs").val()); 
                        var longPrev = this.items.length;                                                                        
                        var sum = totalImg+longPrev;                                               
                        var list_gm = $("#list_gm").val();                                                
                        $("#countTotalImgs").val(sum);
                        
                        if(list_gm=='4'){                            
                            var totalImg = parseInt($("#countTotalImgs").val()); 
                            console.log(totalImg);
                            if(totalImg>1){
                                alert('Solo se permiten 1 imagen para el recorrido virtual');                
                                stopPropagation(); 
                                preventDefault();
                            }else{                                
                               for (var i = 0; i < this.items.length; i++) {
                                    // uId = this.items[i].name._unique();
                                    uId = this.items[i].name._randomstring();
                                    console.log(uId);
                                    var imagePath = $("#urlIcons").val();
                                    var sampleIcon = '<img src="../images/image_icon.png" />';
                                    var errorClass = "";
                                    if (typeof this.items[i] != undefined) {
                                        if (_validate(this.items[i].type) <= 0) {
                                            sampleIcon = '<img src="../images/unknown.png" />';
                                            errorClass = " invalid";
                                        }
                                        html += '<div class="dfiles' + errorClass + '" rel="' + uId + '"><h5>' + sampleIcon + this.items[i].name + '</h5><div id="' + uId + '" class="progress" style="display:none;"><img src="../images/ajax-loader.gif" /></div></div>';
                                    }
                                }
                                $("#dragAndDropFiles").append(html); 
                            }
                        }else{
                            for (var i = 0; i < this.items.length; i++) {
                                // uId = this.items[i].name._unique();
                                uId = this.items[i].name._randomstring();
                                console.log(uId);
                                var imagePath = $("#urlIcons").val();
                                var sampleIcon = '<img src="../images/image_icon.png" />';
                                var errorClass = "";
                                if (typeof this.items[i] != undefined) {
                                    if (_validate(this.items[i].type) <= 0) {
                                        sampleIcon = '<img src="../images/unknown.png" />';
                                        errorClass = " invalid";
                                    }
                                    html += '<div class="dfiles' + errorClass + '" rel="' + uId + '"><h5>' + sampleIcon + this.items[i].name + '</h5><div id="' + uId + '" class="progress" style="display:none;"><img src="../images/ajax-loader.gif" /></div></div>';
                                }
                            }
                            $("#dragAndDropFiles").append(html);                             
                        }
		}
                //$("#multiUpload").val('');
	}

	_read = function(evt){                       
		if(evt.target.files){                                                
			_preview(evt.target.files);                        
			self.all.push(evt.target.files);                        
		} else 
			console.log("Failed file reading");
	}
	
	_validate = function(format){           
		var arr = this.config.support.split(",");                
		return arr.indexOf(format);
	}
	
	_dropFiles = function(e){            
		e.stopPropagation(); e.preventDefault();
		_preview(e.dataTransfer.files);
		self.all.push(e.dataTransfer.files);                                
	}
	
	_uploader = function(file,f){                        
            // var list_gm = $("#list_gm").val();     
            var list_gm = 1;     
            var totalImg = parseInt($("#countTotalImgs").val()); 
            
            if(list_gm=='4'){
                if(totalImg>1){
                    alert('Solo se permiten 1 imagen para el recorrido virtual');                
                    stopPropagation(); 
                    preventDefault();
                }
            }
                        
		if(typeof file[f] != undefined && self._validate(file[f].type) > 0){                                                
                        //var count = 0;
			var data = new FormData();
			// var ids = file[f].name._unique();
            var ids = file[f].name._randomstring();
                        var idGM = $("#idGM").val();
                                                                                                                       
			data.append('file',file[f]);
                        var list_gm = $("#list_gm").val();
                        data.append('list_gm',list_gm);
                                                                        
			data.append('index',ids);
                        data.append('idGM',idGM);                        
                        
                        // console.log(idGM);
                        
			$(".dfiles[rel='"+ids+"']").find(".progress").show();                                                
                        
			$.ajax({
				type:"POST",
				url:this.config.uploadUrl,
				data:data,
				cache: false,
				contentType: false,
				processData: false,
                                async: true,
                                complete: function(){
                                   //Ejecutar cuando se haya terminado el proceso de subida                                                                                                             
                                    // imagesGMContGrid.refresh();
                                    // imagesGMContGrid.commit();
                                    var idUrl = $("#idGM").val();
                                    $("#countTotalImgs").val('0');                                    
                                },
				success:function(rponse){
                    // console.log(rponse);

                    if(rponse != '0')
                    {
                        alertify.success("Imagen guardada correctamente.");
                        versionZonaActivaGrid.refresh();
                        versionZonaActivaGrid.commit();
                        setTimeout(function(){
                          if($(".btnEditarImgGaleria").length){
                            $(".btnEditarImgGaleria").fancybox({
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
                        }, 1000);
                        
                    }
                    else
                    {
                        alertify.error("Error al subir imagen");
                    }
					$("#"+ids).hide();
					var obj = $(".dfiles").get();
                                        //console.log(obj);
					$.each(obj,function(k,fle){                                            						
                                            $(fle).slideUp("normal", function(){ $(this).remove(); });                                                                                                                  
					});
					if (f+1 < file.length) {
						self._uploader(file,f+1);                                               
					}                                    
				}                                
			});                        
                        
		} else{
			console.log("Invalid file format - "+file[f].name);
            alertify.error("Formato de archivo invalido - "+file[f].name)
                }           
	}
	
	_startUpload = function(){ 
    console.log("_startUpload")           ;
		if(this.all.length > 0){
			for(var k=0; k<this.all.length; k++){
				var file = this.all[k];                                
				_uploader(file,0);
                              //$("#multiUpload").val('');      
			}
                        this.all = [];
		}
        else{
            alertify.error("Por favor agregue una imagen para subir");
        }     
          
                
	}
	
	String.prototype._unique = function(){
		return this.replace(/[a-zA-Z]/g, function(c){
     	   return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    	});
	}
    String.prototype._randomstring = function(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 15; i++){
           text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text+'.wct';
	}               
        
        _init();	
}

//metodo que elimina la imagen del directorio y su respectivo nombre en db
function delImageGM(pathImg){   
    console.log(pathImg);
    var data = new FormData();    
    var urlPath = "index.php?option=com_mozi&task=uploadfiles.delImageGM";                            
    data.append('pathImg',pathImg);
    
    $.ajax({
            type:"POST",
            url:urlPath,
            data:data,
            cache: false,
            contentType: false,
            processData: false,
            async: true,
            beforeSend: function(rponse){
                //mostrar imagen loading hasta completar el proceso
                $("#imagesGMContGrid_updatepanel_loading").css("display","block");                                
            },
            complete: function(){
               //Ejecutar cuando se haya terminado el proceso de borrado                                                                                                             
                imagesGMContGrid.refresh();
                imagesGMContGrid.commit();                
            },
            success:function(rponse){                                                            
            }
    });     
}

// Joomla.submitbutton = function(task)
// {
//     if (task == '')
//     {
//         return false;
//     }
//     else
//     {
//         var isValid = true;
//         var action = task.split('.');
//         if (action[1] != 'cancel' && action[1] != 'close')
//         {
//             var forms = $$('form.form-validate');
//             for (var i = 0; i < forms.length; i++)
//             {
//                 if (!document.formvalidator.isValid(forms[i]))
//                 {
//                     isValid = false;
//                     break;
//                 }
//             }
//         }

//         if (isValid)
//         {
//             Joomla.submitform(task);
//             return true;
//         }
//         else
//         {            
//             return false;
//         }
//     }
// }