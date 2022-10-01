<?php
$dirname = dirname(__FILE__);
include_once $dirname.'/brules/utilsObj.php';

$function= $_GET['funct'];
switch ($function)
{
    case "uploadImagesTinymce":
        uploadImagesTinymce();
    break;            
    //Subir imagenes pasandole parametros de destino  
    case "uploadGeneralImages":  
        uploadGeneralImages();
    break;
}
                    
function uploadImagesTinymce(){    
    $dirname = dirname(__FILE__);
    $save_folder = 'upload/tinymceImg/';
    $dateByZone = new DateTime("now", new DateTimeZone('America/Mexico_City') );
    $dateTime = $dateByZone->format('Y-m-d'); //fecha Actual
    $date=explode("-",$dateTime);    
    $anio = $dirname."/".$save_folder.$date[0];
    $mes = $dirname."/".$save_folder.$date[0]."/".$date[1];

    //Revisar si anio destino existe si no crearlo
    if(!file_exists($anio)){
        mkdir($anio, 0777);
    }
    //Revisar si el mes destino existe si no crearlo
    if(!file_exists($mes)){
        mkdir($mes, 0777);
    }    

    //Obtener la extrension
    $extension = obtenerExtension($_FILES['file']['name']);
    //Cambiar nombre a la imagen 
    $nuevaImg = generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$extension;
    // $destino = $save_folder.$date[0]."/".$date[1]."/".$nuevaImg;
    // $destino = $destino."/".$nuevaImg;
    $destino = $save_folder.$date[0]."/".$date[1]."/".$nuevaImg; //path almacenar imagen    

    if(move_uploaded_file($_FILES['file']['tmp_name'], $destino)){
       $res = array("resp"=>true, "ruta"=>"../".$destino);
    }
    else{
        $res = array("resp"=>false);            
    }
    echo json_encode($res);
}

//Subir archivo pasandole la ruta de destino
function uploadGeneralImages(){
    // echo "<pre>";
    // print_r($_POST);
    // echo "</pre>";
    // exit();
    $save_folder = $_POST['saveFolder'];
        
    //Obtener la extrension
    $extension = obtenerExtension($_FILES['file']['name']);
    //Cambiar nombre a la imagen 
    $newNameImg = generarPassword(10, TRUE, TRUE, FALSE, FALSE).".".$extension;
    $destino = $save_folder.$newNameImg;

    if(move_uploaded_file($_FILES['file']['tmp_name'], $destino))
    {              
       $res = array("resp"=>true, "ruta"=>"../".$destino);       
    }
    else
    {
        $res = array("resp"=>false);            
    }
    echo json_encode($res);
}


?>