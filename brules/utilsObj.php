<?php
$dirname = dirname(__DIR__);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>METODOS GENERALES<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function formatoMoneda($amount = 0){
    if($amount !== ''){
        return "$ ".number_format($amount, 2);
    }else{
        return $amount;
    }
    
}

function removerCaracteres($dato, $arrCaracteres = array(",","$", " ")){
    $datoReturn = $dato;

    foreach ($arrCaracteres as $caracter) {
        $datoReturn = str_replace($caracter, "", $datoReturn);
    }
    return trim($datoReturn);
}

//Convierte una cadena de texto enriquecido a sus htmlentities y ademas cambia los signos ? por su entity para evitar errores en base de datos
function convertirTextoEnriquecido($string, $siteURL = "", $tinymce = false){
  if($tinymce && $siteURL != ""){
    $string = str_replace("../upload", $siteURL."upload", $string);
  }

  $string = str_replace("?","&quest;", $string);
  $string = str_replace("'","", $string);
  // $string = htmlentities($string);

  return $string;
}

function convertirTextoEnriquecidoApp($string, $siteURL = "", $tinymce = false){
    if($tinymce && $siteURL != ""){
      $string = str_replace("../upload", $siteURL."upload", $string);
      $string = str_replace("a href", "a class=\"external\" href", $string);
      $string = str_replace("a title", "a class=\"external\" title", $string);
      $string = str_replace("//www", "https://www", $string);
      $string = str_replace("https:https:", "https:", $string);
      $string = str_replace("http:https:", "https:", $string);
    }
    elseif($tinymce && strpos("embed", $string)){
      $string = str_replace("//www", "https://www", $string);
    }
  
    $string = str_replace("?","&quest;", $string);
    $string = str_replace("'","", $string);
    $string = str_replace('"',"&#34;", $string);
    
    //$string = htmlentities($string);
  
    return $string;
  }

//llamar a librerias koolphp
function libreriasKool(){
  include_once '../brules/KoolControls/KoolGrid/koolgrid.php';
  require_once '../brules/KoolControls/KoolCalendar/koolcalendar.php';
  include_once '../brules/KoolControls/KoolGrid/ext/datasources/MySQLiDataSource.php';  
  $localization = "../brules/KoolControls/KoolCalendar/localization/es.xml";
}

//Recibe cadena de fecha con formato AAA-MM-DD
//Si la fecha es menor a hoy, la diferencia saldra positiva
//Si se recibe un segundo parametro de fecha se realizara la diferencia entre ambas fechas, si no, entre la primera fecha y hoy
//El formato salida default es por dias
function obtenerDiferenciaPorFechaHoy($strFechaAnt = '2017-11-05', $strFechaRec = '', $formatoSalida = "a"){
    //Genera una variable date para la fecha recibida
    $formato = "Y-m-d h:i:s";
    $fecha = strtotime ( "-0 day" , strtotime ( $strFechaAnt ) ) ;
    $fecha = date ($formato, $fecha);

    //Se crea una variable DateTime de el momento actual para comparar con la fecha recibida
    if($strFechaRec == ''){
        $dateReciente = new DateTime("now", new DateTimeZone('America/Mexico_City') );
    }
    else{
        $fechaRec = strtotime ( "-0 day" , strtotime ( $strFechaRec ) ) ;
        $fechaRec = date ($formato, $fechaRec);
        $datetimeRec = new DateTime();
        $dateReciente = $datetimeRec->createFromFormat('Y-m-d h:i:s', $fechaRec);
    }


    //Se convierte la variable date a DateTime de la fecha recibida
    $datetime = new DateTime();
    $dateAntigua = $datetime->createFromFormat('Y-m-d h:i:s', $fecha);

    //Obtiene la diferencia de las fechas
    $dif = date_diff($dateAntigua, $dateReciente);

    //Regresa la diferencia en formato numérico y relativo
    return $dif->format('%R%'.$formatoSalida);

}

/*//metodo para detectar que el texto puede ser algun link
function urlify(text) {
    var $urlRegex = '/(((https?:\/\/)|(www\.))[^\s]+)/g';
    
    return text.replace(urlRegex, function(url,b,c) {        
        var url2 = (c == 'www.') ?  'http://' +url : url;
        return '<a href="' +url2+ '" target="_blank" class="external">' + url + '</a>';
    }) 
}*/

