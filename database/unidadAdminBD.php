<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/common/DataServices.php';

class unidadAdminBD {
    //method declaration

	//Obtener coleccion de roles
    public function GetallUnidades($unidadIds = ""){
        $ds = new DataServices();

        $param[0]= ($unidadIds != "")?" WHERE idUniAd IN (".$unidadIds.") ":"";
        $result = $ds->Execute("GetAllUnidades", $param);
        $ds->CloseConnection();
        return $result;
    }

    //obtener el rol por su id
    public function obtenerUnidadByIdDB($id){
        $ds = new DataServices();
        $param[0] = $id;
        $result = $ds->Execute("obtenerUnidadByIdDB", $param);
        $ds->CloseConnection();
        return $result;
    }

}

?>