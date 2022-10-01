<?php
session_start();
$checkRol = ($_SESSION['idRol']==1 || $_SESSION['idRol']==2 ) ?true :false;

if($_SESSION['status']!= "ok" || $checkRol!=true)
        header("location: logout.php");

include_once '../common/screenPortions.php';
include '../brules/utilsObj.php';
include_once '../brules/usuariosObj.php';
include_once '../brules/licitacionesObj.php';
include_once '../brules/utilsObj.php';

$usuariosObj = new usuariosObj();
$licitacionesObj = new licitacionesObj();
$datosUsr = $usuariosObj->UserByID($_SESSION['idUsuario']);

if(isset($_POST['guardar'])){
    
    $licitacionesObj->idUnAd = $_POST['hidd_unidad'];
    $licitacionesObj->idUsuario = $_POST['hidd_id_user'];
    $licitacionesObj->licitacion = $_POST['txt_licitacion'];
    $licitacionesObj->activo = 1;

    $licitacionesObj->GuardarLicitacion();

    header('Location: listLicitaciones.php', true, 303);

}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Licitaciones</title>

    <!-- CSS -->
    <link href="/favicon.ico" rel="shortcut icon">
    <link href="../css/style.css" rel="stylesheet">
    <link href="https://framework-gb.cdn.gob.mx/assets/styles/main.css" rel="stylesheet">

</head>
<body>
    <section class="section-internas">
        <div class="panel-body">
            <div class="container-fluid">
                <div class="row">
                    <div class="colmenu col-md-2 menu_bg ">
                        <br><br><hr>
                        <?php /*echo getNav($menu);*/ ?>
                        <ul>
                            <li class="li_menu inicio"><a href="index.php">Inicio</a></li>
                            <li class="li_menu licitaciones"><a href="listLicitaciones.php">Licitaciones</a></li>
                            <li class="li_menu new_licitacion"><a href="frmLicitacion.php">Nueva Licitaci&oacute;n</a></li>
                            <li class="li_menu salir"><a href="logout.php">Salir</a></li>
                        </ul>
                    </div>
                    <div class="col-md-10">
                        <h1 class="titulo">Nueva Licitaci&oacute;n <span class="pull-right"><?php echo $datosUsr->nombre . ' - ' . $datosUsr->idUnAd; ?><br><a href="logout.php">Cerrar Sesi&oacute;n</a></span> </h1>       
                
                        <div class="cont_iconos">
            			    <div class="row">
                                <div class="col-md-12">
                                    <form name="frm_licitacion" id="frm_licitacion" method="post" action="">
                                        <input type="hidden" name="hidd_id_user" id="hidd_id_user" value="<?php echo $datosUsr->idUsuario; ?>">
                                        <input type="hidden" name="hidd_unidad" id="hidd_unidad" value="<?php echo $datosUsr->idUnAd; ?>">
                                        <div class="row">
                                            <div class="form-group">
                                                <div class="col-md-6 col-xs-12">
                                                    <label>Licitación:</label>
                                                    <input type="text" name="txt_licitacion" id="txt_licitacion" class="form-control" placeholder="Nombre de la licitación" required="">
                                                </div>
                                            </div>
                                        </div>
                                        <br>
                                        <div class="form-group">
                                            <div class="col-md-1 col-xs-12">
                                            </div>
                                            <div class="col-md-2"><input type="submit" name="guardar" id="guardar" class="btn btn-primary" value="Guardar"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </div>
    </section>
    <footer>
        <div class="panel-footer">
           
        </div>
    </footer>
    <script src="https://framework-gb.cdn.gob.mx/gobmx.js"></script>
    
</body>
</html>