function linkify($value, $protocols = array('http', 'mail'), array $attributes = array())
  {
      // Link attributes
      $attr = '';
      foreach ($attributes as $key => $val) {
          $attr .= ' ' . $key . '="' . htmlentities($val) . '"';
      }
      
      $links = array();
      
      // Extract existing links and tags
      $value = preg_replace_callback('~(<a .*?>.*?</a>|<.*?>)~i', function ($match) use (&$links) { return '<' . array_push($links, $match[1]) . '>'; }, $value);
      
      // Extract text links for each protocol
      foreach ((array)$protocols as $protocol) {
          switch ($protocol) {
              case 'http':
              case 'https':   $value = preg_replace_callback('~(?:(https?)://([^\s<]+)|(www\.[^\s<]+?\.[^\s<]+))(?<![\.,:])~i', function ($match) use ($protocol, &$links, $attr) { if ($match[1]) $protocol = $match[1]; $link = $match[2] ?: $match[3]; return '<' . array_push($links, "<a $attr href=\"$protocol://$link\" target=\"_blank\" class=\"external\">$link</a>") . '>'; }, $value); break;
              case 'mail':    $value = preg_replace_callback('~([^\s<]+?@[^\s<]+?\.[^\s<]+)(?<![\.,:])~', function ($match) use (&$links, $attr) { return '<' . array_push($links, "<a $attr href=\"mailto:{$match[1]}\">{$match[1]}</a>") . '>'; }, $value); break;
              case 'twitter': $value = preg_replace_callback('~(?<!\w)[@#](\w++)~', function ($match) use (&$links, $attr) { return '<' . array_push($links, "<a $attr href=\"https://twitter.com/" . ($match[0][0] == '@' ? '' : 'search/%23') . $match[1]  . "\">{$match[0]}</a>") . '>'; }, $value); break;
              default:        $value = preg_replace_callback('~' . preg_quote($protocol, '~') . '://([^\s<]+?)(?<![\.,:])~i', function ($match) use ($protocol, &$links, $attr) { return '<' . array_push($links, "<a $attr href=\"$protocol://{$match[1]}\">{$match[1]}</a>") . '>'; }, $value); break;
          }
      }
      
      // Insert all link
      return preg_replace_callback('/<(\d+)>/', function ($match) use (&$links) { return $links[$match[1] - 1]; }, $value);
  }


  function generaFilaTablaBootstrap($idTabla, $fila, $colAcciones = false, $acciones = "", $arrAligns = array(), $tratoProv = false, $claseTrato = "", $enviarCot = false, $claseEnv = ""){
    $html = '';

        $idFila = 0;

        //Se recorre la fila solo para obtener el id de la fila
        foreach ($fila as $key => $value) {
             if($key == "id" || $key === 0){
                $idFila = $value;
             }
        }

        $html .= '<tr id="'.$idTabla.'_tr_'.$idFila.'" class="'.$idTabla.'_tr_'.$idFila.'">';
        $accAnt = '';$accDes = '';
        //Se recorre la fila de nuevo para agregar a la tabla los datos
        foreach ($fila as $key => $value) {
            if($key == "id" || $key === 0){

             }
             elseif ($key == "accAnt") {
                $accAnt = $value;
             }
             elseif ($key == "accDes") {
                $accDes = $value;
            }
             else{
                $align = "";
                if(count($arrAligns) > 0){//Si se ha enviado un array con alienaciones para cada columna
                    $align = $arrAligns[$key-1];//Obtener la alineacion de la celda actual
                }
                //El id del TD se crea con
                // el nombre de la tabla
                //_td_
                //el key o numero de columna
                //_ id de la fila (id del registro en base de datos)
                $html .= '<td class="'.$align.'" id="'.$idTabla.'_td_'.$key.'_'.$idFila.'">'.$value.'</td>';
             }
        }
        // echo $idFila."<br>";
        //Si se activa columna acciones, se sustituye el id de la fila, en donde sea encontrado en el html de las acciones
        if($colAcciones){
            $accionesMod = $accAnt.$acciones.$accDes;
            $accionesMod = str_replace("{id}", $idFila, $accionesMod);

            if($tratoProv){
                $accionesMod = str_replace("{clase}", $claseTrato, $accionesMod);
            }

            if($enviarCot){
                $accionesMod = str_replace("{clase2}", $claseEnv, $accionesMod);
            }

            $html  .= '<td class="text-right">'.$accionesMod.'</td>';
        }

        $html .= '</tr>';

    return $html;
}

//Convierte una cadena de texto enriquecido a sus htmlentities y ademas cambia los signos ? por su entity para evitar errores en base de datos
function convertirEntitieAString($string){  
  $string = str_replace("&#63;","?", $string);
  $string = str_replace("aaaaa","https", $string);
  $string = str_replace("aaaa","http", $string);
  // $string = str_replace("'","", $string);
  // $string = htmlentities($string);

  return $string;
}



//Metodo para obtener anios atras o adelante a la fecha actual
function aniosPrevPos($anios, $anioActual, $ctr){
    $result = "";    
    //Obtiene anios atras
    if($ctr=="prev") {
      $result = $anioActual-$anios;
    }
    //Obtiene anios delante
    if($ctr=="pos") {
      $result = $anioActual+$anios;
    }

    return $result;
}

//Obtener la fecha 
function obtDateTimeZone(){
    $dateByZone = new DateTime("now", new DateTimeZone('America/Mexico_City') );
    $fecha = $dateByZone->format('Y-m-d'); //fecha
    $hora = $dateByZone->format('H:i:s'); //Hora
    $fechaHora = $dateByZone->format('Y-m-d H:i:s'); //fecha y hora
    $anio = $dateByZone->format('Y'); //fecha
    //Formatos d/m/Y
    $fechaF2 = $dateByZone->format('d/m/Y'); //fecha formato d/m/Y
    $fechaHoraF2 = $dateByZone->format('d/m/Y H:i:s'); //fecha y hora d/m/Y H:i:s
    $dia = $dateByZone->format('N'); //dia (1-7, L-D)

    return (object)array("fecha"=>$fecha, "hora"=>$hora, "fechaHora"=>$fechaHora, "fechaF2"=>$fechaF2, "fechaHoraF2"=>$fechaHoraF2, "anio"=>$anio, "dia"=>$dia);
}    

//Subir una imagen al server
function subirImagen($files, $params, $opc = 0){
    $nombreInput = "imagen";
    if($opc == 1){
        $nombreInput = "imagenc";
    }
    $folderDestino = $params->folderDestino; 
    // $archivoDestino = $folderDestino . basename($files[$nombreInput]["name"]);    
    $archivoExt = pathinfo(basename($files[$nombreInput]["name"]),PATHINFO_EXTENSION);
    
    //Cambiar nombre a la imagen 
    $nuevaImg = generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$archivoExt;
    $archivoDestino = $folderDestino.$nuevaImg;

    //comprueba la extension del archivo
    if(!in_array($archivoExt, $params->arrExt)){
        return (object)array("result"=>false, "respImg"=>"Comprueba la extensión del archivo.");
    }

    //Subir archivo
    if(move_uploaded_file($_FILES[$nombreInput]["tmp_name"], $archivoDestino)) {
        return (object)array("result"=>true, "respImg"=>"Archivo subido correctamente.", "nImg"=>$nuevaImg);
       // return (object)array("result"=>true, "respImg"=>"Archivo subido correctamente.", "nImg"=>basename($files[$nombreInput]["name"]));
    }else{
        return (object)array("result"=>false, "respImg"=>"Lo sentimos, hubo un error al cargar su archivo.");        
    }    
}

