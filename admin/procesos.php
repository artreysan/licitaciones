<?php
session_start();
$checkRol = ($_SESSION['idRol']==1 || $_SESSION['idRol']==2 || $_SESSION['idRol']==3 || $_SESSION['idRol']==4 || $_SESSION['idRol']==6) ?true :false;

if($_SESSION['status']!= "ok" || $checkRol!=true)
    header("location: logout.php");

include_once '../common/screenPortions.php';
include '../brules/utilsObj.php';
require_once '../brules/KoolControls/KoolAjax/koolajax.php';
libreriasKool();
// $localization = "../brules/KoolControls/KoolCalendar/localization/es.xml";
include_once '../brules/procesosObj.php';
include_once '../brules/usuariosObj.php';
include_once '../brules/catDepartamentosObj.php';

// if($_SESSION['idRol']==1 || $_SESSION['idRol']==2){
//     $idUsuario = 0;
//     // $idUsuario = $_SESSION['idUsuario'];
// }else{
//     $idUsuario = $_SESSION['idUsuario'];
// }
$idUsuario = $_SESSION['idUsuario'];
$procesosObj = new procesosObj();
$usuariosObj = new usuariosObj();
$catDepartamentosObj = new catDepartamentosObj();

$idsDepartamentos = "";
$datoUsuario = $usuariosObj->UserByID($idUsuario);
if($datoUsuario->idUsuario>0 && $datoUsuario->departamentoId!=""){
    $idsDepartamentos = trim($datoUsuario->departamentoId,","); //departamentos a los que se encuentra asociado
}

$filTexto = "";
$filSel = "";
if(isset($_GET['buscarProceso'])){
    $filTexto = $_GET['filTexto'];
    $filSel = $_GET['filSel'];
}

// $result = $procesosObj->ObtProcesosGrid($idUsuario, $filSel, $filTexto); 
// $result = $procesosObj->ObtProcesosGrid2($idUsuario, $filSel, $filTexto); //Se obtendra con un ArrayDataSource por la columna de "codigo de referencia"

global $arrayTotal;
$arrayTotal = array();

function obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $procPrincipalId, $nivel){    
    $procesosObj = new procesosObj();
    $array = $procesosObj->ObtProcesosGrid3($idUsuario, $filSel, $filTexto, $procPrincipalId);
    global $arrayTotal;

    // echo "tiene: ".count($array)." - nivel: ".$nivel."<br/>";
    // echo "<pre>";
    // print_r($array);
    // echo "</pre>";
    if(count($array)>0){
        $nivel += 1;
        foreach ($array as $key=>$elem){            
            $array[$key]->{"nivel"} = $nivel;
            $arrayTotal[] = (array)$elem;

            // echo "idPadre: ".$elem->idProceso." - ";
            obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $elem->idProceso, $nivel);
        }
    }
}

$array = $procesosObj->ObtProcesosGrid3($idUsuario, $filSel, $filTexto); //Se obtendra con un ArrayDataSource por la columna de "codigo de referencia"
//Obtener todos aquellos que son padres        
if(count($array)>0){
    foreach ($array as $key=>$elem){
        $nivel = 0;
        $array[$key]->{"nivel"} = $nivel;
        $arrayTotal[] = (array)$elem;

        // echo "idPadre: ".$elem->idProceso." - ";
        obtProcesosRecursivos($idUsuario, $filSel, $filTexto, $elem->idProceso, $nivel);        
    }
}

//Revisar si hay datos para recorrer y poner correctamente el nivel
if(count($arrayTotal)>0){
   foreach ($arrayTotal as $key=>$elem){
        $arrayTotal[$key]["codigo"] = obtNivelesGrid($elem["nivel"]).$elem["codigo"];
   }
}
$procesosObj2 = new procesosObj();
$result = $procesosObj2->ObtProcesosGrid2($arrayTotal);

