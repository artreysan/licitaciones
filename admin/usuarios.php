<?php
session_start();
$checkRol = ($_SESSION['idRol']==1 || $_SESSION['idRol']==2 || $_SESSION['idRol']==3 || $_SESSION['idRol']==4 || $_SESSION['idRol']==6) ?true :false;

if($_SESSION['status']!= "ok" || $checkRol!=true)
        header("location: logout.php");


include_once '../common/screenPortions.php';
include_once '../brules/KoolControls/KoolGrid/koolgrid.php';
require_once '../brules/KoolControls/KoolAjax/koolajax.php';
require_once '../brules/KoolControls/KoolCalendar/koolcalendar.php';
include_once '../brules/KoolControls/KoolGrid/ext/datasources/MySQLiDataSource.php';
$localization = "../brules/KoolControls/KoolCalendar/localization/es.xml";
include_once '../brules/rolesObj.php';
include_once '../brules/gruposObj.php';
include_once '../brules/usuariosObj.php';
include_once '../brules/utilsObj.php';
//establecer la zona horaria
$dateByZone = new DateTime("now", new DateTimeZone('America/Mexico_City') );
$dateTime = $dateByZone->format('Y-m-d H:i:s'); //fecha Actual

$accObj = new usuariosObj();
$result = $accObj->GetUsersGrid("3,4");
$mostrarNoti = '';
$rolIds = "3,4";

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <title>Usuarios</title>
    <link href="../css/bootstrap.min.css" rel="stylesheet" type="text/css"/>    
    <link href="../css/style.css?upd=<?php echo time() ?>" rel="stylesheet" type="text/css" />
    <!-- <link href="../css/style-responsive.css?upd=<?php echo time() ?>" rel="stylesheet" type="text/css" /> -->
    <link href="../js/fancybox/jquery.fancybox.css" rel="stylesheet" type="text/css" />
    <link href="../css/alertify.min.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="../css/themes/semantic.min.css"/>
    <link rel="icon" href="../favicon.ico" type="image/x-icon"/>
    <script type="text/javascript" src="../js/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="../js/bootstrap.min.js"></script>    
    <script type="text/javascript" src="../js/jquery-ui.js"></script>
    <script type="text/javascript" src="../js/fancybox/jquery.fancybox.pack.js"></script>
    <script type="text/javascript" src="../js/jquery.validate.js?upd=<?php echo time() ?>"></script>
    <script type="text/javascript" src="../js/additional-methods.js?upd=<?php echo time() ?>"></script>
    <script type="text/javascript" src="../js/accounting.min.js"></script>
    <script type="text/javascript" src="../js/alertify.js"></script>
    <script>var tieneAlertify = true;</script>
    <script type="text/javascript" src="../js/functions.js?upd=<?php echo time() ?>"></script>
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
                        <h1 class="titulo">Usuarios <span class="pull-right"><a id="btnAyudaweb" onclick="mostrarAyuda('web_inicio')" href="#fancyAyudaWeb"><img src="../images/icon_ayuda.png" width="20px"></a></span></h1>  


                        <ol class="breadcrumb">
                          <li><a href="index.php">Inicio</a></li>
                          <li class="active">Usuarios</li>
                        </ol>

                         <div class="row">
                            <div class="col-md-7 col-sm-7 col-xs-7"></div>
                            <div class="col-md-5 col-sm-5 col-xs-5">
                                <a href="frmUsuario.php?rolIds=<?php echo $rolIds; ?>" class="<?php echo $mostrarNoti; ?>"><input type="button" value="Nuevo" class="btn btn-primary"></a>
                            </div>
                        </div>
                        <br/>
                            <form name="grids" method="post">
                                <?php
                                echo $koolajax->Render();
                                echo '<div id="contsGrid">';
                                if($result != null)
                                {
                                echo $result->Render();
                                }
                                echo '</div>';
                                ?>
                            </form>
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
</body>
</html>