//Subir un archivo al servidor
function subirArchivo_actual($files, $params){
    $nombreInput = $params->nameFile;
    $folderDestino = $params->folderDestino;     
    $archivoExt = strtolower(pathinfo(basename($files[$nombreInput]["name"]),PATHINFO_EXTENSION));
    
    //Cambiar nombre del archivo
    $nombreArchivo = generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$archivoExt;
    $archivoDestino = $folderDestino.$nombreArchivo;

    //comprueba la extension del archivo
    if(!in_array($archivoExt, $params->arrExt)){
        return (object)array("result"=>false, "respArchivo"=>"Comprueba la extensión del archivo.");
    }

    //Subir archivo
    if(move_uploaded_file($_FILES[$nombreInput]["tmp_name"], $archivoDestino)) {
        return (object)array("result"=>true, "respArchivo"=>"Archivo subido correctamente.", "nArchivo"=>$nombreArchivo);
    }else{
        return (object)array("result"=>false, "respArchivo"=>"Lo sentimos, hubo un error al cargar su archivo.");        
    }
}

//Convertir imagen en base 64
function imagenBase64($rutaImg){   
    if(file_exists($rutaImg)){
        $type = pathinfo($rutaImg, PATHINFO_EXTENSION);
        $data = file_get_contents($rutaImg);
        $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);

        return $base64;
    }
    else{
        return "";
    }
}


//Metodo para obtener dias atras o dias posteriores a la fecha actual
function diasPrevPos($dias, $dataCurrent, $ctr, $tipo = 1){
    $fecha = "";
    $formato = "d/m/Y";
    switch ($tipo) {
      case 1: $formato = "d/m/Y"; break;
      case 2: $formato = "Y-m-d h:i:s"; break;
      case 3: $formato = "Y-m-d"; break;
      case 4: $formato = "Y-m-d H:i:s"; break;
      

    }
    //Obtiene dias atras
    if($ctr=="prev") {
      $fecha = strtotime ( "-$dias day" , strtotime ( $dataCurrent ) ) ;
      $fecha = date ($formato, $fecha);
    }
    //Obtiene dias adelante
    if($ctr=="pos") {
      $fecha = strtotime ( "+$dias day" , strtotime ( $dataCurrent ) ) ;
      $fecha = date ($formato, $fecha);
    }

    return $fecha;
}

//Metodo para obtener dias del mes atras o dias posteriores a la fecha actual
function diasPorMesPrevPos($mes, $dataCurrent, $ctr, $tipo = 1){
    $fecha = "";
    $formato = "d/m/Y";
    if($tipo == 2)
    {
        $formato = "Y-m-d h:i:s";
    }
    if($tipo == 3)
    {
        $formato = "Y-m-d";
    }
    //Obtiene dias atras segun el numero de meses
    if($ctr=="prev") {
      $fecha = strtotime ( "-$mes month" , strtotime ( $dataCurrent ) ) ;
      $fecha = date ($formato, $fecha);
    }
    //Obtiene dias adelante segun el numero de meses
    if($ctr=="pos") {
      $fecha = strtotime ( "+$mes month" , strtotime ( $dataCurrent ) ) ;
      $fecha = date ($formato, $fecha);
    }

    return $fecha;
}

//convertir fechas de formato (dd/mm/YYYY) a (YYYY-mm-dd)
function conversionFechas($fecha){
    list($dd, $mm, $yyyy) = explode("/", $fecha);
    $fecha = $yyyy.'-'.$mm.'-'.$dd;
    return $fecha;
}

//convertir fechas de formato (YYYY-mm-dd) a (dd/mm/YYYY)
function conversionFechaF2($fecha){        
    $fecha = date("d/m/Y",strtotime($fecha));        
    return $fecha;
}

//convertir fechas de formato (YYYY-mm-dd hh:mm:ss) a (dd/mm/YYYY hh:mm:ss)
function conversionFechaF4($fecha){        
    $explFecha = explode(" ", $fecha);
    $hora = $explFecha[1];//.':00';
    $fecha = conversionFechaF2($explFecha[0]);
    $fecha = $fecha." ".$hora;

    return $fecha;
}

//convertir fechas de formato (dd/mm/YYYY hh:mm:ss) a (YYYY-mm-dd hh:mm:ss)
function conversionFechaF3($fecha){        
    $explFecha = explode(" ", $fecha);
    $hora = $explFecha[1];//.':00';//JAIR comento 04/6/2020
    $fecha = conversionFechas($explFecha[0]);
    $fecha = $fecha." ".$hora;

    return $fecha;
}

//convertir fechas de formato (YYYY-mm-dd hh:mm:ss) a (dd/mm/YYYY hh:mm)
function conversionFechaF5($fecha){
    $explFecha = explode(" ", $fecha);
    $hora = $explFecha[1];
    $fecha = conversionFechaF2($explFecha[0]);
    $fecha = $fecha." ".$hora;

    return $fecha;
}

//convertir fechas de formato (dd/mm/YYYY hh:mm:ss) a (YYYY-mm-dd)
function conversionFechaF6($fecha){
    $explFecha = explode(" ", $fecha);
    $hora = $explFecha[1];
    $fecha = conversionFechas($explFecha[0]);
    $fecha = $fecha;

    return $fecha;
}

//convertir fechas de formato (YYYY-mm-dd hh:mm:ss) a (Y-m-d)
function conversionFechaF7($fecha){
    $fecha = date("Y-m-d",strtotime($fecha));
    return $fecha;
}

//convertir fechas de formato (17.07.2020 13:28 dd.mm.YYYY hh:mm) a (YYYY-mm-dd hh:mm)
function conversionFechaF8($fecha){
  $explFecha = explode(" ", $fecha);
  $fechaTmp = explode(".", $explFecha[0]);
  $fecha = trim($fechaTmp[2]."-".$fechaTmp[1]."-".$fechaTmp[0])." ".trim($explFecha[1]);

  return $fecha;
}

// Formato de fecha hora para el calendario
function fechaHoraCal($fecha){
  return str_replace(" ", "T", $fecha);
}

// Remover T de la fecha hora calendario
function limpiarFechaHoraCal($fecha){
  return str_replace("T", " ", $fecha);
}

