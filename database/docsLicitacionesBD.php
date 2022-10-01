<?php
$dirname = dirname(__DIR__);
include_once  $dirname.'/common/DataServices.php';

class docsLicitacionesBD {
//method declaration

	public function insertDocumentoDB($param){
        $ds = new DataServices();
        $result = $ds->Execute("insertDocumentoDB", $param, true);
        return $result;
    }


    public function obtAllDocsLicitacionBD($licitacionesIds = ""){
    	$ds = new DataServices();

        $param[0]= ($licitacionesIds != "")?" WHERE idLicitacion IN (".$licitacionesIds.") ":"";
        $result = $ds->Execute("obtAllDocsLicitacionBD", $param);
        $ds->CloseConnection();
        return $result;
    }

}


?>