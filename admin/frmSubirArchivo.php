<?php
session_start();
$checkRol = ($_SESSION['idRol']==1 || $_SESSION['idRol']==2 ) ?true :false;

if($_SESSION['status']!= "ok" || $checkRol!=true)
        header("location: logout.php");

include_once '../common/screenPortions.php';
include '../brules/utilsObj.php';
include_once '../brules/usuariosObj.php';
include_once '../brules/licitacionesObj.php';
include_once '../brules/docsLicitacionesObj.php';
include_once '../brules/utilsObj.php';


$idL = (isset($_GET['id'])) ? $_GET['id'] : 0;

$usuariosObj = new usuariosObj();
$licitacionesObj = new licitacionesObj();
$docsLicitacionObj = new docsLicitacionesObj();

$datosUsr = $usuariosObj->UserByID($_SESSION['idUsuario']);
$infoLicitacion = $licitacionesObj->obtenerLicitacionById($idL);
$allDocs = $docsLicitacionObj->obtAllDocsLicitacion($idL);

if(count($allDocs)<=1){
    if(isset($_POST['save_doc'])){
    /*echo "<pre>";
    print_r($_POST);
    echo "</pre>";*/

      $errors= array();
      $file_name = $_FILES['upload_doc']['name'];
      $file_size = $_FILES['upload_doc']['size'];
      $file_tmp = $_FILES['upload_doc']['tmp_name'];
      $file_type = $_FILES['upload_doc']['type'];
      $target_file = "images/" . time()."_".basename($_FILES["upload_doc"]["name"]);
     
      $name_doc = $_POST['hidd_id_user']."_".$_POST['hidd_licitacion']."_".time().'_'.$file_name;
      //echo $imageFileType;

      // Allow certain file formats
      if($file_type != "application/pdf") {
          $errors[]= "Lo sentimos, sólo archivos PDF son permitidos.";
          $uploadOk = 0;
      }

      if($file_size > 2097152) {
         $errors[]='File size must be excately 2 MB';
      }
     
      if(empty($errors)==true) {
         move_uploaded_file($file_tmp,"../uploads/licitaciones/".$name_doc);
         //echo "Success";
        $docsLicitacionObj->idUsuario = $_POST['hidd_id_user'];
        $docsLicitacionObj->idLicitacion = $_POST['hidd_licitacion'];
        $docsLicitacionObj->nombreDoc = $_POST['name_doc'];
        $docsLicitacionObj->documento = $name_doc;
        $docsLicitacionObj->publicado = 1;
        $docsLicitacionObj->GuardarDocLicitacion();

      }else{
         print_r($errors);
      }

      header('Location: frmSubirArchivo.php?id='.$idL, true, 303);
      //header('Location: '.$_SERVER["PHP_SELF"], true, 303);
    
    }
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
                        <h1 class="titulo"> <span class="pull-right"><?php echo $datosUsr->nombre; ?><br><a href="logout.php">Cerrar Sesi&oacute;n</a></span> </h1>
                        
                        <div class="cont_iconos">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="row">
                                        <h3>Cargar documentos a la licitación - <br><span class="licitacion"><?php echo $infoLicitacion->licitacion; ?> </span></h3>
                                    </div>
                                    <div class="col-md-5">
                                        <form id="frm_upload_files" name="frm_upload_files" method="post" action="" enctype="multipart/form-data">
                                            <input type="hidden" name="hidd_id_user" id="hidd_id_user" value="<?php echo $datosUsr->idUsuario; ?>">
                                            <input type="hidden" name="hidd_unidad" id="hidd_unidad" value="<?php echo $datosUsr->idUnAd; ?>">
                                            <input type="hidden" name="hidd_licitacion" id="hidd_licitacion" value="<?php echo $idL; ?>">
                                            <div class="row">

                                                <label>Nombre documento</label>
                                                <input type="text" name="name_doc" id="name_doc" class="form-control" required="">
                                            </div>
                                            <div class="row">
                                                <label>Subir Archivo</label>
                                                <input type="file" name="upload_doc" id="upload_doc" class="form-control" required="">
                                            </div>
                                            <br>
                                            <div>
                                                <input type="submit" name="save_doc" id="save_doc" value="Guardar" class="btn btn-primary">
                                            </div>
                                        </form>
                                    </div>
                                    <div class="col-md-1"></div>

                                    <div class="col-md-6">
                                        <div>
                                            <h3>Archivos existentes en la licitación</h3>
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Documento</th>
                                                        <th>Fecha</th>
                                                        <th>Descargar</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    <?php
                                                    $cout = 0; 
                                                    foreach ($allDocs as $item) { 
                                                        $cout = $cout + 1;
                                                    ?>
                                                    <tr>
                                                        <td><?php echo $cout ?></td>
                                                        <td><?php echo $item->nombreDoc ?></td>
                                                        <td><?php echo $item->fechaCreacion; ?></td>
                                                        <td class="text-center">
                                                            <a href="../uploads/licitaciones/<?php echo $item->documento; ?>" download="<?php echo $item->documento; ?>">
                                                                <img src="../images/download.png" width="40px">
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <?php } ?>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <br>
    
                                    
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