//Genera una cadena aleatoria
function generarPassword($longitud = 6, $opc_letras = TRUE, $opc_numeros = TRUE,   $opc_letrasMayus = FALSE, $opc_especiales = FALSE ){    
    $password = "";
    $letras ="abcdefghijklmnopqrstuvwxyz";
    $numeros = "1234567890";
    $letrasMayus = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $especiales ="|@#~$%()=^*+[]{}-_";
    $listado = "";
    if ($opc_letras == TRUE) {
        $listado .= $letras; }
    if ($opc_numeros == TRUE) {
        $listado .= $numeros; }
    if($opc_letrasMayus == TRUE) {
        $listado .= $letrasMayus; }
    if($opc_especiales == TRUE) {
        $listado .= $especiales; }
    str_shuffle($listado);
    for( $i=1; $i<=$longitud; $i++) {
        $password .= @$listado[rand(0,strlen($listado))];
        str_shuffle($listado);
    }
    return $password;
}

//Metodo para convertir fecha en formato yy-mm-dd => dd/mm/yy
function convertirFechaVista($fecha){
    return date ( 'd/m/Y' , strtotime($fecha) );
}

function convertirFechaVistaConHora($fecha){
    //return date ( 'd/m/Y H:i:s' , strtotime($fecha) );
    return date ( 'd/m/Y H:i' , strtotime($fecha) );
}

//Metodo para obtener la fecha con formato Lunes 1 de enero de 2017
function obtenerFechaCompletaDeHoy(){
    $dateByZone = new DateTime("now", new DateTimeZone('America/Mexico_City'));
    $mes = $dateByZone->format("n");
    $m = obtenerMes($mes);
    $dateComplete = $dateByZone->format("j") . " de " . $m . " del " . $dateByZone->format("Y");
    return $dateComplete;
}

//Convertir fecha yy-mm-dd a 1 de enero de 2017
function convertirAFechaCompleta($fecha){
    $dateByZone = new DateTime($fecha, new DateTimeZone('America/Mexico_City'));
    $mes = $dateByZone->format("n");
    $m = obtenerMes($mes);
    $dateComplete = $dateByZone->format("j") . " de " . $m . " del " . $dateByZone->format("Y");
    return $dateComplete;
}

//Convertir fecha yy-mm-dd a 1/enero/2018
function convertirFechaF1($fecha){
    list($anio, $mes, $dia) = explode("-", $fecha);
    $m = obtenerMes($mes);
    $dateComplete = $dia . "/" . $m . "/" . $anio;

    return $dateComplete;
}

//Convertir horas de 19:00:00 a 19:00
function convertirHoraF1($hora){
    list($h, $s, $ms) = explode(":", $hora);
    $hora = $h . ":" . $s;

    return $hora;
}

//Obtener la diferencia de minutos entre dos horas
function obtDifMinutos($hora1, $hora2){
    $hora1 = new DateTime($hora1);//hora inicial
    $hora2 = new DateTime($hora2);//hora fin
    $tAgendado = $hora2->diff($hora1);
    $tHoraAg = $tAgendado->format('%H');
    $tMinAg = $tAgendado->format('%i');
    $tAgendado = ($tHoraAg != "00")?$tHoraAg.".".$tMinAg :$tMinAg;
    return $tAgendado;
}

//obtener el nombre del mes mediante el numero que le corresponde
function obtenerMes($mes){
    $m = "";
    switch ($mes) {
        case 1: $m = "Enero";break;
        case 2: $m = "Febrero";break;
        case 3: $m = "Marzo";break;
        case 4: $m = "Abril";break;
        case 5: $m = "Mayo";break;
        case 6: $m = "Junio";break;
        case 7: $m = "Julio";break;
        case 8: $m = "Agosto";break;
        case 9: $m = "Septiembre";break;
        case 10: $m = "Octubre";break;
        case 11: $m = "Noviembre";break;
        case 12: $m = "Diciembre";break;
    }
    return $m;
}


//Convertir fecha yy-mm-dd a Viernes/ 20 Marzo 2018
function convertirAFechaCompleta2($fecha){
    $dateByZone = new DateTime($fecha, new DateTimeZone('America/Mexico_City'));
    $dia = obtenerDiaSemana($dateByZone->format("w"));
    $mes = $dateByZone->format("n");
    $m = obtenerMes($mes);
    $dateComplete = $dia ." ". $dateByZone->format("j") . " " . $m ." ". $dateByZone->format("Y, H:i");//.", ". $dateByZone->format("H");
    return $dateComplete;
}
//obtener el nombre del dia de la semana mediante el numero que le corresponde
function obtenerDiaSemana($dia){
    $dias = array("Domingo","Lunes","Martes","Mi&eacute;rcoles","Jueves","Viernes","S&aacute;bado");
    $dia = $dias[$dia];
    return $dia;
}

//Obtener el dia de la semana por una fecha dada
function obtDiaSemanaPorFecha($fecha){
  $dateByZone = new DateTime($fecha, new DateTimeZone('America/Mexico_City'));
  $dia = $dateByZone->format("w");
  return $dia;
}


//obtener la extension de algun archivo
function obtenerExtension($str) {
        $arr = explode(".", $str);
        $ext = strtolower($arr[count($arr)-1]);
        return $ext;
}

//Metodo para construir una cadena sql
function contruyeCadenaSqlAct($array){
    //$array = Arreglo de campos y valores    
    $cadenaSql = "";
    $query = array();
    if(count($array)>0){
        foreach($array as $elem){
            $elem = (object)$elem; //convierte el arreglo en objeto
            $query[] = $elem->campo.'='."'".$elem->valor."'";            
        }
        $cadenaSql = implode(", ", $query);        
    }
    return $cadenaSql;
}

//reemplaza texto
function textoParaBD($texto){
    return trim(str_replace('?', '___', $texto));
}

//reemplaza texto
function textoParaMostrar($texto){
    return str_replace("___","?",$texto);
}

//Obtener parametro dada una url
function obtenerParametroURL($url, $nombre){
  $params = parse_url($url, PHP_URL_QUERY);
  $array = explode("&",$params); 
  $embed = "";
  foreach ($array as $key => $value) {
          $param = explode("=",$value);
          if($param[0] == $nombre)
          {
            $embed = $param[1];
            break;
          }
  } 
  return $embed;
}

