<?php
session_start();
$checkRol = ($_SESSION['idRol']==1 || $_SESSION['idRol']==2 || $_SESSION['idRol']==4 || $_SESSION['idRol']==5 || $_SESSION['idRol']==6) ?true :false;

if($_SESSION['status']!= "ok" || $checkRol!=true)
        header("location: logout.php");


include_once '../common/screenPortions.php';
include '../brules/utilsObj.php';
require_once '../brules/KoolControls/KoolAjax/koolajax.php';
libreriasKool();
include_once '../brules/EmailFunctionsObj.php';
include_once '../brules/usuariosObj.php';
//include_once '../brules/prospectosObj.php';
include_once '../brules/expedienteClientesObj.php';
include_once '../brules/expedienteValoracionObj.php';
include_once '../brules/expedienteDiagnosticoObj.php';

include_once '../brules/catEstatusObj.php';
include_once '../brules/catPartesCuerpoObj.php';
include_once '../brules/catEnfermedadesObj.php';
include_once '../brules/catAlergiasObj.php';
include_once '../brules/catMedicamentosObj.php';
include_once '../brules/catCirugiasObj.php';
include_once '../brules/catMetodosObj.php';
include_once '../brules/catTiposPartoObj.php';
include_once '../brules/expedienteSesionesObj.php';
include_once '../brules/parametrosPropuestaObj.php';
include_once '../brules/catZonasObj.php';
$dirname = dirname(__DIR__);
include $dirname.'/common/config.php';

// $procesosObj = new procesosObj();
$usuariosObj = new usuariosObj();
$expClienteObj = new expedienteClientesObj();
$expValObj = new expedienteValoracionObj();
$expDiagObj = new expedienteDiagnosticoObj();

$catEstatusObj = new catEstatusObj();
$catPartesCuerpoObj = new catPartesCuerpoObj();
$catEnfermedadesObj = new catEnfermedadesObj();
$catAlergiasObj = new catAlergiasObj();
$catMedicamentosObj = new catMedicamentosObj();
$catCirugiasObj = new catCirugiasObj();
$catMetodosObj = new catMetodosObj();
$catTipoPartoObj = new catTiposPartoObj();
$expedienteSesionesObj = new expedienteSesionesObj();
$paramPropuestaObj = new parametrosPropuestaObj();
$catZonasObj = new catZonasObj();
$timeZone = obtDateTimeZone();

//Variables
$opcMsg = 0;
$fechaAlta = $timeZone->fechaHoraF2;
$fechaAct = "";
//Obtener variable de la url
$idC = (isset($_GET["idC"]))?$_GET["idC"]:0; //id cliente
$idT = (isset($_GET["idT"]))?$_GET["idT"]:0; //id tratamiento
$idS = (isset($_GET["idS"]))?$_GET["idS"]:0; //id Sesion
$pCuerpoBrazos  = ($colDatosExpDiag->pCuerpoBrazos!="")?json_decode($colDatosExpDiag->pCuerpoBrazos):array();

$msjResponse = "";
$msjResponseE = "";

$pCuerpoAbdomen = "";
$pCuerpoEspalda = "";
$pCuerpoPiernas = "";
$pCuerpoGluteos = "";

