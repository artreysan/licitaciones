<?php

$dirname = dirname(__DIR__);

include_once  $dirname.'/database/rolesBD.php';
include_once  $dirname.'/database/datosBD.php';


class rolesObj{

    private $_idRol = 0;
    private $_rol = '';
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
    public function GetAllRoles($rolIds = ""){
        $array = array();
        $ds = new rolesBD();
        $datosBD = new datosBD();
        $result = $ds->GetallRoles($rolIds);
        $array = $datosBD->arrDatosObj($result);     
        return $array;            
    }
    

    //Obtener roles por su id
    public function obtenerRolById($id){
        $ds = new rolesBD();
        $obj = new rolesObj();
        $datosBD = new datosBD();
        $result = $ds->obtenerRolByIdDB($id);
        return $datosBD->setDatos($result, $obj);
    }

}