//Reemplzaza caracteres
function cadenaEspeciales($cadena){
    $cadena = str_replace("\"", "&#39;", $cadena);
    $cadena = str_replace("'", "&#39;", $cadena);
    $cadena = str_replace("ñ", "&ntilde;", $cadena);
    $cadena = str_replace("á", "&aacute;", $cadena);
    $cadena = str_replace("é", "&eacute;", $cadena);
    $cadena = str_replace("í", "&iacute;", $cadena);
    $cadena = str_replace("ó", "&oacute;", $cadena);
    $cadena = str_replace("ú", "&uacute;", $cadena);

    return $cadena;
}

//reemplazar caracteres a su entitie (',")
function reemplazarAEntities($dato){
   $arrC = array("&#039;"=>"'");
   foreach ($arrC as $key=>$val){
    $dato = str_replace($val, $key, $dato);
   } 
   return $dato;
}

// Metodo que genera folio
function generarFolio($number){    
    $folio = str_pad($number, 10, "0", STR_PAD_LEFT);
    
    return $folio;
}

//Metodo para invocar alertas
function msgAlertifySer($insUpd=0, $msjPer=""){
     // echo $insUpd.' - '.$msjPer.'<br/>';
     $html = '';
     $html .= "<script language='javascript' type='text/javascript'> $(function(){";
         if($insUpd>0){
            if($msjPer!=""){
               $msjPer = '"'.$msjPer.'"';
               // $html .= 'msgAlertify("",'.$msjPer.','.$insUpd.');';
               $html .= 'msgAlertify("",'.$msjPer.',1);';
            }else{
                switch ($insUpd) {
                  case 1: $html .= 'msgAlertify("Registro agregado correctamente","",1);'; break;
                  case 2: $html .= 'msgAlertify("Registro actualizado correctamente","",1);'; break;
                }
            }
         }else{
            if($msjPer!=""){
                $msjPer = '"'.$msjPer.'"';
                $html .= 'msgAlertify("",'.$msjPer.',2);';
            }else{
                $html .= 'msgAlertify("","No hay cambios",2);';
            }
         }
    $html .= "}); </script>";
    echo $html;
}

// Metodo para limpiar el campo de un formulario
function limpiaCampo($cad){
    $cad = trim(stripslashes($cad));
    return $cad;
}

//Metodo que comprueba si un archivo existe
function existeArchivo($ruta){
    $resp = false;
    if(file_exists($ruta)){
        $resp = true;
    }
    return $resp;
}

//obtener dias entre 2 fechas
function obtTotalDiasEntreFechas($fecha1, $fecha2){
  $fecha1 = strtotime($fecha1); // or your date as well
  $fecha2 = strtotime($fecha2);
  $fechadif = $fecha2-$fecha1;

  return round($fechadif / (60 * 60 * 24));
}

//OBTENER EL FANCY DE ELIMINAR GENERAL
function getFancyElimGral(){
    return '<div id="fancyElimCat" style="display:none;width:550px;height:100px;">
                           <div class="col-md-12 col-sm-12 col-xs-12" >
                                <h3 id="tituloElim"></h3>
                            </div>
                           <div class="col-md-12 col-sm-12 col-xs-12">
                               <input type="hidden" name="elimRegId" id="elimRegId" value="">
                                <input type="hidden" name="elimTipo" id="elimTipo" value="">
                                <div class="row">
                                    <div class="alert alert-warning" id="warningNoElim">
                                      <strong>Atenci&oacute;n!</strong> El registro no se puede eliminar porque es utilizado.
                                    </div>
                                </div>
                                <div class="row" id="contenidoElim">
                                    
                                </div>

                                <div class="row">
                                    <div class="col-md-7"></div>
                                    <div class="col-md-2">
                                        <a class="btn btn-primary" onclick="parent.$.fancybox.close();">Cerrar</a>
                                    </div>
                                    <div class="col-md-2">
                                        <a class="btn btn-primary" id="btnElimReg" onclick="eliminarRegCatalogo()">Eliminar</a>
                                    </div>
                                </div>
                           </div>
                        </div>';
}


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>METODOS ESPECIFICOS<<<<<<
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//Obtener todos las partidas
function dropDownGaleria($idG){
    $galeriasObj = new catGaleriasObj();
    $colTiposGalerias = $galeriasObj->ObtTodosCatGalerias();
   
    $html = '';
    $html .= '<select class="form-control" name="ip_galeria" id="ip_galeria">';
        // $html .= '<option value="">-Selecciona-</option>';
        if(count($colTiposGalerias)>0){
            foreach($colTiposGalerias as $itemGal){
                $html .= '<option value="'.$itemGal->galeriaId.'">'.$itemGal->nombre.'</option>';
            }
        }
    $html .= '</select>';
    return $html;
}


function generaTablaBootstrapVacia($idTabla, $arrEncabezados, $colAcciones = false, $classEncabezados = array()){
    $width = '100%';
    if(strpos($idTabla, 'Existen') || strpos($idTabla, 'Cotizar') || strpos($idTabla, 'DetallesGastos') || strpos($idTabla, 'Perfilar') ){
        $width = 'auto';
    }
    $html = '';

    //Inicio de la tabla, sustituir id
    $html .= '<div class="datable_bootstrap">';
    $html .= '<table id="'.$idTabla.'" class="table table-striped table-bordered table-condensed dataTable hover" role="grid" cellspacing="0" style="width:'.$width.'" >';
    $html .= '<thead>';
     $idth =(isset($gasPrev))?'id="accGasPrev"':"";
    $html .= '<tr >';

    //Recorrer encabezados de la tabla
    $key = 1;
    foreach ($arrEncabezados as $titulo) {
        $claseExtraComprimido = ($idTabla == 'tablaExistentesHerramientasResumen')?'comprimido':'';
        $iconSort = '<i class="fa fa-fw fa-sort " aria-hidden="true" ></i>';
        $align = "";
        if(count($classEncabezados) > 0){//Si se ha enviado un array con alienaciones para cada columna
            $align = $classEncabezados[$key-1];//Obtener la alineacion de la celda actual

            if(strpos($align, "colCheck") === false){
            }
            else{
                $iconSort = '&nbsp;&nbsp;&nbsp;';
            }
        }
        $html .= '<th class="'.$claseExtraComprimido.' '.$align.'" style="width:80px">'.$titulo.$iconSort.'</th>';

        $key++;
    }

    //Si se activa columna acciones se agrega el encabezado
    if($colAcciones){
        $html .= '<th class="comprimido colNumerico" '.$idth.' style="width:140px">Acciones</th>';
    }

    $html .= '</tr>';
    $html .= '</thead>';
    $html .= '</table>';
    $html .= '</div>';

    return $html;
}
//Crear un codigo de validacion
function genValidationCode(){
  $codigoValidacionObj = new codigoValidacionObj();
  $code = generarPassword(6);
  $codigoValidacionObj->codigo = $code;
  $codigoValidacionObj->GuardarcodigoValidacion();
  return $code;
}

