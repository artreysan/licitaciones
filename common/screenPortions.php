<?php
/*
 *  Description: Contain necessary methods to call portions screen used as part
 *  of the template
 */

//logo page
function getLogo($level=false){
    $level=($level==true)?'../':'';
    //$logo = '<div class="logo"><a href="index.php"><img src="'.$level.'images/aguilar-29.png" /></a></div>';
    $logo = "";
    return $logo;
}

//Menu dependiendo de los permisos
function getAdminMenu(){
    $menu = '';

    $menu .= '<li><img src="../images/iconos/iconos_menu_lateral/home.svg"><a href="index.php">Inicio</a></li>'; 
    if($_SESSION['idRol'] == 1 || $_SESSION['idRol'] == 1){
      $menu .= '<li><img src="../images/iconos/iconos_menu_lateral/prospectos.svg"><a href="prospectos.php">Licitaciones</a></li>';
      $menu .= '<li><img src="../images/iconos/iconos_menu_lateral/expedientes.svg"><a href="expedientes.php">Nueva licitación</a></li>';
      // $menu .= '<li><img src="../images/iconos/iconos_menu_lateral/agenda.svg"><a href="solicitudes.php">Solicitudes cambio</a></li>';
    }


    $menu .= '<li><img src="../images/iconos/iconos_menu_lateral/salir.svg"><a href="../admin/logout.php">Cerrar Sesi&oacute;n</a></li>';

    return $menu;
}

//footer Page
function getPiePag($level=false){
    $level=($level==true)?'../':'';
    $html = "";
    $html .= '<div class="footer_site text-muted text-center">
                   Licitaciones SCT
               </div>';

    return $html;
}

//usuario
function getUsrForHeader($usrName){  
  if($_SESSION['idRol']==1){
    $clinica = "";
  }else{
    $clinica = "Clinica: ".$_SESSION['nSucursal'];
  }
  $hdr = '<div class="user text-right cursorPointer">
            <div class="dropdown">
              <div class="dropdown-toggle" data-toggle="dropdown" href="#"><span class="glyphicon glyphicon-user" aria-hidden="true"></span><strong>Usuario <span class="caret"></span>:</strong> '.$usrName.' <br/>'.$clinica.' </div>
              <ul class="dropdown-menu">      
                <li><a class="user" href="../admin/logout.php">Cerrar sesi&oacute;n</a></li>
              </ul>
            </div>
          </div>
        ';
  return $hdr;
}

//header Page
function getHeaderMain($myusername, $bool){
	$html = "";
		/*$html .= '<header>
            		 <div class="container">
            			<div class="row">
            				<div class="col-md-9 col-sm-3 col-xs-3"> <div class="logo"><a href="index.php"><img src="../images/logo.jpg" /></a></div></div>
            				<div class="colmenu col-md-3 col-sm-3 col-xs-6">'.getUsrForHeader($myusername).'</div>
            			</div>
            	   </div>
            	</header>
            	<div class="panel-heading">
              		<div class="container">
            			<div class="row">
            				<div class="colmenu col-md-3 col-sm-3 col-xs-3">'.getLogo($bool).'</div>
            			</div>
                   </div>
             </div>';
     $html .= '<div id="fancyAyudaWeb" style="display:none;width:550px;height:300px;">
                           <div class="col-md-12 col-sm-12 col-xs-12" ><h3 id="tituloAyuda"></h3></div>
                           <div class="col-md-12 col-sm-12 col-xs-12" id="contenidoAyudaM" style="height:500px;"></div>
                   </div>';*/
	return $html;
}

function getNav($menu){
  $html = "";
  $html .= '
      <nav class="navbar navbar-default" role="navigation">
          <div class="cont_menu">
              <div class="navbar-header">
                  <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                      <span class="sr-only">Toggle navigation</span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                      <span class="icon-bar"></span>
                  </button>
                  <a class="navbar-brand" href="#">Men&uacute;</a>
              </div>
              <div class="collapse navbar-collapse navbar-ex1-collapse">
                  <ul class="nav navbar-nav">';
                      $html .= $menu;
                  $html .= '</ul>
              </div>
          </div>
      </nav>';
    echo  $html;
}

function getCSSRot(){
  //Obtener los colores de base de datos (del template seleccionado)
  $css = '
    :root {
      --header-bg-color: #f3912c;
      --footer-bg-color: #353434;
      --usertext-bg-color:#353434;
      --navbar-bg-color: #0070b1;
      --menubg-bg-color: #0070b1;
      --h1-color: #02289a;
      --conticon-bg-color: #434f82;
      --conticon-border-color: #98a3d0;
      --conticon-bg-color-hover: #282f4b;
      --navbarli-hover: #434f82;
      --btn-bg-color: #98a3d0;
      --header-kool-color: #434f82;
      --btn-kool-color: #98a3d0;
    }
  ';

  // $css = '
  //   :root {
  //     --header-bg-color: #030e2d;
  //     --footer-bg-color: #030e2d;
  //   }
  // ';

  return $css;
}


//Metodo para dar enlazar todos los estilos necesarios para la pagina
function estilosPagina($level=false){
  $level=($level==true)?'../':'';
  $upd = time();
  $link = '';
  //$link .= ' <link href="'.$level.'css/bootstrap-duallistbox.css" rel="stylesheet" type="text/css" />';

  return $link;
}

//Metodo para dar enlazar todos los scripts necesarios para la pagina
function scriptsPagina($level=false, $funct=0, $agenda=false, $expediente = false){
  $level=($level==true)?'../':'';
  $upd = time();
  $link = '';
  // $link .= ' <script src="'.$level.'js/bootstrap.min.js" type="text/javascript"></script>';
  $link .= ' <script src="'.$level.'js/bootstrap-4.4.1.min.js" type="text/javascript"></script>';


  
 
  return $link;
}

?>
