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
include_once '../brules/expedienteClientesSesionesObj.php';
include_once '../brules/catGradosFlacidezObj.php';
include_once '../brules/catGradosCelulitisObj.php';
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
$expedienteClientesSesionesObj = new expedienteClientesSesionesObj();
$catFlacidezObj = new catGradosFlacidezObj();
$catCelulitisObj = new catGradosCelulitisObj();
$timeZone = obtDateTimeZone();

//Variables
$opcMsg = 0;
$fechaAlta = $timeZone->fechaHoraF2;
$fechaAct = "";
//Obtener variable de la url
$idC = (isset($_GET["idC"]))?$_GET["idC"]:0; //id cliente
$idT = (isset($_GET["idT"]))?$_GET["idT"]:0; //id tratamiento
$idS = (isset($_GET["idS"]))?$_GET["idS"]:0; //id Sesion
$tab = (isset($_GET["tab"]))?$_GET["tab"]:0; //tab, imp. 09/07/20
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
$colExpedientesSesiones = $expedienteClientesSesionesObj->ExpClienSesionByIdcIdt($idC, $idT);
$colflacidez = $catFlacidezObj->ObtCatGradosFlacidez();
$colCelulitis = $catCelulitisObj->ObtCatGradosCelulitis();

//Obtener el numero de sesion actual
//Imp. 26/05/20
//Tomar el numero de sesiones por expClienteId, expTratamientoId
$colExpSesiones = $expedienteSesionesObj->ColExpSesionPorIdExpAndIdTrat($idC, $idT);
$sesionActual = count($colExpSesiones);
$repCheckBoqueoSesion = (object)$paramPropuestaObj->CheckBoqueoSesion($sesionActual, $idC, $idT);
// Datos parametros propuesta Imp.16/06/20
$paramsPropuesta = $paramPropuestaObj->ObtDatosPropuestaPorExpCliTrat($idC, $idT);
$colSesion = $expedienteSesionesObj->ExpSesionPorId($idS);
/*echo "<pre>";
print_r($colSesion);
echo "</pre>";*/
//Imp. 21/07/20
$emailUsrApp = "";
$passUsrApp = "";
if($paramsPropuesta->usuarioIdApp!=""){
    $datosUsr = $usuariosObj->UserByID(trim($paramsPropuesta->usuarioIdApp));
    $emailUsrApp = $datosUsr->email;
    $passUsrApp = $datosUsr->password;
}
// $paramsPropuesta = $paramPropuestaObj->ObtDatosPropuestaPorCampo("expClienteId", $idC);


// echo '<pre>';
// print_r($paramsPropuesta);
// echo '</pre>';

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

// echo 'colDatosExpDiag';
// echo '<pre>';
// print_r($colDatosExpDiag);
// echo '</pre>';


/*echo "<pre>";
print_r($pCuerpoBrazos );
print_r($pCuerpoAbdomen);
print_r($pCuerpoEspalda);
print_r($pCuerpoPiernas);
print_r($pCuerpoGluteos);
echo "</pre>";*/