//validar codigo 
// function validaCodigo($code,$correo,$password){
function validaCodigo($code){
  $codigoValidacionObj = new codigoValidacionObj();
  $idcode = $codigoValidacionObj->obtenerCodigoValidacionByCodigo($code);
  $res = 0;
  if($idcode->idCodigoVal>0) {// verifica si existe el codigo en la tabla
    // $codigoValidacionObj->EliminarcodigoValidacion($idcode->idCodigoVal); // como si existe el codigo y se evio el correo , se elimina de la base de datos    
    $res = 1;
  }
  // $res="No existe el Codigo";
  // if ($idcode->idCodigoVal>0) {// verifica si existe el codigo en la tabla
  //   $res=$idcode->codigo;
  //   // si existe el codigo se manda un correo con los datos de acceso
  //   $EmailFunctions = new EmailFunctions();
  //   $result = $EmailFunctions->EnviarDatosAcceso("none",$correo,$password);
  //   if ($result>0) {
  //     $codigoValidacionObj->EliminarcodigoValidacion($idcode->idCodigoVal); // como si existe el codigo y se evio el correo , se elimina de la base de datos
  //   }
  // }
  return $res;
}


//>>>>Inicio enviar codigo por SMS
// Enviar mensaje proveedor bulksms    
function enviarSMS($mensaje, $telefono){
  //$telefono = "2225336420"; //Desabilitar
  $telCod = "+52"; //Mexico
  // $username = 'AppSP'; //usuario: bulksms, cambiar por el id indicado
  // $password = 'Us3rS3rv1c10Publ1c02018'; //pass: bulksms, cambiar por el pass indicado
  $username = 'monzani'; //usuario: bulksms, cambiar por el id indicado
  $password = 'wBsaXyU#ck6itGZ'; //pass: bulksms, cambiar por el pass indicado
  $messages = array();
  $messages[] = array('to'=>"$telCod"."$telefono", 'body'=>$mensaje); 
  
  //Enviar mensaje
  $result = send_message_bulksms(json_encode($messages), 'https://api.bulksms.com/v1/messages', $username, $password);
  if($result['http_status'] != 201){
    // print "Error sending.  HTTP status " . $result['http_status'];
    // print " Response was " .$result['server_response'];
    // return "No fue posible enviar mensaje";
    return false;
  }else{
    // print "Response " . $result['server_response'];
    // return "Mensaje enviado";
    return true;
  }
  // echo "<pre>";
  // print_r($messages);
  // echo "</pre>";  
}
//Api bulksms encargada de enviar el mensaje
function send_message_bulksms($post_body, $url, $username, $password){
  $ch = curl_init( );
  $headers = array(
      'Content-Type:application/json',
      'Authorization:Basic '. base64_encode("$username:$password")
  );
  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  curl_setopt ( $ch, CURLOPT_URL, $url );
  curl_setopt ( $ch, CURLOPT_POST, 1 );
  curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
  curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_body );
  // Allow cUrl functions 20 seconds to execute
  curl_setopt ( $ch, CURLOPT_TIMEOUT, 20 );
  // Wait 10 seconds while trying to connect
  curl_setopt ( $ch, CURLOPT_CONNECTTIMEOUT, 10 );
  $output = array();
  $output['server_response'] = curl_exec( $ch );
  $curl_info = curl_getinfo( $ch );
  $output['http_status'] = $curl_info[ 'http_code' ];
  curl_close( $ch );

  // echo "<pre>";
  // print_r($curl_info);
  // echo "</pre>";
  return $output;
}
//>>>>Fin enviar codigo por SMS


//>>>>Comprobar si la fecha actual esta en el rango de dos fechas
function check_in_range($fecha_inicio, $fecha_fin, $fecha){
   $fecha_inicio = strtotime($fecha_inicio);
   $fecha_fin = strtotime($fecha_fin);
   $fecha = strtotime($fecha);

   if(($fecha >= $fecha_inicio) && ($fecha <= $fecha_fin)){
    return true;
   }else{
    return false;
   }
}

// Saber el dia actual de la semana
function saber_dia($fechaAct) {
  // $dias = array('Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado');
  $dias = array('D','L','M','Mi','J','V','S');
  $fecha = $dias[date('w', strtotime($fechaAct))];
  return $fecha;
}

// Obtener los dias de la semana a partir del dia actual
function obtDiasSemPorDiaActual($fecha){
  /* $date = strtotime(date($fecha));
  $start = $date;
  while (date("w", $start) > 1) {
  $start -= 86400; // One day
  }
  for($i=0; $i<7; $i++){
    echo $end = date('Y-m-d', $start + ($i * 86400));  
    echo "<br/>";
  }*/

  $arrSemana = array();
  $arrSemana["L"] = "";
  $arrSemana["M"] = "";
  $arrSemana["Mi"] = "";
  $arrSemana["J"] = "";
  $arrSemana["V"] = "";
  $arrSemana["S"] = "";
  $arrSemana["D"] = "";
    
  foreach (range(0, 6) as $num) {
    $dia = diasPrevPos($num, $fecha, "pos", 3);
    $diaSem = saber_dia($dia);
    // echo $num." - ".$dia." - ".$diaSem."<br/>";    
    $arrSemana[$diaSem] = $dia;
  }

  return $arrSemana; 
}


function muestraHora($hora, $opc){
  $arrHora = explode(":", $hora);
  $horaRet = "";
  switch ($opc) {
    case 1:
      $horaRet = $arrHora[0].":".$arrHora[1];
    break;
    
    default:break;
  }

  return $horaRet;
}