//obt col de estatus
$colEstatus = $catEstatusObj->ObtEstatus(1, 0);
$colPartesCuerpo = $catPartesCuerpoObj->ObtPartesCuerpo();
$colEnfermedades = $catEnfermedadesObj->ObtCatEnfermedades(1,1);
$colAlergias = $catAlergiasObj->ObtCatAlergias();
$colMedicamentos = $catMedicamentosObj->ObtCatMedicamentos(1, 1);
$colCirugias = $catCirugiasObj->ObtCirugias();
$colMetodos = $catMetodosObj->ObtMetodos(1, 1);
$colPartos = $catTipoPartoObj->ObtTiposParto();
$colExpedienteSesiones = $expedienteSesionesObj->ExpSesionPorIdExpAndIdTrat($idC, $idT);
$colSesion = $expedienteSesionesObj->ExpSesionPorId($idS);
$colZonas = $catZonasObj->ObtZonas(2);
//Obtener el numero de sesion actual
//Imp. 26/05/20
//Tomar el numero de sesiones por expClienteId, expTratamientoId
$colExpSesiones = $expedienteSesionesObj->ColExpSesionPorIdExpAndIdTrat($idC, $idT);
$sesionActual = count($colExpSesiones);
$repCheckBoqueoSesion = (object)$paramPropuestaObj->CheckBoqueoSesion($sesionActual, $idC, $idT);
// Datos parametros propuesta Imp.16/06/20
$paramsPropuesta = $paramPropuestaObj->ObtDatosPropuestaPorExpCliTrat($idC, $idT);
//Obtener el tratamiento contratado //>>>> JGP 23/08/2020 >>>> //Debemos cargar la info deribada de IdCliente y idTratamiento
//$paramsPropuesta = $paramPropuestaObj->ObtDatosPropuestaPorCampo("expClienteId", $idC);
//Imp. 21/07/20
$paramsPropuesta2 = $paramPropuestaObj->ObtDatosPropuestaPorExpCliTrat($idC, $idT);
$emailUsrApp = "";
$passUsrApp = "";
if($paramsPropuesta2->usuarioIdApp!=""){
    $datosUsr = $usuariosObj->UserByID(trim($paramsPropuesta2->usuarioIdApp));
    $emailUsrApp = $datosUsr->email;
    $passUsrApp = $datosUsr->password;
}


//obt. datos cliente
$colDatosExpCliente = $expClienteObj->ExpClientePorId($idC);
$estatusExpC = $colDatosExpCliente->estatusId;
$opcT = $colDatosExpCliente->tratamientoOpc; //Variable con el tratamiento al que pertenece

// obt. datos valoracion por el id del tratamiento
$colDatosExpVal = $expValObj->ExpValPorId("expTratamientoId", $idT);
$arrHijos = ($colDatosExpVal->hijos!="")?(object)json_decode($colDatosExpVal->hijos):array();
$totalHijos = "";
if(count($arrHijos)>0){
    $totalHijos = $arrHijos->totalHijos;
    $numPartos = $arrHijos->partos;
}
$enfermedadIds = ($colDatosExpVal->enfermedadIds!="")?explode(",", $colDatosExpVal->enfermedadIds):array();
$alergiaIds = ($colDatosExpVal->alergiaIds!="")?explode(",", $colDatosExpVal->alergiaIds):array();
$medicamentoIds = ($colDatosExpVal->medicamentoIds!="")?explode(",", $colDatosExpVal->medicamentoIds):array();
$cirugiasIds = ($colDatosExpVal->cirugiasIds!="")?explode(",", $colDatosExpVal->cirugiasIds):array();

// obt. datos diagnostico por el id del tratamiento
$colDatosExpDiag = $expDiagObj->ExpDiagPorId("expTratamientoId", $idT);
$pCuerpoBrazos  = ($colDatosExpDiag->pCuerpoBrazos!="")?json_decode($colDatosExpDiag->pCuerpoBrazos):array();
$pCuerpoAbdomen = ($colDatosExpDiag->pCuerpoAbdomen!="")?json_decode($colDatosExpDiag->pCuerpoAbdomen):array();
$pCuerpoEspalda = ($colDatosExpDiag->pCuerpoEspalda!="")?json_decode($colDatosExpDiag->pCuerpoEspalda):array();
$pCuerpoPiernas = ($colDatosExpDiag->pCuerpoPiernas!="")?json_decode($colDatosExpDiag->pCuerpoPiernas):array();
$pCuerpoGluteos = ($colDatosExpDiag->pCuerpoGluteos!="")?json_decode($colDatosExpDiag->pCuerpoGluteos):array();
$bodyInfo = json_decode($colDatosExpDiag->trabajoDeCuerpo);

$jsonVal = ($colDatosExpVal->datosJson!="") ?json_decode($colDatosExpVal->datosJson) :array();
$jsonValOpc = (count($jsonVal) > 0)?true:false;
$jsonDiag = ($colDatosExpDiag->datosJson!="") ?json_decode($colDatosExpDiag->datosJson) :array();
$jsonDiagOpc = (count($jsonDiag) > 0)?true:false;


