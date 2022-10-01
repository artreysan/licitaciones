<?php
include_once 'common/screenPortions.php';
include_once 'brules/docsLicitacionesObj.php';
include_once 'brules/licitacionesObj.php';



$idL = (isset($_GET['idL'])) ? $_GET['idL'] : 0;

$docsLicitacionesObj = new docsLicitacionesObj();
$licitacionesObj = new licitacionesObj();
$allDocsLici = $docsLicitacionesObj->obtAllDocsLicitacion($idL);
$licitacion = $licitacionesObj->obtenerLicitacionById($idL);

/*echo "<pre>";
print_r($licitacion);
echo "</pre>";*/
?>
<!DOCTYPE html>
<html lang="es">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Licitaciones</title>

    <!-- CSS -->
    <link href="/favicon.ico" rel="shortcut icon">
    <link href="https://framework-gb.cdn.gob.mx/assets/styles/main.css" rel="stylesheet">

<body>
<section id="inicio">
<div class="container">
        <div class="row">
            <div class="col-md-5"></div>
    <figure>    	
    </figure>
     <div class="col-md-5"></div>
        </div>
</div>
    <div class="container">
        <div class="row">
            <div class="col-md-offset-2 col-md-8">
				<!-- <div class="logo"><a href="index.php"><img src="images/logo.jpg" /></a></div> -->
                <div class="login-form">
                    <br><br>
                    <h2>DOCUMENTOS LICITACI&Oacute;N <span class="unidad"> <?php echo $licitacion->licitacion; ?></span></h2>
                    
                    <div class="row">
                        <div class="list_unidades">
                                <?php foreach ($allDocsLici as $item) { 
                                ?>
                                    
                                <div class="banners">
                                    <label><?php echo $item->nombreDoc; ?></label>
                                    <a href="uploads/licitaciones/<?php echo $item->documento; ?>" download="<?php echo $item->documento; ?>">
                                        <img src="images/download.png" width="40px">
                                    </a>
                                </div>

                                <?php
                                } ?> 
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
