<?php

$dirname = dirname(__DIR__);

include_once  $dirname.'/database/unidadAdminBD.php';
include_once  $dirname.'/database/datosBD.php';


class unidadAdminObj{
	private $_idUniAd = 0;
    private $_unidadAdmin = '';
    private $_activo = '';
    private $_fechaCreacion = '0000-00-00 00:00:00';

    //get y set
    public function __get($name) {             
        return $this->{"_".$name};
    }

    public function __set($name, $value) {        
        $this->{"_".$name} = $value;
    }


        //Obtener coleccion de roles
    public function GetAllUnidades($unidadIds = ""){
        $array = array();
        $ds = new unidadAdminBD();
        $datosBD = new datosBD();
        $result = $ds->GetallUnidades($unidadIds);
        $array = $datosBD->arrDatosObj($result);     
        return $array;            
    }
    

    //Obtener roles por su id
    public function obtenerUnidadById($id){
        $ds = new unidadAdminBD();
        $obj = new unidadAdminObj();
        $datosBD = new datosBD();
        $result = $ds->obtenerUnidadByIdDB($id);
        return $datosBD->setDatos($result, $obj);
    }

}


?>