//Recibe el post
if(isset($_POST['form_expclientet2'])){
    base64DecodeSubmit(1, $_POST);
    
    /*echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    exit();*/
    $datosJsonPotencia  = array();
    $datosJsonPulso  = array();
    $datosJsonPmanipulo  = array();
    // Setear datos json sesiones para el tratamiento de fotodepilacion
    foreach ($colZonas as $key=>$elem) { 
        if($jsonDiag->{"t2_".$elem->alias} == 1){
            $datosJsonPotencia["potencia_".$elem->alias] = (isset($_POST["potencia_".$elem->alias])) ? $_POST["potencia_".$elem->alias]: "";
            $datosJsonPulso["pulsos_".$elem->alias] = (isset($_POST["pulsos_".$elem->alias])) ? $_POST["pulsos_".$elem->alias]: "";
            $datosJsonPmanipulo["pmanipulo_".$elem->alias] = (isset($_POST["pmanipulo_".$elem->alias])) ? $_POST["pmanipulo_".$elem->alias]: "";
        }
    }
    $datosJsonInfo = array("potencia"=>$datosJsonPotencia, "pulsos"=>$datosJsonPulso, "pmanipulo"=>$datosJsonPmanipulo);
    $arrCalificacion = array("ds_atencion"=>$_POST["ds_atencion"], "ds_actitud"=>$_POST["ds_actitud"], "ds_limpieza"=>$_POST["ds_limpieza"]);
    $calificacion = json_encode($arrCalificacion);

    $idExpSesion = ($_POST["idExpSesion"] > 0) ? $_POST["idExpSesion"] : 0;
    $expedienteSesionesObj->expClienteId = $_POST["dp_idexpcliente"];
    $expedienteSesionesObj->expTratamientoId = $_POST["expTratamientoId"];
    $expedienteSesionesObj->usuarioId = $_POST["usuarioIdCreador"];
    $expedienteSesionesObj->fecha = conversionFechaF3($_POST["ds_fechacita"]);
    $expedienteSesionesObj->noSesion = $_POST["ds_sesion"];
    $expedienteSesionesObj->fase = "";
    $expedienteSesionesObj->peso = "";
    $expedienteSesionesObj->tcm = "";
    $expedienteSesionesObj->imc = "";
    $expedienteSesionesObj->imcGrasa = "";
    $expedienteSesionesObj->gv = "";
    $expedienteSesionesObj->musculo = "";
    $expedienteSesionesObj->trabajoDeCuerpo = ""; //json
    $expedienteSesionesObj->observaciones = $_POST["ds_observaciones"];
    $expedienteSesionesObj->firma = $_POST["ds_firma"];
    $expedienteSesionesObj->activo = 1;
    $expedienteSesionesObj->calificacion = $calificacion; //json
    $expedienteSesionesObj->datosJson = json_encode($datosJsonInfo);
    $expedienteSesionesObj->idExpSesion = $idExpSesion;

    if($idExpSesion > 0){
        //entra a editar
        $expedienteSesionesObj->EditarExpSesion();
        $expedienteSesionesObj->ActCampoExpSesion("estatus", 1, $idExpSesion);
        header("location: frmExpClientet2.php?idC=".$idC."&idT=".$idT."&status=success");
    }else{
        //entra a crear un nuevo resgistro de sesión
        $expedienteSesionesObj->GuardarExpSesion();
        $idExpSesion = $expedienteSesionesObj->idExpSesion;

        header("location: frmExpClientet2.php?idC=".$idC."&idT=".$idT."&status=success");
    }

}

$result = $expedienteSesionesObj->ObtSesionesGrid($idC, $idT, $opcT);