// Decodificar post en base 64
function base64DecodeSubmit($tipo=0, $datos){
    //Get
    if($tipo==0) {
        foreach($datos as $keyElem=>$elem){
          if(base64_encode(base64_decode($elem, true)) === $elem){
              // $_GET[$keyElem] = base64_decode($elem);
              $_GET[$keyElem] = htmlentities(utf8_encode(base64_decode($elem)), ENT_QUOTES);
          }
        }
    }
    //Post
    if($tipo==1) {
        foreach($datos as $keyElem=>$elem){
          if(base64_encode(base64_decode($elem, true)) === $elem){
            // $_POST[$keyElem] = base64_decode($elem);
            $_POST[$keyElem] = htmlentities(utf8_encode(base64_decode($elem)), ENT_QUOTES);
          }
        }
    }
}


//realizar copia de imagenes de la Descripcion 
function copiaImgDescripcion($descripcion){
  $rutasDescripcionImgTmp = array();
  $rutasImgFinal = array();

  //obtener imagenes de la descripcion     
    if($descripcion!=""){
      @preg_match_all('~<img.*?src=["\']+(.*?)["\']+~', $descripcion, $rutasDescripcionImgTmp);
      if(isset($rutasDescripcionImgTmp[1]) && count($rutasDescripcionImgTmp[1])>0){        
        foreach ($rutasDescripcionImgTmp[1] as $imgYinymce){
            if(strpos($imgYinymce, "https")!==false || strpos($imgYinymce, "http")!==false || strpos($imgYinymce, "www")!==false){
            }else{
                $rutasImgFinal[] = $imgYinymce;
            }        
        }        
      }

      //Recorre cada imagen para ser reemplazada por la nueva
      if(count($rutasImgFinal)>0){
        foreach ($rutasImgFinal as $imgTmp){
            $explImgTmp = explode("/", $imgTmp);
            $ultImgTemp = array_pop($explImgTmp);
            $extension = obtenerExtension($ultImgTemp);
            $impImgTmp = implode("/", $explImgTmp); 
            $imgCopia = $impImgTmp."/".generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$extension;
            copy($imgTmp, $imgCopia); //Duplicar imagen con nuevo nombre
            //Actualizar descripcion
            $descripcion = str_replace($imgTmp, $imgCopia, $descripcion);
        }
      }
    }

    return $descripcion;


    /*//obtener imagenes de la descripcion     
    if($datosProcesoCP->descripcion!=""){
      @preg_match_all('~<img.*?src=["\']+(.*?)["\']+~', $datosProcesoCP->descripcion, $rutasDescripcionImgTmp);
      if(isset($rutasDescripcionImgTmp[1]) && count($rutasDescripcionImgTmp[1])>0){        
        foreach ($rutasDescripcionImgTmp[1] as $imgYinymce){
            if(strpos($imgYinymce, "https")!==false || strpos($imgYinymce, "http")!==false || strpos($imgYinymce, "www")!==false){
            }else{
                $rutasImgFinal[] = $imgYinymce;
            }        
        }        
      }

      //Reemplazar por el texto adecuado        
      // echo "<pre>";
      // print_r($rutasDescripcionImgTmp[1]);
      // print_r($rutasImgFinal);        
      // echo "</pre>";

      if(count($rutasImgFinal)>0){
        foreach ($rutasImgFinal as $imgTmp){
            $explImgTmp = explode("/", $imgTmp);
            $ultImgTemp = array_pop($explImgTmp);
            $extension = obtenerExtension($ultImgTemp);
            $impImgTmp = implode("/", $explImgTmp); 
            $imgCopia = $impImgTmp."/".generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$extension;
            copy($imgTmp, $imgCopia); //Duplicar imagen con nuevo nombre
            //Actualizar descripcion
            $datosProcesoCP->descripcion = str_replace($imgTmp, $imgCopia, $datosProcesoCP->descripcion);
        }
      }
    }*/
}

//realizar copia de imagenes de la Descripcion 
function copiaImgDiagrama($diagrama){
  if($diagrama!=""){
    $explImgTmp = explode("/", $diagrama);
    $ultImgTemp = array_pop($explImgTmp);
    $extension = obtenerExtension($ultImgTemp);
    $impImgTmp = implode("/", $explImgTmp); 
    $imgCopia = $impImgTmp."/".generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$extension;
    copy($diagrama, $imgCopia); //Duplicar imagen con nuevo nombre
    //Actualizar diagrama
    $diagrama = str_replace($diagrama, $imgCopia, $diagrama);
  }

  return $diagrama;
}

//realizar copia de documentos
function copiaDocumento($documento){
  if($documento!=""){
    $explDocTmp = explode("/", $documento);
    $ultDocTmp = array_pop($explDocTmp);
    $extension = obtenerExtension($ultDocTmp);
    $impDocTmp = implode("/", $explDocTmp); 
    $docCopia = $impDocTmp."/".generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$extension;
    copy($documento, $docCopia); //Duplicar documento con nuevo nombre
    //Actualizar documento
    $documento = str_replace($documento, $docCopia, $documento);
  }

  return $documento;
}

function plusVercion($vercionOR){
  $finalVercion="1.0";
  $vercion=explode(".",$vercionOR);
  if ($vercion[1]<9) {
    $finalVercion=$vercion[0].".".($vercion[1]+1);
  }else {
    $finalVercion=($vercion[0]+1).".0";
  }
  return $finalVercion;
  }

function obtNivelesGrid($nivel){
  $identacion = "";
  if($nivel>0){
    for ($i=0; $i<$nivel; $i++) { 
      $identacion .= "┊";
    }    
  }
  return $identacion;
}