//Recibe el post
if(isset($_POST['form_expcliente'])){
    base64DecodeSubmit(1, $_POST);
    
   /* echo "<pre>";
    print_r($_POST);
    echo "</pre>";
    exit();*/

    $infoCuerpo = array("ds_brazoizquierdo"=>$_POST["ds_brazoizquierdo"], "dt_brazoiz_result"=>$_POST["dt_brazoiz_result"], "ds_brazoderecho"=>$_POST["ds_brazoderecho"], "dt_brazode_result"=>$_POST["dt_brazode_result"], "ds_abdomen"=>$_POST["ds_abdomen"], "dt_abdomen_result"=>$_POST["dt_abdomen_result"], "ds_cintura"=>$_POST["ds_cintura"], "dt_cintura_result"=>$_POST["dt_cintura_result"], "ds_bajobusto"=>$_POST["ds_bajobusto"], "dt_bbusto_result"=>$_POST["dt_bbusto_result"], "ds_cadera"=>$_POST["ds_cadera"], "dt_cadera_result"=>$_POST["dt_cadera_result"], "ds_gluteos"=>$_POST["ds_gluteos"], "dt_gluteos_result"=>$_POST["dt_gluteos_result"], "ds_musloizquierdo"=>$_POST["ds_musloizquierdo"], "dt_musloiz_result"=>$_POST["dt_musloiz_result"], "ds_musloderecho"=>$_POST["ds_musloderecho"], "dt_muslode_result"=>$_POST["dt_muslode_result"]);
    $trabajoDeCuerpo = json_encode($infoCuerpo);
    $arrCalificacion = array("ds_atencion"=>$_POST["ds_atencion"], "ds_actitud"=>$_POST["ds_actitud"], "ds_limpieza"=>$_POST["ds_limpieza"]);
    $calificacion = json_encode($arrCalificacion);

    $idExpSesion = ($_POST["idExpSesion"] > 0) ? $_POST["idExpSesion"] : 0;
    $expedienteSesionesObj->expClienteId = $_POST["dp_idexpcliente"];
    $expedienteSesionesObj->expTratamientoId = $_POST["expTratamientoId"];
    $expedienteSesionesObj->usuarioId = $_POST["usuarioIdCreador"];
    $expedienteSesionesObj->fecha = conversionFechas($_POST["ds_fechacita"]);
    $expedienteSesionesObj->noSesion = $_POST["ds_sesion"];
    $expedienteSesionesObj->fase = "";
    $expedienteSesionesObj->peso = $_POST["ds_peso"];
    $expedienteSesionesObj->tcm = $_POST["ds_tcm"];
    $expedienteSesionesObj->imc = $_POST["ds_imc"];
    $expedienteSesionesObj->imcGrasa = $_POST["ds_grasa"];
    $expedienteSesionesObj->gv = $_POST["ds_gv"];
    $expedienteSesionesObj->musculo = $_POST["ds_musculo"];
    $expedienteSesionesObj->trabajoDeCuerpo = $trabajoDeCuerpo; //json
    $expedienteSesionesObj->observaciones = $_POST["ds_observaciones"];
    $expedienteSesionesObj->firma = $_POST["ds_firma"];
    $expedienteSesionesObj->activo = 1;
    $expedienteSesionesObj->calificacion = $calificacion; //json
    $expedienteSesionesObj->idExpSesion = $idExpSesion;

    if($idExpSesion > 0){
        //entra a editar
        $expedienteSesionesObj->EditarExpSesion();
        $expedienteSesionesObj->ActCampoExpSesion("estatus", 1, $idExpSesion);
        header("location: frmExpCliente.php?idC=".$idC."&idT=".$idT."&status=success");
    }else{
        //entra a crear un nuevo resgistro de sesión
        $expedienteSesionesObj->GuardarExpSesion();
        $idExpSesion = $expedienteSesionesObj->idExpSesion;

        header("location: frmExpCliente.php?idC=".$idC."&idT=".$idT."&status=success");
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
                        <form role="form" id="formExpcliente" name="formExpcliente" method="post" action="">
                            <input type="hidden" name="form_expcliente">
                            <input type="hidden" name="dp_idexpcliente" id="dp_idexpcliente" value="<?php echo $idC;?>">
                            <input type="hidden" name="dp_idexptratamiento" id="dp_idexptratamiento" value="<?php echo $idT;?>">
                            <input type="hidden" name="usuarioIdCreador" id="usuarioIdCreador" value="<?php echo $_SESSION['idUsuario'];?>">                            
                            <input type="hidden" id="id_tab" value="<?php echo $tab;?>">

                            <div class="tab_wrapper tabs_proceso">
                                  <ul class="tab_list">
                                    <!-- <li class="mostrarBtnSubmit active" id="tab_list_1">Datos</li>
                                    <li class="mostrarBtnSubmit" id="tab_list_2">Valoraci&oacute;n</li> 
                                    <li class="ocultarBtnSubmit" id="tab_list_3">Diagn&oacute;stico</li>
                                    <li class="ocultarBtnSubmit" id="tab_list_4">Propuesta</li> -->
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
                                        <div id="formularioSesion">
                                            <input type="hidden" name="idExpSesion" id="idExpSesion" value="<?php echo (isset($colSesion->idExpSesion)) ? $colSesion->idExpSesion : 0; ?>">
                                            <div class="col-md-6">
                                                <?php
                                                $sesion = ($idS > 0) ? $colExpedienteSesiones->totalSesiones : $colExpedienteSesiones->totalSesiones +1 ;
                                                ?>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>No. Sesi&oacute;n: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_sesion_0" id="dt_sesion_0" value="0" readonly="" class="form-control">
                                                    </div>
                                                    <input type="hidden" name="hidd_btnsesion" id="hidd_btnsesion" value="0">
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_sesion" id="ds_sesion" value="<?php echo ($colSesion->noSesion == "") ? $colExpedienteSesiones->totalSesiones : $colSesion->noSesion; ?>" class="form-control required" readonly>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <label>Resultados</label>
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Peso: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_peso_0" id="dt_peso_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpVal->pesoReal : $colExpedienteSesiones->peso; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_peso" id="ds_peso" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpVal->pesoReal : $colSesion->peso; ?>" class="form-control required" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_peso_result" id="dt_peso_result" value="0" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>IMC: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_imc_0" id="dt_imc_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->imc : $colExpedienteSesiones->imc; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_imc" id="ds_imc" class="form-control required" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->imc : $colSesion->imc; ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_imc_result" id="dt_imc_result" value="0" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>GV.: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_gv_0" id="dt_gv_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->gv : $colExpedienteSesiones->gv; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_gv" id="ds_gv" class="form-control required" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->gv : $colSesion->gv; ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_gv_result" id="dt_gv_result" value="0" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>% Grasa: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_grasa_0" id="dt_grasa_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->imcGrasa : $colExpedienteSesiones->imcGrasa; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_grasa" id="ds_grasa" class="form-control required" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->imcGrasa : $colSesion->imcGrasa; ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_grasa_result" id="dt_grasa_result" value="0" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>% Musculo: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_musculo_0" id="dt_musculo_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->musculo : $colExpedienteSesiones->musculo; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_musculo" id="ds_musculo" class="form-control required" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? $colDatosExpDiag->musculo : $colSesion->musculo; ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_musculo_result" id="dt_musculo_result" value="0" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <br><br>
                                                <?php
                                                $infoBody = json_decode($colExpedienteSesiones->trabajoDeCuerpo);
                                                $infoBodySesion = json_decode($colSesion->trabajoDeCuerpo);
                                                //print_r($infoBodySesion);
                                                $required = "";

                                                //Inicia validación para mostrar partes a capturar
                                                if ($bodyInfo->brazo_red_grasa != "" || $bodyInfo->brazo_fla_grado != "" || $bodyInfo->brazo_cel_grado != "" ){
                                                    $required = "required";
                                                ?>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Brazo izquierdo: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_brazoiz_0" id="dt_brazoiz_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? '0' : $infoBody->ds_brazoizquierdo; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_brazoizquierdo" id="ds_brazoizquierdo" class="form-control required" value="<?php echo (isset($infoBodySesion->ds_brazoizquierdo)) ? $infoBodySesion->ds_brazoizquierdo : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_brazoiz_result" id="dt_brazoiz_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Brazo derecho: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_brazode_0" id="dt_brazode_0" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_brazoderecho; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_brazoderecho" id="ds_brazoderecho" class="form-control required" value="<?php echo (isset($infoBodySesion->ds_brazoderecho)) ? $infoBodySesion->ds_brazoderecho : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_brazode_result" id="dt_brazode_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <?php } //Fin Brazos
                                                //Inicia Abdomen
                                                if ($bodyInfo->abdomen_red_grasa!= "" || $bodyInfo->abdomen_fla_grado != "" || $bodyInfo->abdomen_cel_grado != "" || $bodyInfo->espalda_red_grasa != "" || $bodyInfo->espalda_fla_grado != "" || $bodyInfo->espalda_cel_grado != ""){
                                                    $required = "required";
                                                ?>

                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Bajo busto: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_bajobusto" id="dt_bajobusto" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_bajobusto; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_bajobusto" id="ds_bajobusto" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_bajobusto)) ? $infoBodySesion->ds_bajobusto : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_bbusto_result" id="dt_bbusto_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Cintura: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_cintura" id="dt_cintura" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_cintura; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_cintura" id="ds_cintura" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_cintura)) ? $infoBodySesion->ds_cintura : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_cintura_result" id="dt_cintura_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Abdomen: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_abdomen" id="dt_abdomen" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_abdomen; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_abdomen" id="ds_abdomen" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_abdomen)) ? $infoBodySesion->ds_abdomen : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_abdomen_result" id="dt_abdomen_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Cadera: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_cadera" id="dt_cadera" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_cadera; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_cadera" id="ds_cadera" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_cadera)) ? $infoBodySesion->ds_cadera : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_cadera_result" id="dt_cadera_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>

                                                <?php
                                                }//Fin Abdomen

                                                //Inicio Gluteos
                                                if ($bodyInfo->gluteos_reduccion != "" || $bodyInfo->gluteos_red_grasa != "" || $bodyInfo->gluteos_flacidez != "" || $bodyInfo->gluteos_celulitis != "" || $bodyInfo->gluteos_cel_grado != ""){
                                                    $required = "required";
                                                ?>

                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Gl&uacute;teos: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_gluteos" id="dt_gluteos" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_gluteos; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_gluteos" id="ds_gluteos" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_gluteos)) ? $infoBodySesion->ds_gluteos : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_gluteos_result" id="dt_gluteos_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>

                                                <?php 
                                                    }//Fin Gluteos 
                                                    
                                                    //Inicio piernas
                                                    if ($bodyInfo->piernas_red_grasa != "" || $bodyInfo->piernas_fla_grado != "" || $bodyInfo->piernas_cel_grado != ""){
                                                    $required = "required";
                                                ?>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Muslo izquierdo: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_musloiz" id="dt_musloiz" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_musloizquierdo; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_musloizquierdo" id="ds_musloizquierdo" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_musloizquierdo)) ? $infoBodySesion->ds_musloizquierdo : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_musloiz_result" id="dt_musloiz_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <div class="row">
                                                    <div class="col-md-3">
                                                        <label>Muslo derecho: </label>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_muslode" id="dt_muslode" value="<?php echo ($colExpedienteSesiones->totalSesiones == 0) ? "0" : $infoBody->ds_musloderecho; ?>" readonly="" class="form-control">
                                                    </div>
                                                    <?php } ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_musloderecho" id="ds_musloderecho" class="form-control <?php echo $required; ?>" value="<?php echo (isset($infoBodySesion->ds_musloderecho)) ? $infoBodySesion->ds_musloderecho : '' ?>" <?php echo $activo; ?>>
                                                    </div>
                                                    <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                    <div class="col-md-3">
                                                        <input type="text" name="dt_muslode_result" id="dt_muslode_result" value="0" readonly="" class="form-control cmResult">
                                                    </div>
                                                    <?php } ?>
                                                </div>
                                                <?php }//Fin Piernas ?>

                                                <?php if($colExpedienteSesiones->totalSesiones > 0){ ?>
                                                <div class="row">
                                                    <div class="col-md-3"></div>
                                                    <div class="col-md-3"></div>

                                                    <div class="col-md-3">
                                                        <label>T. CM.: </label>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <input type="text" name="ds_tcm" id="ds_tcm" value="<?php echo ($colSesion->tcm > 0) ? $colSesion->tcm : 0; ?>" class="form-control required" readonly>
                                                    </div>
                                                </div>
                                                <?php } ?>
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
                                                    <div class="col-md-4">
                                                        <label>Observaciones: </label>
                                                    </div>
                                                    <div class="col-md-8">
                                                        <textarea name="ds_observaciones" id="ds_observaciones" class="form-control required" rows="4" <?php echo $activo; ?>><?php echo ($colSesion->observaciones != "") ? $colSesion->observaciones : ''; ?></textarea>
                                                    </div>
                                                </div>

                                                <?php 
                                                $arrNoSesiones = array('0','6','12','18','24','30','36','42','48','54','60','66','72','78','84','90','96','102');
                                                /*echo "<pre>";
                                                print_r($arrNoSesiones);
                                                echo "</pre>";*/
                                                /*echo $colExpedienteSesiones->totalSesiones."<br>";
                                                echo $colSesion->noSesion; */
                                                $countImg = 0;
                                                foreach ($arrNoSesiones as $itemSesion) {
                                                    if($itemSesion == $colExpedienteSesiones->totalSesiones || $itemSesion == $colSesion->noSesion){
                                                        if($colSesion->imagenes == "" || $colSesion->imagenes == NULL){
                                                            if($countImg == 1){
                                                ?>
                                                <div class="row" id="subirImagenes">
                                                    <div class="col-md-12">
                                                        <div id="drop">
                                                            Arrastrar aquí

                                                            <a>Click aquí</a>
                                                            <input type="file" name="upl" multiple />
                                                        </div>

                                                    </div>
                                                </div>

                                                <?php 
                                                            }
                                                        } if($countImg == 0){ ?>

                                                        <div class="col-md-1"></div>
                                                        
                                                        <div class="row" id="encuestaExterna">
                                                            <div class="col-md-3">
                                                                <a href="frmEncuesta.php?idC=<?php echo $idC ?>&idT=<?php echo $idT ?>&idES=<?php echo $colExpedienteSesiones->totalSesiones ?>" target="_blank"><input type="button" class="btn btn-primary" id="btn_contestar_encuesta" value="Encuesta"></a>
                                                            </div>
                                                        </div>
                                                <?php  }
                                                    }
                                                $countImg = $countImg+1;
                                                }
                                                ?>

                                                <?php 
                                                foreach ($arrNoSesiones as $itemSesion) {
                                                    if($itemSesion == $colSesion->noSesion){
                                                    if($colSesion->imagenes != ""){ ?>
                                                    <div class="row" id="divImagenes">
                                                        <br>
                                                        <div class="col-md-12">
                                                            <div class="row">
                                                                <label>Im&aacute;genes cargadas</label>
                                                            </div>
                                                        </div>
                                                        <div class="row">
                                                            <?php
                                                            $imagenes = explode(",", $colSesion->imagenes); 
                                                            $cout = 0; 
                                                            ?>
                                                            <div class="imgUploads">
                                                            <?php
                                                            while ($cout <= count($imagenes)) {
                                                                if ($imagenes[$cout] != "") {
                                                            ?>
                                                                <a class="fancybox" rel="gallery1" href="../uploads/<?php echo $imagenes[$cout]; ?>" ><img src="../uploads/<?php echo $imagenes[$cout]; ?>" width="100px"></a>
                                                            <?php 
                                                                }
                                                              $cout = $cout+1;
                                                            }
                                                            ?>
                                                            </div>
                                                        </div>
                                                        <br>
                                                    </div>
                                                <?php } 
                                                    }
                                                }
                                                ?>
                                                

                                                <?php $calificacion = json_decode($colSesion->calificacion); 
                                                ?>
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <label>Atenci&oacute;n de la terapeuta</label>
                                                    </div>
                                                    <div class="col-md-4">
                                                        <p class="clasificacion">
                                                            <input id="radio1" type="radio" name="ds_atencion" value="5" <?php echo ($calificacion->ds_atencion == 5) ? "checked" : ""; ?> <?php echo $disable; ?> >
                                                            <label for="radio1">★</label>
                                                            <input id="radio2" type="radio" name="ds_atencion" value="4" <?php echo ($calificacion->ds_atencion == 4) ? "checked" : ""; ?> <?php echo $disable; ?> >
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
                        </form>

                         <div class="row text-center botones">                            
                            <div class="col-md-2">
                                 &nbsp;<a href="frmExpCliente.php?idC=<?php echo $idC; ?>&idT=<?php echo $idT; ?>"><input type="button" value="Regresar" class="btn btn-primary"></a>
                            </div>
                            <?php if($colSesion->estatus == 0){ ?>
                            <div class="col-md-offset-9 col-md-1" >
                                <button type="button" class="btn btn-primary " id="btn_salvar_expcliente">Aceptar</button>
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
    

    
    <?php echo scriptsPagina(true, 1, false, true); ?>
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
   
<!-- Compiled and minified JavaScript -->
<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/js/materialize.min.js"></script> -->

    <script type="text/javascript">
        $( document ).ready(function() {
            //bloquearMetal();
            verificaAreasTratar();
            
            obtPropuestaTrat();
        });

        function verificaAreasTratar(){
            if($("#brazo_reduccion").is(":checked") || $("#brazo_flacidez").is(":checked") || $("#brazo_celulitis").is(":checked")){
                $( "#divPartesCuerpo1" ).find( "a" ).trigger( "click" );
            }

            if($("#abdomen_reduccion").is(":checked") || $("#abdomen_flacidez").is(":checked") || $("#abdomen_celulitis").is(":checked")){
                $( "#divPartesCuerpo2" ).find( "a" ).trigger( "click" );
            }

            if($("#espalda_reduccion").is(":checked") || $("#espalda_flacidez").is(":checked") || $("#espalda_celulitis").is(":checked")){
                //$( "#divPartesCuerpo3" ).find( "a" ).trigger( "click" );
            }

            if($("#piernas_reduccion").is(":checked") || $("#piernas_flacidez").is(":checked") || $("#piernas_celulitis").is(":checked")){
                $( "#divPartesCuerpo4" ).find( "a" ).trigger( "click" );
            }

            if($("#gluteos_reduccion").is(":checked") || $("#gluteos_flacidez").is(":checked") || $("#gluteos_celulitis").is(":checked")){
                $( "#divPartesCuerpo5" ).find( "a" ).trigger( "click" );
            }
        }
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

            calcularAvance();
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