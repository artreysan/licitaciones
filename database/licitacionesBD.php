<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/common/DataServices.php';

class licitacionesBD {
    //method declaration


    public function insertLicitacionDB($param){
        $ds = new DataServices();
        $result = $ds->Execute("insertLicitacionDB", $param, true);
        return $result;
    }

	//Obtener coleccion de roles
    public function GetallLicitaciones($licitacionesIds = ""){
        $ds = new DataServices();

        $param[0]= ($licitacionesIds != "")?" WHERE idUnAd IN (".$licitacionesIds.") ":"";
        $result = $ds->Execute("GetAllLicitaciones", $param);
        $ds->CloseConnection();
        return $result;
    }

    //obtener el rol por su id
    public function obtenerLicitacionByIdDB($id){
        $ds = new DataServices();
        $param[0] = $id;
        $result = $ds->Execute("obtenerLicitacionByIdDB", $param);
        $ds->CloseConnection();
        return $result;
    }

}

?>