function generaTablaBootstrap($idTabla, $arrEncabezados, $arrFilas, $colAcciones = false, $acciones = "", $arrAligns = array(), $changeIconChat = false, $arrIconChat = array(), $tratoProv = false, $arrTratoProv = array(), $busqueda = false, $tipoBusqueda = 0, $enviarCot = false, $arrEnvCot = array(), $arrAccEsp = array(), $gasPrev = false, $widthAuto = false, $usarAlignTh = false){
    $width = '100%';
    if(strpos($idTabla, 'Existen') || strpos($idTabla, 'Cotizar') || strpos($idTabla, 'DetallesGastos') || strpos($idTabla, 'cotizarreq') || $widthAuto){
        $width = 'auto';

    }

    $html = '';
    //Inicio de la tabla, sustituir id
    $html .= '<div class="datable_bootstrap">';
    $html .= '<table id="'.$idTabla.'" class="table table-striped table-bordered table-condensed dataTable hover" role="grid" cellspacing="0" style="width:'.$width.'" >';
    $html .= '<thead>';
     $idth =($gasPrev)?'id="accGasPrev"':"";
    $html .= '<tr >';

    //Recorrer encabezados de la tabla
    // foreach ($arrEncabezados as $titulo) {
    //     $claseExtraComprimido = ($idTabla == 'tablaExistentesHerramientasResumen')?'comprimido':'';

    //     $html .= '<th class="'.$claseExtraComprimido.'" style="width:80px">'.$titulo.'<i class="fa fa-fw fa-sort " aria-hidden="true" ></i></th>';
    // }

    $keyEnc = 1;
    foreach ($arrEncabezados as $titulo) {
        $claseExtraComprimido = ($idTabla == 'tablaExistentesHerramientasResumen')?'comprimido':'';
        $iconSort = '<i class="fa fa-fw fa-sort " aria-hidden="true" ></i>';
        $align = "";
        if($usarAlignTh){
            if(count($arrAligns) > 0){//Si se ha enviado un array con alienaciones para cada columna
                $align = $arrAligns[$keyEnc-1];//Obtener la alineacion de la celda actual

                if(strpos($align, "colCheck") === false){
                }
                else{
                    $iconSort = '&nbsp;&nbsp;&nbsp;';
                }
            }
        }
        $html .= '<th class="'.$claseExtraComprimido.' '.$align.'" style="width:80px">'.$titulo.$iconSort.'</th>';

        // $html .= '<th class="'.$claseExtraComprimido.'" style="width:80px">'.$titulo.'<i class="fa fa-fw fa-sort " aria-hidden="true" ></i></th>';

        $keyEnc++;
    }

    //Si se activa columna acciones se agrega el encabezado
    if($colAcciones){
        $html .= '<th class="comprimido" '.$idth.' style="width:140px">Acciones</th>';
    }

    $html .= '</tr>';
    $html .= '</thead>';
    $html .= '<tbody>';

    //Se recorren las filas
    foreach ($arrFilas as $fila) {
        $idFila = 0;

        //Se recorre la fila solo para obtener el id de la fila
        foreach ($fila as $key => $value) {
             if($key == "id" || $key === 0){
                $idFila = $value;
             }
        }
        $claseBusqueda = '';
        $onclickBusqueda = '';
        if($busqueda){
            $claseBusqueda = 'rowBuscar';
            if($tipoBusqueda == 1)
                $onclickBusqueda = 'onclick="inicializarRowBuscar(this)"';
            elseif ($tipoBusqueda == 2) {
                $onclickBusqueda = 'onclick="inicializarRowBuscarExis(this)"';
            }
            elseif ($tipoBusqueda == 3) {
                $onclickBusqueda = 'onclick="inicializarRowBuscarExis(this, 2)"';
            }
        }
        //Iniciar tr con su id
        $html .= '<tr id="'.$idTabla.'_tr_'.$idFila.'" class="'.$claseBusqueda.' '.$idTabla.'_tr_'.$idFila.'" '.$onclickBusqueda.'>';
        $accAnt = '';$accDes = '';

        //Se recorre la fila de nuevo para agregar a la tabla los datos
        foreach ($fila as $key => $value) {
            if($key == "id" || $key === 0){

             }
             elseif ($key == "accAnt") {
                $accAnt = $value;
             }
             elseif ($key == "accDes") {
                $accDes = $value;
            }
             else{
                $align = "";
                if(count($arrAligns) > 0){//Si se ha enviado un array con alienaciones para cada columna
                    $align = $arrAligns[$key-1];//Obtener la alineacion de la celda actual
                }

                $html .= '<td class="'.$align.'" id="'.$idTabla.'_td_'.$key.'_'.$idFila.'" style="width:auto">'.$value.'</td>';
             }
        }
        // echo $idFila."<br>";
        //Si se activa columna acciones, se sustituye el id de la fila, en donde sea encontrado en el html de las acciones
        if($colAcciones){
            $accionesMod = $accAnt.$acciones.$accDes;
            $accionesMod = str_replace("{id}", $idFila, $accionesMod);

            if($changeIconChat){
                $accionesMod = str_replace("{icon_chat}", $arrIconChat[$idFila], $accionesMod);
            }

            if($tratoProv){
                $accionesMod = str_replace("{clase}", $arrTratoProv[$idFila], $accionesMod);
            }

            if($enviarCot){
                $accionesMod = str_replace("{clase2}", $arrEnvCot[$idFila], $accionesMod);
            }

            if(count($arrAccEsp) > 0){
                $accionesMod = str_replace("{acciones_esp}", $arrAccEsp[$idFila], $accionesMod);
                $accionesMod = str_replace("{id}", $idFila, $accionesMod);
            }

            if($idFila > 0){
                $html  .= '<td class="text-right">'.$accionesMod.'</td>';
            }
            else{
                $html  .= '<td class="text-right"></td>';
            }
        }

        $html .= '</tr>';
    }


    $html .= '</tbody>';
    $html .= '</table>';
    $html .= '</div>';

    return $html;
}

// Permiso Gerente
function permGte(){
  $resp = false;
  //Super admin, Gerente
  if($_SESSION['idRol']==1 || $_SESSION['idRol']==4){
    $resp = true;
  }
  return $resp;
}

function color_rand() {
    return sprintf('#%06X', mt_rand(0, 0xFFFFFF));
}


// Imp. 11/09/20
function obtMontoConIva($monto){
  $iva = 0.16;
  $montoIva = removerCaracteres($monto)*$iva;
  // return round(removerCaracteres($monto)+$montoIva);
  return round(removerCaracteres($monto)+$montoIva);
}