if(isset($_GET['status']))
{
    $selected = $_GET['status'];
    if($selected == 'success')
    {
        $msjResponse .= "Informaci&oacute;n guardada correctamente.";
        $claseResponse = 'alert-success';
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Alta/Edici&oacute;n Sesiones</title>
    <link href="../js/materialize/materialize.css" rel="stylesheet" type="text/css"/>
    <?php echo estilosPagina(true); ?>
</head>
<body>
    <?php echo  getHeaderMain($_SESSION['myusername'], true);?>
    <?php $menu = getAdminMenu(); ?>
    
    <section class="section-internas">
        <div class="panel-body">
            <div class="container-fluid">                
                <div class="row">
                    <div class="colmenu col-md-2 menu_bg">                        
                        <?php echo getNav($menu); ?>
                    </div>
                    
                    <div class="col-md-10 exp-cliente">
                        <h1 class="titulo">Alta/Edici&oacute;n Sesiones<span class="pull-right"><a id="btnAyudaweb" onclick="mostrarAyuda('web_sesiones')" href="#fancyAyudaWeb"><img src="../images/icon_ayuda.png" width="20px"></a></span></h1>

                        <!-- <ol class="breadcrumb">
                            <li>Inicio</li>
                            <li><a href="expedientes.php">Expedientes</a></li>
                            <li><a href="exptratamientos.php">Tratamientos</a></li>
                            <li class="active">Alta/Edici&oacute;n Cliente</li>
                        </ol> -->
                        
                        <!-- <div class="new_line alert  alert-danger " id="msgLong" style="display:none">
                            <?php echo "La longitud de la clave debe ser 5"; ?>
                        </div>

                        <div class="new_line alert  alert-danger " id="msgDigito" style="display:none">
                            <?php echo "Los &uacute;ltimos tres elementos de la clave deben ser n&uacute;meros"; ?>
                        </div>
                        <div class="new_line alert  alert-danger " id="msgCaracter" style="display:none">
                            <?php echo "Los primeros dos elementos de la clave deben ser car&aacute;cteres"; ?>
                        </div> -->
                        
                        <!-- Comienzo de los tabs -->
                        <form role="form" id="formExpclientet2" name="formExpclientet2" method="post" action="" enctype="multipart/form-data">
                            <input type="hidden" name="form_expclientet2">
                            <input type="hidden" name="dp_idexpcliente" id="dp_idexpcliente" value="<?php echo $idC;?>">
                            <input type="hidden" name="dp_idexptratamiento" id="dp_idexptratamiento" value="<?php echo $idT;?>">
                            <input type="hidden" name="usuarioIdCreador" id="usuarioIdCreador" value="<?php echo $_SESSION['idUsuario'];?>">                            
                            <input type="hidden" id="id_tab" value="<?php echo $tab;?>">

                            <div class="tab_wrapper tabs_proceso">
                                  <ul class="tab_list">
                                    <li class="ocultarBtnSubmit" id="tab_list_5">Sesiones</li>
                                  </ul>
                                    <?php if ($msjResponse != "") { ?>
                                        <div class="new_line alert <?php echo $claseResponse;?> alert-dismissable">
                                            <button type="button" class="close" data-dismiss="alert">&times;</button>
                                            <?php echo $msjResponse; ?>
                                        </div>
                                    <?php } ?>

                                    <?php
                                        // obtener los datos json
                                        $datosJson =  json_decode($paramsPropuesta->datosJson);

                                        // echo '<pre>';
                                        // print_r($datosJson);
                                        // echo '</pre>';

                                    ?>

                                <div class="content_wrapper">

                                    <!-- Contenido Sesiones -->
                                    <?php 
                                    $activo = "";
                                    $disable = "";
                                    if($colSesion->estatus == 1){
                                        $activo = "readonly";
                                        $disable = "disabled";
                                    } ?>
                                    <div class="tab_content diagnostico" id="tab_content_5">
                                        <div id="formularioSesiont2">
                                            <input type="hidden" name="idExpSesion" id="idExpSesion" value="<?php echo (isset($colSesion->idExpSesion)) ? $colSesion->idExpSesion : 0; ?>">
                                            <div class="col-md-6">
                                                <?php
                                                $sesion = ($idS > 0) ? $colExpedienteSesiones->totalSesiones : $colExpedienteSesiones->totalSesiones +1 ;
                                                ?>
                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <label>No. Sesisi&oacute;n: </label>
                                                    </div>
                                                    <?php 
                                                        $sesion = $colExpedienteSesiones->totalSesiones+1;
                                                    ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_sesion" id="ds_sesion" value="<?php echo ($colSesion->noSesion == "") ? $colExpedienteSesiones->totalSesiones+1 : $colSesion->noSesion; ?>" class="form-control required" readonly>
                                                    </div>
                                                </div>

                                                <!-- Inicia captura para la sesión de fotodepilacion-->
                                                <div class="row">
                                                    <table>
                                                        <tr>
                                                            <th>Zona</th>
                                                            <th>Potencia</th>
                                                            <th># Pulsos</th>
                                                            <th># Pulsos man&iacute;pulo</th>
                                                        </tr>
                                                    
                                                    <?php 

                                                    $datosJson = json_decode($colSesion->datosJson);
                                                    
                                                    $arrPotencia = (isset($datosJson->potencia)) ? $datosJson->potencia : "";
                                                    $arrPulsos = (isset($datosJson->pulsos)) ? $datosJson->pulsos : "";
                                                    $arrPmanipulo = (isset($datosJson->pmanipulo)) ? $datosJson->pmanipulo : "";

                                                    /*echo "<pre>";
                                                    print_r($arrPotencia);
                                                    print_r($arrPulsos);
                                                    print_r($arrPmanipulo);
                                                    echo "</pre>";*/

                                                    foreach ($colZonas as $key=>$elem) { 
                                                        if($jsonDiag->{"t2_".$elem->alias} == 1){
                                                    ?>
                                                        <tr>
                                                            <td>
                                                                <label><?php echo $elem->nombre; ?></label>
                                                            </td>

                                                            
                                                            <td>
                                                            <?php if(empty($arrPotencia)) { ?>
                                                                <input type="text" name="potencia_<?php echo $elem->alias; ?>" id="potencia_<?php echo $elem->alias; ?>" class="form-control" value="" style="width: 70%;" <?php echo $activo; ?>/>
                                                            <?php }else if(isset($arrPotencia)){ 
                                                                foreach ($arrPotencia as $key=>$itemP) { 
                                                                    if($key == "potencia_".$elem->alias){
                                                            ?>
                                                                <input type="text" name="potencia_<?php echo $elem->alias; ?>" id="potencia_<?php echo $elem->alias; ?>" class="form-control" value="<?php echo (isset($itemP)) ? $itemP : ''; ?>" style="width: 70%;" <?php echo $activo; ?>/>
                                                            <?php 
                                                                    }
                                                                }
                                                            } ?>
                                                            </td>
                                                            
                                                            <td>
                                                            <?php if(empty($arrPulsos)) { ?>
                                                                <input type="text" name="pulsos_<?php echo $elem->alias; ?>" id="pulsos_<?php echo $elem->alias; ?>" class="form-control" value="" style="width: 70%;" <?php echo $activo; ?> />
                                                            <?php } else if(isset($arrPulsos)){  
                                                                foreach ($arrPulsos as $key=>$itemPulsos) {
                                                                    if($key == "pulsos_".$elem->alias){
                                                            ?>
                                                                <input type="text" name="pulsos_<?php echo $elem->alias; ?>" id="pulsos_<?php echo $elem->alias; ?>" class="form-control" value="<?php echo (isset($itemPulsos)) ? $itemPulsos : ''; ?>" style="width: 70%;" <?php echo $activo; ?>/>
                                                            <?php   }
                                                                } 
                                                            }
                                                             ?>
                                                            </td>

                                                            
                                                            <td>
                                                            <?php if(empty($arrPmanipulo)) { ?>
                                                                <input type="text" name="pmanipulo_<?php echo $elem->alias; ?>" id="pmanipulo_<?php echo $elem->alias; ?>" class="form-control" value="" style="width: 70%;" <?php echo $activo; ?>/>

                                                            <?php }else if(isset($arrPmanipulo)){ 
                                                                foreach ($arrPmanipulo as $key=>$itemPman){
                                                                    if($key == "pmanipulo_".$elem->alias){
                                                            ?>
                                                                <input type="text" name="pmanipulo_<?php echo $elem->alias; ?>" id="pmanipulo_<?php echo $elem->alias; ?>" class="form-control" value="<?php echo (isset($itemPman)) ? $itemPman : ''; ?>" style="width: 70%;" <?php echo $activo; ?>/>
                                                            <?php   } 
                                                                }
                                                            }
                                                            ?>
                                                            </td>
                                                        </tr>
                                                    <?php } //cierre de if
                                                    } //cierre de foreach
                                                    ?>
                                                    </table>
                                                    <br>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-4">
                                                        <label>Observaciones: </label>
                                                    </div>
                                                    <div class="col-md-8">
                                                        <textarea name="ds_observaciones" id="ds_observaciones" class="form-control required" rows="4" <?php echo $activo; ?>><?php echo ($colSesion->observaciones != "") ? $colSesion->observaciones : ''; ?></textarea>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Fecha: </label>
                                                    </div>
                                                    <div class="col-md-5">
                                                        <input class="form-control" type="text" name="ds_fechacita" id="ds_fechacita" value="<?php echo ($colSesion->fechaCreacion == "0000-00-00 00:00:00") ? $fechaAlta : conversionFechaF4($colSesion->fechaCreacion); ?>" style="width:100%;display:inline-block;" readonly />
                                                    </div>
                                                    <div class="col-md-1"></div>
                                                    <div class="col-md-3">
                                                        <div class="mensaje_ok">
                                                            Guardado
                                                            <img src="../images/ui-anim_basic_16x16.gif">
                                                        </div>
                                                        <div class="mensaje_error">
                                                            No guardo
                                                            <img src="../images/ui-anim_basic_16x16.gif">
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="row">
                                                    <div class="col-md-2"></div>
                                                    
                                                    <br>
                                                    <div class="row">
                                                        <div class="col-md-3">
                                                            <?php if($colExpedienteSesiones->totalSesiones == 2 || $colExpedienteSesiones->totalSesiones == 4 || $colExpedienteSesiones->totalSesiones == 6 || $colExpedienteSesiones->totalSesiones == 8){ ?>
                                                                <a href="frmEncuestat2.php?idC=<?php echo $idC ?>&idT=<?php echo $idT ?>&idES=<?php echo $colExpedienteSesiones->totalSesiones ?>" target="_blank"><input type="button" class="btn btn-primary" id="btn_contestar_encuesta" value="Encuesta"></a>
                                                            <?php } ?>
                                                        </div>
                                                    </div>
                                                    <?php $calificacion = json_decode($colSesion->calificacion);  ?>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <label>Atenci&oacute;n de la terapeuta</label>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <p class="clasificacion">
                                                                <input id="radio1" type="radio" name="ds_atencion" value="5" <?php echo ($calificacion->ds_atencion == 5) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="radio1">★</label>
                                                                <input id="radio2" type="radio" name="ds_atencion" value="4" <?php echo ($calificacion->ds_atencion == 4) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="radio2">★</label>
                                                                <input id="radio3" type="radio" name="ds_atencion" value="3" <?php echo ($calificacion->ds_atencion == 3) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="radio3">★</label>
                                                                <input id="radio4" type="radio" name="ds_atencion" value="2" <?php echo ($calificacion->ds_atencion == 2) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="radio4">★</label>
                                                                <input id="radio5" type="radio" name="ds_atencion" value="1" <?php echo ($calificacion->ds_atencion == 1) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="radio5">★</label>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <label>Satisfacci&oacute;n de su sesi&oacute;n</label>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <p class="clasificacion">
                                                                <input id="actitud1" type="radio" name="ds_actitud" value="5" <?php echo ($calificacion->ds_actitud == 5) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="actitud1">★</label>
                                                                <input id="actitud2" type="radio" name="ds_actitud" value="4" <?php echo ($calificacion->ds_actitud == 4) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="actitud2">★</label>
                                                                <input id="actitud3" type="radio" name="ds_actitud" value="3" <?php echo ($calificacion->ds_actitud == 3) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="actitud3">★</label>
                                                                <input id="actitud4" type="radio" name="ds_actitud" value="2" <?php echo ($calificacion->ds_actitud == 2) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="actitud4">★</label>
                                                                <input id="actitud5" type="radio" name="ds_actitud" value="1" <?php echo ($calificacion->ds_actitud == 1) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="actitud5">★</label>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6">
                                                            <label>Limpieza de las instalaciones</label>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <p class="clasificacion">
                                                                <input id="limpieza1" type="radio" name="ds_limpieza" value="5" <?php echo ($calificacion->ds_limpieza == 5) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="limpieza1">★</label>
                                                                <input id="limpieza2" type="radio" name="ds_limpieza" value="4" <?php echo ($calificacion->ds_limpieza == 4) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="limpieza2">★</label>
                                                                <input id="limpieza3" type="radio" name="ds_limpieza" value="3" <?php echo ($calificacion->ds_limpieza == 3) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="limpieza3">★</label>
                                                                <input id="limpieza4" type="radio" name="ds_limpieza" value="2" <?php echo ($calificacion->ds_limpieza == 2) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="limpieza4">★</label>
                                                                <input id="limpieza5" type="radio" name="ds_limpieza" value="1" <?php echo ($calificacion->ds_limpieza == 1) ? "checked" : ""; ?> <?php echo $disable; ?>>
                                                                <label for="limpieza5">★</label>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-3">
                                                            <label>Firma: </label>
                                                        </div>
                                                        <div class="col-md-7">
                                                            <div class="canvasFirma">
                                                                <div id="canvasFirma"></div>
                                                                <div id="redrawSignature"></div>
                                                            </div>
                                                            
                                                            <input type="text" name="ds_firma" id="ds_firma" class="required" value='<?php echo ($colSesion->firma != "") ? $colSesion->firma : ''; ?>'>
                                                        </div>
                                                    </div>
                                                    <div class="row" id="btnRest">
                                                        <div class="col-md-3"></div>
                                                        <div class="col-md-3">
                                                            <br>
                                                            <?php if($colSesion->estatus == 0){ ?>
                                                                <input type="button" name="resetFirma" id="resetFirma" value="Resetear firma" class="btn btn-info">
                                                            <?php } ?>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>

                         <div class="row text-center botones">
                            <div class="col-md-2">
                                 &nbsp;<a href="frmExpClientet2.php?idC=<?php echo $idC; ?>&idT=<?php echo $idT; ?>"><input type="button" value="Regresar" class="btn btn-primary"></a>
                            </div>
                            <?php if($colSesion->estatus == 0){ ?>
                            <div class="col-md-offset-9 col-md-1" >
                                <button type="button" class="btn btn-primary" id="btn_salvar_expclientet2">Aceptar</button>
                            </div>
                            <?php } ?>
                        </div>
                        <br/><br/>


                    </div>
                </div>
            </div>
        </div>

        
    </section>

    <footer>
        <div class="panel-footer">
            <?php echo getPiePag(true); ?>
        </div>
    </footer>
    

    
    <?php echo scriptsPagina(true, 2, false, true); ?>
    <?php
        if($opcMsg == 3){
            echo msgAlertifySer($opcMsg, "Se ha creado la nueva versi&oacute;n del proceso.");
            ?>
            <script>
            setTimeout(function(){
                window.location.href = "frmProceso.php?idP="+'<?php echo $idProceso?>';
            }, 700);
            </script>
            <?php
        }

        if($opcMsg == 5){
            echo msgAlertifySer($opcMsg, "Se ha mandado correo al validador.");
        }
    ?>
    <script>
        $(document).ready(function(){                
            <?php if( isset($p_creado) && $p_creado==true){ ?>
                alertify.success("Registro creado correctamente.");
                setTimeout(function(){
                    window.location.href = "frmProceso.php?idP="+'<?php echo $idProceso?>';
                }, 700);
            <?php } ?>

            <?php if( isset($p_actualizado) && $p_actualizado==true){ ?>
                alertify.success("Registro actualizado correctamente.");
                setTimeout(function(){
                    window.location.href = "frmProceso.php?idP="+'<?php echo $idProceso?>';
                }, 700);
            <?php } ?>

            //Mostrar documentos
            setTimeout(function(){
                // documentos.refresh(); 
                // documentos.commit();
            }, 1000);
        });
    </script>

    <style type="text/css">
        div#canvasFirma{
            width: 300px !important;
            height: 150px !important;
        }
        div#redrawSignature{
            width: 300px !important;
            height: 150px !important;
        }
        input#ds_firma {
            opacity: 0;
        }
    </style>
    <script type="text/javascript">

        $(function() {
            // script para firma en la captura de sesiones 
            var sig = $('#canvasFirma').signature();
            $('#disable').click(function() {
                var disable = $(this).text() === 'Disable';
                $(this).text(disable ? 'Enable' : 'Disable');
                sig.signature(disable ? 'disable' : 'enable');
            });

            $('#canvasFirma').signature({ change: function(event, ui) { 
                //alert('Signature changed'); 
                if($('#canvasFirma').signature('toJSON') == "{\"lines\":[]}"){

                }else{
                    actualizarFirma();
                }
            }}); 


            if($("#ds_firma").val() != ""){
                //recuperar firma
                $('#redrawSignature').signature({disabled: true}); 
                mostrarFirma();
            }
        });

        function mostrarFirma(){
            $('#redrawSignature').signature('enable'). 
                    signature('draw', $('#ds_firma').val()). 
                    signature('disable');

            $('#redrawSignature').signature({disabled: true}); 
            $('#canvasFirma').hide();
        }

        function actualizarFirma(){
            $("#ds_firma").val($('#canvasFirma').signature('toJSON')).change();
        }

    </script>
</body>
</html>