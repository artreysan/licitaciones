<?php
include_once 'common/screenPortions.php';
?>
<!DOCTYPE html>
<html lang="es">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Iniciar Sesión</title>

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
                    <form method="post" action="checklogin.php" role="login">

                        <div class="form-group col-md-12">
                            <label class="col-md-3" for="email"></label>
                            <input class="col-md-9" type="email" class="form-control input-lg" name="usr_email" id="usr_email"  placeholder="Correo electrónico" required>
                        </div>
                        <div class="form-group col-md-12">
                            <label class="col-md-3" for="pwd"></label>
                            <input class="col-md-9" type="password" class="form-control input-lg" name="usr_pass" id="usr_pass" placeholder="Contraseña" required>
                        </div>

                        <div class="pwstrength_viewport_progress"></div>
                        <button type="submit" name="aceptar" class="btn btn-lg btn-primary btn-block">INICIAR SESIÓN </button>

                        
                    </form>
                    
                    <div class="row">
                        <!-- <div class="col-md-12">
                            <a href="retrievepass.php">Recuperar contrase&ntilde;a</a>
                        </div> -->
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