/*echo "----------------<br/>";
echo "es: ".count($arrayTotal)."<br/>";
echo "<pre>";
print_r($arrayTotal);
// print_r($_GLOBALS['arrayTotal']);
echo "</pre>";*/


?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Procesos</title>
    <?php echo estilosPagina(true); ?>
    
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
    
</head>
<body>
    <?php echo getHeaderMain($_SESSION['myusername'], true);?>
    <?php $menu = getAdminMenu(); ?>

    <section class="section-internas">
        <div class="panel-body">
            <div class="container-fluid">
                <div class="row">
                    <div class="colmenu col-md-2 menu_bg">
                        <?php echo getNav($menu); ?>
                    </div>
                    <div class="col-md-10">
                        <h1 class="titulo">Procesos<span class="pull-right"><a id="btnAyudaweb" onclick="mostrarAyuda('web_procesos')" href="#fancyAyudaWeb"><img src="../images/icon_ayuda.png" width="20px"></a></span></h1>

                        <ol class="breadcrumb">
                          <li><a href="index.php">Inicio</a></li>
                          <li class="active">Procesos</li>
                      </ol>

                      <div class="row">                            
                      </div>

                      <div class="filtro">
                        <form role="form" id="frmFilProcesos" name="frmFilProcesos" method="get" action="">
                            <div class="row">
                                <div class="text-right form-group col-md-3 col-sm-3 col-xs-3 alinear">
                                    <input type="text" id="filTexto" name="filTexto" value="<?php echo $filTexto; ?>" class="required">
                                </div>
                                <div class="col-md-2 col-sm-2 col-xs-2">
                                    <select class="form-control required" id="filSel" name="filSel">
                                        <option value="">--Seleccionar--</option>
                                        <option value="1" <?php echo ($filSel==1)?"selected":""; ?>>Nombre</option>
                                        <option value="2" <?php echo ($filSel==2)?"selected":""; ?>>Clave</option>
                                    </select>
                                </div>

                                <div class="col-md-3 col-sm-3 col-xs-3">
                                    <div style="display:inline-block;">
                                        <button type="submit" class="btn btn-primary" role="button" title="Buscar" name="buscarProceso" id="buscarProceso" value="Buscar">
                                          <span class="glyphicon glyphicon-search"></span> <!--Buscar-->
                                      </button>
                                  </div>

                                  <div style="display:inline-block;">
                                    <button type="button" class="btn btn-primary" role="button" value="Limpiar" title="Limpiar" onclick="limpiarBusqueda();">
                                      <span class="glyphicon glyphicon-remove"></span> <!--Limpiar-->
                                  </button>
                              </div>
                          </div>
                      </div>
                  </form>
              </div>

              <?php if($_SESSION['idRol']==1 || $_SESSION['idRol']==2 || $_SESSION['idRol']==3){ ?>
                <div class="row">
                    <div class="col-md-offset-9 col-sm-offset-9 col-xs-offset-9 col-md-2 col-sm-2 col-xs-2 text-right ">

                    </div>
                    <div class="col-md-offset-9 col-sm-offset-9 col-xs-offset-9 col-md-2 col-sm-2 col-xs-2 text-right btn-alineados">
                        <a href="frmProceso.php" class=""><input type="button" value="Crear nuevo" class="btn btn-primary"></a>
                        <a href="index.php"><input type="button" id="regresar" value="Regresar" class="btn"></a>
                    </div>

                </div><br>
            <?php } ?>

            <div>
                <form name="grids" method="post">
                    <?php
                    echo $koolajax->Render();
                    // echo '<div id="contsGrid">';
                    if($result != null){
                        echo $result->Render();
                    }
                    // echo '</div>';
                    ?>
                </form>
            </div>
        </div>
    </div>
</div>
</div>
</section>
<?php //echo getFancyElimGral(); ?>
<footer>
    <div class="panel-footer">
        <?php echo getPiePag(true); ?>
    </div>
</footer>

<?php echo scriptsPagina(true); ?>
</body>
</html>
