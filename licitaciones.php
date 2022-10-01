<?php
include_once 'common/screenPortions.php';
include_once 'brules/licitacionesObj.php';
include_once 'brules/unidadAdminObj.php';



$idU = (isset($_GET['idU'])) ? $_GET['idU'] : 0;

$licitacionesObj = new licitacionesObj();
$unidadAdminObj = new unidadAdminObj();
$allLicitaciones = $licitacionesObj->GetAllLicitaciones("");
$unidad = $unidadAdminObj->obtenerUnidadById($idU);

/*echo "<pre>";
print_r($unidad);
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
                    <h2>LICITACIONES <span class="unidad"> DE <?php echo $unidad->unidadAdmin; ?></span></h2>
                    
                    <div class="row">
                        <div class="list_unidades">
                            <?php foreach ($allLicitaciones as $item) { 
                                if($item->idUnAd == $idU){
                            ?>
                                
                            <div class="banners">
                                <a href="docsLicitacion.php?idL=<?php echo $item->idLicitacion; ?>"><?php echo $item->licitacion; ?></a>
                            </div>

                            <?php 
                                }
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
